<template>
  <div>
    <EditCustomDefinedMessages />
    <v-expansion-panels flat>
      <v-expansion-panel
        v-for="(item, key) in items"
        :key="key"
        class="backgroundFAQColor"
      >
        <v-expansion-panel-header class="font-style-paragraph"> {{ item.type }} </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
            v-for="(btn, index) in item.questions"
            :key="index"
            class="text-hover text-left"
            @click="sendMessage(btn)"
          >
            <!-- <v-btn
              icon
              depressed
              class="text-capitalize mr-1"
              color="#7C7C7C"
              outlined
              x-small
              @click="changeQuestion(item, index)"
            >
              <v-icon small> mdi-pencil </v-icon>
            </v-btn> -->
            <!-- <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  light
                  outlined
                  class="my-1 text-transformation-none"
                  v-bind="attrs"
                  v-on="on"
                  @click="sendMessage(btn)"
                  width="240"
                >
                  <span class="text-caption"
                    >{{ btn.substr(0, 33)
                    }}{{ btn.length > 33 ? "..." : "" }}</span
                  >
                </v-btn>
              </template>
              <span>{{ btn }}</span>
            </v-tooltip> -->

            <span
              class="text-caption font-style-paragraph"
              
              >{{ index + 1 }}. {{ btn }}</span
            >
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EventBus from "@/js/EventBus";
import EditCustomDefinedMessages from "./EditCustomDefinedMessages.vue";
export default {
  components: { EditCustomDefinedMessages },
  name: "PreDefinedComponent",
  data() {
    return {
      dialog: false,
      inputField: "",
    };
  },
  mounted() {
    this.$store.dispatch("ticket/getFaq");
  },
  computed: {
    ...mapGetters({
      items: "ticket/getFaq",
    }),
  },
  methods: {
    sendMessage(message) {
      EventBus.$emit("predefined-message", message);
    },
    // Function to open a Update FAQ Dialog Box using Event Bus
    changeQuestion(item, index) {
      let obj = {
        index: index,
        details: item,
      };
      EventBus.$emit("change-questionnare", obj);
    },
  },
};
</script>
<style scoped>
.text-transformation-none span[data-v-c53282fc] {
  text-transform: none !important;
}
.text-hover {
  cursor: pointer;
  border-radius: 5px;
  padding:0px 5px;
}
.text-hover:hover {
  background-color: rgb(182, 177, 177);
}
</style>
