<template>
  <v-app-bar
    app
    color="#f6f6f6"
    elevation="0"
    style="border-bottom: 1px solid #e0e0e0"
  >
    <v-app-bar-nav-icon
      v-if="role === 'superadmin'"
      @click="openDrawer"
      class="drawer-icon d-xs-flex d-sm-flex d-md-none"
    ></v-app-bar-nav-icon>
    <h1 v-if="role === 'superadmin'" class="font-style-heading">
      {{ this.$route.path.substring(1).toUpperCase() }}
    </h1>
    <h1
      v-else-if="
        role === 'supervisor' &&
        currentWorkspace.workspaceName &&
        !['/supervisor-ticketpool'].includes($route.path)
      "
      class="font-style-heading"
    >
      {{ currentWorkspace.workspaceName }}
    </h1>
    <v-spacer></v-spacer>

    <!-- Switch Button for online/offline status -->
    <div
      v-if="
        user.role === 'accountant' ||
        (user.role === 'supervisor' &&
          this.$route.path === '/supervisor-ticketpool')
      "
    >
      <v-chip
        v-if="onlineStatusValue"
        color="green"
        class="d-flex row-pointer"
        small
        dense
        @click="statusUpdated()"
      >
        <v-icon x-small color="green darken-4">mdi-circle-medium</v-icon>
        <p class="white--text font-style-paragraph pl-2 pt-1">Online</p>
      </v-chip>
      <v-chip
        v-else
        color="red"
        class="d-flex row-pointer"
        small
        dense
        @click="statusUpdated()"
      >
        <v-icon x-small color="red darken-4">mdi-circle-medium</v-icon>
        <p class="white--text font-style-paragraph pl-2 pt-1">Offline</p>
      </v-chip>
    </div>

    <div
      v-else-if="
        user.role === 'supervisor' &&
        this.$route.path !== '/supervisor-ticketpool'
      "
    >
      <v-chip
        color="appColor"
        class="d-flex row-pointer"
        small
        dense
        @click="openSupervisorPool()"
      >
        <v-icon x-small color="appColor darken-4">mdi-circle-medium</v-icon>
        <p class="white--text font-style-paragraph pl-2 pt-1">
          Open Pool in new Window
        </p>
      </v-chip>
    </div>

    <v-avatar
      color="appLightColor appColor--text"
      rounded
      size="31"
      class="ma-2"
    >
      {{ user.name[0].toUpperCase() }}
    </v-avatar>
    <p class="font-style-paragraph mx-2">{{ user.name }}</p>
    <v-menu left bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" class="mx-2">
          <v-icon>mdi-arrow-down-drop-circle-outline</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="n in dropDown"
          :key="n.id"
          @click="dropDownFunctionalities(n.id)"
        >
          <v-list-item-title class="font-style-paragraph mainTextColor--text">{{
            n.text
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
import socket from "../../../../constants/socket-io/SocketIo";
import router from "@/app/router";
export default {
  name: "AppBarComponent",
  data() {
    return {
      dropDown: [
        {
          id: 1,
          text: "Logout",
          path: this.$route.path,
        },
      ],
      userStatusInterval: null,
      channel: new BroadcastChannel("online-status"),
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      onlineStatus: "auth/getOnlineStatus",
      role: "auth/getUserRole",
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
    onlineStatusValue: {
      get() {
        return this.onlineStatus;
      },
      set(newName) {
        return newName;
      },
    },
  },
  created() {
    EventBus.$on("change-user-status", (body) => {
      EventBus.$emit("user-status-offline");
      this.statusUpdated();
    });
    socket.on("disconnect", () => {
      if (this.onlineStatus == true) {
        EventBus.$emit("user-status-offline");
        this.statusUpdated();
      }
    });
  },
  mounted() {
    if (this.onlineStatusValue === true && this.role !== "superadmin")
      socket.emit("userConnected", this.user._id);
    this.channel.addEventListener("message", (event) => {
      if (location.origin === event.origin && this.role !== "superadmin")
        this.$store.commit("auth/setOnlineStatus", event.data);
    });
  },
  methods: {
    openSupervisorPool() {
      // socket.emit("userConnected", this.user._id); 
      this.$store.commit("auth/setOnlineStatus", false);
      window.open("/supervisor-ticketpool");
    },
    /**
     * This method is used to test i.e either the user is online/offline
     * Socket integration method used in it
     **/
    statusUpdated() {
      clearTimeout(this.userStatusInterval);
      if (this.onlineStatusValue === false) {
        // if (this.role === "supervisor") {
        //   window.open("/supervisor-ticketpool");
        //   // this.$router.push("/supervisor-ticketpool")
        // }
        socket.emit("userConnected", this.user._id);
        this.userStatusInterval = setTimeout(function () {
          EventBus.$emit("user-status-online");
        }, 1000);
      } else {
        if (this.role === "supervisor") {
          this.$router.push("/");
        }
        socket.emit("userDisconnected", this.user._id);
      }
      this.$store.commit("auth/setOnlineStatus", !this.onlineStatusValue);
      this.channel.postMessage(this.onlineStatusValue);
    },

    dialogOpen() {
      EventBus.$emit("open-online-status-dialog");
    },
    dropDownFunctionalities(id) {
      if (id === 1) this.logout();
    },
    openDrawer() {
      document.getElementById("navigation").style.visibility = "visible";
      document.getElementById("navigation").style.transform = "translateX(0%)";
    },
    logout() {
      this.axios
        .get("log-out")
        .then((res) => {
          console.log(res.data, "SUCCESS");
          this.$store.commit("auth/logout");
          this.$store.commit("ticket/logout");
          this.$store.commit("user/logout");
          this.$store.commit("xeroForm/logout");
          this.$router.push("/login");
          // socket.emit("userDisconnected", this.user._id);
          socket.removeAllListeners();
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.response, "ERR");
        });
    },
  },
  beforeDestroy() {
    this.channel.close();
  },
};
</script>

<style scoped>
.font-style-paragraph {
  font-family: "Lato";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  /* identical to box height */

  /* Text- Style 2 */

  color: #484964;
}

button.v-app-bar__nav-icon.drawer-icon.d-xs-flex.d-sm-flex.d-md-none.v-btn.v-btn--icon.v-btn--round.theme--light.v-size--default {
  margin: 10px;
}

::v-deep .v-toolbar__content .v-btn.v-btn--icon.v-size--default,
.v-toolbar__extension .v-btn.v-btn--icon.v-size--default {
  height: 24px !important;
  width: 24px !important;
}

::v-deep .v-input--selection-controls__ripple {
  width: 0px !important;
}
</style>
