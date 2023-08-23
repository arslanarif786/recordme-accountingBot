<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      persistent
      justifyContent="right"
      class="dialog-class"
      content-class="dialog-class"
      origin="right"
      open-delay="3"
    >
      <v-card class="card-class">
        <v-card-title
          class="lighten-2 backgroundLightColor font-style-heading"
        >
          Create Ticket
          <v-spacer></v-spacer>
          <v-icon @click="closeDialog()">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>

        <form @dragover="dragover" @dragleave="dragleave" @drop="drop">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="requestTypes"
                    label="Request Type*"
                    v-model="request_type"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    auto-grow
                    rows="1"
                    row-height="15"
                    label="Message*"
                    required
                    v-model="message"
                  ></v-textarea>
                </v-col>

                <v-file-input
                  v-model="file"
                  
                  label="File attachment"
                  counter
                  show-size
                  truncate-length="40"
                >
                </v-file-input>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog()">
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :loading="loader"
              @click="createTicket()"
            >
              Save
            </v-btn>
          </v-card-actions>
        </form>
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
  name: "CreateTicket",
  components: {
    
  },
  data() {
    return {
      requestTypes: ["Bill", "Invoice", "Salary", "Others"],
      dialog: false,
      message: "",
      request_type: "",
      file: null,
      loader: false,
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
    dragover(event) {
      event.preventDefault();
    },
    dragleave(event) {},
    drop(event) {
      event.preventDefault();
      if (event.dataTransfer.files[0]) this.file = event.dataTransfer.files[0];
    },
    closeDialog() {
      (this.dialog = false),
        (this.request_type = ""),
        (this.file = null),
        (this.message = "");
    },
    handleChange(value, name) {
      this[name] = value;
    },
    createTicket() {
      if (this.loader === true) return;
      this.loader = true;
      if (!this.message | !this.request_type) {
        EventBus.$emit("show-snackbar", {
          text: "Please provide all the required fields",
          type: "error",
        });
        this.loader = false;
        return;
      }
      let formdata = new FormData();
      formdata.append("file", this.file);
      formdata.append("message", this.message);
      formdata.append("requestType", this.request_type);
      axios
        .post(`${UrlServices.createTicket}${this.currentWorkspace.workspaceId}`, formdata, {
          headers: {
            Authorization: this.token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          EventBus.$emit("show-snackbar", {
            text: "Successfully created",
            type: "success",
          });
          this.$store.dispatch("ticket/getTasks");
          this.dialog = false;
          this.loader = false;
          this.file = null;
          this.message = "";
          this.request_type = "";
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
  mounted() {
    var self = this;
    EventBus.$on("open-create-ticket-dialog", () => {
      this.dialog = true;
    });
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
  },
};
</script>

<style scoped>
.img-style {
  width: 100%;
  max-width: 250;
  max-height: 200;
  height: 200px;
  border: 5px solid var(--appColor);
}

.v-dialog__content {
    justify-content: flex-end !important;
}

::v-deep .v-dialog > .v-card > .v-card__text {
  padding: 0 24px 0px;
  justify-content: right !important;
}

::v-deep .message-comment {
  padding: 0px !important;
  margin: 0px !important;
}

::v-deep .v-dialog:not(.v-dialog--fullscreen) {
  max-height: 100% !important;
  margin: 0px !important;
  width: 60vw !important;
  justify-content: right !important;
  /* justify-self: right !important; */
}

::v-deep .v-sheet.v-card {
  height: 100vh !important;
}

</style>
