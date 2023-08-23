<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="450" persistent>
      <v-card >
        <v-card-title class="lighten-2 backgroundLightColor font-style-heading">
          Connect Workspace
          <v-spacer></v-spacer>
          <v-icon @click="closeDialog()" @keyup.esc="closeDialog()">mdi-close</v-icon>
        </v-card-title>
        <v-divider></v-divider>
        <div>
          <p class="font-style-heading pl-4 pt-4 mb-0"> Third Party Integrations</p>
          <v-col md="12" class="py-2 d-flex justify-center">
            <a :href="baseURL" target="_blank" style="align-items:center;color:#fff;background-color:#4A154B;border:0;border-radius:4px;display:inline-flex;font-family:Lato, sans-serif;font-size:14px;font-weight:600;height:44px;justify-content:center;text-decoration:none;width:224px"><svg xmlns="http://www.w3.org/2000/svg" style="height:16px;width:16px;margin-right:12px" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>Create with Slack</a>
          </v-col>
          <p class="font-style-heading pl-4 pt-4 mb-0"> Custom Work Space</p>
          <v-col md="12" class="py-2 d-flex justify-center">
            <v-btn color="appColor" class="white--text text-capitalize " width="150" @click="createWorkspace()">
              Create with  App
            </v-btn>
          </v-col>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>


// <script>
import EventBus from "@/js/EventBus";
import { config } from "@/config/development";
import { mapGetters } from "vuex";
export default {
  name: "MajorCreateWorkspaceDialog",
  data() {
    return {
      dialog: false,
      baseURL : "",
    };
  },
  mounted() {
    // Dialog box will be shown to screen  when this event will be triggered
    EventBus.$on("open-major-create-workspace-dialog", (object) => {
      this.dialog = true;
      let token = this.token
      token = token.split(' ');
      token = token[token.length - 1];
      this.baseURL = `${process.env.BACK_END_URL}slack/slackInstall?token=${token}`
    });
  },
  computed: {
    ...mapGetters({
      token: "auth/getAuthToken",
    })
  },
  created() {},
  methods: {
    closeDialog(){
      this.dialog = false
    },
    createWorkspace(){
      this.dialog = false
      EventBus.$emit("open-create-workspace-dialog");
    },
    addToSlack(){
      this.dialog = false
    }
  },
};
</script>
<style scoped>
::v-deep .v-dialog > .v-card > .v-card__text {
  padding: 0 16px 0px;
}
.font-style-paragraph{
  font-family: 'Lato';
font-style: normal;
font-weight: 500;
font-size: 13px;
line-height: 16px;
color: #484964;
}
::v-deep .v-btn{
  letter-spacing: 0px !important;
}
</style>
