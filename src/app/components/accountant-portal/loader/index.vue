<template>
  <div>
    <div style="height: 50vh" class="d-flex justify-center align-end">
      <v-img
        :src="require('../../../../assets/no-request.png')"
        class=""
        contain
        height="250"
        width="250"
      />
    </div>
    <div class="d-flex flex-column justify-center align-center my-10">
      <p class="font-style-heading">
        <slot name="text"></slot>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "index",
  components: {},
  data: () => ({}),
  watch: {},
  mounted() {},
  computed: {
    ...mapGetters({}),
  },
  methods: {},
  created() {},
};
</script>

<style scoped></style>
