<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" persistent>
      <v-card>
        <v-card-title class="text-h5 justify-center">
          Delete User
        </v-card-title>
        <v-card-text>
          Note : Deleted User will not restored and will be deleted permanently.
        </v-card-text>
        <div class="justify-content : center">
          <v-col md="12" class="py-2 px-4">
            <h3> Are you sure you want to delete this User ?</h3>
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
            @click="deleteField()"
            @keyup.enter="deleteField()"
          >
            <v-icon small> mdi-delete </v-icon>
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
      id : ""
    };
  },
  mounted() {
    // Dialog box will be shown to screen  when this event will be triggered
    EventBus.$on("open-delete-dialog", (object) => {
      this.dialog = true;
      this.id = object;
    });
  },
  beforeUnmount() {
        EventBus.$off("open-delete-dialog");
    },
  computed: {
    ...mapGetters({
      items: "user/getworkspacesWithFilter",
      user: "auth/getUser",
      token: "auth/getAuthToken",
    }),
    
  },
  created() {},
  methods: {
    deleteField() {
      this.$store.dispatch('user/deleteUser', {id : this.id}).then((response) => {
        this.dialog= false;
        this.$store.dispatch("auth/getUsers");
      }).catch((e) => {
        console.log(e)
      })
    },
    closeDialog(){
      this.dialog = false,
      this.id = ""
    },
  },
};
</script>
<style scoped>
::v-deep .v-dialog > .v-card > .v-card__text {
  padding: 0 16px 0px;
}
</style>
