<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" scrollable persistent>
      <v-card>
        <v-card-title class="lighten-2">
          List of All {{type}} in Workspace
          <v-spacer></v-spacer>
          <v-icon @click="closeDialog()">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="my-2">
          <v-row justify="center" class="pa-3">
            <v-data-table
              :headers="headers"
              :items="users"
              class="elevation-0"
              :hide-default-footer="true"
              :loading="loader"
            >

           <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip  v-if="item.userRole === 'accountant' && workspace.workSpaceType === 'specific' "  top>
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
                  <span>Unassign accountant from this workspace</span>
                </v-tooltip>

                <v-tooltip  v-else-if="item.userRole === 'supervisor' && workspace.workSpaceType === 'specific'"  top>
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
                  <span>Unassign supervisor from this workspace</span>
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
import axios from "axios"
import UrlServices from "@/services/Url"
export default {
  name: "ListAllAccountantsInWorkspace",
  data() {
    return {
      dialog: false,
      headers: [
        { text: "Name", value: "userId.name" },
        { text: "Email", value: "userId.email" },
        { text: "Actions", value: "actions" },
      ],
      users : [],
      type: '',
      workspace : "",
      loader : false,
    };
  },
  beforeDestroy(){
      EventBus.$off("list-all-in-workspace")
  },
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
    }),
  },
  methods: {
    closeDialog(){
      this.users = []
      this.type = ''
      this.dialog = false;
      this.workspace = ''
    },
    unAssignAccountantFromWorkspace(item) {
      let obj = {
        objectId : item._id,
      }
      EventBus.$emit("unassign-accountant-from-workspace", obj);
      this.closeDialog()
    },

    unAssignSupervisorFromWorkspace(item) {
      let obj = {
        objectId : item._id,
      }
      EventBus.$emit("unassign-supervisor-from-workspace", obj);
      this.closeDialog()
    },

    apiCall(workspace){
      var config = {
        method: "get",
        url: `${UrlServices.ListAllinWorkspace}?workspaceId=${workspace._id}&userRole=${this.type}`,
        headers: {},
        headers: {
             "Authorization": this.token
        },
      };
      axios(config)
        .then(response  => {
          this.users = response.data.users
          this.loader = false
        })
        .catch(error => {
        
        });
    }
  },
  mounted() {
    EventBus.$on("list-all-in-workspace", (workspace, type) => {
      this.loader = true
      this.type = type
      this.dialog = true;
      this.workspace = workspace
      this.apiCall(workspace)
    });
    
  },
};
</script>
