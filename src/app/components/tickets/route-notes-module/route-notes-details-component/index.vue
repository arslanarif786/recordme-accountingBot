<template>
  <v-row class="ma-0 pa-0">
    <v-col cols="2" class="ma-0 pa-0">
      <h4 class="font-style-section-heading mainTextColor--text">
        {{ heading }}
      </h4>
    </v-col>
    <v-col cols="10" class="ma-0 pa-0 text-left">
      <div v-if="text">
        <p
          v-if="text.length > 100 && textCheck"
          class="font-style-paragraph pr-2"
          style="word-break: break-all"
        >
          {{ text.slice(0, 100) }}
          <span class="font-style-paragraph pr-2 blue--text" style="cursor: pointer" @click="textCheck = false">See more ...</span>
        </p>
        <p
          v-else
          class="font-style-paragraph pr-2"
          style="word-break: break-all"
        >
          {{ text }}
          <span v-if="text.length>100" class="font-style-paragraph pr-2 blue--text" style="cursor: pointer" @click="textCheck = true">See less ...</span>
        </p>
      </div>
      <p v-else-if="date" class="font-style-paragraph pr-2">
        {{ date | formatTime }}, {{ date | formatDate }}.
      </p>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "index",
  components: {},
  props: {
    heading: String,
    text: String,
    date: String,
  },
  data() {
    return {
      textCheck: true,
    };
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
