<template>
  <div>
    <SnackBar />
    <v-row>
      <v-col cols="5" class="hidden-sm-and-down">
        <span class="bg"></span>
      </v-col>
      <v-col md="7" sm="12">
        <div
          style="min-height: 92vh"
          class="d-flex align-center justify-center"
        >
          <div v-if="!successResponse">
            <h1 class="font-style-heading-auth mb-2">SignUp</h1>
            <div class="d-flex inline">
              <p class="font-style-paragraph">Already have an account?</p>
              <a href="/login" class="font-style-paragraph appColor--text pl-2"
                >Login
              </a>
            </div>
            <div v-for="(item, index) of initials" :key="index" class="mt-3">
              <label class="font-style-paragraph">{{ item.label }}</label>
              <v-text-field
                class="d-flex appColor--text default-input"
                :autocomplete="false"
                flat
                solo
                hide-details
                color="appColor"
                :placeholder="item.placeholder"
                :type="item.type"
                :rules="[item.type === 'password' ? rules.min : rules.min1]"
                :prepend-inner-icon="item.icon"
                v-model="model[item.key]"
                @click:append="showPasswordFunction(index)"
                :append-icon="item.key === 'password' || item.key === 'confirmPassword' ?  (item. type === 'text' ? 'mdi-eye appColor--text' : 'mdi-eye-off appColor--text') : ''"
              >
              </v-text-field>
            </div>
            <v-btn
              block
              color="appColor"
              class="mt-6 white--text text-capitalize"
              :loading="loader"
              @click="signUp()"
            >
              Create an Account
            </v-btn>
          </div>
          <div v-else>
            <h1 class="font-style-heading mb-2">Verify Email</h1>
            <div class="d-flex inline">
              <p class="font-style-paragraph">Kindly verify your Email. We have send a verification Email to "{{model.email}}"</p>
            </div>
            <v-btn
              block
              color="appColor"
              class="mt-6 white--text text-capitalize"
              :loading="loader"
              @click="$router.push('/login')"
            >
              Back to Login
            </v-btn>
            <div class="d-flex justify-end">
               <p @click="resendEmail()" class="font-style-paragraph appColor--text pt-2" style="cursor : pointer">Resend Email
              </p>
             
            </div>
          </div>
        </div>
        <div style="min-height: 8vh" class="d-flex align-center justify-center">
          <p class="font-style-paragraph">Privacy Policy</p>
          <p class="font-style-paragraph pl-16">Terms of Service</p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EventBus from "@/js/EventBus";
import SnackBar from "../../common/snackbar/Snackbar.vue"
export default {
  name: "SignUp",
  components: {
    SnackBar,
  },
  data: () => ({
    initials: [
      {
        key: "firstName",
        label: "First Name",
        placeholder: "Enter your First Name here",
        type: "text",
        icon: "mdi-account appColor--text",
      },
      {
        key: "lastName",
        label: "Last Name",
        placeholder: "Enter your Last Name here",
        type: "text",
        icon: "mdi-account appColor--text",
      },
      {
        key: "email",
        label: "Email",
        placeholder: "Enter your Email here",
        type: "email",
        icon: "mdi-email appColor--text",
      },
      {
        key: "password",
        label: "Password",
        placeholder: "Enter your Password here",
        type: "password",
        icon: "mdi-lock appColor--text",
      },
      {
        key: "confirmPassword",
        label: "Confirm Password",
        placeholder: "Enter your confirm Password here",
        type: "password",
        icon: "mdi-lock appColor--text",
      },
    ],

    model: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    successResponse : false,
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
  computed: {},
  methods: {
    showPasswordFunction(index){
      if(this.initials[index].type === "password"){
        this.initials[index].type = 'text'
      }  
      else if(this.initials[index].type === 'text') {
        this.initials[index].type = 'password'
      }
    },  
    signUp() {
      this.loader = true;
      let index = Object.values(this.model).findIndex((x) => x.trim() === null || x.trim() === "")
      if(index !== -1) return this.error(`${this.initials[index].label} field is empty`);
      if (this.model.password !== this.model.confirmPassword)
        return this.error("Password's dont match");
      if (!this.validateEmail(this.model.email))
        return this.error("Email is not valid");
      if (this.model.password.length <= 6)
        return this.error("Password length should be greater than 6.");
      const { firstName, lastName, password, email } = this.model;
      const request = { name: firstName + " " + lastName, password, email };
      this.$store
        .dispatch("auth/signUp", request)
        .then((response) => {
          EventBus.$emit("show-snackbar", {
            text: response.message,
            type: "success",
          });
          this.loader = false;
          this.successResponse = true
        })
        .catch((e) => {
          this.error(JSON.parse(e.request.response).message);
          this.loader = false;
        });
    },
    error(text) {
      EventBus.$emit("show-snackbar", { text: text, type: "error" });
      this.loader = false;
    },
    validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    resendEmail(){
      this.$store
        .dispatch("auth/resendEmail", this.model.email)
        .then((response) => {
          EventBus.$emit("show-snackbar", {
            text: "Email has been sent",
            type: "success",
          });
        })
        .catch((e) => {
          let text = e.message;
          this.error(text);
        });
    }
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
  background: url("../../assets/login/img.png") no-repeat center center;
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
