<template>
  <v-container class="ma-0 pa-0">
    <FormHeader :invoice="invoice" :invoiceIndex="index" />
    <BillingForm :billing="invoice.lineItems ? invoice.lineItems : sampleArray" :invoiceindex="index" :type="invoice.lineAmountTypes"/>
    <FormFooter :invoice="invoice" :type="invoice.lineAmountTypes" />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import BillingForm from "../billing-form/index.vue";
import FormHeader from "../form/form-header/index.vue"
import FormFooter from "../form/form-footer/index.vue"

export default {
  name: "index",
  props: {
    invoice: Object,
    index : Number,
  },
  components: {
    BillingForm,
    FormHeader,
    FormFooter
  },
  data: () => ({
    sampleArray : [{
              description : "",
              unitAmount : 0,
              quantity : 0,
              taxAmount : 0,
              lineAmount: 0,
              disc : 0,
              itemCode : '',
              accoundCode: '',
              taxType: ''
          }]
  }),
  mounted() {
    if(!this.invoice.lineItems){
      let Arr = []
      if(this.isAccountingSoftConnected) {
      this.categories?.trackingCategories.forEach(item => {
       let obj = {
         trackingCategoryID : item.trackingCategoryID,
         trackingOptionID : ''
       }
       Arr.push(obj)
    })
    }
    if(Arr.length > 0) this.sampleArray[0]['tracking'] = Arr
    }
  },
  computed: {
    ...mapGetters({
      categories : "xeroForm/getCategories",
      currentWorkspace: "auth/getCurrentWorkspace",
      isAccountingSoftConnected : "xeroForm/getIsTicketAccountingSoftConnected"
    }),
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
</style>
