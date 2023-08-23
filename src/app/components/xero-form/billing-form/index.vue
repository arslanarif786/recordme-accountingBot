<template>
  <v-container class="ma-0 pa-0">
    <div class="d-flex justify-center">
      <p class="font-style-heading">Billing Details</p>
    </div>
    <div class="d-flex justify-left">
      <p
        class="ml-2 font-style-paragraph appColor--text"
        style="cursor: pointer"
        @click="addnewProduct()"
      >
        Add new Product in Invoice
      </p>
    </div>
    <div class="d-flex flex-column full-width">
      <BillingHeading :type="type" />
      <div v-for="(item, index) of billing" :key="index">
        <BillingFormEditable
          :product="item"
          :index="invoiceindex"
          @delete-field="deleteField(index)"
          :type="type"
        />
      </div>
    </div>
  </v-container>
</template>

<script>
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";
import BillingHeading from "./billing-form-heading/index.vue";
import BillingFormEditable from "./billing-form-editable-field/index.vue";

export default {
  name: "index",
  props: {
    billing: Array,
    invoiceindex: Number,
    type: String,
  },
  components: {
    BillingHeading,
    BillingFormEditable,
  },
  data: () => ({}),
  computed: {
    ...mapGetters({
      categories: "xeroForm/getCategories",
      currentWorkspace: "auth/getCurrentWorkspace",
      isAccountingSoftConnected : "xeroForm/getIsTicketAccountingSoftConnected"
    }),
  },
  methods: {
    addnewProduct() {
      let sampleObject = {
        description: "",
        unitAmount: 0,
        quantity: 0,
        taxAmount: 0,
        lineAmount: 0,
        disc: 0,
      };

      let Arr = [];
      if(this.isAccountingSoftConnected) {
      this.categories?.trackingCategories.forEach((item) => {
        let obj = {
          trackingCategoryID: item.trackingCategoryID,
          trackingOptionID: "",
        };
        Arr.push(obj);
      });
      }
      if (Arr.length > 0) sampleObject["tracking"] = Arr;

      this.billing.push(sampleObject);
    },
    deleteField(index) {
      this.billing.splice(index, 1);
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
.data-table {
  border: solid 1px #ebeef7;
}
.full-width {
  overflow: auto;
  flex-wrap: nowrap;
}
</style>
