<template>
  <div class="mt-4">
    <WorkspacesDetails />
    <CreateUser />
    <AddToWorkspace />
    <DeleteDialog />
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

    <v-data-table
      :search="search"
      :headers="headers"
      :items="users"
      class="elevation-0 font-style-paragraph mt-2"
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
        <v-tooltip top>
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

      <template v-slot:[`item.actions`]="{ item }">
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
          <span>Delete User</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import EventBus from "@/js/EventBus";
import TicketDetails from "../../dashboard/dialog-box/TicketDetails.vue";
import WorkspacesDetails from "../dialog-box/WorkspacesDetails.vue";
import CreateUser from "../dialog-box/CreateUser.vue";
import AddToWorkspace from "../dialog-box/AddToWorkspace.vue";
import DeleteDialog from "../dialog-box/DeleteDialog.vue";
import { mapGetters } from "vuex";

export default {
  name: "ClientTable",
  components: {
    TicketDetails,
    WorkspacesDetails,
    CreateUser,
    AddToWorkspace,
    DeleteDialog,
  },
  data: () => ({
    headers: [
      { text: "Name", value: "name" },
      { text: "Email", value: "email" },
      { text: "Role", value: "role" },
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
      users: "auth/getClientUsers",
      token: "auth/getAuthToken",
    }),
  },
  methods: {
    async viewWorkspaces(user) {
      this.$store.dispatch("user/addUserWorkspaces", user.workspaces);
      EventBus.$emit("open-details-dialog-for-workspaces", user);
    },
    async createUser() {
      EventBus.$emit("open-user-dialog");
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
