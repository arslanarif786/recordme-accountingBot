<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" persistent>
      <v-card>
        <v-card-title
          class="lighten-2 secondaryTextColor appColor--text font-style-heading"
        >
          Reroute ticket
        </v-card-title>
        <v-container class="py-0 pt-1" v-if="!loader">
          <v-card-text class="py-0 font-style-paragraph">
            Note : Ticket will be moved to selected supervisor
          </v-card-text>
          <v-col cols="12" class="ma-0 px-0">
            <v-select
              class="appColor--text default-input-field ma-1 pa-0"
              :items="[...supervisors, { user: false, userId: {name : 'Anyone ... '} }]"
              flat
              solo
              hide-details
              placeholder="Status"
              color="appColor"
              dense
              v-model="selectedSupervisor"
              item-text="userId.name"
              item-value="item"
            >
              <template #item="{ item }">
                <p class="font-style-paragraph mainTextColor--text ma-0 pa-0">
                  {{ item?.userId?.name }}
                </p>
                <v-spacer></v-spacer>
                <div v-if="item.userRole">
                  <div v-if="item.socketId">
                    <v-chip
                      v-if="!item.busy"
                      color="green"
                      class="d-flex row-pointer"
                      small
                      dense
                    >
                      <v-icon x-small color="green darken-4"
                        >mdi-circle-medium</v-icon
                      >
                      <p class="white--text font-style-paragraph pl-2 pt-1">
                        Online
                      </p>
                    </v-chip>
                    <v-chip
                      v-else
                      color="orange"
                      class="d-flex row-pointer"
                      small
                      dense
                    >
                      <v-icon x-small color="orange darken-4"
                        >mdi-circle-medium</v-icon
                      >
                      <p class="white--text font-style-paragraph pl-2 pt-1">
                        Busy
                      </p>
                    </v-chip>
                  </div>
                  <v-chip
                    v-else
                    color="red"
                    class="d-flex row-pointer"
                    small
                    dense
                  >
                    <v-icon x-small color="red darken-4"
                      >mdi-circle-medium</v-icon
                    >
                    <p class="white--text font-style-paragraph pl-2 pt-1">
                      Offline
                    </p>
                  </v-chip>
                </div>
              </template>
            </v-select>
          </v-col>

          <v-col cols="12" class="ma-0 px-0 pb-0">
            <v-textarea
              class="d-flex appColor--text default-input-field ma-1 pa-0"
              :autocomplete="false"
              flat
              solo
              hide-details
              color="appColor"
              type="text"
              v-model="note"
              dense
              no-resize
              required
              placeholder="Note"
            >
            </v-textarea>
          </v-col>
        </v-container>

        <v-card-actions v-if="!loader">
          <v-spacer></v-spacer>
          <v-btn
            color="appColor"
            class="white--text text-capitalize"
            @click="closeDialog()"
            @keyup.esc="closeDialog()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="appColor"
            class="white--text text-capitalize"
            @click="rerouteTicket()"
            @keyup.enter="rerouteTicket()"
          >
            Save
          </v-btn>
        </v-card-actions>

        <v-container v-else>
          <div class="d-flex justify-center align-end">
            <v-progress-circular
              indeterminate
              color="appColor"
            ></v-progress-circular>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";
import axios from "axios";
import UrlServices from "@/services/Url";
export default {
  name: "RerouteTicketDialog",
  data() {
    return {
      loader: true,
      dialog: false,
      ticket: "",
      selectedSupervisor: "",
      note: "",
      supervisors: [],
    };
  },
  mounted() {
    // Dialog box will be shown to screen  when this event will be triggered
    EventBus.$on("open-reroute-ticket-dialog", (object) => {
      this.dialog = true;
      this.ticket = object;
      //call api here and set loader to false
      this.getActiveSupervisors();
    });
  },
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
    }),
  },
  created() {},
  methods: {
    closeDialog() {
      (this.dialog = false), (this.ticket = "");
      this.selectedSupervisor = "";
      this.note = "";
      this.supervisors = [];
    },
    rerouteTicket() {
      let supervisor = "";
      if (this.selectedSupervisor.trim().length == 0) {
        EventBus.$emit("show-snackbar", {
          type: "error",
          text: "Please fill all fields",
        });
        return;
      }
      
      
      if (this.selectedSupervisor !== "Anyone...") {
        supervisor = this.supervisors.find(
          (item) => item.userId.name === this.selectedSupervisor
        );
      }
      if (this.note.trim().length == 0) {
        EventBus.$emit("show-snackbar", {
          type: "error",
          text: "Please fill all fields",
        });
        return;
      }
      const data = {
        note: this.note,
      };
      axios
        .post(
          `${UrlServices.rerouteTicketToSupervisor}/${this.ticket._id}?supervisorId=${supervisor?.userId?._id}`,
          data,
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.closeDialog();
          EventBus.$emit("ticket-status-completed");
        })
        .catch((error) => {
          console.log(error);
          EventBus.$emit("show-snackbar", {
            type: "error",
            text: error.response.data.data,
          });
        });
    },
    getActiveSupervisors() {
      axios
        .get(
          `${UrlServices.getActiveSupervisorsForSpecificWorkspace}?workspaceId=${this.ticket.actualWorkspaceId}`,
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        .then((res) => {
          console.log("users Supervisor--->", res.data.users);
          this.supervisors = res.data.users;
          this.loader = false;
        })
        .catch((e) => {
          EventBus.$emit("show-snackbar", {
            text: e.response.data.message,
            type: "error",
          });
        });
    },
  },
};
</script>
<style scoped>
::v-deep .v-input--is-focused {
  border: 1px solid var(--v-appColor-base) !important;
}
::v-deep .v-btn__content {
  letter-spacing: 0.2px !important;
}
</style>
