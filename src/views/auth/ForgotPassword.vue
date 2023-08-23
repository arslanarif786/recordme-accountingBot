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
            <h1 class="font-style-heading-auth mb-2">Forgot Password</h1>
              <label class="font-style-paragraph">Email</label>
              <v-text-field class="d-flex appColor--text default-input" :autocomplete="false" flat solo hide-details
                color="appColor" placeholder="Enter your email here"
                type="email"
                prepend-inner-icon="mdi-email appColor--text"
                v-model="email" >
              </v-text-field>
            <v-btn block color="appColor" class="mt-6 white--text text-capitalize" :loading="loader" @click="sendEmail()" @keyup.enter="sendEmail()">
              Forgot Password
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
  name: "ForgotPassword",
  components: {
    SnackBar,
  },
  data: () => ({
    email : "",
    loader: false,
  }),
  computed: {
    
  },
  methods: {
    sendEmail() {
      this.loader = true;
      if (!this.email) {
        EventBus.$emit("show-snackbar", { text : "Fields can not be empty", type: "error" });
        this.loader = false;
      }
      this.$store.dispatch("auth/forgotPassword",{email : this.email}).then((response) => {
        EventBus.$emit("show-snackbar", { text: "Email has been sent , Kindly check ", type: "success" });
          this.loader = false;
      })  
        .catch((e) => {
          let text = e.message;
          EventBus.$emit("show-snackbar", { text: text, type: "error" });
          this.loader = false;
        });
    },
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
