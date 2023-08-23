<template>
  <v-app>
    <audio id="myAudioClient">
      <source :src="soundClient" type="audio/ogg" />
      <source :src="soundClient" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <audio id="myAudioAccountant" >
      <source :src="soundAccountant" type="audio/ogg" />
      <source :src="soundAccountant" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <v-main>
      <ul>
        <li v-for="message in messages" v-bind:key="message">
          {{ message }}
        </li>
      </ul>
      <router-view />
    </v-main>
  </v-app>
</template>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script>
import firebase from "./../js/Firebase";
import soundClient from "../assets/mixkit.wav";
import soundAccountant from "../assets/notification1.wav";
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";
import socket from "../constants/socket-io/SocketIo";

export default {
  name: "App",
  data: () => ({
    messages: "",
    soundClient: soundClient,
    soundAccountant: soundAccountant,
  }),
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
      user: "auth/getUser",
      currentWorkspace: "auth/getCurrentWorkspace",
      workspaces: "auth/getWorkspaces",
      tickets: "ticket/getTickets",
      onlineStatus: "auth/getOnlineStatus",
    }),
  },
  mounted() {
    firebase(document);
    var self = this;
    window.addEventListener(
      "focus",
      function () {
        self.pauseSound(false);
      },
      false
    );
    /**
     *  on tab change active/inactive
     **/
    // if (this.user.role === "accountant") {
    //   document.addEventListener("visibilitychange", (event) => {
    //     if (
    //       document.visibilityState == "visible" &&
    //       this.onlineStatus === true
    //     ) {
    //       socket.emit("userConnected", this.user._id);
    //     } else if (
    //       document.visibilityState != "visible" &&
    //       this.onlineStatus === true
    //     ) {
    //       socket.emit("userDisconnected", this.user._id);
    //     }
    //   });
    // }
  },

  methods: {
    playSound(play) {
      if (this.user.role === "client") {
        var x = document.getElementById("myAudioClient");
        if (play) {
          x.play();
          this.$store.dispatch("ticket/getTasks");
        }
      } else if (this.user.role === "accountant") {
        var y = document.getElementById("myAudioAccountant");
        if (play) {
          // y.loop = true;
          y.play();
          this.$store.dispatch("ticket/getTasks");
        }
      }
    },
    // This fuction is user to pause sound of notification
    pauseSound(play) {
      var x = document.getElementById("myAudioClient");
      x.pause();
      var y = document.getElementById("myAudioAccountant");
      y.pause();
    },
    subscribe() {
      socket.on("ticketAssign", (body) => {
        if (this.token && this.onlineStatus && body != null) {
          EventBus.$emit("show-snackbar", {
            text: `New ticket received`,
            type: "success",
          });
          this.playSound(true);
        }
      });
      // accountant message notification needs new socket if a message has been received
      // socket.on("comment", (body) => {
      //   if (this.token)
      //     if (
      //       body.userId !== this.user._id &&
      //       this.workspaces.filter(
      //         (workspace) => workspace._id == body.workspaceId
      //       ).length
      //     ) {
      //       this.playSound(true);
      //       EventBus.$emit("show-snackbar", {
      //         text: `New message received`,
      //         type: "success",
      //       });
      //     }
      // });
    },
  },
  beforeDestroy(){
    socket.removeAllListeners()
  },
  created() {
    this.subscribe();
    var self = this;
    document.addEventListener("click", function () {
      document.getElementById("myAudioClient").pause();
      document.getElementById("myAudioAccountant").pause();
    });

    /**
     *  on tab close
     **/
    if (this.user.role === "accountant") {
      document.addEventListener("beforeunload", (e) => {
        socket.emit("disconnecting", this.user._id);
      });
    }

    EventBus.$on("play-new-message-sound", () => {
      this.playSound(true);
      EventBus.$emit("show-snackbar", {
        text: `New message received`,
        type: "success",
      });
    });

    EventBus.$on('user-status-offline', () => {
      this.pauseSound()
    })
  },
};
</script>

<style>
@font-face {
  font-family: "Lato";
  src: local("Lato"), url(../fonts/Lato-Regular.ttf) format("truetype");
}
</style>
