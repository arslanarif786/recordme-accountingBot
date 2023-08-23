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
            Update Items and Accounts
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
                      v-model="item[fields[0]['keyFromProp']]"
                      dense
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    v-if="index != 0"
                    v-for="(field, index) in fields"
                    :key="index"
                  >
                    {{ field.label }}
                    <v-select
                      v-model="item[field['keyFromProp']]"
                      :items="field.items"
                      :menu-props="{ maxHeight: 200}"
                      dense
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    Items
                    <v-combobox
                      v-model="item.itemIds"
                      item-text="itemName"
                      return-object
                      :value="getItems"
                      :items="allItems"
                      @focus="getAllItems()"
                      @update:search-input="getInputItems($event)"
                      @click="getAllItems()"
                      :menu-props="{ maxHeight: 200}"
                      chips
                      multiple
                      dense
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
                    color="appColor"
                    :loading="loader"
                    class="white--text text-capitalize mx-1"
                    @click="updateAccountsAndItems()"
                    @keyup.enter="updateAccountsAndItems()"
                  >
                    Update
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
import accountTypes from "../../../../constants/accountType";
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";
export default {
  name: "UpdateAccounts",
  props: ["dialog", "item"],
  components: {
    Snackbar,
  },
  computed: {
    ...mapGetters({
      allItems: "xeroForm/getMoreItems",
      total: "xeroForm/getTotalItemsInList",
    }),
    getItems() {
      this.item?.itemIds?.map((el) => {
        this.allItems.push(el);
      });
      this.items = this.allItems;
      return this.items;
    },
  },
  data() {
    return {
      loader: false,
      items: [],
      fields: [
        {
          label: "Account Name*",
          key: "account_name",
          keyFromProp: "accountName",
          value: "",
          multiple: false,
        },
        {
          label: "Account Type*",
          key: "account_type",
          keyFromProp: "accountType",
          value: "",
          multiple: false,
          items: accountTypes,
        },
      ],
      paginate: {
        size: 10,
        page: 1,
        total: 0,
      },
    };
  },
  methods: {
    /**
     * Method to close the edit-accounts dialog
     */
    closeDialog() {
      this.$store.commit('xeroForm/addMoreItems', { response : [] , reset : true});
      this.paginate.page = 1;
      this.$store.commit('xeroForm/setPage', this.paginate.page);
      this.$emit("closeEditAccountsDialog");
    },
    /**
     * Method to update accounts and items
     * @param {*} object
     */
    async updateAccountsAndItems() {
      this.loader = true;
      try {
        this.checkValidations();
        // Account credentials
        const accountCred = {
          _id: this.item._id,
          account_name: this.item.accountName,
          account_type: this.item.accountType,
          account_items: this.item.itemIds.map((e) => e._id),
        };
        await this.$store.dispatch("xeroForm/updateAccountItems", accountCred);
        this.loader = false;
        EventBus.$emit("show-snackbar", {
          text: "Account Items has been updated",
          type: "success",
        });
        this.closeDialog();
      } catch (error) {
        this.loader = false;
        EventBus.$emit("show-snackbar", {
          text: error?.response?.data?.message
            ? error.response.data.message
            : error,
          type: "error",
        });
      }
    },

    /**
     * validations on update accounts and items fields
     */
    checkValidations() {
      if (!this.item.accountName || !this.item.accountType) {
        throw "Account name or type is required";
      }
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
    },
    /**
     * Method to get all Items from Xero
     */
     async getAllItems() {
      this.paginate.page = 1;
      this.paginate['moreItems'] = true;
      this.paginate['changeCounter'] = false;
      await this.$store.dispatch("xeroForm/getItemsFromXero", this.paginate);
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

