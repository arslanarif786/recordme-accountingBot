<template>
    <div class="text-center">
      <Snackbar />
      <div class="text-center">
        <v-dialog
          v-model="dialog"
          persistent
          max-width="600px"
          class="dialog-class"
          content-class="dialog-class"
          origin="right"
          open-delay="3"
        >
          <v-card class="card-class">
            <v-card-title
              class="lighten-2 backgroundLightColor font-style-heading"
            >
              Add Item
              <v-spacer></v-spacer>
              <v-icon @click="closeDialog()">mdi-close</v-icon>
            </v-card-title>
            <v-divider></v-divider>
  
            <v-form ref="form">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      {{ fields.label }}
                      <v-text-field
                        v-model="fields.value"
                        dense
                        required
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
                  <v-row class="mx-1 pb-2">
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
                      :loading="loader"
                      color="appColor"
                      class="white--text text-capitalize mx-1"
                      @click="createItem()"
                    >
                      Add
                    </v-btn>
                  </v-row>
                </v-container>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </template>
  
  <script>
  import Snackbar from "../../../../common/snackbar/Snackbar.vue";
  import EventBus from "@/js/EventBus";
  export default {
    name: "AddNewItem",
    props: ["dialog"],
    components: {
      Snackbar,
    },
    data() {
      return {
        loader: false,
        fields: {
            label: "Item Name*",
            key: "itemName",
            value: "",
          },
      };
    },
    methods: {
      /**
       * Emitting method to parent to close the accounts dialog box
       */
      closeDialog() {
        this.$emit("closeItemDialog");
        this.emptyFields();
      },
      /**
       * Method to create New items
       * @param {*} object
       */
      async createItem() {
        this.loader = true;
        try {
            if (!this.fields.value) {
               throw "Item name is required";
            }
          await this.$store.dispatch("xeroForm/createitemsToXero", this.fields.value);
          this.loader = false;
            EventBus.$emit("show-snackbar", {
            text: "New item is created",
            type: "success",
          });
          this.closeDialog();
        } catch (error) {
          this.loader = false;
          EventBus.$emit("show-snackbar", {
            text: error?.response?.data?.data
              ? error.response.data.data
              : error,
            type: "error",
          });
        }
      },
      /**
       * Method to empty Items field
       */
      emptyFields() {
        this.$refs.form.reset();
      },
    },
  };
  </script>
  
  