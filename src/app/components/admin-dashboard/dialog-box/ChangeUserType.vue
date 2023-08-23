<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" scrollable persistent>
      <v-card>
        <v-card-title class="lighten-2">
          Change
          {{ user.role === "accountant" ? "Accountant" : "Supervisor" }} Type
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
                @click="changeUserType()"
                @keyup.enter="changeUserType()"
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
  name: "ChangeUserType",
  data() {
    return {
      dialog: false,
      loader: false,
      user: {},
      // User Types that can be changed
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
    EventBus.$off("open-change-user-type-dialog");
  },
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
    }),
  },
  methods: {
    // Calling backend For updating User Type
   async apiCall() {
      var config = {
        method: "post",
        url: `${UrlServices.updateUserType}`,
        headers: {},
        data: {
            id : this.user._id,
            userType : this.type 
        },
        headers: {
          Authorization: this.token,
        },
      };
      return await axios(config)
    },
    // Check for Validation
    validation() {
        if(this.type === this.user?.userType) throw new Error(`User Type is already ${this.user?.userType}`)
        if(this.type.trim().length === 0) throw new Error('User Type is not selected')
    },
    // Main Function is used to call change User Type
    async changeUserType() {
      try {
        // Set Loader to true for eliminating multiple responses
        this.loader = true
        // Check for Validation
        this.validation()
        // API Call
        await this.apiCall()
        // Get Users to Update Data
        this.$store.dispatch("auth/getUsers");
        // Close Dialog
        this.closeDialog()
        //Call Event Bus for Tag
        EventBus.$emit("show-snackbar", { text: "User type has been updated successfully", type: "success" });
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
      this.user = {};
      this.type = "";
    },
  },
  mounted() {
    // Event Bus is used to open dialog and change user type
    EventBus.$on("open-change-user-type-dialog", (user) => {
      this.user = user;
      this.type = user.userType;
      this.dialog = true;
    });
  },
};
</script>
