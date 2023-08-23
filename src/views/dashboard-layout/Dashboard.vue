<template>
  <div>
    <SnackBar />
    <div v-if="role == 'supervisor'">
      <NavigationBar />
      <SupervisorMainPage />
    </div>
    <div v-else>
      <MainPage />
    </div>
  </div>
</template>

<script>
import SnackBar from "../../common/snackbar/Snackbar.vue"
import NavigationBar from "../../app/components/layout/navigation-bar/NavigationBar.vue"
import MainPage from "../../app/components/dashboard/MainPage.vue"
import SupervisorMainPage from "../../app/components/dashboard/SupervisorMainPage.vue"
import { mapGetters } from "vuex";
import socket from "../../../src/constants/socket-io/SocketIo";
export default {
  name: "Dashboard",
  components : {
    SnackBar,
    NavigationBar,
    MainPage,
    SupervisorMainPage
  },
  data: () => ({
    
  }),
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
      user: "auth/getUser",
      role: "auth/getUserRole",
      // onlineStatus: "auth/getOnlineStatus"
    })
  },
  methods: {  
    
  },
  mounted(){
    /**
    * On Login
    **/ 
    if(this.onlineStatus && this.token && this.role === 'accountant') socket.emit("userConnected", this.user._id)
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
    width: 47.6vw;
    min-height: 96vh;
    position: absolute;
    top: 0;
    left: 0;
    background: url( '../../assets/login/image.png') no-repeat center center;
    background-size: cover;
    transform: scale(1.1);
}
::v-deep .v-input__append-outer .v-icon, .v-input__prepend-outer .v-icon {
    margin-left: 20px !important;
}
::v-deep .v-btn__content {
    letter-spacing: 0.2px !important;
}
</style>
