<template>
    <div>
      <SnackBar />
      <NavigationBar />
      <ClientPage />
    </div>
  </template>
  
  <script>
  import EventBus from "@/js/EventBus"
  import SnackBar from "../../common/snackbar/Snackbar.vue"
  import NavigationBar from "../../app/components/layout/navigation-bar/NavigationBar.vue"
  import ClientPage from "../../app/components/admin-dashboard/pages/ClientPage.vue"
  export default {
    name: "ClientView",
    components: {
      SnackBar,
      NavigationBar,
      ClientPage
    },
    mounted() {
      this.$store.dispatch("auth/getUsers");
    },
    data: () => ({
  
    }),
    computed: {
  
    },
    methods: {
    },
  
  };
  </script>
  
  <style scoped>
  .font-style {
    font-family: Lato !important;
  }
  
  .font-style-paragraph {
    font-family: Lato !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    text-align: center;
  }
  
  .font-style-heading {
    font-family: Lato !important;
    font-size: 32px !important;
    font-weight: 800 !important;
    font-style: normal;
  }
  
  .default-input {
    border: solid 1px #ebeef7;
    border-radius: 5px;
    height: 50px;
    width: 411px;
    font-size: 13px;
    font-family: Lato !important;
  }
  
  ::v-deep .v-input--is-focused {
    border: 1px solid var(--v-appColor-base) !important;
  }
  
  .bg {
    width: 47.6vw;
    min-height: 96vh;
    position: absolute;
    top: 0;
    left: 0;
    background: url('../../assets/login/image.png') no-repeat center center;
    background-size: cover;
    transform: scale(1.1);
  }
  
  ::v-deep .v-input__append-outer .v-icon,
  .v-input__prepend-outer .v-icon {
    margin-left: 20px !important;
  }
  
  ::v-deep .v-btn__content {
    letter-spacing: 0.2px !important;
  }
  </style>
  