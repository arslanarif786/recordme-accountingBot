<template>
  <div>
    <div style="height: 50vh" class="d-flex justify-center align-end">
      <v-progress-circular
        indeterminate
        color="appColor"
        :size="200"
        :width="10"
      ></v-progress-circular>
    </div>
    <div>
      <p class="font-style-paragraph d-flex justify-center my-10">
        Please wait, while we are setting up the form
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
