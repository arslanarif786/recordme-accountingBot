<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" persistent>
      <v-card>
        <v-card-title class="lighten-2 secondaryTextColor appColor--text font-style-heading">
          Change Status
        </v-card-title>
        <v-container class="py-0 pt-1">
      <v-card-text class="py-0 font-style-paragraph">
        Note : Status will be changed permanently.
      </v-card-text>
      <v-col cols="12" class="ma-0 px-0">
        <v-select
          class="appColor--text default-input-field ma-1 pa-0"
          flat
          solo
          hide-details
          :items="status"
          placeholder="Status"
          color="appColor"
          dense
          v-model="statusModel"
        >
          <template #item="{ item }">
            <span class="font-style-paragraph mainTextColor--text ma-0 pa-0">
              {{ item }}</span
            >
          </template></v-select
        >
      </v-col>
      </v-container>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="appColor" class="white--text text-capitalize" @click="closeDialog()"
            @keyup.esc="closeDialog()">
              Cancel
            </v-btn>
          <v-btn color="appColor" class="white--text text-capitalize" @click="markComplete(ticket)"
            @keyup.enter="markComplete(ticket)">
              Save
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";
import axios from "axios"
import UrlServices from "@/services/Url"
export default {
  name: "AddToWorkspace",
  data() {
    return {
      dialog: false,
      ticket: "",
      status: ["Complete", "AwaitingResponse"],
      statusModel: "",
    };
  },
  beforeDestroy(){
    EventBus.$off("open-complete-status-dialog")
  },
  mounted() {
    // Dialog box will be shown to screen  when this event will be triggered
    EventBus.$on("open-complete-status-dialog", (object) => {
      this.dialog = true;
      this.ticket= object;
      // this.statusModel = object.status
    });
  },
  computed: {
    ...mapGetters({
      items: "user/getworkspacesWithFilter",
      user: "auth/getUser",
      token: "auth/getAuthToken",
    }),
    
  },
  created() {},
  methods: {
    markComplete(ticket) {
      if(!this.statusModel){
        EventBus.$emit("show-snackbar", { text: "Select Status type", type: "error" });
        return
      }
      let task = ticket;
      task.status = this.statusModel;
      axios
        .post(
          `${UrlServices.changeStatus}${task._id}`,
          {
            status: this.statusModel,
            userId: this.user._id,
          },
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        .then((res) => {
          this.$store.dispatch("ticket/getTasks");
          EventBus.$emit("show-snackbar", {
            text: `Marked ${this.statusModel} successfully`,
            type: "success",
          });
          EventBus.$emit('ticket-status-completed')
          this.closeDialog()
        })
        .catch((e) => {
          let text = e.response.data.data;
          EventBus.$emit("show-snackbar", { text: text, type: "error" });
        });
    },
    closeDialog(){
      this.dialog = false,
      this.ticket = ""
      this.statusModel = ""
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
