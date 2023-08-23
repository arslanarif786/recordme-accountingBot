<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-center">
          Assign a Workspace
        </v-card-title>
        <v-card-text>
          Note : User will be added to selected workspace
        </v-card-text>
        <div class="justify-content : center">
          <v-col md="12" class="py-2 px-4">
            <v-select :items="specificTypeWorkspaces" v-model="selected" label="Select Workspaces" item-text="workspaceName"></v-select>
          </v-col>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn icon depressed class="text-capitalize" color="#7C7C7C" outlined small text-capitalize
            @click="closeDialog()" @keyup.esc="closeDialog()">
            <v-icon small> mdi-close </v-icon>
          </v-btn>
          <v-btn icon depressed class="text-capitalize" color="#7C7C7C" outlined small @click="updateField()"
            @keyup.enter="updateField()">
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
      sentId: "",
      userId: ""
    };
  },
  mounted() {
    // Dialog box will be shown to screen  when this event will be triggered
    EventBus.$on("add-to-workspace-dialog", (object) => {
      this.userId = object._id
      this.dialog = true;
      let filter = "no" + object.role.charAt(0).toUpperCase() + object.role.slice(1);
      this.sentId = object.role;
      this.$store.dispatch("auth/getWorkspaces")
    });
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      token: "auth/getAuthToken",
      items: "auth/getWorkspaces",
    }),
    specificTypeWorkspaces(){
      return this.items.filter(item => item.workSpaceType === 'specific')
    },
    selectedWorkspace() {
      return this.items.find((obj) => obj.workspaceName === this.selected);
    },
  },
  created() { },
  beforeDestroy(){
    EventBus.$off("add-to-workspace-dialog")
  },
  methods: {
    updateField() {
      if (!this.selectedWorkspace) return EventBus.$emit("show-snackbar", { text: "Field cannot be empty", type: "error" });
      let payload = {
        workspace: this.selectedWorkspace,
        user: this.userId,
        token: this.token,
        sentId: this.sentId
      };
      this.$store
        .dispatch("user/addUserWorkspaces", payload)
        .then((response) => {
          this.closeDialog()
          EventBus.$emit("show-snackbar", { text: response.data.message, type: "success" });
          this.$store.dispatch("auth/getUsers")
        })
        .catch((e) => {
          EventBus.$emit("show-snackbar", { text: text, type: "error" });
        });
    },
    closeDialog() {
      this.dialog = false,
        this.selected = ""
    },
  },
};
</script>
<style scoped>
::v-deep .v-dialog>.v-card>.v-card__text {
  padding: 0 16px 0px;
}
</style>
