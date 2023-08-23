<template>
  <v-container>
    <Snackbar />
    <h1
      v-if="response && categories"
      class="d-flex justify-center font-style-heading"
    >
      Xero Form
    </h1>
    <!-- Submit Invoice Button -->
    <v-btn
      v-if="response && categories && requestType != 'PAID'"
      block
      color="appColor"
      class="mt-6 mb-6 white--text text-capitalize"
      :loading="loader"
      @click="submitInvoices()"
      @keyup.enter="submitInvoices()"
    >
      Submit Invoices
    </v-btn>

    <!-- Submit Payment Button -->
    <v-btn
      v-if="response && categories && requestType == 'PAID'"
      block
      color="appColor"
      class="mt-6 mb-6 white--text text-capitalize"
      :loading="paymentLoader"
      @click="submitPayment()"
      @keyup.enter="submitPayment()"
    >
      Submit Payment
    </v-btn>

    <h1
      class="d-flex justify-start font-style-paragraph"
      v-if="response && categories"
    >
      Select manually on each invoice or select request type from dropdown for
      all invoices
    </h1>
    <v-row v-if="response && categories" class="ma-0 pa-0">
      <v-col lg="6" sm="12">
        <v-select
          class="d-flex appColor--text default-input-field ma-0 pa-0"
          flat
          solo
          ref="requestType"
          hide-details
          :items="statusValues"
          placeholder="Request Type"
          color="appColor"
          dense
          :value="requestType"
        >
          <template #item="{ item }">
            <span class="font-style-paragraph mainTextColor--text ma-0 pa-0">
              {{ item }}</span
            >
          </template></v-select
        >
      </v-col>
      <v-col lg="6" sm="12">
        <v-btn
          block
          color="appColor"
          class="white--text text-capitalize"
          @click="changeRequestType()"
          @keyup.enter="changeRequestType()"
        >
          Change Request Type for all Invoices
        </v-btn>
      </v-col>
      <v-col lg="6" sm="12" v-if="requestType != 'PAID'"></v-col>
      <v-col lg="6" sm="12" v-if="requestType != 'PAID'">
        <v-btn
          color="appColor"
          class="white--text text-capitalize float-right"
          @click="addInvoiceForm()"
          >+ Add Invoice Form</v-btn
        >
        <v-btn
          color="appColor"
          class="white--text text-capitalize float-right mx-4"
          @click="saveDraftForm()"
          >Save as a Draft</v-btn
        >
      </v-col>
    </v-row>
    <!-- Loader Component -->
    <Loader v-if="!response || !categories" />

    <v-row v-if="requestType != 'PAID'" class="mt-0">
      <v-col v-if="response && categories" cols="5" class="pt-0">
        <div v-if="pdfUrl">
          <div>
            <v-tabs bg-color="primary" v-model="tab">
              <v-tab href="#tab-1">Attachment Preview</v-tab>
              <v-tab href="#tab-2">ML Response</v-tab>
            </v-tabs>
          </div>

          <div>
            <v-tabs-items v-model="tab">
              <v-tab-item v-for="i in 2" :key="i" :value="'tab-' + i">
                <br />
                <div v-if="i === 1"><PdfPreview /></div>
                <div
                  v-if="i === 2 && fromMLSide.response"
                  class="ml-response-preview"
                >
                  <pre>{{ fromMLSide.data }}</pre>
                </div>
              </v-tab-item>
            </v-tabs-items>
          </div>
          <!-- <PdfPreview /> -->
        </div>
      </v-col>
      <v-col v-if="response && categories" class="invoices" lg="7" sm="12">
        <!-- Skeleton loader -->
        <v-skeleton-loader
          v-if="draftCheck && tableLoader"
          v-bind="attrs"
          height="680"
          style="padding-left: 20px; padding-right: 20px"
          type="article, text, table-row-divider@7, actions"
        ></v-skeleton-loader>
        
        <div
          v-else-if="!tableLoader"
          v-for="(item, index) of response?.invoices"
          :key="index"
          class="mt-2"
        >
          <div>
            <label class="">
              <span
                class="secondaryTextColor d-flex justify-center font-style-heading"
                >Invoice No : {{ item.invoiceNumber }}</span
              >
              <v-icon
                v-if="index != 0"
                @click="removeForm(index)"
                color="red"
                size="20"
                class="float-right mr-2"
                >mdi-delete</v-icon
              >
            </label>
            <label class="d-flex justify-center inputBackground mr-1"
              >Page No: {{ index + 1 }}
            </label>
          </div>
          <Form
            class="backgroundLightColor my-2 pa-2"
            :invoice="item"
            :index="index"
          />
          <v-divider class="mt-3"></v-divider>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="requestType == 'PAID'" class="mt-0">
      <v-col cols="12" class="pt-0 d-none d-md-flex">
        <PaymentForm />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";
import Form from "./form/index.vue";
import PaymentForm from "./form/payment-form/index.vue";
import Loader from "./loader/index.vue";
import PdfPreview from "./pdf-preview/index.vue";
import Snackbar from "@/common/snackbar/Snackbar.vue";
import axios from "axios";
import UrlServices from "@/services/Url";
import { computed } from "vue";

export default {
  name: "index",
  components: {
    Form,
    PaymentForm,
    Loader,
    PdfPreview,
    Snackbar,
  },
  props: {
    ticket: Object,
  },
  data: () => ({
    tab: null,
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
    tableLoader: false,
    resItems: {},
    resTaxRates: {},
    resAccountsCode: {},
    resBrandingTheme: {},
    loader: false,
    statusValues: ["ACCPAY", "ACCREC", "PAID"],
    requestType: "ACCREC",
    loadingItems: false,
    loadingTaxRates: true,
    loadingAccounts: false,
    responseSuccessOfItems: "",
    responseSuccessOfTaxRates: "",
    responseSuccessOfAccounts: "",
    brandingResponse: "",
    brandingLoader: true,
    brandingThemes: [],
    taxRatesDropdown: [],
    itemUp: [],
    account: [],
    payments: [
      {
        invoice: { invoiceID: null },
        account: { code: null },
        date: "",
        amount: "",
      },
    ],
    paymentLoader: false,
    isSold: true,
    newInvoiceForm: {
      address: "",
      balanceDue: "",
      currencyCode: "",
      date: "",
      discount: "",
      dueDate: "",
      email: "",
      invoiceNumber: "",
      lineItems: [
        {
          description: "",
          disc: 0,
          lineAmount: 0,
          quantity: 0,
          taxAmount: 0,
          unitAmount: 0,
          itemCode: "",
          accountCode: "",
          taxType: "",
        },
      ],
      name: "",
      subTotal: "",
      totalTax: "",
      total: "",
      status: "",
      type: "ACCREC",
      lineAmountTypes: "Exclusive",
    },
    paginate: {
      size: 10,
      page: 1,
      lastPage: 10,
      total: 0,
    },
  }),
  /**
   * Provide requestType (i.e. type = ACCREC || ACCPAY || PAID) to multiple child components
   * and provide some variables to form-editable component
   * and provide other variables to form-header component
   */
  provide() {
    return {
      requestType: computed(() => this.requestType),
      responseSuccessOfItems: computed(() => this.responseSuccessOfItems),
      responseSuccessOfTaxRates: computed(() => this.responseSuccessOfTaxRates),
      loadingItems: computed(() => this.loadingItems),
      loadingTaxRates: computed(() => this.loadingTaxRates),
      loadingAccounts: computed(() => this.loadingAccounts),
      itemUp: computed(() => this.itemUp),
      taxRatesDropdown: computed(() => this.taxRatesDropdown),
      responseSuccessOfAccounts: computed(() => this.responseSuccessOfAccounts),
      account: computed(() => this.account),
      brandingResponse: computed(() => this.brandingResponse),
      brandingLoader: computed(() => this.brandingLoader),
      brandingThemes: computed(() => this.brandingThemes),
    };
  },

  async mounted() {
    await this.$store.dispatch("xeroForm/getAccountsToDb");
    this.$store.dispatch("xeroForm/getTotalAccountItems");
    /**
     * For draft Case only,
     * Showing skeleton loader before fetching all the data from APIs, in case of editing the Xero Form
     */
    if (this.draftCheck) {
      this.tableLoader = true;
      Promise.all([
        // this.getItemsUp(),
        this.getAccounts(),
        this.getTaxRates(),
        this.fetchBrandingThemes(),
      ]).then((res) => {
        console.log("all response>>>", res);
        this.tableLoader = false;
      });
    }
    if (this.pdfUrl) await this.savePdfLink(this.pdfUrl);
  },
  beforeMount() {
    this.$store.commit("xeroForm/setPdfLink", "");
    this.$store.commit("xeroForm/addCategories", "");
    this.$store.commit("xeroForm/setAccountItemsHashMaps", "");
  },
  computed: {
    ...mapGetters({
      fromMLSide: "xeroForm/getfromMLSide",
      response: "xeroForm/getInvoices",
      currentWorkspace: "auth/getCurrentWorkspace",
      pdfUrl: "xeroForm/getAttachmentUrl",
      pdfLink: "xeroForm/getPdfLink",
      categories: "xeroForm/getCategories",
      authToken: "auth/getAuthToken",
      workspaceId: "xeroForm/getWorkspaceId",
      draftCheck: "xeroForm/getDraftCheck",
      total: "xeroForm/getTotalItems",
      noOfRecords: "xeroForm/getNoOfRecords",
      page: "xeroForm/getPage",
    }),
  },
  methods: {
    /**
     * Method to save draft from invoices
     */
    async saveDraftForm() {
      try {
        let config = {
          method: "post",
          url: `${UrlServices.saveTicketDraft}/${this.ticket._id}`,
          data: {
            data: this.response ? this.response : "",
          },
          headers: {
            Authorization: this.authToken,
          },
        };
        await axios(config);
        EventBus.$emit("update-draft-form", this.response);
        EventBus.$emit("show-snackbar", {
          text: "Draft has been saved",
          type: "success",
        });
      } catch (error) {
        console.log("error =>", error);
      }
    },
    /**
     * Method to add new form in invoices table
     */
    addInvoiceForm() {
      let Arr = [];
      this.categories?.trackingCategories.forEach((item) => {
        let obj = {
          trackingCategoryID: item.trackingCategoryID,
          trackingOptionID: "",
        };
        Arr.push(obj);
      });
      if (Arr.length > 0) this.newInvoiceForm.lineItems[0]["tracking"] = Arr;
      this.$store.commit(
        "xeroForm/addNewInvoice",
        JSON.parse(JSON.stringify(this.newInvoiceForm))
      );
    },

    /**
     * Method to remove xeroform from invoices
     */
    removeForm(index) {
      this.$store.commit("xeroForm/removeInvoiceForm", index);
    },
    /**
     * Method to change request type, such as ACCREC for invoices or ACCPAY for bills
     */
    changeRequestType() {
      const previousValue = this.requestType;
      // Assign requestType (i.e. type = ACCREC || ACCPAY) in NewInvoiceForm
      this.newInvoiceForm.type = this.requestType =
        this.$refs.requestType.lazyValue;
      // whenever requestType changes, this will run
      if (previousValue != this.requestType) {
        this.loadingItems = true;
        this.responseSuccessOfItems = false;
        this.itemUp = [];
        if (this.requestType == "ACCREC") this.isSold = true;
        else this.isSold = false;
        this.getItemsUp();
        this.response.invoices = this.response.invoices.map((v) => {
          v.lineItems.forEach((item) => {
            item.itemCode = "";
          });
          v["type"] = this.requestType;
          return v;
        });
      }
    },
    async savePdfLink(url) {
      var self = this;
      var data = {
        token:
          this.currentWorkspace.source === "slack"
            ? this.currentWorkspace.botToken
            : "test-string",
      };
      data["file"] =
        url.search("files/tickets") > -1
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
      var response = await axios(config);
      if (!response) return;
      let blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        var base64data = reader.result;
        this.image_url = base64data;
      };

      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      self.$store.commit("xeroForm/setPdfLink", link.href);
    },
    /**
     * Method to submit invoices on Xero(3rd party App)
     */
    submitInvoices() {
      let hasMatch = "";
      this.loader = true;
      hasMatch = this.response.invoices.find((e) => {
        if (!["ACCPAY", "ACCREC"].includes(e.type)) {
          return e;
        }
      });
      if (hasMatch) {
        EventBus.$emit("show-snackbar", {
          text: `Please provide the request type of ${hasMatch.invoiceNumber}`,
          type: "error",
        });
        this.loader = false;
        return;
      }
      this.$store
        .dispatch("xeroForm/submitInvoices", this.ticket)
        .then((res) => {
          EventBus.$emit("update-draft-form", this.response);
          this.loader = false;
          EventBus.$emit("change-ticket-xero-form-to-complete", true);
          EventBus.$emit("show-snackbar", {
            text: "Response has been submitted",
            type: "success",
          });
          setTimeout(() => {
            this.$store.commit("xeroForm/addInvoices", "");
            this.$emit("close-dialog");
          }, 2000);
        })
        .catch((e) => {
          this.loader = false;
          EventBus.$emit("show-snackbar", {
            text: e,
            type: "error",
          });
        });
    },
    /**
     * Method to submit Payment on Xero
     * Here check Validations first, before submitting payment amount
     */
    submitPayment() {
      const payment = JSON.parse(JSON.stringify(this.payments[0]));
      if (!payment.account.accountID) {
        EventBus.$emit("show-snackbar", {
          text: `Account Code is required`,
          type: "error",
        });
        return;
      }
      if (!payment.date) {
        EventBus.$emit("show-snackbar", {
          text: `Date is required`,
          type: "error",
        });
        return;
      }
      if (!payment.amount) {
        EventBus.$emit("show-snackbar", {
          text: `Amount is required`,
          type: "error",
        });
        return;
      }
      if (payment.amount <= 0) {
        EventBus.$emit("show-snackbar", {
          text: `Payment amounts must be positive amounts`,
          type: "error",
        });
        return;
      }
      if (!payment.invoice.invoiceID) {
        EventBus.$emit("show-snackbar", {
          text: `Invoice is required`,
          type: "error",
        });
        return;
      }

      this.paymentLoader = true;
      delete payment.account.code;
      this.axios
        .post(
          `${UrlServices.submitInvoicePayment}/${this.workspaceId}`,
          { payments: [payment] },
          {
            headers: {
              Authorization: this.authToken,
            },
          }
        )
        .then((res) => {
          this.paymentLoader = false;
          EventBus.$emit("show-snackbar", {
            text: "Payment has been submitted",
            type: "success",
          });
          setTimeout(() => {
            this.$emit("close-dialog");
          }, 2000);
        })
        .catch((err) => {
          this.paymentLoader = false;
          EventBus.$emit("show-snackbar", {
            text: err.response.data.message,
            type: "error",
          });
          console.log(err);
        });
    },
    /**
     * Method to fetch Branding themes from Xero
     */
    async fetchBrandingThemes() {
      var configBrandingTheme = {
        method: "get",
        url: `xero/get-branding-themes/${this.workspaceId}`,
        headers: { Authorization: this.authToken },
      };
      this.resBrandingTheme = await axios(configBrandingTheme);
      if (this.resBrandingTheme.status == 200) {
        this.brandingResponse = true;
        this.brandingThemes = this.resBrandingTheme.data.brandingThemes;
        this.brandingLoader = false;
      } else if (this.resBrandingTheme.status != 200) {
        this.brandingLoader = false;
        console.log("error", this.resBrandingTheme);
      }
      return this.resBrandingTheme;
    },
    /**
     * check Response(key) from child component
     */
    checkResponse(key) {
      if (key == "itemCode") this.getItemsUp();
      else if (key == "accountCode") this.getAccounts();
      else if (key == "taxType") this.getTaxRates();
    },
    /**
     * Method to getItems from xero
     */
    async getItemsUp() {
      // var configItems = {
      //       method: "get",
      //       url: `${UrlServices.getItems}/${this.workspaceId}?is_sold=${this.isSold}`,
      //       headers: { Authorization: this.authToken },
      //     }
      // this.resItems = await axios(configItems)
      // if(this.resItems.status == 200) {
      //   const items = [];
      //   this.responseSuccessOfItems = true;
      //   this.resItems.data?.items.forEach((item) => {
      //   items.push({
      //       label: item.code + ": " + item.name,
      //       key: item.code,
      //     });
      //   });
      //   this.itemUp = items;
      //   this.loadingItems = false;
      // }
      // else if(this.resItems.status != 200) {
      //   console.log('error',this.resItems);
      // }
      // return this.resItems;
    },

    /**
     * Method to getTaxRates from xero
     */
    async getTaxRates() {
      var configTaxRates = {
        method: "get",
        url: `${UrlServices.getTaxRates}/${this.workspaceId}`,
        headers: { Authorization: this.authToken },
      };
      this.resTaxRates = await axios(configTaxRates);
      if (this.resTaxRates.status == 200) {
        let taxRates = [];
        this.responseSuccessOfTaxRates = true;
        taxRates = this.resTaxRates.data.taxRates;
        this.taxRatesDropdown = taxRates;
        this.loadingTaxRates = false;
      } else if (this.resTaxRates.status != 200) {
        console.log("error", this.resTaxRates);
      }
      return this.resTaxRates;
    },

    /**
     * Method to get Accounts from xero
     */
    async getAccounts() {
      // var configAccountsCode = {
      //       method: "get",
      //       url: `${UrlServices.getAccounts}/${this.workspaceId}`,
      //       headers: { Authorization: this.authToken },
      //     }
      // this.resAccountsCode = await axios(configAccountsCode)
      // if(this.resAccountsCode.status == 200) {
      //   let account = [];
      //   this.responseSuccessOfAccounts = true;
      //   this.resAccountsCode.data?.accounts.forEach((item) => {
      //     account.push({
      //       label: item.name,
      //       code: item.code,
      //     });
      //   });
      //   this.account = account;
      //   this.loadingAccounts = false;
      // }
      // else if(this.resAccountsCode.status != 200) {
      //   console.log('error',this.resAccountsCode)
      // }
      // return this.resAccountsCode;
    },
    /**
     * Method to get Paid Accounts from xero
     */
    getPaidAccounts() {
      this.axios
        .get(`${UrlServices.getAccounts}/${this.workspaceId}`, {
          headers: { Authorization: this.authToken },
        })
        .then((res) => {
          let paidAccount = [];
          this.responseSuccessOfPaidAccounts = true;
          res.data?.accounts.forEach((item) => {
            if (item.enablePaymentsToAccount) {
              paidAccount.push({
                label: item.name,
                code: item.code,
              });
            }
          });
          this.paidAccount = paidAccount;
          this.loadingPaidAccounts = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * Method to fetch paginated data on scroll end
     */
    // async endIntersect() {
    //   this.paginate.page = this.page + 1;
    //   const res = this.paginate.page * this.paginate.size;
    //   if((res < this.total) || this.noOfRecords === 10) {
    //     await this.$store.dispatch("xeroForm/getAccountItems", this.paginate);
    //   }
    // },
  },
  created() {
    /**
     * Get event emit from form-header component
     */
    this.$root.$on("check-response-brands", this.fetchBrandingThemes);
    /**
     * Get event(key) from form-editable component
     */
    this.$root.$on("check-response", this.checkResponse);
    /**
     * Get object from payment-form component and assign it to payments variable
     * Used this object in submitPayment() function
     */
    this.$root.$on("submit-payment", (obj) => {
      this.payments = obj;
    });
    /**
     * Get event emit from from-editable component
     */
    // this.$root.$on("load-more-data", this.endIntersect);
  },
  beforeDestroy() {
    this.tableLoader = false;
    this.$store.commit("xeroForm/setSkeletonLoader", false);
    this.$store.commit("xeroForm/addInvoices", "");
    this.$store.commit("xeroForm/setInvoiceArr", []);
    this.$store.commit("xeroForm/setFromMLSide", {
      response: false,
      data: null,
    });
    this.$root.$off("check-response");
    this.$root.$off("submit-payment");
    this.$root.$off("check-response-brands");
  },
};
</script>

<style scoped>
.invoices {
  height: 700px;
  overflow: scroll;
}

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
.container {
  max-width: 1345px;
}
.ml-response-preview {
  border: 1px solid black;
  border-radius: 10px;
  max-height: 500px;
  overflow: scroll;
  padding: 10px;
}
</style>
