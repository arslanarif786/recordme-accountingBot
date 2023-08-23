<template>
  <v-container>
    <AppBar />
    <TicketTable />
    
  </v-container>
</template>

<script>
import AppBar from "../../layout/appbar/Appbar.vue"
import TicketTable from "../datatable/TicketTable.vue"
export default {
  name: "MainPage",
  components : {
      AppBar,
      TicketTable
  },
  data: () => ({
  }),
};
</script>