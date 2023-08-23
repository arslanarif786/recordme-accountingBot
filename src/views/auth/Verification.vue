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
          <div>
            <h1 class="font-style-heading-auth mb-2">Verifiying</h1>
            <v-progress-circular
              class="ml-8 mt-7"
              :size="70"
              :width="10"
              color="appColor"
              indeterminate
            ></v-progress-circular>
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
import axios from "axios";
import UrlServices from "@/services/Url"
export default {
  name: "Verification",
  components: {
    SnackBar,
  },
  data: () => ({}),
  created() {
    const token = this.$route.params.token;
    if (token) this.sendVerification(token);
  },
  methods: {
    sendVerification(token) {
      axios
        .get(`${UrlServices.verification}?token=${token}`)
        .then((res) => {
          this.reRoute(res.data.message, 'success')
        })
        .catch((e) => {
          this.reRoute(JSON.parse(e.request.response).message , 'error')
        });
    },
    reRoute(val, type){
      localStorage.setItem("response", JSON.stringify({ val : val , type : type}))
      this.$router.push("/login")
    },
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
