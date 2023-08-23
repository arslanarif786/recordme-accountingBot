<template>
  <div class="">
    <TicketDetails />
    <CompleteStatusDialog />
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-0 font-style-paragraph"
      :footer-props="{
        disableItemsPerPage: true,
      }"
      @update:page="updatePagination"
      :page="page"
      :server-items-length="totalItems.count"
      :loading="loader"
    >
      <template v-slot:progress>
        <v-progress-linear color="appColor" indeterminate></v-progress-linear>
      </template>
      <v-progress-linear></v-progress-linear>
      <template v-slot:[`item.createdAt`]="{ item }">
        <div class="font-style-paragraph">
          {{ item.createdAt | formatDate }}
        </div>
        <!-- <div class="font-style-paragraph">
          {{ item.createdAt | formatTime }}
        </div> -->
      </template>

      <template v-slot:[`item.ticketNo`]="{ item }">
        <div class="d-flex">
          <div
            @click="openTicketDetails(item)"
            class="font-style-paragraph"
            style="cursor: pointer"
          >
            {{ item.ticketNo }}
          </div>
        <v-badge
          v-if="item.unreadBy && item.unreadBy[user._id] !== undefined && item.unreadBy[user._id] > 0"
          color="red"
          :content="item.unreadBy[user._id]"
          class=""
          inline
        >
        </v-badge>
         <v-badge
          v-if="!item.isSeen"
          color="red"
          content="new"
          class=""
          inline
        >
        </v-badge>
          </div>
      </template>

      <template v-slot:[`item.no`]="{ item }">
        <div class="font-style-paragraph">
          {{ (totalItems.pageNo - 1) * 10 + item.no }}
        </div>
      </template>

      <template v-slot:[`item.statusLastUpdatedAt`]="{ item }">
        <div v-if="item.status === 'Pending'">
          <div class="font-style-paragraph">-</div>
        </div>
        <div v-else>
          <div
            v-if="item.statusLastUpdatedAt === null"
            class="font-style-paragraph"
          >
            -
          </div>
          <div v-else>
            <div class="font-style-paragraph">
              {{ item.statusLastUpdatedAt | formatDate }}
            </div>
            <div class="font-style-paragraph">
              {{ item.statusLastUpdatedAt | formatTime }}
            </div>
          </div>
        </div>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          @click="user.role === 'accountant' ? markComplete(item) : ''"
          :color="
            item.status === 'Pending'
              ? 'pendingBackGroundColor'
              : 'completedBackgroundColor'
          "
          :class="
            item.status === 'Pending'
              ? 'pendingColor--text'
              : 'completedColor--text'
          "
          small
          >{{ item.status }}</v-chip
        >
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
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
                <v-list-item @click="openTicketDetails(item)">
                  <v-list-item-title
                    class="font-style-paragraph mainTextColor--text"
                    >View Details</v-list-item-title
                  >
                </v-list-item>

                <v-list-item
                  @click="markComplete(item)"
                  v-if="user.role === 'accountant'"
                >
                  <v-list-item-title
                    class="font-style-paragraph mainTextColor--text"
                    >Change Status</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <span>Click to Open Details</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import EventBus from "@/js/EventBus";
import TicketDetails from "../dialog-box/TicketDetails.vue";
import CompleteStatusDialog from "../dialog-box/CompleteStatusDialog.vue";
import { mapGetters } from "vuex";
import axios from "axios";
import UrlServices from "@/services/Url"

export default {
  name: "DataTable",
  components: {
    TicketDetails,
    CompleteStatusDialog,
  },
  data: () => ({
    getTransactions: [],
    headers: [
      // { text: "No.", value: "no", sortable: false },
      { text: "Created At", value: "createdAt", sortable: false },
      { text: "Ticket ID", value: "ticketNo", sortable: false },
      { text: "Type", value: "requestType", sortable: false },
      {
        text: "Completed ON",
        value: "statusLastUpdatedAt",
        sortable: false,
      },
      { text: "Status", value: "status", sortable: false },
      { text: "Action", value: "actions", sortable: false },
    ],
    statusValues: ["All", "Complete", "Pending"],
    search: "",
    status: "All",
    page: 1,
    loader : true
  }),
  watch: {},
  mounted() {
    this.$store.dispatch("ticket/getTasks").then(res => this.loader= false).catch(e => console.log(e) );
    this.search = this.searchFromStore;
    this.status = this.statusFromStore;
    // this.openTicketDetails(this.items[0])
    EventBus.$on('close-details-dialog', (ticket) => {
      if(ticket.isSeen == false || ticket.unreadBy[this.user._id]> 0) {
        this.$store.dispatch("ticket/setTicketAsReadable", ticket, this.page);
      }
    });
    EventBus.$on('update-loader', val => {
      this.loader = val
      if(val == true) this.$store.commit("ticket/addTickets", []);
    })
  },
  computed: {
    ...mapGetters({
      items: "ticket/getTickets",
      user: "auth/getUser",
      token: "auth/getAuthToken",
      totalItems: "ticket/getTotalItems",
      workspaces: "auth/getWorkspaces",
      statusFromStore: "ticket/getStatus",
      searchFromStore: "ticket/getSearch",
      currentWorkspace : "auth/getCurrentWorkspace"
    }),
    
    // itemsWithSerialNo() {
    //   return this.items.map((d,item, index) => ({ ...d, unReadByUpdated : item.unReadBy}));
    // },
  },
  
  methods: {
    onChange() {
      this.loader = true
      this.$store.commit("ticket/addTickets", []);
      this.$store.commit("ticket/setStatus", this.status);
      this.$store.commit("ticket/setSearch", this.search.trim());
      this.updatePagination(1);
    },
    async updatePagination(page) {
      this.page = page;
      await this.$store.dispatch("ticket/getTasks", page);
      this.loader = false
    },
    async openTicketDetails(ticket) {
      var resTicket = ticket;
      try {
        if(ticket.isSeen == false || ticket.unreadBy[this.user._id]> 0) {
          this.$store.dispatch("ticket/setTicketAsReadable", ticket, this.page);
        }
        let response = await axios.get(UrlServices.getTicketDetails + ticket._id);
        if (response.data && response.data.ticket)
          resTicket = response.data.ticket;
      } catch (error) {
        console.log("error in retrieving data", error.message);
      }
      EventBus.$emit("open-details-dialog", resTicket);
    },
    markComplete(ticket) {
      EventBus.$emit("open-complete-status-dialog", ticket);
    },
  },
  created() {},
};
</script>

<style scoped>
::v-deep .v-chip.v-size--small {
  border-radius: 6px !important;
  width: 120px !important;
  justify-content: center !important;
}
::v-deep td {
  height: 60px !important;
}
/* ::v-deep .v-data-footer {
    justify-content: flex-end !important;
}
::v-deep  .v-data-footer__select {
    display: none !important;
} */
::v-deep .v-input--is-focused {
  border: 1px solid var(--v-appColor-base) !important;
}
::v-deep .v-list-item--active {
  color: var(--v-appLightColor-base) !important;
}
</style>
