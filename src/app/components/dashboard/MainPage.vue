<template>
  <div>
    <AppBar />
    <div v-if="userOnline">
      <AccountantPage v-if="infoCheck === 'done'" />
      <Loader v-else-if="infoCheck === 'wait'">
        <template v-slot:text>Please wait ...</template>
      </Loader>
      <div class="d-flex flex-column justify-center align-center" v-else-if="infoCheck === 'show-popup' || infoCheck === 'leave-portal'">
        <Loader >
          <template v-if="infoCheck === 'show-popup'" v-slot:text>You are already logged in elsewhere.</template>
          <template v-else-if="infoCheck === 'leave-portal'" v-slot:text>This account has updated its current login status</template>
        </Loader>
        <v-btn
          color="appColor"
          class="d-flex flex-column justify-center align-center white--text text-capitalize"
          @keyup.enter="resetSocketId()"
          @click="resetSocketId()"
        >
        Reset Previous Data
      </v-btn>
      </div>
      <Loader v-else>
        <template v-slot:text>Kindly log in again ... </template>
      </Loader>
    </div>
    <Loader v-else>
      <template v-slot:text
        >Please change your status to online ...</template
      >
    </Loader>
  </div>
</template>

<script>
import AppBar from "../layout/appbar/Appbar.vue";
import AccountantPage from "../accountant-portal";
import Loader from "../accountant-portal/loader";
import socket from "@/constants/socket-io/SocketIo";
import { mapGetters } from "vuex";
export default {
  name: "MainPage",
  components: {
    AppBar,
    AccountantPage,
    Loader,
  },
  data: () => ({
    /*
     **  keys for info check, by-default it should be waiting , already has ticket ,  move forward
     */
    infoCheck: "wait",
  }),
  /*
   **  Listem socket Instance for Info and do not move ahead if response has not come
   */
  created() {
    this.infoInstance();
  },
  /*
   **  Before closing this, clear all instances of sockets
   */
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      onlineStatus: "auth/getOnlineStatus",
    }),
    /*
     **  Check user status for online and offline
     */
    userOnline() {
      if (this.user._id && this.onlineStatus === true) {
        return true;
      } else {
        return false;
      }
    },
  },
  /*
   **  Call methods that can be used in this component
   */
  methods: {
    infoInstance() {
      socket.on("info", (body) => {
        console.log("body here and its response", body);
        this.infoCheck = body.message;
      });
    },
    resetSocketId(){
      socket.emit('setSocketId', this.user._id)
    }
  },
  /*
   **  Before closing this, clear all instances of sockets
   */
  beforeDestroy() {
    socket.off("info");
  },
};
</script>
