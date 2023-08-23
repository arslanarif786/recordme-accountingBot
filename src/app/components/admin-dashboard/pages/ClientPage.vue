<template>
    <v-container>
      <AppBar />
      <ClientTable />
    </v-container>
  </template>
  
  <script>
  import AppBar from "../../layout/appbar/Appbar.vue"
  import ClientTable from "../datatable/ClientTable.vue"
  export default {
    name: "ClientView",
    components : {
        AppBar,
        ClientTable
    },
    data: () => ({
    }),
  };
  </script>

  