<template>
  <v-navigation-drawer app id="navigation">
    <a
      href="javascript:void(0)"
      class="closebtn d-xs-flex d-sm-flex d-md-none"
      @click="closeDrawer"
      >&times;</a
    >
    <v-img
      :src="require('../../../../assets/navbar/image1.png')"
      class="my-5 ml-14"
      contain
      height="40"
      width="140"
    />
    <span class="font-style-heading secondaryTextColor--text pl-4">{{
      role == "superadmin" ? "ROUTES" : "COMPANIES"
    }}</span>
    <v-list dense nav>
      <template v-if="role == 'superadmin'">
        <v-list-item
          v-for="(route, ind) in routes"
          :key="ind"
          :class="{
            'color-active': $route.path == route.route,
          }"
          @click="navigate(route.route)"
        >
          <v-list-item-icon class="mr-2">
            <v-icon v-if="$route.path == route.route" color="appColor">{{
              route.icon
            }}</v-icon>
            <v-icon v-else color="secondaryTextColor">{{ route.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-style-heading"
              >{{ route.name | truncate() }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list-item
        v-else
        link
        :ripple="false"
        v-for="(workspace, index) in workspaces"
        :key="index"
        :class="{
          'color-active': workspace.workspaceId == currentWorkspace.workspaceId,
        }"
        @click="updateCurrentWorkspace(workspace)"
      >
        <v-list-item-icon class="mr-2">
          <!-- :style="{backgroundColor: randomColor()}" -->
          <v-avatar
            color="appLightColor navBarTextColor--text"
            rounded
            size="26"
            class="mb-1"
          >
            {{ workspace.workspaceName[0].toUpperCase() }}</v-avatar
          >
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>
            {{ workspace.workspaceName | truncate() }}</v-list-item-title
          >
        </v-list-item-content>

        <v-badge
          v-if="workspace.isAccountingSoftConnected"
          value="444"
          color="red"
          content="xero"
          class=""
          inline
        >
        </v-badge>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
export default {
  name: "NavigationBarComponent",
  computed: {
    ...mapGetters({
      workspaces: "auth/getWorkspaces",
      currentWorkspace: "auth/getCurrentWorkspace",
      role: "auth/getUserRole",
    }),
  },
  data() {
    return {
      routes: [
        {
          name: "ACCOUNTANTS",
          active: false,
          icon: "mdi-account",
          route: "/accountants",
        },
        {
          name: "CLIENTS",
          active: false,
          icon: "mdi-account",
          route: "/clients",
        },
        {
          name: "WORKSPACES",
          active: false,
          icon: "mdi-office-building",
          route: "/workspaces",
        },
        { name: "TICKETS", active: false, icon: "mdi-file", route: "/tickets" },
        {
          name: "SUPERVISOR",
          active: false,
          icon: "mdi-account",
          route: "/supervisor",
        },
        {
          name: "ITEMS",
          active: false,
          icon: "mdi-shopping",
          route: "/all-items",
        },
        {
          name: "CHART OF ACCOUNTS",
          active: false,
          icon: "mdi-bank",
          route: "/account-items",
        },
      ],
    };
  },
  methods: {
    // randomColor(){
    //   return "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
    // },
    async updateCurrentWorkspace(workspace) {
      if (workspace.workspaceId == this.currentWorkspace.workspaceId) return;
      EventBus.$emit("update-loader", true);
      this.$store
        .dispatch("auth/selectWorkspace", workspace)
        .then((res) => {
          this.$store
            .dispatch("ticket/getTasks")
            .then((res) => EventBus.$emit("update-loader", false));
        })
        .catch((e) => console.log(e));
    },
    navigate(route) {
      this.$router.replace({ path: route });
    },
    closeDrawer() {
      document.getElementById("navigation").style.visibility = "hidden";
      document.getElementById("navigation").style.transform = "translateX(0%)";
    },
  },
  mounted() {
    if (this.role !== "superadmin")
      this.$store.dispatch("auth/getWorkspacesForSpecificUser");
  },
};
</script>

<style scoped>
.font-style-heading {
  font-family: Lato !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  font-style: normal;
}

button.v-app-bar__nav-icon.drawer-icon.v-btn.v-btn--icon.v-btn--round.theme--light.v-size--default {
  margin: 10px;
}

a.closebtn.d-xs-flex.d-sm-flex.d-md-none {
  font-size: 25px;
  color: #6e5c5c;
  position: relative;
  left: 230px;
}

.font-style-paragraph {
  font-family: Lato !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-align: center;
}

::v-deep .v-list-item__title,
.v-list--dense .v-list-item .v-list-item__subtitle {
  font-family: Lato !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  line-height: 1rem;
}

.color-active {
  background: #bee2e6 !important;
}

.pointer {
  cursor: pointer;
}
</style>
