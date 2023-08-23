<template>
    <div class="text-center">
      <v-dialog v-model="dialog" width="450" persistent>
        <v-card>
          <v-card-title class="text-h5 justify-center font-style-heading">
            Un Assign Supervisor
          </v-card-title>
          <v-card-text class="font-style-paragraph">
            Note : Supervisor will be removed permanently from workspace.
          </v-card-text>
          <div class="justify-content : center">
            <v-col md="12" class="py-2 px-4">
              <h3 class="font-style-section-heading"> Are you sure you want to unassign this supervisor ?</h3>
            </v-col>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="appColor" class="white--text text-capitalize" @click="closeDialog()"
              @keyup.esc="closeDialog()">
                Cancel
              </v-btn>
            <v-btn color="appColor" class="white--text text-capitalize" @click="unAssignSupervisor()"
              @keyup.enter="unAssignSupervisor()">
                Unassign
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  
  <script>
  import EventBus from "@/js/EventBus";
  import { mapGetters } from "vuex";
  export default {
    name: "UnAssignSupervisorFromWorkspace",
    data() {
      return {
        dialog: false,
        selected: "",
        supervisor : "",
      };
    },
    mounted() {
      // Dialog box will be shown to screen  when this event will be triggered
      EventBus.$on("unassign-supervisor-from-workspace", (object) => {
        console.log("obj>>>" , object)
        this.supervisor = object
        this.dialog = true;
      });
    },
    computed: {
      ...mapGetters({
        items: "auth/getSupervisorUsers",
        token: "auth/getAuthToken",
      }),
    },
    created() {},
    methods: {
      closeDialog(){
        this.dialog = false,
        this.selected = ""
      },
      unAssignSupervisor(){
        this.$store.dispatch('user/unAssignWorkspace', this.supervisor).then((response) => {
          this.dialog= false;
          this.$store.dispatch("auth/getUsers");
          this.$store.dispatch("auth/getWorkspaces")
          EventBus.$emit("show-snackbar", { text: "Supervisor Removed from Workspace", type: "success" });
        }).catch((e) => {
          console.log(e)
          EventBus.$emit("show-snackbar", { text: "Something went wrong", type: "error" });
        })
  
      },
    },
  };
  </script>
  <style scoped>
  ::v-deep .v-dialog > .v-card > .v-card__text {
    padding: 0 16px 0px;
  }
  .font-style-paragraph {
    font-family: 'Lato';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #484964;
  }
  </style>
  