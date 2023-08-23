<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" persistent>
      <v-card>
        <v-card-title class="lighten-2 secondaryTextColor appColor--text font-style-heading">
          Change Request Type
        </v-card-title>
        <v-container class="py-0 pt-1">
      <v-card-text class="py-0 font-style-paragraph">
        Note : Request Type will be changed permanently.
      </v-card-text>
      <v-col cols="12" class="ma-0 px-0">
        <v-select
          class="appColor--text default-input-field ma-1 pa-0"
          flat
          solo
          hide-details
          :items="requestTypes"
          placeholder="Request Type*"
          color="appColor"
          dense
          v-model="request_type"
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
          <v-btn color="appColor" class="white--text text-capitalize" @click="changeRequestType()"
            @keyup.enter="changeRequestType()" :loading="loader">
              Save
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
import axios from "axios";
import UrlServices from "@/services/Url"

export default {
  name: "ChangeRequestType",
  components: {
    
  },
  data() {
    return {
      requestTypes: [],
      dialog: false,
      request_type: "",
      loader: false,
      ticket : ""
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
      (this.dialog = false),
        (this.request_type = ""),
        (this.ticket = ""),(this.loader = false)
    },
    changeRequestType() {
      if (this.loader === true) return;
      this.loader = true;
      if (!this.request_type) {
        EventBus.$emit("show-snackbar", {
          text: "Please provide all the required fields",
          type: "error",
        });
        this.loader = false;
        return;
      }
      axios
        .post(
          `${UrlServices.changeRequestType}${this.ticket._id}`,
          {
            type: this.request_type,
          },
          {
            headers: {
              Authorization: this.token,
            },
          }
        )
        .then((res) => {
          EventBus.$emit("show-snackbar", {
            text: "Successfully updated",
            type: "success",
          });
          this.$emit('update-request-type', this.request_type)
          this.closeDialog()
        })
        .catch((e) => {
          EventBus.$emit("show-snackbar", {
            text: "Something went wrong!",
            type: "error",
          });
          this.loader = flase;
        });
    },
  },
  beforeDestroy(){
    EventBus.$off("open-change-request-type-dialog")
  },
  mounted() {
    var self = this;
    EventBus.$on("open-change-request-type-dialog", (body) => {
      this.ticket= body
      var config = {
      method: "get",
      url: UrlServices.ticketTypes,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        if (response.data.data.length > 0) self.requestTypes = [];
        for (let i = 0; i < response.data.data.length; i++) {
          self.requestTypes.push(response.data.data[i].title);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
      this.dialog = true;
    });
    
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
