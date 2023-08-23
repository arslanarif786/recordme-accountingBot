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
            Add Items and Accounts
            <v-spacer></v-spacer>
            <v-icon @click="closeDialog()">mdi-close</v-icon>
          </v-card-title>
          <v-divider></v-divider>

          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    {{ fields[0].label }}
                    <v-text-field
                      v-model="fields[0].value"
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    {{ fields[1].label }}
                    <v-select
                      v-model="fields[1].value"
                      :items="fields[1].items"
                      :menu-props="{ maxHeight: 200}"
                      dense
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    {{ fields[2].label }}
                    <v-combobox
                      v-model="fields[2].value"
                      :multiple="fields[2].multiple"
                      :items="fields[2].items"
                      @focus="getAllItems()"
                      @update:search-input="getInputItems($event)"
                      @click="getAllItems()"
                      :no-data-text="loadingItems ? 'Loading...' : 'No Items available'"
                      :menu-props="{ maxHeight: 200}"
                      chips
                      dense
                      required
                    >
                    <template v-slot:append-item>
                      <div v-intersect="endIntersect" />
                    </template>
                  </v-combobox>
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
                    @click="createAccountsAndItems()"
                    @keyup.enter="createAccountsAndItems()"
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
import accountTypes from "../../../../constants/accountType";
import { mapGetters } from "vuex";
export default {
  name: "CreateAccounts",
  props: ["dialog"],
  components: {
    Snackbar,
  },
  data() {
    return {
      loader: false,
      loadingItems: false,
      responseItems: false,
      fields: [
        {
          label: "Account Name*",
          key: "account_name",
          value: "",
        },
        {
          label: "Account Type*",
          key: "account_type",
          value: "",
          multiple: false,
          items: accountTypes,
        },
        {
          label: "Items",
          key: "items",
          value: [],
          multiple: true,
          items: [],
        },
      ],
      paginate: {
        size: 10,
        page: 1,
        total: 0,
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/getUser",
      allItems: "xeroForm/getMoreItems",
      total: "xeroForm/getTotalItemsInList",
      page: "xeroForm/getPage",
    }),
  },
  methods: {
    /**
     * Emitting method to parent to close the accounts dialog box
     */
    closeDialog() {
      this.$store.commit('xeroForm/addMoreItems', { response : [] , reset : true});
      this.paginate.page = 1;
      this.fields[2].items = [];
      this.$store.commit('xeroForm/setPage', this.paginate.page);
      this.$emit("closeAccountsDialog");
      this.emptyFields();
    },
    /**
     * Method to create accounts and items
     * @param {*} object
     */
    async createAccountsAndItems() {
      this.loader = true;
      try {
        this.checkValidations();
        // Account credentials
        const accountCred = {
          account_name: this.fields[0].value,
          account_type: this.fields[1].value,
          account_items: this.fields[2].value,
        };
        await this.$store.dispatch("xeroForm/createAccountItems", accountCred);
        this.loader = false;
        EventBus.$emit("show-snackbar", {
          text: "New Account Items has been created",
          type: "success",
        });
        this.closeDialog();
      } catch (error) {
        console.log('error>>',error)
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
     * validations on create accounts and items fields
     */
    checkValidations() {
      if (!this.fields[0].value || !this.fields[1].value) {
        throw "Account name or type is required";
      }
    },
    /**
     * Method to empty Account and Items fields
     */
    emptyFields() {
      this.$refs.form.reset();
    },
    /**
     * This function gets the input items from v-combobox
     * @param {*} input
     */
     async getInputItems(input) {
      this.paginate.page = 1;
      this.paginate['search'] = input;
      this.paginate['moreItems'] = true;
      this.paginate['changeCounter'] = false;
      await this.$store.dispatch("xeroForm/getItemsFromXero", this.paginate);
      this.fields[2].items = this.allItems.map((e) => e?.itemName);
    },
    /**
     * Method to get all Items from Xero
     */
    async getAllItems() {
      this.loadingItems = true;
      this.paginate.page = 1;
      this.paginate['moreItems'] = true;
      this.paginate['changeCounter'] = false;
      await this.$store.dispatch("xeroForm/getItemsFromXero", this.paginate);
      this.loadingItems = false;
      // assign itemNames to "items" array present in fields
      this.fields[2].items = this.allItems.map((e) => e?.itemName);
     },
    /**
     * Method to fetch paginated data on scroll end
     */

     async endIntersect(entries, observer, isIntersecting) {
      if (isIntersecting) {
      this.paginate.page = this.paginate.page + 1;
      const res = this.paginate.page * this.paginate.size;
      this.paginate['moreItems'] = true;
      this.paginate['changeCounter'] = false;
      if(res < this.total) {
        await this.$store.dispatch("xeroForm/getItemsFromXero", this.paginate);
        // assign itemNames to "items" array present in fields
        this.fields[2].items = this.allItems.map((e) => e?.itemName);
      }
     }
    }
  },
  beforeCreate() {
    this.$store.commit('xeroForm/addMoreItems', { response : [] , reset : true});
    this.$store.commit('xeroForm/setPage', this.paginate?.page? 1 : '');
  }
};
</script>
