<template>
  <div>
    <template v-if="updatedMessages && updatedMessages.length">
      <div
        v-for="(message, index) in updatedMessages"
        :key="index"
        :class="`index-${index}`"
      >
        <div class="d-flex justify-center" v-if="message.newDate">
          <v-chip color="appLightColor font-style-paragraph">{{
            message.createdAt | formatDate
          }}</v-chip>
        </div>

        <div
          class="d-flex my-2"
          v-if="currentWorkspace.source === 'slack'"
          :class="{
            'justify-end text-left ml-12': comment.commentType == 'User',
            'justify-start text-left mr-12': comment.commentType != 'User',
          }"
        >
          <div
            class="pa-2"
            :class="{
              backgroundLightColor: comment.commentType == 'User',
              appLightColor: comment.commentType != 'User',
            }"
            style="border-radius: 10px"
          >
            <MessageModule
              :message="message"
              @openPrivateUrl="openPrivateUrl($event)"
            />
          </div>
        </div>

        <div
          class="d-flex my-2"
          v-if="message.type === 'app' && user.role === 'accountant'"
          :class="{
            'justify-end text-left ml-12': message.userRole == user.role,
            'justify-start text-left mr-12': message.userRole != user.role,
          }"
        >
          <div
            class="pa-2"
            :class="{
              backgroundLightColor: message.userRole == user.role,
              appLightColor: message.userRole != user.role,
            }"
            style="border-radius: 10px"
          >
            <MessageModule
              :message="message"
              @openPrivateUrl="openPrivateUrl($event)"
            />
          </div>
        </div>

        <div
          class="d-flex my-2"
          v-if="message.type === 'app' && user.role === 'supervisor'"
          :class="{
            'justify-end text-left ml-12': ['client','employee'].includes(message.userRole) === false  ,
            'justify-start text-left mr-12': ['client','employee'].includes(message.userRole) === true  ,
          }"
        >
          <div
            class="pa-2"
            :class="{
              backgroundLightColor: ['client','employee'].includes(message.userRole) === false  ,
              appLightColor: ['client','employee'].includes(message.userRole) === true  ,
            }"
            style="border-radius: 10px"
          >
            <MessageModule
              :message="message"
              @openPrivateUrl="openPrivateUrl($event)"
            />
          </div>
        </div>

        <div
          class="d-flex my-2"
          v-if="message.type === 'app' && user.role === 'superadmin'"
          :class="{
            'justify-end text-left ml-12': ['client','employee'].includes(message.userRole) === false  ,
            'justify-start text-left mr-12': ['client','employee'].includes(message.userRole) === true  ,
          }"
        >
          <div
            class="pa-2"
            :class="{
              backgroundLightColor: ['client','employee'].includes(message.userRole) === false  ,
              appLightColor: ['client','employee'].includes(message.userRole) === true  ,
            }"
            style="border-radius: 10px"
          >
            <MessageModule
              :message="message"
              @openPrivateUrl="openPrivateUrl($event)"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="font-style-paragraph">No comments are added yet</div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import MessageModule from "../message-module/index.vue";
import axios from "axios";
import UrlServices from "@/services/Url";
export default {
  name: "ChatModule",
  components: {
    MessageModule,
  },
  data() {
    return {};
  },
  mounted() {},
  created() {},
  computed: {
    ...mapGetters({
      messages: "ticket/getMessages",
      user: "auth/getUser",
      currentWorkspace: "auth/getCurrentWorkspace",
    }),
    updatedMessages() {
      let comments = this.messages;
      comments = comments.map((curr, i, array) => {
        if (i == 0) {
          curr["newDate"] = true;
          return curr;
        }
        const currentValue = moment(curr.createdAt).format("YYYY MM DD");
        const previousValue = moment(array[i - 1].createdAt).format(
          "YYYY MM DD"
        );
        curr["newDate"] = true;
        if (currentValue === previousValue) curr["newDate"] = false;
        return curr;
      });

      return comments;
    },
  },
  methods: {
    openPrivateUrl(url) {
      var data = {
        token:
          this.currentWorkspace.source === "slack"
            ? this.currentWorkspace.botToken
            : "test-string",
      };
      data["file"] =
        url.search("files/") > -1
          ? url
          : url.split("https://files.slack.com/")[1];
      var config = {
        method: "post",
        url: UrlServices.slack,
        data: data,
        responseType: "blob",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      axios(config)
        .then(function (response) {
          let blob = new Blob([response.data], {
            type: response.headers["content-type"],
          });
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result;
            this.imageUrl = base64data;
          };

          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = url.split("/")[url.split("/").length - 1];
          link.click();
          link.remove();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  beforeCreate() {
    this.$store.commit("ticket/setMessages", [])
  },
};
</script>
<style scoped>
::v-deep .message-comment {
  padding: 0px !important;
  margin: 0px !important;
}
</style>
