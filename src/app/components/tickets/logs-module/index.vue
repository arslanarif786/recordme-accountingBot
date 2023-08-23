<template>
  <div>
    <v-timeline small v-if="ticket.logs?.length>0">
      <v-timeline-item v-for="(item, i) in ticket.logs" :key="i" dense small right>
        <template v-slot:opposite>
          <p class="font-style-paragraph ma-0 pa-0">{{ item.createdAt | formatTime }}</p>
            <p class="font-style-paragraph ma-0 pa-0">
                {{ item.createdAt | formatDate }}</p>
      </template>
        <div v-if="!item.action">
          <p class="font-style-paragraph ma-0 pa-0" v-if="item.status== 'Created'"> Ticket created by <b>{{item.userId?.name}}</b></p>
          <p class="font-style-paragraph ma-0 pa-0" v-else-if="item.status== 'Assign'"> Ticket Assigned to <b>{{item.userId?.name}}</b></p>
          <p class="font-style-paragraph ma-0 pa-0" v-else> Ticket marked as <b>{{item.status}}</b> by <b>{{item.userId?.name}}</b></p>
        </div>
        <div v-else-if="item.action == 'change_status'">
          <p class="font-style-paragraph ma-0 pa-0" v-if="item.status== 'Created'"> Ticket created by <b>{{item.userId?.name}}</b></p>
          <p class="font-style-paragraph ma-0 pa-0" v-else-if="item.status== 'Assign'"> Ticket Assigned to <b>{{item.userId?.name}}</b></p>
          <p class="font-style-paragraph ma-0 pa-0" v-else> Ticket marked as <b>{{item.status}}</b> by <b>{{item.userId?.name}}</b></p>
        </div>
        <div v-else-if="item.action == 'route' || item.action == 'Route'">
           <p class="font-style-paragraph ma-0 pa-0"> Ticket rerouted to <b>{{item?.toUserId?.name ? item?.toUserId?.name : 'Anyone' }}</b> by <b>{{item.userId?.name}}</b></p>
        </div>
        <div v-else-if="item.action == 'change_request_type'">
           <p class="font-style-paragraph ma-0 pa-0"> <b>{{item.userId?.name}}</b> changed Request Type from <b>{{item?.data?.oldType}}</b> to <b>{{item?.data?.newType}}</b></p>
        </div>
        <div v-else-if="item.action == 'review' || item.action == 'Review'">
          <p class="font-style-paragraph ma-0 pa-0"> <b>{{item.userId?.name}}</b> requested for Review ticket.</p>
        </div>
      </v-timeline-item>
    </v-timeline>
    <div class="d-flex justify-center mt-4" v-else>
    <h4 class="font-style-paragraph">No logs have been genertated</h4>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "index",
  components: {},
  props: {
    ticket: Object,
  },
  data() {
    return {
      
    }
  },
  mounted() {
  },
  created() {},
  computed: {
    ...mapGetters({}),
  },
  methods: {},
};
</script>
<style scoped></style>
