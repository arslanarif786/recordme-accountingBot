<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-center"> Update FAQ </v-card-title>
        <v-card-text>
          Note : Updated value will be changed permanently.
        </v-card-text>
        <div class="justify-content : center">
          <v-col md="12" class="py-2 px-4">
            <v-text-field
              v-model="questionText"
              dense
              flat
              full-width
              hide-details
              color="#7C7C7C"
              @keyup.enter="updateField()"
              @keyup.escape="dialog = false"
            ></v-text-field>
          </v-col>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            icon
            depressed
            class="text-capitalize"
            color="#7C7C7C"
            outlined
            small
             text-capitalize
            @click="dialog = false"
          >
            <v-icon small> mdi-close </v-icon>
          </v-btn>
          <v-btn
            icon
            depressed
            class="text-capitalize"
            color="#7C7C7C"
            outlined
            small
            @click="updateField()"
          >
            <v-icon small> mdi-content-save </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import EventBus from "@/js/EventBus";
export default {
  name: "EditCustomDefinedMessages",
  data() {
    return {
      dialog: false,
      index: "",
      details: "",
      questionText: "",
    };
  },
  mounted() {
    // Dialog box will be shown to screen  when this event will be triggered
    EventBus.$on("change-questionnare", (object) => {
      this.dialog = true;
      this.index = object.index;
      this.questionText = object.details.questions[this.index];
      this.details = object.details;
    });
  },
  created() {},
  methods: {
    // Function is used to update FAQ, storing into database as well.
    updateField() {
      let value = this.questionText.trim();
      if (!value) {
        EventBus.$emit("show-snackbar", {
          text: "Input Field cannot be empty",
          type: "error",
        });
        return;
      }
      this.details.questions[this.index] = this.questionText;
      this.$store.dispatch("ticket/updateFaq", this.details);
      this.dialog = false;
    },
  },
};
</script>
<style scoped>
::v-deep .v-dialog > .v-card > .v-card__text {
  padding: 0 16px 0px;
}
</style>
