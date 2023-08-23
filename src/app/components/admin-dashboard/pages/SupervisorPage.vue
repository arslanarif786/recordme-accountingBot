<template>
    <v-container>
      <AppBar />
      <SupervisorTable />
    </v-container>
  </template>
  
  <script>
  import AppBar from "../../layout/appbar/Appbar.vue"
  import SupervisorTable from "../datatable/SupervisorTable.vue"
  export default {
    name: "SupervisorPage",
    components : {
        AppBar,
        SupervisorTable
    },
    data: () => ({
    }),
  };
  </script>