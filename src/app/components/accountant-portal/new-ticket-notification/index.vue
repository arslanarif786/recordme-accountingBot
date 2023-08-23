<template>
  <v-dialog v-model="newTicketNotification" width="450" persistent @keydown.space="accept()">
    <v-card class="card-class">
      <v-card-title
        class="lighten-2 secondaryTextColor appColor--text font-style-heading"
      >
        New Ticket has arrived
      </v-card-title>
      <v-divider></v-divider>
      <v-container class="py-0 pt-1">
        <v-card-text class="py-0 pt-3 d-flex justify-center">
          Ticket type : {{ticket.requestType}}
        </v-card-text>
        <v-card-text class="py-0 pt-3 d-flex justify-center">
          Message : {{ticket.message | truncate(40)}}
        </v-card-text>

        <v-card-actions class="">
          <v-col cols="12" class="pb-0 pr-0 d-flex">
            <v-spacer></v-spacer>
            <!-- <p class="font-style-paragraph px-4 pt-4" style="cursor: pointer" @click="reportIssue()"><u>Report Issue</u></p> -->
            <Button @button-clicked="accept()" :loader="loader" class="mr-2">
              <template v-slot:buttonHeading> Accept </template>
            </Button>
          </v-col>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import Button from "../../../../common/button";
export default {
  name: "index",
  components: {
    Button,
  },
  created() {
    document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        if(this.newTicketNotification)
        this.accept()
    }
}
  },
  data() {
    return {
      loader : false
    };
  },
  props: {
    newTicketNotification: Boolean,
    ticket : Object,
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    // reportIssue(){
    //   window.location.reload()
    // },
    accept() {
      this.loader = true,
      this.modal = false;
      this.$emit("change-step");
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
