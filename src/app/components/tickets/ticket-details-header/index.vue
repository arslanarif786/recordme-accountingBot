<template>
  <div>
    <XeroFormNotConnected />
    <v-card-title
      class="lighten-2 secondaryTextColor appColor--text font-style-heading"
    >
      Ticket Details : #{{ ticket.ticketNo }}
      <v-spacer></v-spacer>
      <div v-if="role === 'superadmin'">
        <v-icon @click="closeDialog()">mdi-close</v-icon>
      </div>
      <div v-else-if="role === 'supervisor' && crossBtn">
        <v-icon @click="closeDialog()">mdi-close</v-icon>
      </div>
      <span v-else>
        <Button
          v-if="role === 'accountant'"
          @button-clicked="changeRequestType()"
          class="mr-2"
        >
          <template v-slot:buttonHeading> Change Request Type </template>
        </Button>
        <Button @button-clicked="rerouteTicket()" class="mr-2">
          <template v-slot:buttonHeading> Route Ticket </template>
        </Button>
        <Button @button-clicked="markComplete()" class="mr-2">
          <template v-slot:buttonHeading> Change Status </template>
        </Button>
      </span>
      <!-- <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-menu bottom offset-y v-bind="attrs" v-on="on">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                depressed
                class="text-capitalize"
                v-bind="attrs"
                v-on="on"
                color="appColor"
                outlined
                small
              >
                <v-icon small>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="markComplete()">
                <v-list-item-title
                  class="font-style-paragraph mainTextColor--text"
                  >Change Status</v-list-item-title
                >
              </v-list-item>
              <v-list-item @click="rerouteTicket()">
                <v-list-item-title
                  class="font-style-paragraph mainTextColor--text"
                  >Reroute Ticket</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <span>Click to Open Details</span>
      </v-tooltip> -->
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pt-3">
      <v-row justify="center" class="">
        <v-col cols="6">
          <div>
            <div class="d-flex">
              <h4 class="font-style-section-heading mainTextColor--text">
                Ticket ID :
              </h4>
              <p class="pl-2 font-style-paragraph">
                {{ ticket.ticketNo }}
              </p>
            </div>
            <div class="d-flex" v-if="role === 'supervisor' && crossBtn">
              <h4 class="font-style-section-heading mainTextColor--text">
                Workspace :
              </h4>
              <p class="pl-2 font-style-paragraph">
                {{ currentWorkspace.workspaceName }}
              </p>
            </div>
            <div class="d-flex" v-else-if="role === 'superadmin'">
              <!-- <h4 class="font-style-section-heading mainTextColor--text">
                Workspace :
              </h4>
              <p class="pl-2 font-style-paragraph">
                {{ currentWorkspace.workspaceName }}
              </p> -->
            </div>
            <div class="d-flex" v-else>
              <h4 class="font-style-section-heading mainTextColor--text">
                Workspace :
              </h4>
              <p class="pl-2 font-style-paragraph">
                {{ ticket.workspaceName }}
              </p>
            </div>
            <div class="d-flex">
              <h4 class="font-style-section-heading mainTextColor--text">
                Created At :
              </h4>
              <p class="pl-2 font-style-paragraph">
                {{ ticket.createdAt | formatTime }},
                {{ ticket.createdAt | formatDate }}
              </p>
            </div>
            <div v-if="ticket.message != ''" class="d-flex">
              <h4 class="font-style-section-heading mainTextColor--text">
                Message :
              </h4>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <p v-bind="attrs" v-on="on" class="pl-2 font-style-paragraph">
                    {{ ticket.message | truncate(54) }}
                  </p>
                </template>
                <span>{{ ticket.message }}</span>
              </v-tooltip>
            </div>
          </div>
        </v-col>

        <v-col cols="6">
          <div>
            <div class="d-flex">
              <h4 class="font-style-section-heading mainTextColor--text">
                Status :
              </h4>
              <v-chip
                v-if="role === 'supervisor' && crossBtn"
                :color="
                  ticket.status !== 'Complete'
                    ? 'pendingBackGroundColor'
                    : 'completedBackgroundColor'
                "
                :class="
                  ticket.status !== 'Complete'
                    ? 'pendingColor--text'
                    : 'completedColor--text'
                "
                small
                >{{ ticket.status }}</v-chip
              >
              <v-chip
                v-else-if="role === 'superadmin'"
                :color="
                  ticket.status !== 'Complete'
                    ? 'pendingBackGroundColor'
                    : 'completedBackgroundColor'
                "
                :class="
                  ticket.status !== 'Complete'
                    ? 'pendingColor--text'
                    : 'completedColor--text'
                "
                small
                >{{ ticket.status }}</v-chip
              >
              <v-chip
                v-else
                class="ml-2 font-style-paragraph"
                small
                color="pendingBackGroundColor pendingColor--text"
                >In Progress</v-chip
              >
            </div>
            <div class="d-flex">
              <h4 class="font-style-section-heading mainTextColor--text">
                Request Type :
              </h4>
              <p class="pl-2 font-style-paragraph">
                {{ ticket.requestType }}
              </p>
            </div>
            <div class="d-flex">
              <h4 class="font-style-section-heading mainTextColor--text">
                Completed On :
              </h4>
              <p
                v-if="role === 'superadmin' && ticket.status == 'Complete'"
                class="pl-2 font-style-paragraph"
              >
                {{ ticket.statusLastUpdatedAt | formatTime }},
                {{ ticket.statusLastUpdatedAt | formatDate }}
              </p>
              <p
                v-else-if="
                  role === 'supervisor' &&
                  crossBtn &&
                  ticket.status == 'Complete'
                "
                class="pl-2 font-style-paragraph"
              >
                {{ ticket.statusLastUpdatedAt | formatTime }},
                {{ ticket.statusLastUpdatedAt | formatDate }}
              </p>
              <p v-else class="pl-2 font-style-paragraph">-</p>
            </div>
            <div v-if="ticket.attachmentUrl" class="d-flex">
              <h4 class="font-style-section-heading mainTextColor--text">
                Attachment :
              </h4>

              <v-icon
                class="ml-2 mb-2"
                color="appColor"
                @click="openPrivateURL(ticket.attachmentUrl)"
              >
                mdi-cloud-download-outline</v-icon
              >
            </div>
            <div v-if="role !== 'superadmin'" class="d-flex">
              <h4 class="font-style-section-heading mainTextColor--text">
                Xero Form:
              </h4>
              <!-- <p v-if="" class="pl-2 font-style-paragraph mainTextColor--text">
                Form is already Submitted
              </p>
              v-else -->

              <!-- Xero Software is connected -->
              <div v-if="ticket.isAccountingSoftConnected">
                <v-icon
                  v-if="ticket?.xeroSubmission === true"
                  class="ml-2 mb-2"
                  color="appColor"
                  @click="openXeroFormFromDraft(ticket.attachmentUrl)"
                >
                  mdi-pencil-box-outline</v-icon
                >
                <v-icon
                  v-else-if="ticket?.xeroSubmission === false"
                  class="ml-2 mb-2"
                  color="appColor"
                  @click="openXeroForm(ticket.attachmentUrl)"
                >
                  mdi-link-box-outline</v-icon
                >
              </div>
              <!-- <div v-else>
                <v-icon class="ml-2 mb-2" color="appColor" @click="showError">
                  mdi-link-box-outline</v-icon
                >
              </div> -->
              <!-- Xero Software is not connected -->
              <div v-else-if="!ticket.isAccountingSoftConnected">
              Has a draft object
              <v-icon
                v-if="ticketDraft || ticket?.draft"
                class="ml-2 mb-2"
                color="appColor"
                @click="openXeroFormFromDraftNotConnectedXero(ticket.attachmentUrl)"
              >
                mdi-pencil-box-outline</v-icon
              >
              <!-- Does not has draft object -->
              <v-icon
                v-else-if="!ticketDraft || !ticket?.draft"
                class="ml-2 mb-2"
                color="appColor"
                @click="openXeroFormNotConnectedWithXero(ticket.attachmentUrl)"
              >
                mdi-link-box-outline</v-icon
              >
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
  </div>
</template>

<script>
import axios from "axios";
import UrlServices from "@/services/Url";
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
import Button from "@/common/button";
import XeroFormNotConnected from "../../dashboard/dialog-box/XeroFormNotConnected.vue";
export default {
  name: "TicketDetailsHeader",
  data() {
    return {
      crossBtn: false,
      ticketDraft: false,
      isTicketAccountingSoftConnected: false,
      newInvoiceForm: {
        invoices: [
          {
            address: "",
            balanceDue: "",
            currencyCode: "",
            date: "",
            discount: "",
            dueDate: "",
            email: "",
            invoiceNumber: "",
            lineItems: [
              {
                description: "",
                disc: 0,
                lineAmount: 0,
                quantity: 0,
                taxAmount: 0,
                unitAmount: 0,
                itemCode: "",
                accountCode: "",
                taxType: "",
              },
            ],
            name: "",
            subTotal: "",
            totalTax: "",
            total: "",
            status: "",
            type: "ACCREC",
            lineAmountTypes: "Exclusive",
          },
        ],
      },
    };
  },
  props: {
    ticket: Object,
  },
  components: {
    Button,
    XeroFormNotConnected,
  },
  created() {
    this.crossBtn =
      this.$route.path === "/supervisor-ticketpool" ? false : true;
  },
  mounted() {
    // The value of ticketDraft key sets to true when user is not connected with Xero
    // and wants to open the saved invoices
    EventBus.$on("open-draft-form", (boolean) => {
      this.ticketDraft = boolean;
    });
  },
  beforeDestroy() {
    EventBus.$off("open-draft-form");
  },
  methods: {
    showError() {
      EventBus.$emit("show-snackbar", {
        type: "error",
        text: "User disconnected Xero",
      });
    },
    async apiCallForCategories() {
      try {
        let config = {
          method: "get",
          url: `${UrlServices.getWorkspaceCategories}/${this.ticket.workspaceId}`,
          headers: {
            Authorization: this.token,
          },
        };
        let res = await axios(config);
        this.$store.commit("xeroForm/addCategories", res.data);
        return;
      } catch (error) {
        EventBus.$emit("show-snackbar", {
          text: error.response.data.message,
          type: "error",
        });
      }
    },
    async openXeroFormFromDraft(url) {
      this.$store.commit("xeroForm/setWorkspaceId", this.ticket.workspaceId);
      this.$store.commit("xeroForm/addDraftCheck", true);
      this.isTicketAccountingSoftConnected =
        this.ticket.isAccountingSoftConnected;
      this.$store.commit(
        "xeroForm/setIsTicketAccountingSoftConnected",
        this.isTicketAccountingSoftConnected
      );
      if (url) this.$store.commit("xeroForm/setAttachementUrl", url);
      else this.$store.commit("xeroForm/setAttachementUrl", "");
      this.$store.commit("ticket/setTicket", {
        request_type: this.ticket.requestType,
        ticket_id: this.ticket._id,
      });
      //set data here get Data
      this.$store.commit("xeroForm/addInvoices", this.ticket.draft);
      // end set data
      EventBus.$emit("open-xero-form-dialog", this.ticket);
      await this.apiCallForCategories();
    },
    async openXeroForm(url) {
      // check added for draft
      if (this.ticket.draft) return this.openXeroFormFromDraft(url);

      this.isTicketAccountingSoftConnected =
        this.ticket.isAccountingSoftConnected;
      this.$store.commit(
        "xeroForm/setIsTicketAccountingSoftConnected",
        this.isTicketAccountingSoftConnected
      );
      this.$store.commit("ticket/setTicket", {
        request_type: this.ticket.requestType,
        ticket_id: this.ticket._id,
      });
      const payload = {
        url: url,
        token:
          this.currentWorkspace.source === "slack"
            ? this.currentWorkspace.botToken
            : undefined,
        workspaceId: this.ticket.workspaceId,
      };
      // If URL exists then hit API to get invoices else dispatch store without attachments
      if (url) {
        this.$store.commit("xeroForm/setAttachementUrl", url);
        this.$store.dispatch("xeroForm/getInvoices", payload);
      } else {
        this.$store.commit("xeroForm/setAttachementUrl", "");
        this.$store.dispatch("xeroForm/getInvoicesWithoutAttachment", {
          invoice: this.newInvoiceForm,
          data: payload,
        });
      }

      EventBus.$emit("open-xero-form-dialog", this.ticket);
    },

    /**
     * This function Commits the workspace ID of the ticket to the Vuex store for the XeroForm module
     * Commits the value of `true` to indicate that a draft check has been added
     * Emits an event to open the Xero form dialog with the ticket details
     * Commits the ticket details to the Vuex store for the Ticket module
     * Adds the draft invoice data to the Vuex store for the XeroForm module
     * @param {*} url
     */
    openXeroFormFromDraftNotConnectedXero(url) {
      this.$store.commit("xeroForm/setWorkspaceId", this.ticket.workspaceId);
      this.$store.commit("xeroForm/addDraftCheck", true);
      EventBus.$emit(
        "open-xero-form-dialog-without-xero-Connected",
        this.ticket
      );
      this.isTicketAccountingSoftConnected =
        this.ticket.isAccountingSoftConnected;
      this.$store.commit(
        "xeroForm/setIsTicketAccountingSoftConnected",
        this.isTicketAccountingSoftConnected
      );
      if (url) this.$store.commit("xeroForm/setAttachementUrl", url);
      else this.$store.commit("xeroForm/setAttachementUrl", "");
      this.$store.commit("ticket/setTicket", {
        request_type: this.ticket.requestType,
        ticket_id: this.ticket._id,
      });
      this.$store.commit("xeroForm/addInvoices", this.ticket.draft);
    },

    /**
     * This function commits the ticket details to the Vuex store
     * constructs the payload object to be sent to the API endpoint for fetching invoices
     * If the URL is present, commits the URL to the Vuex store and dispatches the action to fetch invoices
     * Emits an event to open the Xero form dialog with ticket details
     * @param {*} url
     */
    openXeroFormNotConnectedWithXero(url) {
      this.$store.commit("ticket/setTicket", {
        request_type: this.ticket.requestType,
        ticket_id: this.ticket._id,
      });
      const payload = {
        url: url,
        token:
          this.currentWorkspace.source === "slack"
            ? this.currentWorkspace.botToken
            : "",
        workspaceId: this.ticket.workspaceId,
      };
      this.isTicketAccountingSoftConnected =
        this.ticket.isAccountingSoftConnected;
      this.$store.commit(
        "xeroForm/setIsTicketAccountingSoftConnected",
        this.isTicketAccountingSoftConnected
      );
      // IF >>> URL exists then hit API to get invoices
      // ELSE >>> dispatch store without attachments
      if (url) {
        this.$store.commit("xeroForm/setAttachementUrl", url);
        this.$store.dispatch("xeroForm/getInvoices", payload);
      } else {
        this.$store.commit("xeroForm/setAttachementUrl", "");
        this.$store.dispatch("xeroForm/getInvoicesWithoutAttachment", {
          invoice: this.newInvoiceForm,
          data: payload,
        });
      }
      EventBus.$emit(
        "open-xero-form-dialog-without-xero-Connected",
        this.ticket
      );
    },

    openPrivateURL(url) {
      var data = {
        token:
          this.currentWorkspace.source === "slack"
            ? this.currentWorkspace.botToken
            : "test-string",
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
      axios(config)
        .then(function (response) {
          let blob = new Blob([response.data], {
            type: response.headers["content-type"],
          });
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result;
            this.imageUrl = base64data;
          };

          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = url.split("/")[url.split("/").length - 1];
          link.click();
          link.remove();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    changeRequestType() {
      EventBus.$emit("open-change-request-type-dialog", this.ticket);
    },
    markComplete() {
      EventBus.$emit("open-complete-status-dialog", this.ticket);
    },
    rerouteTicket() {
      if (this.role === "accountant") {
        EventBus.$emit("open-reroute-ticket-dialog", this.ticket);
      } else if (this.role === "supervisor") {
        EventBus.$emit("open-reroute-ticket-supervisor-dialog", this.ticket);
      }
    },
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      currentWorkspace: "auth/getCurrentWorkspace",
      role: "auth/getUserRole",
      token: "auth/getAuthToken",
    }),
  },
};
</script>
<style scoped></style>
