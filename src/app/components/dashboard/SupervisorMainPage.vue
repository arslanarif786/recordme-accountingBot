<template>
    <v-container>
      <AppBar />
      <DataTable />
      
    </v-container>
  </template>
  
  <script>
  import AppBar from "../layout/appbar/Appbar.vue"
  import DataTable from "./datatable/DataTableSupervisor.vue"
  export default {
    name: "SupervisorMainPage",
    components : {
        AppBar,
        DataTable
    },
    data: () => ({
    }),
  };
  </script>