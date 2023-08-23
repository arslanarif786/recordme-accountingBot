<template>
  <div>
    <v-col cols="3">
      <div class="d-flex">
        <v-text-field
          @input="inputElement($event)"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          dense
          style="width: 24.54%"
          class="ml-3 mt-4"
        ></v-text-field>
      </div>
    </v-col>
  </div>
</template>

<script>
/**
 * This component shows search filter in admin portal,
 * an input event is triggered & received in parent to get data according with the search element
 */
export default {
  name: "Search",
  methods: {
    inputElement(event) {
      this.$emit("search-input", event);
    },
  },
};
</script>
