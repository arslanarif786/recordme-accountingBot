<template>
  <v-container class="ma-0 pa-0">
    <v-form ref="myForm" v-model="valid">
      <v-row class="ma-0 pa-0 d-flex justify-end align-center">
        <v-col lg="6" md="8" sm="12">
          <div>
            <v-row
              class="ma-0 pa-0"
              v-for="(item, index) in footerFields"
              :key="index"
            >
              <v-col
                cols="3"
                class="ma-0 pa-0 d-flex justify-center align-center"
              >
                <h4 class="font-style-section-heading mainTextColor--text">
                  {{ item.label }}
                </h4>
              </v-col>
              <v-col cols="9" class="ma-0 pa-0">
                <!-- Footer Disabled Number Fields -->
                <v-text-field
                  v-if="item.key != 'currencyCode'"
                  class="d-flex appColor--text default-input-field ma-1 pa-0"
                  :autocomplete="false"
                  flat
                  solo
                  hide-details
                  color="appColor"
                  :placeholder="item.placeholder"
                  :type="item.type"
                  dense
                  :rules="requiredField"
                  :value="item.key == 'subTotal' ?
                   calcSubTotal :
                   item.key == 'totalTax' ?
                   calcTotalTax :
                   item.key == 'total' ?
                   calcTotal :
                   ''"
                   disabled
                >
                </v-text-field>
                <!-- Currency Field -->
                <!-- if Xero is connected and isAccountingSoftConnected is true -->
                <v-combobox
                  v-if="item.key == 'currencyCode' && isAccountingSoftConnected"
                  class="d-flex appColor--text default-input-field ma-1 pa-0"
                  flat
                  solo
                  hide-details
                  :items="currencies"
                  placeholder="Currency"
                  color="appColor"
                  dense
                  item-value="code"
                  :return-object="false"
                  v-model="invoice[item.key]"
                  @input="setCurrency($event)"
                  @focus="fetchCurrency()"
                >
                  <template v-slot:selection="{ item }">
                    <span
                      class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                    >
                      {{ item }}</span
                    >
                  </template>
                  <template v-slot:item="{ item }">
                    <span
                      class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                    >
                      {{ item.code + " - " + item.description }}</span
                    >
                  </template>
                  <template v-slot:append-item>
                    <div class="text-center" v-if="currencyLoader">
                      <span>Loading...</span>
                    </div>
                  </template>
                </v-combobox>

              <!-- Currency Field -->
              <!-- if Xero is not connected and isAccountingSoftConnected is false -->
              <v-combobox
                v-if="item.key == 'currencyCode' && !isAccountingSoftConnected"
                  class="d-flex appColor--text default-input-field ma-1 pa-0"
                  flat
                  solo
                  hide-details
                  :items="currencyList"
                  placeholder="Currency"
                  color="appColor"
                  dense
                  item-value="code"
                  :return-object="false"
                  v-model="invoice[item.key]"
                  @input="setCurrency($event)"
                >
                </v-combobox>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";

export default {
  name: "index",
  props: {
    invoice: Object,
    type: String,
  },
  data: () => ({
    editFooter: true,
    invoiceTypes: ["ACCPAY", "ACCREC"],
    currencies: [],
    currencyLoader: false,
    currencyList: ['USD','PKR','EUR','GBP'],
    footerFields: [
      {
        label: "Sub Total",
        placeholder: "Sub Total",
        type: "number",
        key: "subTotal",
      },
      {
        label: "Tax Amount",
        placeholder: "Tax Amount",
        type: "number",
        key: "totalTax",
      },
      {
        label: "Currency",
        placeholder: "Currency",
        type: "string",
        key: "currencyCode",
      },
      {
        label: "Total",
        placeholder: "Total",
        type: "number",
        key: "total",
      },
    ],
    requiredField: [(v) => !!v || "Field is required"],
    valid: false,
  }),
  computed: {
    ...mapGetters({
      authToken: "auth/getAuthToken",
      workspaceId: "xeroForm/getWorkspaceId",
      invoices: "xeroForm/getInvoices",
      currentWorkspace: "auth/getCurrentWorkspace",
      isAccountingSoftConnected : "xeroForm/getIsTicketAccountingSoftConnected"
    }),
    /**
     * To calculate the subTotal in footer
     */
    calcSubTotal() {
      let invoiceSubTotal = 0;
      this.invoice.lineItems.forEach((el) => {
          let totalLineAmount = Number(el.lineAmount);
          invoiceSubTotal += totalLineAmount;
        });
      this.invoice['subTotal'] = (Math.round(invoiceSubTotal * 100) / 100);
      return (Math.round(invoiceSubTotal * 100) / 100);
    },
    /**
     * To calculate the totalTax in footer
     */
    calcTotalTax() {
      let invoiceTotalTax = 0;
      if(this.type == 'Exclusive'){
        this.invoice.lineItems.forEach((el) => {
          if(el.taxAmount == undefined) return el.taxAmount;
          let totalTaxAmount = Number(el.taxAmount);
          invoiceTotalTax += totalTaxAmount;
        });
        this.invoice['totalTax'] = (Math.round(invoiceTotalTax * 100) / 100);
        return (Math.round(invoiceTotalTax * 100) / 100);
      }
      else {
        this.invoice['totalTax'] = (Math.round(invoiceTotalTax * 100) / 100);
        return (Math.round(invoiceTotalTax * 100) / 100);
      }
    },
    /**
     * To calculate the total(subTotal+totalTax) in footer
     */
    calcTotal() {
      let total = Number(this.calcSubTotal) + Number(this.calcTotalTax)
      this.invoice['total'] = (Math.round(total * 100) / 100);
      return (Math.round(total * 100) / 100);
    },
  },
  mounted() {},
  methods: {
    /**
     * Method to fetch currencies
     */
    fetchCurrency() {
      this.currencyLoader = true;
      this.axios
        .get(`xero/currencies/${this.workspaceId}`, {
          headers: { Authorization: this.authToken },
        })
        .then((res) => {
          this.currencyLoader = false
          this.currencies = res.data.currencies;
        })
        .catch((err) => {
          this.currencyLoader = false
          console.log(err);
        });
    },
    /**
     * Method on input the currency field
     */
    setCurrency(e) {
      if (e != null) {
        this.invoice.currencyCode = e.toUpperCase();
      }
    },
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
</style>
