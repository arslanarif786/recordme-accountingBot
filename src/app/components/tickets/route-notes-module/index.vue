<template>
  <div>
    <div class="mt-4" v-if="ticket?.note?.length > 0">
      <div v-for="(item, i) in ticket.note" :key="i" class="my-2 rounded-lg appLightColor">
          <ShowDetails heading="From" :text="item.from" />
          <ShowDetails heading="To" :text="item.to" />
          <ShowDetails heading="Note" :text="item.note" />
          <ShowDetails heading="Time" :date="item.time" />
      </div>
    </div>
    <div class="d-flex mt-4" v-else>
      <h4 class="font-style-paragraph">No notes have been genertated</h4>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import ShowDetails from "./route-notes-details-component/index.vue";
export default {
  name: "index",
  components: {
    ShowDetails,
  },
  props: {
    ticket: Object,
  },
  data() {
    return {};
  },
  mounted() {},
  created() {},
  computed: {
    ...mapGetters({}),
  },
  methods: {},
};
</script>
<style scoped></style>
