<template>
  <div class="mt-4">
    <WorkspacesDetails />
    <AddAccountantToWorkspace />
    <AddSupervisorToWorkspace />
    <AddClientToWorkspace />
    <ListAllInWorkspace />
    <ChangeWorkspaceType />
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
      :items="workspaces"
      class="elevation-0 font-style-paragraph mt-2"
    >
      <template v-slot:[`item.accountantActions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              class="text-capitalize ml-2"
              color="appColor"
              outlined
              small
              @click="getAllAccountantsFromWorkspace(item)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small> mdi-eye </v-icon>
            </v-btn>
          </template>
          <span>List of all Accountants</span>
        </v-tooltip>
        <v-tooltip top v-if="item.workSpaceType === 'specific'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              class="text-capitalize ml-2"
              color="appColor"
              outlined
              small
              @click="addAccountantToWorkspace(item)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small> mdi-account-plus </v-icon>
            </v-btn>
          </template>
          <span>Add Accountant in Workspace</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.supervisorActions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              class="text-capitalize ml-2"
              color="appColor"
              outlined
              small
              @click="getAllSupervisorsFromWorkspace(item)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small> mdi-eye </v-icon>
            </v-btn>
          </template>
          <span>List of all Supervisor</span>
        </v-tooltip>
        <v-tooltip v-if="item.workSpaceType === 'specific'" top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              class="text-capitalize ml-2"
              color="appColor"
              outlined
              small
              @click="addSupervisorToWorkspace(item)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small> mdi-account-plus </v-icon>
            </v-btn>
          </template>
          <span>Add Supervisor in Workspace</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.clientActions`]="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              depressed
              class="text-capitalize ml-2"
              color="appColor"
              outlined
              small
              @click="getAllClientsFromWorkspace(item)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon small> mdi-eye </v-icon>
            </v-btn>
          </template>
          <span>List of all Clients</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.createdAt`]="{ item }">
        <div class="font-style-paragraph">
          {{ item.createdAt | formatDate }}
        </div>
      </template>

      <template v-slot:[`item.workSpaceType`]="{ item }">
        <div v-if="item.cease === true">
          <v-chip color="red" small dense>
            <v-icon x-small color="red darken-4">mdi-circle-medium</v-icon>
            <p class="white--text font-style-paragraph pl-2 pt-1">Cease</p>
          </v-chip>
        </div>
        <div v-else class="d-flex">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                depressed
                class="text-capitalize"
                color="appColor"
                outlined
                small
                @click="changeWorkspaceType(item)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small> mdi-account-convert </v-icon>
              </v-btn>
            </template>
            <span>Change Workspace Type</span>
          </v-tooltip>
          <div class="font-style-paragraph ml-2 pt-1">
            {{ String(item.workSpaceType).toLocaleUpperCase() }}
          </div>
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";
import AddAccountantToWorkspace from "../dialog-box/AddAccountantToWorkspace.vue";
import AddSupervisorToWorkspace from "../dialog-box/AddSupervisorToWorkspace.vue";
import AddClientToWorkspace from "../dialog-box/AddClientToWorkspace.vue";
import TicketDetails from "../../dashboard/dialog-box/TicketDetails.vue";
import WorkspacesDetails from "../dialog-box/WorkspacesDetails.vue";
import ChangeWorkspaceType from "../dialog-box/ChangeWorkspaceType.vue";
import ListAllInWorkspace from "../dialog-box/ListAllInWorkspace.vue";
import socket from "@/constants/socket-io/SocketIo";

export default {
  name: "WorkspaceTable",
  components: {
    TicketDetails,
    WorkspacesDetails,
    AddAccountantToWorkspace,
    AddClientToWorkspace,
    ListAllInWorkspace,
    AddSupervisorToWorkspace,
    ChangeWorkspaceType,
  },
  data: () => ({
    headers: [
      { text: "Workspace Name", value: "workspaceName" },
      { text: "Channel Name", value: "channelName" },
      { text: "Workspace Type", value: "workSpaceType" },
      { text: "Accountant", value: "accountantActions" },
      { text: "Supervisor", value: "supervisorActions" },
      { text: "Client", value: "clientActions" },
      { text: "Created At", value: "createdAt" },
    ],
    search: "",
  }),
  mounted() {
    // this.$store.dispatch("auth/getUsers");
  },
  created() {
    socket.on("workspaceStatusUpdated", (body) => {
      // console.log("body here", body)
      // this.$store.commit("auth/updateWorkspace", body);
      this.$store.dispatch("auth/getWorkspaces");
    });
  },
  computed: {
    ...mapGetters({
      workspaces: "auth/getWorkspaces",
    }),
  },
  methods: {
    async changeWorkspaceType(workspace) {
      EventBus.$emit("open-change-workspace-type-dialog", workspace);
    },
    addAccountantToWorkspace(item) {
      EventBus.$emit("add-accountant-to-workspace", item);
    },

    addSupervisorToWorkspace(item) {
      EventBus.$emit("add-supervisor-to-workspace", item);
    },

    unAssignAccountantFromWorkspace(item) {
      EventBus.$emit("unassign-accountant-from-workspace", item);
    },

    unAssignSupervisorFromWorkspace(item) {
      EventBus.$emit("unassign-supervisor-from-workspace", item);
    },

    addClientToWorkspace(item) {
      EventBus.$emit("add-client-to-workspace", item);
    },
    getAllAccountantsFromWorkspace(item) {
      EventBus.$emit("list-all-in-workspace", item, "accountant");
    },
    getAllClientsFromWorkspace(item) {
      EventBus.$emit("list-all-in-workspace", item, "client");
    },
    getAllSupervisorsFromWorkspace(item) {
      EventBus.$emit("list-all-in-workspace", item, "supervisor");
    },
  },
};
</script>
