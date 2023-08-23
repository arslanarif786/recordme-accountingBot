<template>
  <v-snackbar
    v-model="show"
    top
    right
    timeout="4000"
    :color="type"
    elevation="1"
    class="font-style-paragraph"
  >
    {{ text }}
    <v-icon @click="show = false" class="float-end"> mdi-close </v-icon>
  </v-snackbar>
</template>

<script>
import EventBus from "@/js/EventBus";
export default {
  name: "Snackbar",
  data() {
    return {
      show: false,
      text: "",
      type: "",
    };
  },
  mounted() {
    EventBus.$on("show-snackbar", (data) => {
      this.text = data.text;
      this.type = data.type;
      this.show = true;
    });
  },
};
</script>

<style scoped>
.font-style-paragraph {
  font-family: Lato !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-align: center;
}
</style>
