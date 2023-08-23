<template>
  <v-container class="ma-0 pa-0" style="min-height: 57px">
    <v-form ref="myForm">
      <v-row class="ma-0 pa-0 ma-0 pa-0 flex-nowrap">
        <!-- add loop for all sort of data -->
        <v-col
          class="ma-0 pa-0 data-table justify-left d-flex align-center"
          v-for="(item, index) in Fields"
          :key="index"
          :style="{
            display:
              (item.key === 'taxAmount' && type !== 'Exclusive') ||
              (item.key === 'disc' && requestType === 'ACCPAY')
                ? 'none !important'
                : '',
          }"
          :cols="item.colSize"
        >
          <v-text-field
            v-if="
              item.selectionType == 'textField' &&
              !item.text &&
              (type == 'Exclusive' || item.key !== 'taxAmount')
            "
            class="d-flex appColor--text default-input-field ma-1 pa-0"
            :autocomplete="false"
            flat
            solo
            :min="item.type == 'number' ? 0 : ''"
            :max="item.key == 'disc' ? 100 : ''"
            hide-details
            color="appColor"
            :placeholder="item.placeholder"
            :type="item.type"
            dense
            v-model.number="product[item.key]"
            :rules="[(v) => !!v || 'Field is required']"
            required
          >
          </v-text-field>
          <v-text-field
            v-if="item.selectionType == 'textField' && item.text == 'total'"
            class="d-flex appColor--text default-input-field ma-1 pa-0"
            :autocomplete="false"
            flat
            solo
            min="0"
            hide-details
            color="appColor"
            :placeholder="item.placeholder"
            :type="item.type"
            :value="calcTotalAmount"
            disabled
            dense
          >
          </v-text-field>

          <div
            v-else-if="item.selectionType == 'button'"
            class="red white--text border-radius ml-2"
          >
            <p
              class="font-style-paragraph justify-center d-flex px-1 pt-1"
              style="cursor: pointer"
              @click="deleteField()"
            >
              Delete
            </p>
          </div>

          <div
            v-else-if="
              item.selectionType == 'select' && item.text == 'categories'
            "
          >
            <div v-for="(item1, index) in product.tracking" :key="index">
              <v-select
                v-if="item1.trackingCategoryID == item.trackingId"
                class="d-flex appColor--text default-input-field ma-1 pa-0 field-width"
                flat
                solo
                hide-details
                :items="item.dropDownValues"
                :placeholder="item.placeholder"
                color="appColor"
                dense
                v-model="product.tracking[index].trackingOptionID"
                item-text="name"
                item-value="trackingOptionID"
              >
                <template #item="{ item }">
                  <span
                    class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                  >
                    {{ item.name }}</span
                  >
                </template></v-select
              >
            </div>
          </div>

          <!-- if Xero is connected and isAccountingSoftConnected is true -->
          <div
            v-else-if="
              item.selectionType == 'select' && item.text == 'taxRates'
               && isAccountingSoftConnected
            "
          >
            <v-select
              class="d-flex appColor--text default-input-field ma-1 pa-0 field-width select-type"
              flat
              solo
              hide-details
              height="1"
              :items="returnValues"
              :placeholder="item.placeholder"
              :no-data-text="
                loadingTaxRates ? 'Loading...' : 'No Items available'
              "
              @click.stop="getResponseFromParent(item.key)"
              color="appColor"
              dense
              :disabled="type === 'NoTax'"
              v-model="product[item.key]"
              item-value="taxType"
            >
              <template #item="{ item }">
                <span
                  class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.name + " (" + item.displayTaxRate + "%)" }}</span
                >
              </template>
              <template #selection="{ item }">
                <span
                  class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.name.substr(0, 8) }}</span
                >
              </template>
            </v-select>
          </div>

          <!-- if Xero is not connected and isAccountingSoftConnected is false -->
          <div
            v-else-if="
              item.selectionType == 'select' && item.text == 'taxRates'
               && !isAccountingSoftConnected
            "
          >
            <v-select
              class="d-flex appColor--text default-input-field ma-1 pa-0 field-width select-type"
              flat
              solo
              hide-details
              height="1"
              :items="staticValues"
              :placeholder="item.placeholder"
              color="appColor"
              dense
              :disabled="type === 'NoTax'"
              v-model="product[item.key]"
              item-value="taxType"
            >
              <template #item="{ item }">
                <span
                  class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.name }}</span
                >
              </template>
              <template #selection="{ item }">
                <span
                  class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.name.substr(0, 8) }}</span
                >
              </template>
            </v-select>
          </div>

          <div
            v-else-if="item.selectionType == 'select' && item.text == 'items'"
          >
            <v-autocomplete
              class="d-flex appColor--text default-input-field ma-1 pa-0 field-width select-type"
              flat
              solo
              hide-details
              :items="
                product['accountCode'] &&
                xeroHashMaps.accountsHashmap.ids[product['accountCode']]
                  ? xeroHashMaps.accountsHashmap.ids[product['accountCode']]
                      .items
                  : xeroHashMaps.itemsHashmap.all
              "
              :placeholder="item.placeholder"
              color="appColor"
              dense
              @click.stop="getResponseFromParent(item.key)"
              v-model="product[item.key]"
              item-value="id"
              item-text="name"
            >
              <template #item="{ item }">
                <span
                  class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.name }}</span
                >
              </template>
              <!-- <template v-slot:append-item>
                <div v-intersect="loadMoreData" />
              </template> -->
            </v-autocomplete>
          </div>
          <div
            v-else-if="item.selectionType == 'select' && item.text == 'account'"
          >
            <v-autocomplete
              class="d-flex appColor--text default-input-field ma-1 pa-0 field-width select-type"
              flat
              solo
              hide-details
              :items="
                product['itemCode'] &&
                xeroHashMaps.itemsHashmap.ids[product['itemCode']]
                  ? xeroHashMaps.itemsHashmap.ids[product['itemCode']].accounts
                  : xeroHashMaps.accountsHashmap.all
              "
              :placeholder="item.placeholder"
              color="appColor"
              dense
              return-object
              @click.stop="getResponseFromParent(item.key)"
              @input="selectAccountType($event, item.key)"
              item-text="name"
              :value="product[item.key]"
            >
              <template #item="{ item }">
                <span
                  class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  {{ item.name }}</span
                >
              </template>
              <template #selection="{ item }">
                <span
                  class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                >
                  <!-- {{ item.code + " - " + item.label.substr(0, 2) }} -->
                  {{ item.name.substr(0,8) }}..
                </span>
              </template>
              <!-- <template v-slot:append-item>
                <div v-intersect="loadMoreData" />
              </template> -->
              <!-- <template v-slot:prepend-item>
                <div class="text-center" v-if="loadingAccounts">
                  <span>Loading...</span>
                </div>
              </template> -->
            </v-autocomplete>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "index",
  props: {
    product: Object,
    index: Number,
    type: String,
  },
  /**
   * Injection of requestType which can only be (ACCPAY or ACCREC)
   * and injection of other items from grandParent component
   */
  inject: [
    "requestType",
    "responseSuccessOfItems",
    "responseSuccessOfTaxRates",
    "responseSuccessOfAccounts",
    "loadingItems",
    "loadingTaxRates",
    "loadingAccounts",
    "itemUp",
    "taxRatesDropdown",
    "account",
  ],
  data: () => ({
    Fields: [
      {
        selectionType: "select",
        text: "items",
        heading: "Item",
        placeholder: "items",
        colSize: 2,
        key: "itemCode",
      },
      {
        selectionType: "textField",
        label: "Description",
        placeholder: "Description",
        type: "string",
        key: "description",
        colSize: 2,
      },
      {
        selectionType: "textField",
        label: "Quantity",
        placeholder: "Quantity",
        type: "number",
        key: "quantity",
        colSize: 2,
      },
      {
        selectionType: "textField",
        label: "Unit Price",
        placeholder: "Unit Price",
        type: "number",
        key: "unitAmount",
        colSize: 2,
      },
      {
        selectionType: "textField",
        label: "Discount %",
        placeholder: "Discount %",
        type: "number",
        key: "disc",
        colSize: 2,
      },
      {
        selectionType: "textField",
        label: "Tax",
        placeholder: "Tax",
        type: "number",
        key: "taxAmount",
        colSize: 2,
      },
      {
        selectionType: "textField",
        label: "Total",
        text: "total",
        placeholder: "Total",
        type: "number",
        key: "lineAmount",
        colSize: 2,
      },
      {
        selectionType: "select",
        text: "account",
        heading: "Account",
        placeholder: "Accounts",
        colSize: 2,
        key: "accountCode",
      },
      {
        selectionType: "select",
        text: "taxRates",
        heading: "Tax Rate",
        placeholder: "Tax Rate",
        colSize: 2,
        key: "taxType",
      },
    ],
    accountType: null,
    taxRateType: "",
    discount: null,
    unitPrice: null,
    quantity: null,
    totalAmount: null,
    types: {
      EXPENSE: "canApplyToExpenses",
      LIABILITY: "canApplyToLiabilities",
      EQUITY: "canApplyToEquity",
      ASSET: "canApplyToAssets",
      REVENUE: "canApplyToRevenue",
    },
  }),
  watch: {
    "product.itemCode": function (after) {
      if (after) {
        const accounts = this.xeroHashMaps.itemsHashmap.ids[after]?.accounts;
        if (Array.isArray(accounts) && accounts.length)
          this.product.accountCode = accounts[0];
        // else { this.product.accountCode = null;
        //   console.log('runs ELSE');
        // }
      }
    },
  },
  computed: {
    ...mapGetters({
      authToken: "auth/getAuthToken",
      workspaceId: "xeroForm/getWorkspaceId",
      categories: "xeroForm/getCategories",
      invoices: "xeroForm/getInvoices",
      xeroHashMaps: "xeroForm/getXeroHashMaps",
      currentWorkspace: "auth/getCurrentWorkspace",
      isAccountingSoftConnected : "xeroForm/getIsTicketAccountingSoftConnected"
    }),
    /**
     * To calculate the total lineAmount in every lineitem
     */
    calcTotalAmount() {
      if (isNaN(this.product.quantity)) this.product.quantity = 0;
      if (isNaN(this.product.unitAmount)) this.product.unitAmount = 0;
      if (isNaN(this.product.disc)) this.product.disc = 0;
      if (isNaN(this.product.taxAmount)) this.product.taxAmount = 0;
      if (typeof this.product.disc === "string") {
        this.product.disc = this.product.disc.replace(/^%|%$/g, "");
      }
      if (typeof this.product.taxAmount === "string")
        this.product.taxAmount = this.product.taxAmount.replace(/^%|%$/g, "");
      const x =
        this.requestType === "ACCPAY" ? 1 : (100 - (Math.round(this.product.disc * 100) / 100)) / 100;
      const total = +this.product.quantity * +this.product.unitAmount * x;
      this.product.lineAmount = (Math.round(total * 100) / 100);
      return (Math.round(total * 100) / 100);
    },
    /**
     * Return the value of TaxType(TaxRates) in dropdown
     */
    returnValues() {
      if (this.accountType) {
        const accordingToValue = this.types[this.accountType];
        return this.taxRatesDropdown.filter((el) => {
          return el[accordingToValue];
        });
      }
      return this.taxRatesDropdown;
    },
    staticValues() {
      let taxTypeArr = [
        { name:'Sales Tax on Imports(0%)', taxType:'GSTONIMPORTS' },
        { name:'Tax Exempt(0%)', taxType:'NONE' },
        { name:'Tax on Purchases(0%)', taxType:'INPUT' },
        { name:'Tax on Sales(0%)', taxType:'OUTPUT' }
      ];
      return taxTypeArr;
    }
  },
  mounted() {
    /**
     * Insert Category column in Fields (array)
     */
     if(this.isAccountingSoftConnected) {
    this.categories?.trackingCategories?.forEach((item) => {
      this.Fields.push({
        selectionType: "select",
        text: "categories",
        heading: item.name,
        placeholder: item.name,
        dropDownValues: item.options,
        colSize: 2,
        trackingId: item.trackingCategoryID,
      });
    });
    }
    this.Fields.push({
      selectionType: "button",
      colSize: 1,
    });
  },
  methods: {
    /**
     * Method to getItems, getAccounts, getTaxRates
     * from grandParent component
     */
    getResponseFromParent(key) {
      if (
        key === "itemCode" &&
        !this.responseSuccessOfItems &&
        this.loadingItems
      ) {
        this.$root.$emit("check-response", key);
      } else if (
        key === "accountCode" &&
        !this.responseSuccessOfAccounts &&
        this.loadingAccounts
      ) {
        this.$root.$emit("check-response", key);
      } else if (
        key === "taxType" &&
        !this.responseSuccessOfTaxRates &&
        this.loadingTaxRates
      ) {
        this.$root.$emit("check-response", key);
      }
    },

    /**
     * Method to pass emit with the name (save-editable-field)
     */
    saveField() {
      this.$emit("save-editable-field");
    },
    getSpecificValues(items, accordingToValue) {
      accordingToValue = this.types[accordingToValue];
      return items.filter((el) => {
        return el[accordingToValue];
      });
    },
    /**
     * Method to select account type
     */
    selectAccountType(e, key) {
      console.log("selected account>>", e, key);
      const accountNameAndType = { name: e.name, type: e.type };
      this.product[key] = accountNameAndType;
    },
    /**
     * Method to delete the lineitem with emit method
     */
    deleteField() {
      this.$emit("delete-field", this.index);
    },
    // loadMoreData(){
    //   this.$root.$emit("load-more-data");
    // }
  },
};
</script>

<style scoped>
::v-deep .v-chip.v-size--small {
  border-radius: 6px !important;
  width: 120px !important;
  justify-content: center !important;
}
::v-deep td {
  height: 60px !important;
}
::v-deep .v-input--is-focused {
  border: 1px solid var(--v-appColor-base) !important;
}
::v-deep .v-list-item--active {
  color: var(--v-appLightColor-base) !important;
}
.data-table {
  border: solid 1px #ebeef7;
}
.border-radius {
  border-radius: 5px;
}
.field-width {
  width: 112px !important;
}
.select-type > .v-list-item {
  height: 0 !important;
}
</style>
