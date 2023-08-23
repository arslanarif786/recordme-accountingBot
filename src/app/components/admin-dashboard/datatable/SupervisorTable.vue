<template>
  <div class="mt-4">
    <WorkspacesDetails />
    <CreateSupervisor />
    <UpdateSupervisor />
    <AddToWorkspace />
    <DeleteDialog />
    <ChangeUserType />
    <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
      dense
      style="width: 25%"
      class="ml-3"
    ></v-text-field>
    <template>
      <v-btn
        icon
        depressed
        class="text-capitalize mt-3"
        color="appColor"
        outlined
        small
        @click="createSupervisor()"
      >
        <v-icon small> mdi-plus </v-icon>
      </v-btn>
    </template>
    <v-data-table
      :search="search"
      :headers="headers"
      :items="users"
      class="elevation-0 font-style-paragraph"
    >
      <template v-slot:[`item.name`]="{ item }">
        <div class="font-style-paragraph">
          {{ String(item.name).toLocaleUpperCase() }}
        </div>
      </template>

      <template v-slot:[`item.email`]="{ item }">
        <div class="font-style-paragraph">{{ item.email }}</div>
      </template>

      <template v-slot:[`item.role`]="{ item }">
        <div class="font-style-paragraph">
          {{ String(item.role).toLocaleUpperCase() }}
        </div>
      </template>

      <template v-slot:[`item.workspaces`]="{ item }">
        <v-tooltip v-if="item.userType === 'specific'" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              class="text-capitalize"
              color="appColor"
              outlined
              small
              @click="viewWorkspaces(item)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small> mdi-eye </v-icon>
            </v-btn>
          </template>
          <span>View Workspaces</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.createdAt`]="{ item }">
        <div class="font-style-paragraph">
          {{ item.createdAt | formatDate }}
        </div>
      </template>

      <template v-slot:[`item.userType`]="{ item }">
        <div class="d-flex">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                depressed
                class="text-capitalize"
                color="appColor"
                outlined
                small
                @click="changeUserType(item)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small> mdi-account-convert </v-icon>
              </v-btn>
            </template>
            <span>Change Supervisor Type</span>
          </v-tooltip>
          <div class="font-style-paragraph ml-2 pt-1">
            {{ String(item.userType).toLocaleUpperCase() }}
          </div>
        </div>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              class="text-capitalize"
              color="appColor"
              outlined
              small
              @click="updateSuperVisor(item)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small> mdi-plus </v-icon>
            </v-btn>
          </template>
          <span>Update Supervisor</span>
        </v-tooltip>

        &nbsp;
        <v-tooltip v-if="item.userType === 'specific'" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              class="text-capitalize"
              color="appColor"
              outlined
              small
              @click="openTicketDetails(item)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small> mdi-office-building-plus </v-icon>
            </v-btn>
          </template>
          <span>Assign Workspace</span>
        </v-tooltip>

        &nbsp;
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              class="text-capitalize"
              color="appColor"
              outlined
              small
              @click="deleteUser(item._id)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small> mdi-delete </v-icon>
            </v-btn>
          </template>
          <span>Delete Supervisor</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import EventBus from "@/js/EventBus";
import TicketDetails from "../../dashboard/dialog-box/TicketDetails.vue";
import WorkspacesDetails from "../dialog-box/WorkspacesDetails.vue";
import CreateSupervisor from "../dialog-box/CreateSupervisor.vue";
import UpdateSupervisor from "../dialog-box/UpdateSupervisor.vue";
import AddToWorkspace from "../dialog-box/AddToWorkspace.vue";
import DeleteDialog from "../dialog-box/DeleteDialog.vue";
import ChangeUserType from "../dialog-box/ChangeUserType.vue";
import DialogBox from "../../../../common/dialog-box/index.vue";

import { mapGetters } from "vuex";

export default {
  name: "UserTable",
  components: {
    TicketDetails,
    WorkspacesDetails,
    CreateSupervisor,
    UpdateSupervisor,
    AddToWorkspace,
    DeleteDialog,
    DialogBox,
    ChangeUserType,
  },
  data: () => ({
    headers: [
      { text: "Name", value: "name" },
      { text: "Email", value: "email" },
      { text: "Role", value: "role" },
      { text: "Type", value: "userType" },
      { text: "Workspaces", value: "workspaces" },
      { text: "Created At", value: "createdAt" },
      { text: "Actions", value: "actions" },
    ],
    search: "",
  }),
  mounted() {
    // this.$store.dispatch("auth/getUsers");
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      users: "auth/getSupervisorUsers",
      token: "auth/getAuthToken",
    }),
  },
  methods: {
    async changeUserType(user) {
      EventBus.$emit("open-change-user-type-dialog", user);
    },
    async updateSuperVisor(payload) {
      EventBus.$emit("open-update-supervisor-dialog", payload);
    },
    async viewWorkspaces(user) {
      EventBus.$emit("open-details-dialog-for-workspaces", user);
    },
    async createSupervisor() {
      EventBus.$emit("open-supervisor-dialog");
    },
    async deleteUser(id) {
      EventBus.$emit("open-delete-dialog", id);
    },
    openTicketDetails(item) {
      EventBus.$emit("add-to-workspace-dialog", item);
    },
  },
};
</script>
