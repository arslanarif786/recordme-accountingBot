<template>
  <div>
    <SnackBar />
    <v-row>
      <v-col cols="5" class="hidden-sm-and-down">
        <span class="bg"></span>
      </v-col>
      <v-col md="7" sm="12">
        <div style="min-height: 92vh" class="d-flex align-center justify-center ">
          <div>
            <h1 class="font-style-heading-auth mb-2">Login</h1>
            <!-- <div class="d-flex inline">
              <p class="font-style-paragraph"> Not register yet? </p>
              <a href="/register" class="font-style-paragraph appColor--text pl-2">Create an account
              </a>
            </div>  -->
            <span class="font-style-paragraph pa-1" v-if="resendEmailText" style="cursor : pointer; backgroundColor : #f4d9d8">
                If you didn't get the email, <a @click=resendEmail() class="appColor--text">click here </a>to resend email. 
            </span>
            <span class="font-style-paragraph pa-1" v-if="appUrl" style="cursor : pointer; backgroundColor : #f4d9d8">
                This is not required domain, Kindly go to another portal
            </span>
            <div v-for="(item, index) of Object.keys(initials)" :key="index" class="mt-3">
              <label class="font-style-paragraph">{{
                  item == "email" ? "Email" : "Password"
              }}</label>
              <v-text-field class="d-flex appColor--text default-input" :autocomplete="false" flat solo hide-details
                color="appColor" :placeholder="item == 'email' ? 'Enter your email here' : 'Enter your password here'"
                :type="
                item == 'email' ? 'email' : showPassword ? 'text' : 'password'"
                :rules="[item === 'password' ? rules.min : rules.min1]"
                :prepend-inner-icon="item == 'email' ? 'mdi-email appColor--text' : 'mdi-lock appColor--text'"
                @click:append="showPassword = !showPassword"
                :append-icon="item === 'password' ? (showPassword ? 'mdi-eye appColor--text' : 'mdi-eye-off appColor--text') : ''"
                v-model="initials[item]">
              </v-text-field>

            </div>
            <div class="d-flex justify-end">
               <!-- <a href="/forgot-password" class="font-style-paragraph appColor--text pt-2">Forgot Password ?
              </a> -->
             
            </div>

            <v-btn block color="appColor" depressed class="mt-6 white--text text-capitalize" :loading="loader" @click=login() @keyup.enter="login()">
              Login
            </v-btn>
          </div>
        </div>
        <div style="min-height: 8vh" class="d-flex align-center justify-center ">
          <p class="font-style-paragraph "> Privacy Policy </p>
          <p class="font-style-paragraph pl-16"> Terms of Service</p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EventBus from "@/js/EventBus"
import SnackBar from "../../common/snackbar/Snackbar.vue"
export default {
  name: "Login",
  components: {
    SnackBar,
  },
  data: () => ({
    initials: {
      email: "",
      password: "",
    },
    resendEmailText : false,
    appUrl : false,
    loader: false,
    dashboardPermission: null,
    items: [],
    showPassword: false,
    isPasswordVisible: false,
    rules: {
      min: (v) => v.length >= 8 || "Min 8 characters",
      min1: (v) => /.+@.+/.test(v) || "E-mail must be valid",
    },
  }),
  computed: {
    filterItem() {
      return this.items.filter((value) => Object.keys(value).length !== 0);
    },
  },
  created(){
    
  },
  methods: {
    login() {
      this.loader = true;
      if (!this.initials.email || !this.initials.password) {
      return this.error("Fill the required fields properly")
      }
      var object = JSON.parse(JSON.stringify(this.initials))
      object['firebaseToken'] = localStorage.getItem("firebaseToken")
      this.$store.dispatch("auth/login", object).then(async (response) => {
        this.loader = false;
        let role = this.$store.getters["auth/getUserRole"]
        if (role == 'superadmin') this.$router.push({ path: "accountants" })
        else {
          await this.$store.dispatch("auth/getWorkspacesForSpecificUser", {ascSort : true})
          // this.$router.push({ path: "/" })
          }
      })
        .catch((e) => {
          if(e === 'Please verify your email first!') this.resendEmailText = true
          if(e === 'Nor client not employee') this.appUrl = true
          this.error(e)
        })
    },
    showPasswordFunction(index){
      if(this.initials === "password"){
        this.initials[index].type = 'text'
      }  
      else if(this.initials[index].type === 'text') {
        this.initials[index].type = 'password'
      }
    }, 
    error(text){
      EventBus.$emit("show-snackbar", { text: text, type: "error" });
      this.loader = false;
    },
    resendEmail(){
      this.$store
        .dispatch("auth/resendEmail", this.initials.email)
        .then((response) => {
          EventBus.$emit("show-snackbar", {
            text: "Email has been sent",
            type: "success",
          });
          this.resendEmailText = false
        })
        .catch((e) => {
          let text = e.message;
          this.error(text);
        });
    }
  },
  mounted(){
    if(localStorage.getItem("response")) {
      const data  =  JSON.parse(localStorage.getItem("response"))
      EventBus.$emit("show-snackbar", { text: data.val, type: data.type });
      localStorage.removeItem("response")
    } 
  }


};
</script>

<style scoped>
.font-style {
  font-family: Lato !important;
}

.font-style-paragraph {
  font-family: Lato !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-align: center;
}


.default-input {
  border: solid 1px #ebeef7;
  border-radius: 5px;
  height: 50px;
  width: 411px;
  font-size: 13px;
  font-family: Lato !important;
  
}

/* Landscape phones and portrait tablets */
@media only screen and (max-width: 500px) {
  ::v-deep .default-input {
    width: 350px; 
  }
}

::v-deep .v-input--is-focused {
  border: 1px solid var(--v-appColor-base) !important;
}

.bg {
  width: 40.6vw;
  min-height: 96vh;
  position: absolute;
  top: 0;
  left: 0;
  background: url('../../assets/login/img.png') no-repeat center center;
  background-size: cover;
  transform: scale(1.1);
}

::v-deep .v-input__append-outer .v-icon,
.v-input__prepend-outer .v-icon {
  margin-left: 20px !important;
}

::v-deep .v-btn__content {
  letter-spacing: 0.2px !important;
}
</style>
