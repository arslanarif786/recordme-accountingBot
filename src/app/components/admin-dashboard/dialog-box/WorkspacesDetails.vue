<template>
  <div class="text-center">
    <UnAssignAccountantFromWorkspace />
    <UnAssignSupervisorFromWorkspace />
    <v-dialog v-model="dialog" width="700" scrollable persistent>
      <v-card>
        <v-card-title class="lighten-2">
          User Workspaces
          <v-spacer></v-spacer>
          <v-icon @click="dialog = false">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="my-2">
          <v-row justify="center" class="pa-3">
            <v-data-table
              :headers="headers"
              :items="workspaces"
              class="elevation-0"
              :hide-default-footer="true"
            >
              <template  v-slot:[`item.name`]="{ item }">
                <div class="font-style-paragraph">{{ item.name }}</div>
              </template>

              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip  v-if="user.role === 'accountant'"  top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      depressed
                      class="text-capitalize"
                      color="red"
                      outlined
                      small
                      @click="unAssignAccountantFromWorkspace(item)"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small> mdi-account-minus </v-icon>
                    </v-btn>
                  </template>
                  <span>Unassign Workspace</span>
                </v-tooltip>

                <v-tooltip  v-else-if="user.role === 'supervisor'"  top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      depressed
                      class="text-capitalize"
                      color="red"
                      outlined
                      small
                      @click="unAssignSupervisorFromWorkspace(item)"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon small> mdi-account-minus </v-icon>
                    </v-btn>
                  </template>
                  <span>Unassign Workspace</span>
                </v-tooltip>
                <div v-else> - </div>
              </template>
            </v-data-table>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
import axios from "axios";
import UrlServices from "@/services/Url"
import UnAssignAccountantFromWorkspace from "./UnAssignAccountantFromWorkspace.vue";
import UnAssignSupervisorFromWorkspace from "./UnAssignSupervisorFromWorkspace.vue";
export default {
  name: "WorkspaceDetails",
  components: { 
    UnAssignAccountantFromWorkspace,
    UnAssignSupervisorFromWorkspace
  },
  data() {
    return {
      dialog: false,
      workspaces: [],
      headers: [
        { text: "Id", value: "workspaceId.workspaceId" },
        { text: "Name", value: "workspaceId.workspaceName" },
        { text: "Actions", value: "actions" },
      ],
      user : "",
    };
  },
  computed: {
    ...mapGetters({
      token : "auth/getAuthToken"
    }),
  },
  beforeDestroy(){
    EventBus.$off("open-details-dialog-for-workspaces")
  },
  methods: {
    unAssignAccountantFromWorkspace(item) {
      let obj = {
        objectId : item._id,
      }
      EventBus.$emit("unassign-accountant-from-workspace", obj);
      this.dialog = false;
    },
    unAssignSupervisorFromWorkspace(item) {
      let obj = {
        objectId : item._id,
      }
      EventBus.$emit("unassign-supervisor-from-workspace", obj);
      this.dialog = false;
    },
    apiCall(workspace){
      var config = {
        method: "get",
        url: `${UrlServices.getWorkspacesForSpecificUser}?userId=${workspace._id}`,
        headers: {},
        headers: {
             "Authorization": this.token
        },
      };
      axios(config)
        .then(response  => {
          this.workspaces = response.data.workspaces
          
          })
        .catch(error => {
        
        });
    }
  },
  mounted() {
    EventBus.$on("open-details-dialog-for-workspaces", (user) => {
      this.dialog = true
      this.user = user
      this.apiCall(user)
    });
  },
};
</script>
