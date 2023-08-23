<template>
  <!-- <div v-if="userOnline"> -->
  <div >
    <CompleteStatusDialog />
    <XeroFormDialog />
    <RerouteTicketDialog />
    <ChangeRequestType @update-request-type="updateRequestType" />
    <Loader v-if="step == 1">
      <template v-slot:text>Waiting for new ticket ...</template>
    </Loader>
    <NewTicketNotification
      v-else-if="step == 2"
      @change-step="getTicketDetails"
      :newTicketNotification="newTicketNotification"
      :ticket="ticket"
    />
    <TicketComponent v-else-if="step == 4" :ticket="ticket" />
  </div>
  <!-- <div v-else>
    <Loader>
      <template v-slot:text>Please change your status to online</template>
    </Loader>
  </div> -->
</template>

<script>
import { mapGetters } from "vuex";
import Loader from "./loader";
import TicketComponent from "./ticket-component";
import NewTicketNotification from "./new-ticket-notification";
import socket from "../../../constants/socket-io/SocketIo";
import CompleteStatusDialog from "../dashboard/dialog-box/CompleteStatusDialog.vue";
import ChangeRequestType from "../dashboard/dialog-box/ChangeRequestType.vue";
import XeroFormDialog from "../dashboard/dialog-box/XeroFormDialog.vue";
import RerouteTicketDialog from "../dashboard/dialog-box/RerouteTicketDialog.vue";
import EventBus from "@/js/EventBus";
import axios from "axios";
import UrlServices from "@/services/Url";
let interval = null,
  intervalForTicket = null,
  removeTicketInterval = null;
export default {
  name: "DataTable",
  components: {
    Loader,
    TicketComponent,
    NewTicketNotification,
    CompleteStatusDialog,
    XeroFormDialog,
    RerouteTicketDialog,
    ChangeRequestType,
  },
  data: () => ({
    ticket: {},
    step: 1,
    newTicketNotification: false,
    workspaceName: "",
    isAccountingSoftConnected: "",
  }),
  watch: {},
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      onlineStatus: "auth/getOnlineStatus",
    }),
    // userOnline() {
    //   if (this.user._id && this.onlineStatus === true) {
    //     this.resetData();
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
  },
  created() {
    // when ticket is completed, function is being used to found a new ticket
    EventBus.$on("ticket-status-completed", () => {
      this.getTicketFromSockets();
    });
    // when ticket is completed, function is being used to found a new ticket if user status is online
    // EventBus.$on("user-status-online", () => {
    //   this.resetData();
    //   this.emitTicketSocket();
    //   //TESTING PHASE - 1
    //   this.onlineIntervalCheck();
    //   //TESTING PHASE - 1 -END
    // });
    // update-draft when user is offline
    EventBus.$on("update-draft-form", (draft) => {
      this.ticket["draft"] = draft;
    });
    // The value of xeroSubmission key sets to true when ticket is completed
    EventBus.$on("change-ticket-xero-form-to-complete", (boolean) => {
      this.ticket["xeroSubmission"] = boolean;
    });

    this.listenTicketSocket();
  },
  mounted() {
    this.getTicketFromSockets();
  },
  methods: {
    /*
    TESTING PHASE - 1
    check after 2 second if user network is in online state or not 
    if not, kindly change the user status to offline and clear interval.
    */
    onlineIntervalCheck() {
      if (interval !== null) clearInterval(interval);
      interval = setInterval(() => {
        let online = navigator.onLine;
        if (online == false && this.onlineStatus === true) {
          // if (online == false) {
          // update user inpuit
          EventBus.$emit("change-user-status");
          clearInterval(interval);
        }
      }, 2000);
    },
    updateRequestType(value) {
      this.ticket.requestType = value;
    },
    // to reset page data
    resetData() {
      (this.step = 1), (this.emptyCount = 0);
      this.newTicketNotification = false;
      this.ticket = {};
      this.workspaceName = "";
      this.isAccountingSoftConnected = "";
    },
    // socket emitter function
    emitTicketSocket() {
      socket.emit("findTicket", this.user._id);
    },
    // socket listener function
    listenTicketSocket() {
      if (intervalForTicket !== null) clearInterval(intervalForTicket);
      socket.on("ticketAssign", (body) => {
        if (body !== null && Object.keys(this.ticket).length === 0) {
          // Testing Phase - 1
          clearInterval(intervalForTicket);
          // Testing Phase - 1 - End
          this.assignTicketToUser(body);
        } else if (!body) {
          /*
          TESTING PHASE - 1
          emit socket after 10 seconds if user is in online state and idle 
          remove the listener instance after getting new ticket
          */
          if (intervalForTicket !== null) clearInterval(intervalForTicket);
          intervalForTicket = setTimeout(() => {
            if (this.user._id && this.onlineStatus === true)
              this.emitTicketSocket();
            else clearInterval(intervalForTicket);
          }, 10000);
        }
      });
    },
    // socket emitter function for change status of ticket
    socketForChangeStatus(status) {
      socket.emit("changeStatus", {
        ticketId: this.ticket._id,
        userId: this.user._id,
        status: status,
      });
    },
    // assign ticket to user function
    assignTicketToUser(body) {
      this.step = 2;
      this.newTicketNotification = true;
      this.ticket = body;
      this.workspaceName = body?.workspaceName;
      this.isAccountingSoftConnected = body?.isAccountingSoftConnected;
      console.log("body here =>", this.ticket);
      // here condition will be added for one minute
      if (removeTicketInterval !== null) clearInterval(removeTicketInterval);
      removeTicketInterval = setTimeout(() => {
        // close dialog box
        this.resetData();
        EventBus.$emit("change-user-status", false);
      }, 60000);
    },
    // get details of ticket function if user accepted the details
    getTicketDetails() {
      this.socketForChangeStatus("InProgress");
      clearTimeout(removeTicketInterval);
      setTimeout(() => this.APIcalling(), 1000);
      // this.step = 4
    },
    async APIcalling() {
      let response = await axios.get(
        UrlServices.getTicketDetails + this.ticket._id
      );
      if (response.data && response.data.ticket) {
        console.log("here resp =>", response.data.ticket);
        this.ticket = response.data.ticket;
        this.ticket["workspaceName"] = this.workspaceName;
        this.ticket["isAccountingSoftConnected"] =
          this.isAccountingSoftConnected;
        this.step = 4;
      }
    },
    // function to reset data and emit socket listener
    getTicketFromSockets() {
      if (this.user._id && this.onlineStatus === true) {
        this.resetData();
        this.emitTicketSocket();
        //TESTING PHASE - 1
        this.onlineIntervalCheck();
        //TESTING PHASE - 1 -END
      }
    },
  },
  beforeDestroy() {
    EventBus.$off("ticket-status-completed");
    EventBus.$off("user-status-online");
    EventBus.$off("update-draft-form");
    EventBus.$off("change-ticket-xero-form-to-complete");
  },
};
</script>

<style scoped></style>
