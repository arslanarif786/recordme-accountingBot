import Vue from "vue";
import App from "../src/app/App.vue";
import router from "../src/app/router";
import store from "../src/app/store";
import vuetify from "./plugins/vuetify";
import axios from 'axios';
import VueAxios from 'vue-axios'
import { showNotificationBar } from "./services/SnackBar";
import { config } from "@/config/development";
import { firestorePlugin } from 'vuefire'
import moment from 'moment'
import '@/assets/main.css';
import EventBus from "./js/EventBus";
import myJson from '../package.json'

import VuePapaParse from 'vue-papa-parse'
Vue.use(VuePapaParse)
Vue.prototype.$showNotificationBar = showNotificationBar;


Vue.config.productionvTip = false;


let refreshTokenPromise; // this holds any in-progress token refresh requests

/**
 * call the refresh token API
 */
 export const refreshTokenSet = () =>
 axios.get("/refresh-token")
   .then((response) => {
     console.log("data========>", response.data.token);
     localStorage.setItem("token", response.data.token);
    //  console.log(store.commit);
     store.commit("auth/addAuthToken", `Bearer ${response.data.token}`);
     return response.data.token;
   })
   .catch((err) => {
     console.log("refreshTokenSet =====>", err);
   });
// const baseURL = `${config.baseURL}`;
const baseURL = process.env.BACK_END_URL
axios.defaults.baseURL = baseURL


// Add a request interceptor
axios.interceptors.request.use(function (config) {
  console.log("BOI ====> ", store.getters['auth/getAuthToken']);
  const token = store.getters['auth/getAuthToken'];
  config.headers.Authorization =  token;
   
  return config;
});

axios.interceptors.response.use(function (response) {
  // (resp) => {
  //   let fe_version = localStorage.getItem('fe-version') || null;
  //   if(!fe_version) {
  //     fe_version = myJson.version
  //     localStorage.setItem('fe-version', fe_version)
  //   }
  //   else {
  //     if(fe_version !== myJson.version) {
  //       localStorage.clear();
  //       window.location.reload()         // For new version, simply reload on any get
  //       fe_version = myJson.version
  //       localStorage.setItem('fe-version', fe_version)
  //     }
  //   }
  //   return Promise.resolve(resp)
  // },  
  return response;
}, function (error) {
  if(error.response.status === 403 && error?.response?.data?.name !== "xero")  {
    EventBus.$emit('show-snackbar',{text : "Token has expired", type : "error"})
    store.commit("auth/logout");
    store.commit("ticket/logout");
    store.commit("user/logout");
    setTimeout(() => {
      router.push("/login");
    }, 2000)
  } else if(error.response.status === 401 && error?.response?.data?.name !== "xero") {
    console.log(
      "SHOULD ASK FOR NEW ACCESS AND REFRESH TOKEN",
      error.response
    );

    if (!refreshTokenPromise) {
      console.log("********* YOU CAN MAKE THE REFRESH TOKEN API CALL");
      // check for an existing in-progress request
      // if nothing is in-progress, start a new refresh token request

      refreshTokenPromise = refreshTokenSet().then((token) => {
        refreshTokenPromise = null; // clear state
        console.log("***************************TOKEN =====>", token);
        return token;
      });

      console.log(
        "WHAAAT ====> refreshTokenPromise OUTSIDE THEN BLOCK ===> ",
        refreshTokenPromise
      );
    }

    console.log("/////////refreshTokenPromise\\\\\\\\\\\\\\ ===>");
    return refreshTokenPromise.then(async (token) => {
      console.log(
        "refreshTokenPromise ORIGINAL REQUEST THAT FAILED =====>",
        error.config
      );

      error.config.headers = {
        ...error.config.headers,
        Authorization: "Bearer " + token,
      };

      console.log("UPDATED CONFIGURATIONS ==<>", error.config);
      console.log("*******MAKING RETRY API CALL ===>, ", error.config);
      return axios(error.config)
        .then((response) => {
          console.log("RETRY API RESPONSE =====>", response.data);
          return response;
        })
        .catch((err) => {
          console.log("RETRY API ERRR =====>", err);
          return Promise.reject(err);
        });
    });
  }
  return Promise.reject(error);
});
Vue.use(VueAxios, axios)
var filter = function(text, length, clamp){
  clamp = clamp || '...';
  var node = document.createElement('div');
  node.innerHTML = text;
  var content = node.textContent;
  return content.length > length ? content.slice(0, length) + clamp : content;
};
Vue.filter('truncate', filter);
Vue.filter('formatDate', function (value) {
  if (!value) return 'N/A'
  return moment(value).format('YYYY MM DD')
})
Vue.filter('formatTime', function (value) {
  if (!value) return 'N/A'
  return moment(value).format('hh:mm A')
})
Vue.filter('msgDate', function (value) {
  if (!value) return ''
  return moment(value).format('DD/MM/YYYY hh:mm:ss')
})
Vue.use(firestorePlugin)
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
