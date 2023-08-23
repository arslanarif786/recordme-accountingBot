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
            Create User
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
                      v-model="email"
                      color="appColor"
                      dense
                      outlined
                      filled
                      label="Email *"
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
                    <v-select
                      class="font-style-paragraph"
                      hide-details
                      color="appColor"
                      dense
                      outlined
                      filled
                      :items="accountantTypes"
                      item-text="text"
                      item-value="value"
                      label="Accountant Type *"
                      v-model="type"

                    >
                    </v-select>
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
                    @click="createUser()"
                    @keyup.enter="createUser()"
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
  name: "CreateUser",
  components: {
    Snackbar,
  },
  data() {
    return {
      dialog: false,
      workspaces: "",
      name: "",
      email: "",
      password: "",
      type: "",
      accountantTypes: [
        {
          text: "Public",
          value: "public",
        },
        {
          text: "Specific",
          value: "specific",
        },
      ],
      emailRules: [(v) => /.+@.+/.test(v) || "Invalid Email address"],
      show: false,
    };
  },
  computed: {},
  methods: {
    validateEmail(email) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    },
    createUser() {
      if (!this.name || !this.email || !this.password || !this.type) {
        return EventBus.$emit("show-snackbar", {
          text: "All fields are required!",
          type: "error",
        });
      }
      if (!this.validateEmail(this.email)) {
        return EventBus.$emit("show-snackbar", {
          text: "Email format is not correct",
          type: "error",
        });
      }
      if (this.password.length < 7) {
        return EventBus.$emit("show-snackbar", {
          text: "Password length should be greater than 6",
          type: "error",
        });
      }
      const user = {
        name: this.name,
        email: this.email.toLowerCase(),
        password: this.password,
        role: "accountant",
        userType: this.type,
      };
      this.$store
        .dispatch("user/create", user)
        .then((response) => {
          EventBus.$emit("show-snackbar", {
            text: " User has been created",
            type: "success",
          });
          this.dialog = false;
          this.$store.dispatch("auth/getUsers");
          this.closeDialog();
        })
        .catch((e) => {
          console.log("e =>", e);
          EventBus.$emit("show-snackbar", { text: e, type: "error" });
        });
    },
    closeDialog() {
      (this.dialog = false),
        (this.name = ""),
        (this.email = ""),
        (this.password = ""),
        (this.type = "");
    },
  },
  beforeDestroy(){
    EventBus.$off("open-user-dialog");
  },
  mounted() {
    EventBus.$on("open-user-dialog", (workspaces) => {
      this.dialog = true;
      this.workspaces = workspaces;
    });
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
