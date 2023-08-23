<template>
  <v-container>
    <AppBar />
    <AccountantTable />
  </v-container>
</template>

<script>
import AppBar from "../../layout/appbar/Appbar.vue"
import AccountantTable from "../datatable/AccountantTable.vue"
export default {
  name: "AccountantPage",
  components : {
      AppBar,
      AccountantTable
  },
  data: () => ({
  }),
};
</script>