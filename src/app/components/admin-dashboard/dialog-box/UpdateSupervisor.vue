<template>
  <div class="text-center">
    <Snackbar />
    <div class="text-center">
      <v-dialog
        v-model="dialog"
        persistent
        justifyContent="right"
        class="dialog-class"
        content-class="dialog-class"
        origin="right"
        open-delay="3"
      >
        <v-card class="card-class">
          <v-card-title
            class="lighten-2 backgroundLightColor font-style-heading"
          >
            Update Supervisor
            <v-spacer></v-spacer>
            <v-icon @click="closeDialog()">mdi-close</v-icon>
          </v-card-title>
          <v-divider></v-divider>

          <form>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      class="font-style-paragraph"
                      hide-details
                      v-model="name"
                      color="appColor"
                      dense
                      outlined
                      filled
                      label="Name *"
                      maxLength="50"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      class="font-style-paragraph"
                      hide-details
                      v-model="password"
                      color="appColor"
                      dense
                      outlined
                      filled
                      label="Password * "
                      :type="show ? 'text' : 'password'"
                      :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="show = !show"
                      maxLength="30"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                     <v-text-field
                      class="font-style-paragraph"
                      hide-details
                      v-model="confirmPassword"
                      color="appColor"
                      filled
                      dense
                      outlined
                      label="Confirm Password * "
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPassword = !showPassword"
                      maxLength="30"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <small class="font-style-paragraph"
                  >*indicates required field</small
                >
              </v-container>
            </v-card-text>

            <v-card-actions class="px-4">
              <v-container>
                <v-row class="mx-1">
                  <v-spacer></v-spacer>
                  <v-btn
                    depressed
                    class="appColor--text text-capitalize mx-1"
                    @click="closeDialog()"
                    @keyup.esc="closeDialog()"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    depressed
                    color="appColor"
                    class="white--text text-capitalize mx-1"
                    @click="updateSupervisor()"
                    @keyup.enter="updateSupervisor()"
                  >
                    Save
                  </v-btn>
                </v-row>
              </v-container>
            </v-card-actions>
          </form>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
import Snackbar from "../../../../common/snackbar/Snackbar.vue";
export default {
  name: "UpdateSupervisor",
  components: {
    Snackbar,
  },
  data() {
    return {
      dialog: false,
      name: "",
      password: "",
      confirmPassword: "",
      id: "",
      supervisor: "",
      show: false,
      showPassword : false,
    };
  },
  computed: {},
  methods: {
    updateSupervisor() {
      if (!this.name.trim() || !this.password) {
        return EventBus.$emit("show-snackbar", {
          text: "All fields are required!",
          type: "error",
        });
      }
      if (this.password.length < 7) {
        return EventBus.$emit("show-snackbar", {
          text: "Password length should be greater than 6",
          type: "error",
        });
      }
      if (this.password !== this.confirmPassword) {
        return EventBus.$emit("show-snackbar", {
          text: "Passwords do not match",
          type: "error",
        });
      }
      const payload = {
        name: this.name,
        password: this.password,
        id: this.supervisor._id,
      };

      this.$store
        .dispatch("auth/updateSupervisor", payload)
        .then((response) => {
          EventBus.$emit("show-snackbar", {
            text: " Supervisor has been updated",
            type: "success",
          });
          this.dialog = false;
          this.closeDialog();
        })
        .catch((e) => {
          EventBus.$emit("show-snackbar", { text: e, type: "error" });
        });
    },
    closeDialog() {
      (this.dialog = false), (this.name = ""), (this.password = "");
    },
  },
  mounted() {
    EventBus.$on("open-update-supervisor-dialog", (payload) => {
      this.supervisor = payload;
      this.name = this.supervisor.name;
      this.dialog = true;
    });
  },
  beforeUnmount() {
    EventBus.$off("open-update-supervisor-dialog");
  },
};
</script>

<style scoped>
.img-style {
  width: 100%;
  max-width: 250;
  max-height: 200;
  height: 200px;
  border: 5px solid var(--appColor);
}

.v-dialog__content {
  justify-content: flex-end !important;
}

::v-deep .v-dialog > .v-card > .v-card__text {
  padding: 0 24px 0px;
  justify-content: right !important;
}

::v-deep .message-comment {
  padding: 0px !important;
  margin: 0px !important;
}

::v-deep .v-dialog:not(.v-dialog--fullscreen) {
  max-height: 100% !important;
  margin: 0px !important;
  width: 60vw !important;
  justify-content: right !important;
  /* justify-self: right !important; */
}

::v-deep .v-sheet.v-card {
  height: 100vh !important;
}
</style>
