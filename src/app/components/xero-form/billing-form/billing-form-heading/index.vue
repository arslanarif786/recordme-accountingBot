<template>
  <v-container class="ma-0 pa-0 appColor">
    <v-row class="ma-0 pa-0 flex-nowrap">
      <v-col v-for="(item, index) in headerFields" :key="index" :cols="item.colSize"
        class="ma-0 pa-0 data-table justify-center d-flex align-center appColor" :style="{
          'display': (item.text === 'Tax' && type !== 'Exclusive') || (item.text === 'Discount' && requestType === 'ACCPAY') ? 'none !important' : ''
        }">
        <span v-if="item.text !== 'Tax' || (item.text === 'Tax' && type == 'Exclusive')">
          <p class="font-style-section-section  overflow-hidden">{{ item.heading }}</p>
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import EventBus from "@/js/EventBus";
import { mapGetters } from "vuex";


export default {
  name: "index",
  props: {
    type: String,
  },

  components: {
  },
  data: () => ({
    headerFields: [
      {
        heading: "Description",
        colSize: 2
      },
      {
        heading: "Quantity",
        colSize: 2
      },
      {
        heading: "Unit Price",
        colSize: 2
      },
      {
        heading: "Discount %",
        text: "Discount",
        colSize: 2
      },
      {
        heading: "Tax",
        text: "Tax",
        colSize: 2
      },
      {
        heading: "Total",
        colSize: 2
      },
    ]
  }),
  watch: {},
  inject: ['requestType'],
  mounted() {
    this.headerFields.unshift({
      heading: "Items",
      colSize: 2
    })

    this.headerFields.push({
      heading: "Accounts",
      colSize: 2
    })

    this.headerFields.push({
      heading: "Tax Rate",
      colSize: 2
    })

    if(this.isAccountingSoftConnected) {
    this.categories?.trackingCategories?.forEach(item => {
      this.headerFields.push({
        heading: item.name,
        colSize: 2
      })
    })
    }
    this.headerFields.push({
      heading: 'Action',
      colSize: 1
    })
  },
  computed: {
    ...mapGetters({
      categories: "xeroForm/getCategories",
      accounts: "xeroForm/getAccounts",
      taxRate: "xeroForm/getTaxRates",
      items: "xeroForm/getItemsField",
      currentWorkspace: "auth/getCurrentWorkspace",
      isAccountingSoftConnected : "xeroForm/getIsTicketAccountingSoftConnected"
    }),

  },
  methods: {},
  created() { },
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
