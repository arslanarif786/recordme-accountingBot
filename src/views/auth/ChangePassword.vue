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
            <h1 class="font-style-heading-auth mb-2">Set Password</h1>
            <div v-for="(item, index) of Object.keys(initials)" :key="index" class="mt-3">
              <label class="font-style-paragraph">{{
                  item == "password" ? "Password" : "Confirm Password"
              }}</label>
              <v-text-field class="d-flex appColor--text default-input" :autocomplete="false" flat solo hide-details
                color="appColor" :placeholder="item == 'password' ? 'Enter your Password here' : 'Enter your Confirm Password here'"
                type="password" 
                :rules="[rules.min]"
                prepend-inner-icon="mdi-lock appColor--text"
                v-model="initials[item]">
              </v-text-field>

            </div>
            <v-btn block color="appColor" class="mt-6 white--text text-capitalize" :loading="loader" @click="setPassword()" @keyup.enter="setPassword()">
              Set Password
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
  name: "ChangePassword",
  components: {
    SnackBar,
  },
  data: () => ({
    initials : {
      password : "",
      confirmPassword : "",
    },
    loader: false,
    dashboardPermission: null,
    items: [],
    showPassword: false,
    isPasswordVisible: false,
    rules: {
      min: (v) => v.length >= 8 || "Min 8 characters",
      min1: (v) => /.+@.+/.test(v) || "E-mail must be valid",
    },
    token : ""
  }),
  computed: {
    
  },
  methods: {
    setPassword(){
      this.loader = true
      if(!this.initials.password.trim() || !this.initials.confirmPassword.trim()) return this.error("Some Fields are Empty")
      if(this.initials.password !== this.initials.confirmPassword) return this.error("Password's dont match")
      this.$store.dispatch("auth/setPassword",{token : this.token, newPassword : this.initials.password, verifyPassword : this.initials.password }).then((response) => {
        EventBus.$emit("show-snackbar", { text: "Password has been reset, Login again", type: "success" });
        this.loader = false;
        // this.$router.push("/login")
      })  
        .catch((e) => {
          let text=e.response.data.message
          EventBus.$emit("show-snackbar", { text: text, type: "error" });
          this.loader = false;
        });
    },
    error(text){
      EventBus.$emit("show-snackbar", { text: text, type: "error" });
      this.loader = false;
    }
  },
  mounted(){
    if (!this.$route.query.token) this.$router.push("/login")
    this.token = this.$route.query.token
  },

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

.font-style-heading {
  font-family: Lato !important;
  font-size: 32px !important;
  font-weight: 800 !important;
  font-style: normal;
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
