<template>
  <v-dialog v-model="dialog" width="450" persistent>
    <v-card>
      <v-card-title
        class="lighten-2 backgroundLightColor font-style-heading"
      >
        Connect Accounting Software
        <v-spacer></v-spacer>
        <v-icon @click="closeDialog()" @keyup.esc="closeDialog()"
          >mdi-close</v-icon
        >
      </v-card-title>
      <v-divider></v-divider>
      <form>
        <v-card-text class="pb-0">
          <v-container class="pb-0">
            <v-row>
              <v-col cols="12" class="ma-0 py-0 pl-2">
                <p class="font-style-paragraph ma-0 pa-0">
                  Please select one of the following accounting software.
                </p>
              </v-col>
              <v-col cols="12" class="ma-0 px-0">
                <v-select
                  class="appColor--text default-input-field ma-1 pa-0"
                  flat
                  solo
                  hide-details
                  :items="softwares"
                  placeholder="Status"
                  color="appColor"
                  dense
                  v-model="software"
                  @keyup.enter="connectAccontingSoftware()"
                >
                  <template #item="{ item }">
                    <span
                      class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                    >
                      {{ item }}</span
                    >
                  </template></v-select
                >
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-container class="py-0 d-flex justify-end">
            <v-btn
              color="appColor"
              class="white--text text-capitalize mr-2"
              @click="closeDialog()"
              @keyup.esc="closeDialog()"
            >
              Cancel
            </v-btn>
            <v-btn
              :loading="loader"
              color="appColor"
              class="white--text text-capitalize"
              @click="connectAccontingSoftware()"
              @keyup.enter="connectAccontingSoftware()"
            >
              Save
            </v-btn>
          </v-container>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";
import { config } from "@/config/development";
export default {
  name: "ConnectAccountingSoftware",
  data() {
    return {
      dialog: false,
      software: "",
      softwares: ["Xero"],
      loader: false,
    };
  },
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
  },
  methods: {
    closeDialog() {
      this.dialog = false;
      this.software = "";
      this.loader = false;
    },
    connectAccontingSoftware() {
        this.loader = true;
        if (!this.software) {
          EventBus.$emit("show-snackbar", {
            text: "Please provide all the required fields",
            type: "error",
          });
          this.loader = false;
          return;
        }
        const { workspace_id } = this.currentWorkspace;
        let token = this.token
        token = token.split(' ');
        token = token[token.length - 1];
        window.location.replace(`${process.env.BACK_END_URL}xero/connect?token=${token}&workspace_id=${workspace_id}`)
      },
  },
  mounted() {
    EventBus.$on("open-connect-accounting-software-dialog", () => {
      this.dialog = true;
    });
  },
};
</script>