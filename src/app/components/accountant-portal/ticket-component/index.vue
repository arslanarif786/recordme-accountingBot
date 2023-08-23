<template>
  <div class="text-center">
        <TicketDetailsHeader :ticket="ticket"  @closeDialog="closeDialog($event)" />
        <div @dragover="dragover" @dragleave="dragleave" @drop="drop">
          <v-card-actions class="pt-0">
            <v-row class="ma-0 pa-0">
              <v-col
                cols="9"
                class="overflow-auto"
                style="height: 55vh; max-height: 55vh"
                id="chatBox"
                ref="chatBox"
              >
                <ChatModule />
              </v-col>
              <v-col
                cols="3"
                class="overflow-auto backgroundFAQColor"
                style="height: 55vh; max-height: 55vh"
              >
                <LogsandFAQModule  :ticket="ticket"/>
              </v-col>
            </v-row>
          </v-card-actions>
          <TicketDetailsFooter @move-div-to-bottom="moveDivToBottom" :ticket="ticket" />
        </div>
      
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
import axios from "axios";
import UrlServices from "@/services/Url"
import LogsandFAQModule from "../../tickets/logs-and-faq-module/index.vue"
import ChatModule from "../../tickets/chat-module/index.vue";
import TicketDetailsHeader from "../../tickets/ticket-details-header/index.vue";
import TicketDetailsFooter from "../../tickets/ticket-details-footer/index.vue";
import socket from "../../../../constants/socket-io/SocketIo";

export default {
  name: "index",
  components: {
    ChatModule,
    TicketDetailsHeader,
    TicketDetailsFooter,
    LogsandFAQModule
  },
  props : {
    ticket : Object,
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
      user: "auth/getUser",
      currentWorkspace: "auth/getCurrentWorkspace",      
    }),
  },
  created() {
    this.subscribe();
  },
  beforeDestroy(){
    socket.removeListener("comment")
  },
  methods: {
    moveDivToBottom(){
      setTimeout(() => {
        const element = document.getElementById("chatBox");
        element.scrollTop = element.scrollHeight;
      }, 1000)
    },
    dragover(event) {
      event.preventDefault();
    },
    dragleave(event) {},
    drop(event) {
      event.preventDefault();
      if (event.dataTransfer.files[0]) EventBus.$emit("update-file-input",event.dataTransfer.files[0]) 
      var input = event.dataTransfer.files[0];
      EventBus.$emit("update-preview", event.dataTransfer.files[0]);
      if (input.files) {
        var reader = new FileReader();
        reader.onload = (e) => {
          
          // this.preview = e.target.result
        };
        reader.readAsDataURL(input.files[0]);
      }
    },
    closeDialog() {
      (this.dialog = false)
      EventBus.$emit('close-details-dialog', this.ticket)
      this.$store.commit('ticket/setMessages', [])
    },
    convertBlobToBase64: (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      }),
    async previewImage(url) {
      var data = {
        token: this.currentWorkspace.botToken,
      };
      data["file"] =
        url.search("files/tickets") > -1
          ? url
          : url.split("https://files.slack.com/")[1];
      var config = {
        method: "post",
        url: UrlServices.slack,
        data: data,
        responseType: "blob",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      return axios(config);
    },
    async previewURL(ticket) {
      if (!ticket.attachmentUrl) return;
      let response = await this.previewImage(ticket.attachmentUrl);
      let blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const base64String = await this.convertBlobToBase64(blob);
      this.imageUrl = base64String;
    },
    subscribe() {
      socket.on("comment", (body) => {
        if (this.token) 
          if (this.ticket.ticketNo == body.ticketNo) {
            this.$store.dispatch("ticket/getAllMessagesByTicketId", {
              id: this.ticket._id,
            });
            if(this.user._id !== body.userId) EventBus.$emit("play-new-message-sound")
          }
        });
    },
  },
  mounted() {
    this.$store.dispatch("ticket/getAllMessagesByTicketId", {
              id: this.ticket._id,
    });
    // EventBus.$on("open-details-dialog", (ticket) => {
      // this.dialog = true;
      // console.log("here get all messages using this ticket id" , this.ticket?._id)
      // this.ticket = ticket;
      // this.$store.dispatch("ticket/getAllMessagesByTicketId", {
      //   // id: ticket?._id,
      //   id : this.ticket?._id
      // });
    // });
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
  /* padding: 0 24px 0px; */
  justify-content: right !important;
}

.preview-img {
  width: 100px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #e6e6e6;
}

::v-deep .message-comment {
  padding: 0px !important;
  margin: 0px !important;
}

::v-deep .v-dialog:not(.v-dialog--fullscreen) {
  max-height: 100vh !important;
  margin: 0px !important;
  width: 60vw !important;
  justify-content: right !important;
}

::v-deep .v-sheet.v-card {
  height: 200% !important;
}

.v-application p {
  margin-bottom: 4px !important;
}

/* Landscape phones and portrait tablets */
@media only screen and (max-width: 767px) {
  ::v-deep .v-dialog:not(.v-dialog--fullscreen) {
    width: 90vw !important;
  }
}
.font-style-heading {
  font-family: Lato !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  font-style: normal;
}

.font-style-paragraph {
  font-family: Lato !important;
  font-size: 13px !important;
  font-weight: 400 !important;
}

.font-style-section-heading {
  font-family: Lato !important;
  font-size: 13px !important;
  font-weight: 600 !important;
}
</style>