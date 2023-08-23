import EventBus from "@/js/EventBus";
import axios from "axios";
import UrlServices from "@/services/Url";
const initialState = () => {
  return {
    userWorkspaces: [],
    workspaces: [],
    workspaceswithFilter: [],
  };
};
const state = initialState();
const getters = {
  getUserWorkspaces(state) {
    return state.userWorkspaces;
  },
  getWorkspaces(state) {
    return state.workspaces;
  },
  getworkspacesWithFilter(state) {
    return state.workspaceswithFilter;
  },
}
const mutations = {
  addUserWorkspaces(state, payload) {
    state.userWorkspaces = payload;
  },
  addWorkspaces(state, payload) {
    state.workspaces = payload;
  },
  addWorkspaceswithFilter(state, payload) {
    state.workspaceswithFilter = payload;
  },
  logout(state) {
    Object.assign(state, initialState());
  },
};

const actions = {
  async addUserWorkspaces({ commit }, {token, workspace, sentId, user}) {
    try {
      if(!user) return;
      return new Promise((resolve, reject) => {
        const data = {
          workspaceId: workspace?._id,
          userRole: sentId,
          userId: user
        };
        axios.post(UrlServices.addUserWorkspaces, data, {
          headers: {
            "Authorization": token
          }
        })
          .then(function (response) {
            resolve(response)
          })
          .catch(function (error) {
            reject(error.message)
          });
      });
    } catch (error) {
      
      return error.message
    }
  },
  async addWorkspaces({ commit }, payload) {
    commit("addUserWorkspaces", payload)
  },
  async getworkspacesWithFilter(store, payload) {
    axios.get(UrlServices.getworkspacesWithFilter + payload, { headers: { "Authorization": store.rootState.auth.authToken } })
      .then((res) => {
        console.log(res);
        store.commit("addWorkspaceswithFilter", res.data.workspaces)
      })
      .catch((error) => {
        console.log('error: getWorkspace: ', error.message)
      })
  },
  async getWorkspaces({ commit }, payload) {
    axios.get(UrlServices.getWorkspaces + payload)
      .then((res) => {
        commit("addWorkspace", res.data.workspaces)
      })
      .catch((error) => {
        console.log('error: getWorspace: ', error.message)
      })
  },
  async create(store, payload) {
    return new Promise((resolve, reject) => {
      axios.post(UrlServices.createUser, payload, { headers: { "Authorization": store.rootState.auth.authToken } })
        .then((response) => {
          if (response.data.user) {
            resolve(true)
          } else {
            console.log(e)
            reject(JSON.parse(e.request.response).message);
          }
        })
        .catch(e => {
          reject(e.response.data.error.errors[0].msg);
        })
    })
  },
  async deleteUser(store, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(UrlServices.deleteUser, { headers: { "Authorization": store.rootState.auth.authToken }, data: payload })
        .then((response) => {
          EventBus.$emit("show-snackbar", { text: "Successfully Deleted", type: "success" });
          resolve(true)
        })
        .catch(e => {
          EventBus.$emit("show-snackbar", { text: "Something bad happened", type: "error" });
          reject(e)
        })
    })
  },
  async unAssignWorkspace(store, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(UrlServices.unAssignWorkspace, { headers: { "Authorization": store.rootState.auth.authToken } , data : payload })
        .then((response) => {
          resolve(response)
        })
        .catch(e => {
          reject(e)
        })
    })
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
