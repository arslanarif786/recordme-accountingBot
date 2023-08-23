<template>
  <div>
    <v-tabs
    fixed-tabs
    background-color="appColor"
    dark
    v-model="tab"
  >
    <v-tab class="font-style-paragraph" href="#tab-1">
      FAQ
    </v-tab>
    <v-tab class="font-style-paragraph" href="#tab-2">
      Logs
    </v-tab>
    <v-tab class="font-style-paragraph" href="#tab-3">
      Notes
    </v-tab>
  </v-tabs>

  <v-tabs-items v-model="tab" class="backgroundFAQColor">
      <v-tab-item
        v-for="i in 3"
        :key="i"
        :value="'tab-' + i"
      >
        <div v-if="i === 1" class="font-style-paragraph"><FAQ /></div>
        <div v-if="i === 2" class="font-style-paragraph"> <LogsModule :ticket="ticket"/></div>
        <div v-if="i === 3" class="font-style-paragraph"> <NotesModule :ticket="ticket"/></div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import LogsModule from "../logs-module/index.vue";
import NotesModule from "../route-notes-module/index.vue"
import FAQ from "../../faq/PreDefinedMessages.vue"
import moment from "moment";
export default {
  name: "index",
  components: {
    LogsModule,
    FAQ,
    NotesModule
  },
  props: {
    ticket: Object,
  },
  data() {
    return {
        tab: null,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      }
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
