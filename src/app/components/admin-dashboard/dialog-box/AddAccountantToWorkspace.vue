<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-center">
          Assign to Accountant
        </v-card-title>
        <v-card-text>
          Note : Accountant will be added to the respected workspace
        </v-card-text>
        <div class="justify-content : center">
          <v-col md="12" class="py-2 px-4">
            <v-select
              :items="itemsUpdated"
              v-model="selected"
              label="Select Accountant"
              item-text="name"
            ></v-select>
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
            @click="closeDialog()"
            @keyup.esc="closeDialog()"
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
            @keyup.enter="updateField()"
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
import { mapGetters } from "vuex";
export default {
  name: "AddToWorkspace",
  data() {
    return {
      dialog: false,
      selected: "",
      workspace : "",
    };
  },
  mounted() {
    // Dialog box will be shown to screen  when this event will be triggered
    EventBus.$on("add-accountant-to-workspace", (object) => {
      this.workspace = object
      this.dialog = true;
    });
  },
  beforeDestroy(){
    EventBus.$off("add-accountant-to-workspace")
  },
  computed: {
    ...mapGetters({
      items: "auth/getAccountantUsers",
      token: "auth/getAuthToken",
    }),
    itemsUpdated(){
      return this.items.filter(item => item.userType === 'specific')
    },
    selectedUser() {
      return this.items.find((obj) => obj.name === this.selected)._id;
    },

  },
  created() {},
  methods: {
    updateField() {
      if(!this.selectedUser) return EventBus.$emit("show-snackbar", { text: "Field cannot be empty", type: "error" });
      let payload = {
        workspace: this.workspace,
        user: this.selectedUser,
        token: this.token,
        sentId : "accountant"
      };
      
      this.$store
        .dispatch("user/addUserWorkspaces", payload)
        .then((response) => {
          this.closeDialog()
          EventBus.$emit("show-snackbar", { text: response.data.message, type: "success" });
          this.$store.dispatch("auth/getWorkspaces")
        })
        .catch((e) => {
          EventBus.$emit("show-snackbar", { text: "Something went wrong", type: "error" });
        });
    },
    closeDialog(){
      this.dialog = false,
      this.selected = ""
    },
  },
};
</script>
<style scoped>
::v-deep .v-dialog > .v-card > .v-card__text {
  padding: 0 16px 0px;
}
</style>
