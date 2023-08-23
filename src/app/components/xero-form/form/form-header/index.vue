<template>
  <v-container class="ma-0 pa-0">
    <v-row class="ma-0 pa-0">
      <v-col lg="6" md="6" sm="12">
        <!-- Invoive Nmber -->
        <div class="d-flex justify-end align-center">
          <div class="field-width">
            <h4 class="font-style-section-heading mainTextColor--text">
              Invoice Number
            </h4>
          </div>
          <v-text-field
            class="d-flex appColor--text default-input-field ma-1 pa-0 field-width"
            :autocomplete="false"
            flat
            solo
            hide-details
            color="appColor"
            placeholder="Invoice Number"
            dense
            :rules="requiredField"
            v-model="invoice.invoiceNumber"
          >
          </v-text-field>
        </div>
        <!-- Contact Name -->
        <div class="d-flex justify-end align-center">
          <div class="field-width">
            <h4 class="font-style-section-heading mainTextColor--text">Name</h4>
          </div>
          <!-- if Xero is connected and isAccountingSoftConnected is true -->
          <v-combobox
            v-if="isAccountingSoftConnected"
            class="d-flex appColor--text default-input-field ma-1 pa-0 field-width"
            color="appColor"
            hide-details
            flat
            solo
            dense
            attach
            :rules="requiredField"
            v-model="invoice.name"
            :items="contactOptions"
            placeholder="Select Contacts"
            @input="setContact()"
            @focus="fetchContacts()"
            item-text="name"
            item-value="name"
          >
            <!-- Template to get paginated data on scroll end -->
            <template v-slot:append-item>
              <div class="text-center" v-if="contactLoader">
                <span>Loading...</span>
              </div>
            </template>
          </v-combobox>

          <!-- if Xero is not connected and isAccountingSoftConnected is false -->
          <v-text-field
            v-if="!isAccountingSoftConnected"
            class="font-style-paragraph ma-1 pa-0 text-no-wrap rounded-md custom appColor"
            placeholder="Contacts"
            color="appColor"
            flat
            dense
            solo
            autocomplete="off"
            persistent-placeholder
            hide-details
            v-model="invoice.name"
          ></v-text-field>
        </div>
        <!-- Created Date -->
        <div class="d-flex justify-between align-baseline">
          <div class="field-width">
            <h4 class="font-style-section-heading mainTextColor--text">
              Created At
            </h4>
          </div>
          <div class="d-flex flex-column date-field">
            <v-text-field
              class="font-style-paragraph ma-1 pa-0 text-no-wrap rounded-md custom"
              placeholder="Date"
              color="appColor"
              flat
              dense
              solo
              autocomplete="off"
              persistent-placeholder
              hide-details
              v-model="invoice.date"
              type="date"
            >
            </v-text-field>
            <span v-if="!isDateValid && defaultDateCheck" class="red--text font-size pl-3">
              Date is incorrect
            </span>
          </div>
          <!-- <v-menu
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            v-model="datePickerModal"
            class="field-width"
          >
            <template v-slot:activator="{ on, attrs }">
             <div class="date-field">
              <v-text-field
                class="font-style-paragraph ma-1 pa-0 text-no-wrap rounded-md custom"
                placeholder="Date"
                color="appColor"
                flat
                dense
                solo
                autocomplete="off"
                hide-details
                readonly
                v-bind="attrs"
                v-on="on"
                v-model="invoice.date"
              ></v-text-field>
              <span v-if="invoice.validationdate" class="red--text font-size pl-3">
                Format not supported
              </span>
             </div>
            </template>
            <v-date-picker v-model="invoice.date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="noDateSelect()">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="dateSelected">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu> -->
        </div>
        <!-- Expected Payment Date -->
        <div class="d-flex justify-between align-center">
          <div class="field-width">
            <h4 class="font-style-section-heading mainTextColor--text">
              Expected Payment Date
            </h4>
          </div>
          <div class="d-flex flex-column date-field">
          <v-text-field
              class="font-style-paragraph ma-1 pa-0 text-no-wrap rounded-md custom"
              placeholder="Expected Payment Date"
              color="appColor"
              flat
              dense
              solo
              autocomplete="off"
              persistent-placeholder
              hide-details
              v-model="invoice.expectedPaymentDate"
              type="date"
            >
            </v-text-field>
            <span v-if="!isExpectedPaymentDate && defaultExpectedPaymentDateCheck" class="red--text font-size pl-3">
              Date is incorrect
            </span>
            </div>
          <!-- <v-menu
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            v-model="expectedPaymentDate"
            class="field-width"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="font-style-paragraph ma-1 pa-0 text-no-wrap rounded-md custom appColor"
                placeholder="Expected Payment Date"
                color="appColor"
                flat
                dense
                solo
                autocomplete="off"
                persistent-placeholder
                hide-details
                readonly
                v-bind="attrs"
                v-on="on"
                v-model="invoice.expectedPaymentDate"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="invoice.expectedPaymentDate"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="noExpectedDateSelect()">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="expectedPaymentDate = false">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu> -->
        </div>
        <!-- Branding Themes -->
        <div class="d-flex align-center">
          <div class="field-width">
            <h4 class="font-style-section-heading mainTextColor--text">
              Branding Themes
            </h4>
          </div>
          <!-- if Xero is connected and isAccountingSoftConnected is true -->
          <v-select
            v-if="isAccountingSoftConnected"
            class="d-flex appColor--text default-input-field ma-1 pa-0 field-width"
            flat
            solo
            attach
            hide-details
            placeholder="Select Branding Theme"
            color="appColor"
            dense
            :no-data-text="brandingLoader ? 'Loading..' : 'No brands available'"
            :items="brandingThemes"
            item-value="brandingThemeID"
            item-text="name"
            v-model="invoice.brandingThemeID"
            @focus="fetchBrandingThemes()"
          >
          </v-select>
          <!-- if Xero is not connected and isAccountingSoftConnected is false -->
          <v-text-field
            v-if="!isAccountingSoftConnected"
            class="font-style-paragraph ma-1 pa-0 text-no-wrap rounded-md custom appColor"
            placeholder="Branding Theme"
            color="appColor"
            flat
            dense
            solo
            autocomplete="off"
            persistent-placeholder
            hide-details
            v-model="invoice.brandingThemeID"
          ></v-text-field>
        </div>
        <!-- Reference -->
        <div class="d-flex justify-end align-center">
          <div class="field-width">
            <h4 class="font-style-section-heading mainTextColor--text">
              Reference
            </h4>
          </div>
          <v-text-field
            class="d-flex appColor--text default-input-field ma-1 pa-0 field-width"
            :autocomplete="false"
            flat
            solo
            hide-details
            color="appColor"
            placeholder="Reference"
            dense
            v-model="invoice.reference"
          >
          </v-text-field>
        </div>
        <!-- Status -->
        <div class="d-flex align-center">
          <div class="field-width mr-15">
            <h4 class="font-style-section-heading mainTextColor--text">
              Status
            </h4>
          </div>
          <v-radio-group
            v-model="invoice.status"
            v-for="(item, index) in radioButtonValues"
            :key="index"
          >
            <v-radio
              class="d-flex appColor--text default-input-field mr-4"
              :label="item.label"
              :color="item.color"
              :value="item.value"
            ></v-radio>
          </v-radio-group>
        </div>
      </v-col>
      <v-col>
        <!-- Email -->
        <div class="d-flex align-center">
          <h4 class="font-style-section-heading mainTextColor--text">Email</h4>
          <v-text-field
            class="d-flex appColor--text default-input-field ma-1 pa-0 ml-8"
            :autocomplete="false"
            flat
            solo
            hide-details
            color="appColor"
            placeholder="Email"
            dense
            :rules="requiredField"
            v-model="invoice.email"
          >
          </v-text-field>
        </div>
        <!-- Address -->
        <div class="d-flex align-center">
          <h4 class="font-style-section-heading mainTextColor--text">
            Address
          </h4>
          <v-text-field
            class="d-flex appColor--text default-input-field ma-1 pa-0 ml-4"
            :autocomplete="false"
            flat
            solo
            hide-details
            color="appColor"
            placeholder="Address"
            dense
            :rules="requiredField"
            v-model="invoice.address"
          >
          </v-text-field>
        </div>
        <!-- Due Date -->
        <div class="d-flex align-baseline">
          <h4 class="font-style-section-heading mainTextColor--text">
            Due Date
          </h4>
          <div class="d-flex flex-column due-date-field">
            <v-text-field
              class="font-style-paragraph ma-1 ml-2 pa-0 text-no-wrap rounded-md custom"
              placeholder="Due date"
              color="appColor"
              flat
              dense
              solo
              autocomplete="off"
              persistent-placeholder
              hide-details
              v-model="invoice.dueDate"
              type="date"
            >
            </v-text-field>
            <span v-if="!isDueDateValid && defaultDueDateCheck" class="red--text font-size pl-3">
              Date is incorrect
            </span>
          </div>
          <!-- <v-menu
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            v-model="dueDatePicker"
          >
            <template v-slot:activator="{ on, attrs }">
              <div class="due-date-field">
              <v-text-field
                class="font-style-paragraph ma-1 ml-11 pa-0 text-no-wrap rounded-md custom"
                placeholder="Due Date"
                flat
                dense
                solo
                autocomplete="off"
                hide-details
                readonly
                v-bind="attrs"
                v-on="on"
                :rules="requiredField"
                v-model="invoice.dueDate"
              ></v-text-field>
              <span v-if="invoice.validationdueDate" class="red--text font-size pl-13">
                Format not supported
              </span>
              </div>
            </template>
            <v-date-picker v-model="invoice.dueDate" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="noDueDateSelect()">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="dueDateSelected()">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu> -->
        </div>
        <!-- Planned Payment Date -->
        <div class="d-flex justify-between align-center">
          <div class="field-width">
            <h4 class="font-style-section-heading mainTextColor--text">
              Planned Payment Date
            </h4>
          </div>
          <div class="d-flex flex-column date-field">
          <v-text-field
              class="font-style-paragraph ma-1 pa-0 text-no-wrap rounded-md custom"
              placeholder="Planned Payment Date"
              color="appColor"
              flat
              dense
              solo
              autocomplete="off"
              persistent-placeholder
              hide-details
              v-model="invoice.plannedPaymentDate"
              type="date"
            >
            </v-text-field>
            <span v-if="!isPlannedPaymentDate && defaultPlannedPaymentDateCheck" class="red--text font-size pl-3">
              Date is incorrect
            </span>
            </div>
          <!-- <v-menu
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
            v-model="plannedPaymentDate"
            class="field-width"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="font-style-paragraph ma-1 pa-0 text-no-wrap rounded-md custom"
                placeholder="Planned Payment Date"
                color="appColor"
                flat
                dense
                solo
                autocomplete="off"
                persistent-placeholder
                hide-details
                readonly
                v-bind="attrs"
                v-on="on"
                v-model="invoice.plannedPaymentDate"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="invoice.plannedPaymentDate"
              no-title
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="noPlannedDateSelect()">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="plannedPaymentDate = false">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu> -->
        </div>
        <!-- Line Amount Types -->
        <div class="d-flex justify-end align-center">
          <div class="field-width">
            <h4 class="font-style-section-heading mainTextColor--text">
              Line Amount Types
            </h4>
          </div>
          <v-select
            class="d-flex appColor--text default-input-field ma-1 pa-0 field-width"
            v-model="invoice.lineAmountTypes"
            :items="lineAmountTypes"
            @change="sendIndexOfInvoice"
            flat
            solo
            dense
            attach
            hide-details
          />
        </div>
         <!-- URL -->
         <div class="d-flex justify-end align-center">
          <div class="field-width">
            <h4 class="font-style-section-heading mainTextColor--text">
              URL
            </h4>
          </div>
          <v-text-field
            class="d-flex appColor--text default-input-field ma-1 pa-0 field-width"
            :autocomplete="false"
            flat
            solo
            hide-details
            color="appColor"
            placeholder="URL"
            dense
            v-model="invoice.url"
            :rules="urlRules"
          >
          </v-text-field>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "index",
  props: {
    invoice: Object,
    invoiceIndex: Number
  },
  inject: [
    "brandingThemes",
    "brandingLoader",
    "brandingResponse",
  ],
  watch: {
    'invoice.date': {
      handler: function () {
        if(this.isValidDate(this.invoice.date)) {
          this.defaultDateCheck = true;
          return this.isDateValid = true;
        }
        else
          return this.isDateValid = false;
        },
        immediate: true
    },
    'invoice.dueDate': {
      handler: function () {
        if(this.isValidDate(this.invoice.dueDate)) {
          this.defaultDueDateCheck = true;
          return this.isDueDateValid = true;
        }
        else
          return this.isDueDateValid = false;
        },
        immediate: true
    },
    'invoice.expectedPaymentDate': {
      handler: function () {
        if(this.isValidDate(this.invoice.expectedPaymentDate)) {
          this.defaultExpectedPaymentDateCheck = true;
          return this.isExpectedPaymentDate = true;
        }
        else
          return this.isExpectedPaymentDate = false;
        },
        immediate: true
    },
    'invoice.plannedPaymentDate': {
      handler: function () {
        if(this.isValidDate(this.invoice.plannedPaymentDate)) {
          this.defaultPlannedPaymentDateCheck = true;
          return this.isPlannedPaymentDate = true;
        }
        else
          return this.isPlannedPaymentDate = false;
        },
        immediate: true
    },
  },
  data: () => ({
    defaultDateCheck : false,
    defaultDueDateCheck : false,
    defaultExpectedPaymentDateCheck : false,
    defaultPlannedPaymentDateCheck : false,
    isDateValid: false,
    isDueDateValid: false,
    isExpectedPaymentDate: false,
    isPlannedPaymentDate: false,
    editHeader: true,
    datePickerModal: false,
    dueDatePicker: false,
    expectedPaymentDate: false,
    plannedPaymentDate: false,
    contactLoader: false,
    lineAmountTypes: ["Exclusive", "Inclusive", "NoTax"],
    page: 1,
    radioButtonValues: [
      {
        label: "Draft",
        color: "primary",
        value: "DRAFT",
      },
      {
        label: "Submitted",
        color: "primary",
        value: "SUBMITTED",
      },
      {
        label: "Authorised",
        color: "primary",
        value: "AUTHORISED",
      },
    ],
    contactOptions: [],
    requiredField: [(v) => !!v || "Field is required"],
    emailRules: [
      (v) => !!v || "Field is required",
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(v) ||
        "E-mail must be valid",
    ],
    urlRules: [
      (v) => !!v || "Field is required",
      (v) => 
        /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/.test(v) ||
        "URL must be valid",
    ],
    nameRules: [
      (v) => !!v || "Field is required",
      (v) =>
        (v && v.length >= 3) ||
        "Name must be greater than or equal to 3 characters",
    ],
  }),
  computed: {
    ...mapGetters({
      authToken: "auth/getAuthToken",
      workspaceId: "xeroForm/getWorkspaceId",
      draftCheck : "xeroForm/getDraftCheck",
      currentWorkspace: "auth/getCurrentWorkspace",
      isAccountingSoftConnected : "xeroForm/getIsTicketAccountingSoftConnected"
    }),
  },
  methods: {
    /**
     * This function validates the date(s)
     * @param {*} dateString 
     */
    isValidDate(dateString) {
      var regEx = /^\d{4}-\d{2}-\d{2}$/;
      if(!dateString?.match(regEx)) return false;  // Invalid format
      var d = new Date(dateString);
      var dNum = d.getTime();
      if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
      return d.toISOString().slice(0,10) === dateString;
    },
    setContact() {
      this.invoice.name =
        typeof this.invoice.name == "object"
          ? this.invoice.name.name
          : this.invoice.name;
      this.fetchContacts();
    },
    // For future use
    // Method to fetch paginated data on scroll end
    // async endIntersect(entries, observer, isIntersecting) {
    //   this.page = this.page + 1;
    //   if (isIntersecting) {
    //     let paginatedContacts = this.contactOptions;
    //     await this.fetchContacts();
    //     const contacts = paginatedContacts.concat(this.contactOptions);
    //     return (this.contactOptions = contacts);
    //   }
    // },
    /**
     * Method to fetch contacts from Xero
     */
    async fetchContacts() {
      this.contactLoader = true;
      this.invoice.name = this.invoice.name == null ? '' : this.invoice.name;
      await axios
        .get(
          `xero/get-contacts/${this.workspaceId}?search=${this.invoice.name}`,
          {
            headers: { Authorization: this.authToken },
          }
        )
        .then((res) => {
          this.contactLoader = false;
          return (this.contactOptions = res.data.contacts);
        })
        .catch((err) => {
          this.contactLoader = false;
          console.log(err);
        });
    },

    /**
     * Method to fetch Branding themes from Xero
     * if brandingResponse is true it means response already get and event doesn't emit
     * So, API will not call in parent component
     */
     fetchBrandingThemes() {
      if (!this.brandingResponse && this.brandingLoader) {
        this.$root.$emit("check-response-brands");
      }
     },
    editHeaderFields() {
      this.editHeader = true;
    },
    saveHeaderFields() {
      this.editHeader = false;
    },
    setDate() {
      // this.$emit("update-date", this.dates.join("~"));
      this.datePickerModal = false;
    },
    dueDate() {
      this.dueDatePicker = false;
    },
    noDateSelect() {
      this.invoice.date = "";
      this.datePickerModal = false;
    },
    // This function sets the date picker modal to false and delete the key "validationdate"
    dateSelected() {
      this.datePickerModal = false;
      delete this.invoice.validationdate;
    },
    // This function sets the date picker modal to false and delete the key "validationdueDate"
    dueDateSelected() {
      this.dueDatePicker = false;
      delete this.invoice.validationdueDate;
    },
    noExpectedDateSelect() {
      this.invoice.expectedPaymentDate = "";
      this.expectedPaymentDate = false;
    },
    noPlannedDateSelect() {
      this.invoice.plannedPaymentDate = "";
      this.plannedPaymentDate = false;
    },
    noDueDateSelect() {
      this.invoice.dueDate = "";
      this.dueDatePicker = false;
    },
    sendIndexOfInvoice() {
      this.$store.commit('xeroForm/performActionOnInvoiceTypeChanged',this.invoiceIndex)
    }
  },
};
</script>

<style scoped>
::v-deep .v-chip.v-size--small {
  border-radius: 6px !important;
  width: 120px !important;
  justify-content: center !important;
}

::v-deep .v-input--is-focused {
  border: 1px solid var(--v-appColor-base) !important;
}
::v-deep .v-list-item--active {
  color: var(--v-appLightColor-base) !important;
}
.field-width {
  width: 95px;
}
.field-width-radio{
  width: 110px
}
.background > .v-input__control .v-input__slot {
  background-color: #ffffff !important;
}
.font-size {
  font-size: 12px;
}
.date-field {
  width: 252px;
}
.due-date-field {
  width: 293px;
}
</style>
