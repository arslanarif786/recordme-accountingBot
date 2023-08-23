<template>
  <v-container>
    <AppBar />
    <WorkspaceTable />
    
  </v-container>
</template>

<script>
import AppBar from "../../layout/appbar/Appbar.vue"
import WorkspaceTable from "../datatable/WorkspaceTable.vue"
export default {
  name: "MainPage",
  components : {
      AppBar,
      WorkspaceTable
  },
  data: () => ({
  }),
};
</script>