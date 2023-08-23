<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" scrollable persistent>
      <v-card>
        <v-card-title class="lighten-2">
          Change Workspace Type
          <v-spacer></v-spacer>
          <v-icon @click="closeDialog()">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2 pt-2">
          <v-select
            class="font-style-paragraph"
            hide-details
            color="appColor"
            dense
            outlined
            filled
            :items="types"
            item-text="text"
            item-value="value"
            label="Change Type"
            v-model="type"
          >
          </v-select>
        </v-card-text>

        <v-card-actions>
          <v-container>
            <v-row class="mx-1">
              <v-spacer></v-spacer>
              <v-btn
                depressed
                class="appColor--text text-capitalize mx-1"
                @click="closeDialog()"
                @keyup.esc="closeDialog()"
              >
                Cancel
              </v-btn>
              <v-btn
                depressed
                :loading="loader"
                color="appColor"
                class="white--text text-capitalize mx-1"
                @click="changeWorkspaceType()"
                @keyup.enter="changeWorkspaceType()"
              >
                Save
              </v-btn>
            </v-row>
          </v-container>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
import axios from "axios";
import UrlServices from "@/services/Url";
export default {
  name: "ChangeWorkspaceType",
  data() {
    return {
      dialog: false,
      loader: false,
      workspace: {},
      // Workspace Types that can be changed
      types: [
        {
          text: "Public",
          value: "public",
        },
        {
          text: "Specific",
          value: "specific",
        },
      ],
      type: "",
    };
  },
  // Close event bus to avoid multiple instances.
  beforeDestroy() {
    EventBus.$off("open-change-workspace-type-dialog");
  },
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
    }),
  },
  methods: {
    // Calling backend For updating Workspace Type
   async apiCall() {
      var config = {
        method: "post",
        url: `${UrlServices.updateWorkspaceType}`,
        headers: {},
        data: {
            id : this.workspace._id,
            workSpaceType : this.type 
        },
        headers: {
          Authorization: this.token,
        },
      };
      return await axios(config)
    },
    // Check for Validation
    validation() {
        if(this.type === this.workspace?.workSpaceType) throw new Error(`Workspace Type is already ${this.workspace?.workSpaceType}`)
        if(this.type.trim().length === 0) throw new Error('Workspace Type is not selected')
    },
    // Main Function is used to call change Workspace Type
    async changeWorkspaceType() {
      try {
        // Set Loader to true for eliminating multiple responses
        this.loader = true
        // Check for Validation
        this.validation()
        // API Call
        await this.apiCall()
        // Get Workspaces to Update Data
        this.$store.dispatch("auth/getWorkspaces");
        // Close Dialog
        this.closeDialog()
        //Call Event Bus for Tag
        EventBus.$emit("show-snackbar", { text: "Workspace type has been updated successfully", type: "success" });
      } catch (e) {
        this.loader = false
        // Show Error Message
        EventBus.$emit("show-snackbar", { text: e?.response?.data?.error ? e.response.data.error : e, type: "error" });
      }
    },
    // Close Dialog and Reset Data
    closeDialog() {
      this.dialog = false;
      this.loader = false;
      this.workspace = {};
      this.type = "";
    },
  },
  mounted() {
    // Event Bus is used to open dialog and change workspace type
    EventBus.$on("open-change-workspace-type-dialog", (workspace) => {
      this.workspace = workspace;
      this.type = workspace.workSpaceType;
      this.dialog = true;
    });
  },
};
</script>
