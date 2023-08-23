<template>
  <v-container>
    <Snackbar />
    <h1 v-if="response" class="d-flex justify-center font-style-heading">
      Xero Form
    </h1>
    <!-- Save Invoice Button -->
    <v-btn
      v-if="response"
      block
      color="appColor"
      class="mt-6 mb-6 white--text text-capitalize"
      :loading="loader"
      @click="saveInvoices()"
      @keyup.enter="saveInvoices()"
    >
      Save Invoices
    </v-btn>

    <h1 class="d-flex justify-start font-style-paragraph" v-if="response">
      Select manually on each invoice or select request type from dropdown for
      all invoices
    </h1>
    <v-row v-if="response" class="ma-0 pa-0">
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
      <v-col lg="6" sm="12"></v-col>
      <v-col lg="6" sm="12">
        <v-btn
          color="appColor"
          class="white--text text-capitalize float-right"
          @click="addInvoiceForm()"
          >+ Add Invoice Form</v-btn
        >
      </v-col>
    </v-row>
    <!-- Loader Component -->
    <Loader v-if="!response" />

    <v-row class="mt-0">
      <v-col v-if="response" cols="5" class="pt-0 d-none d-md-flex">
        <PdfPreview />
      </v-col>
      <v-col v-if="response" class="invoices" lg="7" sm="12">
        <!-- Skeleton loader -->
        <v-skeleton-loader
          v-if="tableLoader"
          v-bind="attrs"
          height="680"
          style="padding-left: 20px; padding-right: 20px"
          type="article, text, table-row-divider@7, actions"
        ></v-skeleton-loader>

        <div
          v-else-if="!tableLoader"
          v-for="(item, index) of response.invoices"
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
  </v-container>
</template>

<script>
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";
import Form from "../xero-form/form/index.vue";
import Loader from "../xero-form/loader/index.vue";
import PdfPreview from "../xero-form/pdf-preview/index.vue";
import Snackbar from "@/common/snackbar/Snackbar.vue";
import axios from "axios";
import UrlServices from "@/services/Url";
import { computed } from "vue";

export default {
  name: "index",
  components: {
    Form,
    Loader,
    PdfPreview,
    Snackbar,
  },
  props: {
    // recieve ticket object from XeroFormNotConnected.vue
    ticket: Object,
  },
  data: () => ({
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
    loadingItems: false,
    loadingTaxRates: true,
    loadingAccounts: false,
    brandingLoader: true,
    responseSuccessOfItems: "",
    responseSuccessOfTaxRates: "",
    responseSuccessOfAccounts: "",
    brandingResponse: "",
    brandingThemes: [],
    taxRatesDropdown: [],
    itemUp: [],
    account: [],
    loader: false,
    statusValues: ["ACCPAY", "ACCREC"],
    requestType: "ACCREC",
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
  }),
  provide() {
    return {
      requestType: computed(() => this.requestType),
      responseSuccessOfItems: computed(() => this.responseSuccessOfItems),
      responseSuccessOfTaxRates: computed(() => this.responseSuccessOfTaxRates),
      responseSuccessOfAccounts: computed(() => this.responseSuccessOfAccounts),
      brandingResponse: computed(() => this.brandingResponse),
      loadingItems: computed(() => this.loadingItems),
      loadingTaxRates: computed(() => this.loadingTaxRates),
      loadingAccounts: computed(() => this.loadingAccounts),
      brandingLoader: computed(() => this.brandingLoader),
      itemUp: computed(() => this.itemUp),
      taxRatesDropdown: computed(() => this.taxRatesDropdown),
      account: computed(() => this.account),
      brandingThemes: computed(() => this.brandingThemes),
    };
  },
  async mounted() {
    this.$store.dispatch("xeroForm/getTotalAccountItems");
    if (this.pdfUrl) await this.savePdfLink(this.pdfUrl);
  },
  beforeMount() {
    this.$store.commit("xeroForm/setPdfLink", "");
    this.$store.commit("xeroForm/setAccountItemsHashMaps", "");
  },
  beforeDestroy() {
    this.$store.commit("xeroForm/setSkeletonLoader", false);
    this.$store.commit("xeroForm/addInvoices", "");
    this.$store.commit("xeroForm/setInvoiceArr", []);
  },

  computed: {
    ...mapGetters({
      response: "xeroForm/getInvoices",
      currentWorkspace: "auth/getCurrentWorkspace",
      pdfUrl: "xeroForm/getAttachmentUrl",
      pdfLink: "xeroForm/getPdfLink",
      authToken: "auth/getAuthToken",
      workspaceId: "xeroForm/getWorkspaceId",
      draftCheck: "xeroForm/getDraftCheck",
      tableLoader: "xeroForm/getSkeletonLoader",
    }),
  },
  methods: {
    /**
     * This function add new form in invoices table
     */
    addInvoiceForm() {
      let Arr = [];
      if (Arr.length > 0) this.newInvoiceForm.lineItems[0]["tracking"] = Arr;
      this.$store.commit(
        "xeroForm/addNewInvoice",
        JSON.parse(JSON.stringify(this.newInvoiceForm))
      );
    },

    /**
     * This function remove xeroform from invoices
     * @param {*} index
     */
    removeForm(index) {
      this.$store.commit("xeroForm/removeInvoiceForm", index);
    },

    /**
     * This function change request type, such as ACCREC for invoices or ACCPAY for bills
     */
    changeRequestType() {
      const previousValue = this.requestType;
      // Assign requestType (i.e. type = ACCREC || ACCPAY) in NewInvoiceForm
      this.newInvoiceForm.type = this.requestType =
        this.$refs.requestType.lazyValue;
      // whenever requestType changes, this will run
      if (previousValue != this.requestType) {
        if (this.requestType == "ACCREC") this.isSold = true;
        else this.isSold = false;

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
     * This function saves the invoices
     */
    async saveInvoices() {
      this.setNotAvailableEditables(this.response.invoices);
      if (this.validationOnXeroFormEditable(this.response.invoices)) return;

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
        this.loader = false;
        EventBus.$emit("show-snackbar", {
          text: "Response has been saved",
          type: "success",
        });
        EventBus.$emit("open-draft-form", true);
        setTimeout(() => {
          this.$store.commit("xeroForm/addInvoices", "");
          this.$emit("close-dialog");
        }, 2000);
      } catch (error) {
        this.loader = false;
        console.log("error =>", error);
      }
    },

    /**
     * This functions sets validations on xeroForm editables
     * @param {*} invoices
     */
    validationOnXeroFormEditable(invoices) {
      for (let item = 0; item < invoices.length; item++) {
        const ele = invoices[item];
        console.log("inv >>", ele);
        if (!ele.invoiceNumber) {
          return EventBus.$emit("show-snackbar", {
            text: "Invoice number is required",
            type: "error",
          });
        }
        if (!ele.name) {
          return EventBus.$emit("show-snackbar", {
            text: "Name is required",
            type: "error",
          });
        }
        if (!ele.date) {
          return EventBus.$emit("show-snackbar", {
            text: "Created at is required",
            type: "error",
          });
        }
        if (!ele.dueDate) {
          return EventBus.$emit("show-snackbar", {
            text: "Due date is required",
            type: "error",
          });
        }

        if (Array.isArray(ele.lineItems)) {
          for (
            let lineItemIndex = 0;
            lineItemIndex < ele.lineItems.length;
            lineItemIndex++
          ) {
            const r = ele.lineItems[lineItemIndex];
            // xeroform lineitems validations here
            if (!r.description) {
              return EventBus.$emit("show-snackbar", {
                text: "Description is required",
                type: "error",
              });
            }
            if (!r.quantity) {
              return EventBus.$emit("show-snackbar", {
                text: "Quantity is required",
                type: "error",
              });
            }
            if (!r.unitAmount) {
              return EventBus.$emit("show-snackbar", {
                text: "Unit Price is required",
                type: "error",
              });
            }
            // xeroform lineitems validations END
          }
        }
        // footer fields validations here
        if (!ele.currencyCode) {
          return EventBus.$emit("show-snackbar", {
            text: "Currency is required",
            type: "error",
          });
        }
      }
    },

    /**
     * This function sets the not available lineitems
     * @param {*} invoices
     */
    setNotAvailableEditables(invoices) {
      invoices.forEach((ele) => {
        if (!ele.invoiceNumber) ele.invoiceNumber = "";
        if (!ele.name) ele.name = "";
        if (!ele.date) ele.date = "";
        if (!ele.dueDate) ele.dueDate = "";
        if (Array.isArray(ele.lineItems)) {
          for (
            let lineItemIndex = 0;
            lineItemIndex < ele.lineItems.length;
            lineItemIndex++
          ) {
            const r = ele.lineItems[lineItemIndex];
            if (!r.description) r.description = "";
            if (!r.unitAmount) r.unitAmount = 0;
            if (!r.quantity) r.quantity = 0;
          }
        }
        if (!ele.currencyCode) ele.currencyCode = "";
      });
    },
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
</style>
