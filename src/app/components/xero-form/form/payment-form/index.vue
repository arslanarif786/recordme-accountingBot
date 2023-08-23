<template>
  <v-container class="ma-0 pa-0 mt-3">
    <p class="d-flex justify-center font-style-heading">Payment</p>
    <div>
      <div class="pa-4 mt-2 backgroundLightColor">
        <div class="d-flex justify-space-between font-style-paragraph">
          <span class="">Fill the required options</span>
          <span>Required fields*</span>
        </div>
        <div class="mt-6 ml-16 pl-16">
          <v-row class="ma-0 pa-0">
            <v-col
              cols="2"
              class="font-style-section-heading mainTextColor--text"
            >
              Account Code:
            </v-col>
            <v-col
              cols="2"
              class="ma-0 pa-0 justify-center d-flex align-center"
            >
              <v-select
                class="d-flex appColor--text default-input-field ma-1 pa-0 field-width select-type"
                flat
                solo
                hide-details
                :items="paidAccounts"
                :no-data-text="
                  loadingPaidAccounts ? 'Loading..' : 'No account available'
                "
                placeholder="Account code"
                color="appColor"
                dense
                return-object
                @click.stop="getPaidAccounts()"
                @input="selectAccountType($event)"
                item-value="code"
                item-text="label"
              >
                <template #item="{ item }">
                  <span
                    class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                  >
                    {{ item.code + " - " + item.label }}</span
                  >
                </template>
                <template #selection="{ item }">
                  <span
                    class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                  >
                    {{
                      item.code + " - " + item.label.substr(0, 13) + ".."
                    }}</span
                  >
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col
              cols="2"
              class="font-style-section-heading mainTextColor--text"
            >
              Dated on
            </v-col>
            <v-col
              cols="2"
              class="ma-0 pa-0 justify-center d-flex align-center"
            >
              <v-menu
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
                v-model="datePaid"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    class="font-style-paragraph default-input-field ma-1 pa-0 text-no-wrap rounded-md custom"
                    placeholder="Date"
                    color="appColor"
                    flat
                    dense
                    solo
                    v-model="payments[0].date"
                    autocomplete="off"
                    persistent-placeholder
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  >
                  </v-text-field>
                </template>
                <v-date-picker v-model="payments[0].date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="noDateSelected()">
                    Cancel
                  </v-btn>
                  <v-btn text color="primary" @click="datePaid = false">
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col
              cols="2"
              class="font-style-section-heading mainTextColor--text"
            >
              Amount:
            </v-col>
            <v-col
              cols="2"
              class="ma-0 pa-0 justify-center d-flex align-center"
            >
              <v-text-field
                class="d-flex appColor--text default-input-field ma-1 pa-0"
                :autocomplete="false"
                min="0"
                flat
                solo
                hide-details
                v-model="payments[0].amount"
                placeholder="Amount"
                type="number"
                dense
                :rules="[(v) => !!v || 'Amount is required']"
                required
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0">
            <v-col
              cols="2"
              class="font-style-section-heading mainTextColor--text"
            >
              Invoice:
            </v-col>
            <v-col
              cols="3"
              class="ma-0 pa-0 justify-center d-flex align-center"
            >
              <v-select
                class="d-flex appColor--text default-input-field ma-1 pa-0 field-width select-type"
                flat
                solo
                hide-details
                :items="invoices"
                :menu-props="{ maxHeight: 170, top: !$vuetify.breakpoint.lg ? true : false , offsetY: !$vuetify.breakpoint.lg ? true : false }"
                :no-data-text="invoiceLoader ? 'Loading..' : 'No invoice available'"
                @click.stop="getInvoices()"
                @input="selectInvoiceType($event)"
                placeholder="Search by payment amount"
                color="appColor"
                dense
                return-object
              >
                <template #item="{ item }">
                  <span
                    class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                  >
                    {{
                      item.label +
                      " -- " +
                      item.reference +
                      " -- " +
                      item.amountDue
                    }}</span
                  >
                </template>
                <template #selection="{ item }">
                  <span
                    class="font-style-paragraph mainTextColor--text ma-0 pa-0"
                  >
                    {{
                      item.label +
                      " -- " +
                      item.reference +
                      " -- " +
                      item.amountDue
                    }}</span
                  >
                </template>
                <template v-slot:append-item>
                  <div
                    class="text-center font-style-paragraph"
                    v-if="moreBtnLoader"
                  >
                    <span
                      class="cursor-pointer font-style-section-heading mainTextColor--text"
                      @click="getMoreInvoice"
                      >Load More</span
                    >
                  </div>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import UrlServices from "@/services/Url";

export default {
  name: "index",
  data: () => ({
    datePaid: false,
    invoices: [],
    payments: [
      {
        invoice: { invoiceID: null },
        account: { code: null },
        date: "",
        amount: "",
      },
    ],
    paidAccounts: [],
    invoiceLoader: false,
    loadingPaidAccounts: false,
    moreBtnLoader: false,
    responseSuccessOfPaidAccounts: false,
  }),
  computed: {
    ...mapGetters({
      authToken: "auth/getAuthToken",
      workspaceId: "xeroForm/getWorkspaceId",
    }),
  },
  /**
   * Apply watcher on object (this.payments) and send it to grand-parent component
   * where submit payment button exists
   */
  watch: {
    payments: {
      deep: true,
      handler() {
        this.$root.$emit("submit-payment", this.payments);
      },
    },
  },
  methods: {
    /**
     * Method to get Paid Accounts from xero
     */
    getPaidAccounts() {
      if (this.responseSuccessOfPaidAccounts) return;
      this.loadingPaidAccounts = true;
      this.axios
        .get(
          `${UrlServices.getAccounts}/${this.workspaceId}?enablePaymentsToAccount=true`,
          {
            headers: { Authorization: this.authToken },
          }
        )
        .then((res) => {
          let paidAccounts = [];
          this.responseSuccessOfPaidAccounts = true;
          res.data?.accounts.forEach((item) => {
            paidAccounts.push({
              label: item.name,
              code: item.type !== 'BANK' ? item.code : item.bankAccountNumber,
              accountID: item.accountID
            });
          });
          this.paidAccounts = paidAccounts;
          this.loadingPaidAccounts = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * Method to get invoices onload data in dropdown
     */
    getInvoices() {
      this.invoiceLoader = true;
      this.moreBtnLoader = false;
      this.invoices = [];
      this.axios
        .get(
          `${UrlServices.getPaymentApprovalInvoices}/${this.workspaceId}?amountDue=${this.payments[0].amount}`,
          {
            headers: { Authorization: this.authToken },
          }
        )
        .then((res) => {
          let invoices = [];
          res.data?.data.forEach((item) => {
            invoices.push({
              label: item.invoiceNumber,
              reference: item.reference,
              amountDue: item.amountDue,
              invoiceID: item.invoiceID,
            });
          });
          this.invoices = invoices;
          if (this.invoices.length < 100) {
            // Don't show load more button
            this.moreBtnLoader = false;
          } else {
            // Show load more button
            this.moreBtnLoader = true;
          }
          this.invoiceLoader = false;
        })
        .catch((err) => {
          this.invoiceLoader = false;
          console.log(err);
        });
    },
    /**
     * Method to get more invoices onclick Load More
     */
    getMoreInvoice() {
      this.getInvoices();
    },
    /**
     * This function calls when select 'cancel' button from date-menu
     */
    noDateSelected() {
      if (!this.date) this.date = "";
      this.datePaid = false;
    },
    /**
     * Method to set account code
     */
    selectAccountType(e) {
      this.payments[0].account.accountID = e.accountID;
    },
    /**
     * Method to set invoice code
     */
    selectInvoiceType(e) {
      this.payments[0].invoice.invoiceID = e.invoiceID;
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
/* ::v-deep .v-data-footer {
      justify-content: flex-end !important;
  }
  ::v-deep  .v-data-footer__select {
      display: none !important;
  } */
::v-deep .v-input--is-focused {
  border: 1px solid var(--v-appColor-base) !important;
}
::v-deep .v-list-item--active {
  color: var(--v-appLightColor-base) !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
