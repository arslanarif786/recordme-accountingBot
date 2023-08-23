<template>
  <div class="mt-4">
    <TicketDetails />
    <!-- <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
      dense
      style="width: 25%"
      class="ml-3"
    ></v-text-field> -->
    <v-data-table
      :headers="headers"
      :items="tickets.data"
      class="elevation-0 font-style-paragraph cursor-pointer"
      :footer-props="{
        disableItemsPerPage: true,
      }"
      @update:page="updatePagination"
      :page="page"
      :server-items-length="tickets.count"
      soratable="false"
      @click:row="testFunction"
    >
      <template v-slot:[`item.createdAt`]="{ item }">
        <div class="font-style-paragraph">
          {{ item.createdAt | formatDate }}
        </div>
      </template>
      <template v-slot:[`item.request_type`]="{ item }">
        <div class="font-style-paragraph">
          {{ item.request_type || "OTHERS" }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import EventBus from "@/js/EventBus";
import TicketDetails from "../../dashboard/dialog-box/TicketDetails.vue";
import { mapGetters } from "vuex";

export default {
  name: "TicketTable",
  components: {
    TicketDetails,
  },
  data: () => ({
    headers: [
      { text: "Created At", value: "createdAt", sortable: false },
      { text: "Ticket No", value: "ticketNo", sortable: false },
      { text: "Type", value: "requestType", sortable: false },
      { text: "Status", value: "status", sortable: false },
      { text: "Workspace ID", value: "workspaceId", sortable: false },
    ],
    page: 1,
    search: "",
  }),
  mounted() {
    // this.$store.dispatch("auth/getUsers");
  },
  computed: {
    ...mapGetters({
      tickets: "auth/getTickets",
    }),
  },
  methods: {
    testFunction(data) {
      EventBus.$emit("open-details-dialog", data);
    },
    updatePagination(page) {
      this.page = page;
      this.$store.dispatch("auth/getTickets", page);
    },
  },
};
</script>
