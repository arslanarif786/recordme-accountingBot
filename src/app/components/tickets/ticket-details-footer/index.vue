<template>
  <div>
    <v-card-actions>
      <v-row class="ma-0 pa-0">
        <v-col cols="11" class="py-0 ma-0">
          <div class="d-flex">
            <v-textarea
              class="font-style-paragraph"
              hide-details
              v-model="message"
              color="appColor"
              dense
              outlined
              placeholder="Send Message"
              filled
              auto-grow
              @keydown.enter.exact.prevent
              @keyup.enter.exact="sendMessage()"
              @keydown.enter.shift.exact="newline"
              rows="1"
              row-height="15"
            >
            </v-textarea>
          </div>
        </v-col>
        <v-col cols="1" class="ma-0 pa-0">
          <div class="d-flex">
            <v-btn
              class="ma-0 pa-0"
              fab
              x-small
              depressed
              dark
              color="appColor"
              @click="sendMessage()"
              @keyup.enter="sendMessage()"
              :loading="loader"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
            <v-file-input
              v-model="file"
              @change="vInputFileChange"
              chips
              show-size
              hide-input
              small-chips
              truncate-length="50"
              class="my-0 ml-2 mr-0 pa-0"
            >
            </v-file-input>
          </div>
        </v-col>
      </v-row>
    </v-card-actions>

    <v-card-actions class="ma-0 py-0 px-6">
      <span v-if="file.length != 0" class="font-style-paragraph"
        >{{ file.name }} | {{ bytesToSize }}</span
      >
      <span
        v-if="file.length != 0"
        @click="clearFiles"
        style="cursor: pointer"
        class="pl-2 font-style-paragraph appColor--text"
        >clear</span
      >
      <span v-if="file.length == 0" class="font-style-paragraph"
        >No file has been selected</span
      >
      <img
        :src="preview"
        v-bind:class="{ 'd-none': isActive }"
        class="img-fluid preview-img"
      />
    </v-card-actions>
  </div>
</template>

<script>
import axios from "axios";
import UrlServices from "@/services/Url";
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
export default {
  name: "TicketDetailsFooter",
  data() {
    return {
      message: "",
      file: [],
      previewFromFileInput: null,
      isActive: true,
      preview: null,
      loader: false,
    };
  },
  props: {
    ticket: Object,
  },
  mounted() {
    this.$emit("move-div-to-bottom")
  },

  methods: {
    async sendMessage() {
      if (this.message.trim().length === 0 && this.file.length === 0) return;
      this.loader = true;
      let formdata = new FormData();
      if (this.file.length != 0) formdata.append("file", this.file);
      formdata.append("message", this.message);
      axios
        .post(
          `${UrlServices.sendMessage}${this.ticket.workspaceId}/${
            this.ticket._id
          }/${this.ticket.fileTimestamp || 23}`,
          formdata,
          {
            headers: {
              Authorization: this.token,
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          this.loader = false;
          let attachmentUrl = "";
          if (this.file.length != 0) {
            attachmentUrl = this.file;
          }
          this.clearFiles();
          this.$emit("move-div-to-bottom")
        });
    },
    vInputFileChange(file) {
      this.preview = null;
      this.isActive = true;
      if (this.bytesToSize != false) {
        if (file.type.startsWith("image/")) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((this.preview = reader.result));
            reader.onerror = (error) => reject(error);
            this.isActive = false;
            this.file.value = "";
          });
        }
      } else {
        this.file.value = "";
        this.clearFiles();
        EventBus.$emit("show-snackbar", {
          text: "File size should be less than 5 MB.",
          type: "error",
        });
      }
    },
    clearFiles() {
      this.file = [];
      this.previewFromFileInput = null;
      this.isActive = true;
      this.message = "";
    },
  },
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
    }),
    bytesToSize() {
      const bytes = this.file.size;
      if (bytes > 5000000) {
        return false;
      }
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },
  },
  created() {
    EventBus.$on("predefined-message", (message) => {
      this.message = message;
    });
    EventBus.$on("update-preview", (message) => {
      this.vInputFileChange(message);
    });
    EventBus.$on("update-file-input", (message) => {
      this.file = message;
    });
  },
};
</script>
<style scoped>
.preview-img {
  width: 100px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #e6e6e6;
}
</style>
