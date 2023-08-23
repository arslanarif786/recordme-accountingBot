<template>
    <div class="text-center">
      <v-dialog v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
          class="ma-0 pa-0">
        <v-card class="ma-0 pa-0">
          <v-card-title
            class="lighten-2 secondaryTextColor appColor--text font-style-heading"
          >
            Xero Form
            <v-spacer></v-spacer>
            <v-btn
              icon
              depressed
              class="text-capitalize"
              color="appColor"
              outlined
              small
              text-capitalize
              @click="closeDialog()"
              @keyup.esc="closeDialog()"
            >
              <v-icon small> mdi-close </v-icon>
            </v-btn>
          </v-card-title>
              <XeroForm v-if="dialog" :ticket="ticket" @close-dialog="dialog=false"/>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  <script>
  import EventBus from "../../../../js/EventBus";
  import { mapGetters } from "vuex";
  import XeroForm from "../../xero-form-not-connected-with-xero/index.vue"
  export default {
    name: "XeroformNotConnected",
    data() {
      return {
        dialog: false,
        ticket: "",
      };
    },
    components : {
      XeroForm
    },
    mounted() {
      // Dialog box will be shown to screen  when this event will be triggered
      EventBus.$on("open-xero-form-dialog-without-xero-Connected", (object) => {
        this.ticket = object;
        this.dialog = true;
      });
    },
    computed: {
      ...mapGetters({
        token : "auth/getAuthToken"
      })
    },
    created() {},
    methods: {
      closeDialog() {
        (this.dialog = false), (this.ticket = "");
        this.$store.commit("xeroForm/addDraftCheck", false);
      },
    },
    beforeDestroy(){
      EventBus.$off('open-xero-form-dialog-without-xero-Connected')
    }
  };
  </script>
  <style scoped>
  ::v-deep .v-input--is-focused {
    border: 1px solid var(--v-appColor-base) !important;
  }
  ::v-deep .v-btn__content {
    letter-spacing: 0.2px !important;
  }
  </style>
  