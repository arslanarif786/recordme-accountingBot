<template>
    <v-dialog v-model="dialog" width="450" persistent>
      <v-card >
         <v-card-title class="lighten-2 backgroundLightColor font-style-heading">
          Create Workspace
          <v-spacer></v-spacer>
          <v-icon @click="closeDialog()" @keyup.esc="closeDialog()">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <form v-if="step === 1">
          <v-card-text class="pb-0">
            <v-container class="pb-0">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                  class="font-style-paragraph"
                  hide-details
                  v-model="workspace_name"
                  color="appColor"
                  dense
                  outlined
                  filled
                  label="Workspace Name*"
                ></v-text-field>
                </v-col>
                <v-col cols="12">
                   <v-text-field
                  class="font-style-paragraph"
                  hide-details
                  v-model="description"
                  color="appColor"
                  dense
                  outlined
                  filled
                  label="Description"
                ></v-text-field>
                </v-col>
              </v-row>
            <small class="font-style-paragraph">*indicates required field</small>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-container class="py-0 d-flex justify-end">
            <v-btn color="appColor" class="white--text text-capitalize mr-2" @click="closeDialog()"
            @keyup.esc="closeDialog()">
              Cancel
            </v-btn>
          <v-btn color="appColor" class="white--text text-capitalize" @click="createWorkspace()"
            @keyup.enter="createWorkspace()">
              Save
            </v-btn>
            </v-container>
          </v-card-actions>
        </form>
        <form v-else-if="step === 2">
          <v-card-text class="pb-0">
            <v-container class="pb-0 d-flex">
             <span class="font-style-paragraph pa-0 ma-0"> Great ! Now please connect "Xero" with email<p class="font-style-paragraph pa-0 ma-0 appColor--text">{{email}}</p> </span>
              <v-spacer></v-spacer>
              <v-btn icon depressed class="text-capitalize mt-2" color="appColor" outlined small text-capitalize
            @click="copyEmail()">
            
            <v-icon small> mdi-content-copy </v-icon>
          </v-btn>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-container class="py-0 d-flex justify-end">
          <v-btn color="appColor" class="white--text text-capitalize" @click="nextPhase()"
            @keyup.enter="nextPhase()">
              Next
            </v-btn>
            </v-container>
          </v-card-actions>
        </form>
        <form v-else-if="step === 3">
          <v-card-text class="pb-0">
            <v-container class="pb-0">
             Press "Done" Button once Access is granted
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-container class="py-0 d-flex justify-end">
          <v-btn color="appColor" class="white--text text-capitalize" @click="complete()"
            @keyup.enter="complete()">
              Done
            </v-btn>
            
            </v-container>
          </v-card-actions>
        </form>
      </v-card>
      
    </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
import axios from "axios";
import UrlServices from "@/services/Url"

export default {
  name: "CreateWorkspace",
  components: {
    
  },
  data() {
    return {
      dialog: false,
      description: "",
      workspace_name: "",
      file: null,
      step : 1,
      email : "bot@recordme.ai",
    };
  },
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
      user: "auth/getUser",
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
  },
  methods: {
    closeDialog() {
     (this.dialog = false), (this.workspace_name = ""), (this.description = ""), (this.step = 1);
    },
    handleChange(value, name) {
      this[name] = value
    },
    createWorkspace() {
      if (!this.workspace_name) return EventBus.$emit("show-snackbar", { text: "Please provide all the required fields", type: 'error' })
      axios
        .post(
          UrlServices.createWorkspace,
          {
            name : this.workspace_name,
            description : this.description
          },
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        .then((res) => {
          EventBus.$emit("show-snackbar", { text: "Successfully created", type: 'success' })
          this.$store.dispatch("auth/getWorkspacesForSpecificUser", {ascSort : false})
          // this.$store.commit("ticket/addTickets", [])
          // this.$store.commit("ticket/setTotalItems", {count : 0, pageNo : 1})
          this.workspace_name = "";
          this.description = "";
          this.step = 2
        })
        .catch((e) => {
          EventBus.$emit("show-snackbar", { text: "Something went wrong!", type: 'error' })
        })
    },
    nextPhase(){
      this.step = this.step + 1
    },
    complete(){
      console.log("xero api is connected")
      this.closeDialog()
    },
    copyEmail(){
      navigator.clipboard.writeText(this.email);
      EventBus.$emit("show-snackbar", { text: "Email has been copied", type: 'success' })
    }


  },
  mounted() {
    EventBus.$on("open-create-workspace-dialog", () => {
      this.dialog = true;
    });
  },
};
</script>

<style scoped>

</style>
