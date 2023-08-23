import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../../views/auth/Login.vue";
import ForgotPassword from "../../views/auth/ForgotPassword.vue";
import ChangePassword from "../../views/auth/ChangePassword.vue";
import SignUp from "../../views/auth/SignUp.vue";
import Verification from "../../views/auth/Verification.vue";
import Dashboard from "../../views/dashboard-layout/Dashboard.vue";
import SupervisorTicketpool from "../../views/dashboard-layout/SupervisorTicketpool.vue";
import AdminDashboard from "../../views/admin-dashboard-layout/AdminDashboard.vue";
import AccountantView from '../../views/admin-dashboard-layout/AccountantView.vue'
import ClientView from '../../views/admin-dashboard-layout/ClientView.vue'
import WorkspaceView from '../../views/admin-dashboard-layout/WorkspaceView.vue'
import Tickets from '../../views/admin-dashboard-layout/Tickets.vue'
import Supervisor from '../../views/admin-dashboard-layout/Supervisor.vue'
import AccountNameAndType from '../../views/admin-dashboard-layout/AccountNameAndType.vue'
import AllAccountsItems from '../../views/admin-dashboard-layout/AllAccountsItems.vue'
import XeroForm from '../components/xero-form/index.vue'
import store from "../store/index"

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(token) next();
      if (token) {
        if (role === "superadmin") next({ name: "Accountants" });
        else next({ path: "/" });
      } 
      else next();
    },
    meta: {
      name: "AccountingBot",
    },
  },
  // {
  //   path: "/forgot-password",
  //   name: "ForgotPassword",
  //   component: ForgotPassword,
  //   meta: {
  //     name: "AccountingBot",
  //   },
  // },
  // {
  //   path: "/change-password",
  //   name: "ChangePassword",
  //   component: ChangePassword,
  //   meta: {
  //     name: "AccountingBot",
  //   },
  // },
  // {
  //   path: "/register",
  //   name: "SignUp",
  //   component: SignUp,
  //   meta: {
  //     name: "AccountingBot",
  //   },
  // },
  // {
  //   path: "/verification/:token",
  //   name: "Verification",
  //   component: Verification,
  //   meta: {
  //     name: "AccountingBot",
  //   },
  // },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(!token) next({name : "Login"});
      else if (role !== "superadmin") next();
      else next({ name: "Accountants" });
    },
  },
  {
    path: "/accountants",
    name: "Accountants",
    component: AccountantView,
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(!token) next({name : "Login"})
      else if (role === "superadmin") next();
      else next({ name: "Dashboard" });
    },
  },
  {
    path: "/clients",
    name: "Clients",
    component: ClientView,
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(!token) next({name : "Login"});
      else if (role === "superadmin") next();
      else next({ name: "Dashboard" });
    },
  },
  
  {
    path: "/workspaces",
    name: "Workspaces",
    component: WorkspaceView,
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(!token) next({name : "Login"});
      else if (role === "superadmin") next();
      else next({ name: "Dashboard" });
    },
  },
  {
    path: "/tickets",
    name: "Tickets",
    component: Tickets,
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(!token) next({name : "Login"});
      else if (role === "superadmin") next();
      else next({ name: "Dashboard" });
    },
  },
  {
    path: "/supervisor",
    name: "Supervisor",
    component: Supervisor,
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(!token) next({name : "Login"});
      else if (role === "superadmin") next();
      else next({ name: "Dashboard" });
    },
  },
  {
    path: "/all-items",
    name: "AllAccountsItems",
    component: AllAccountsItems,
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(!token) next({name : "Login"});
      else if (role === "superadmin") next();
      else next({ name: "Dashboard" });
    },
  },
  {
    path: "/account-items",
    name: "ItemsAndAccounts",
    component: AccountNameAndType,
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(!token) next({name : "Login"});
      else if (role === "superadmin") next();
      else next({ name: "Dashboard" });
    },
  },

  {
    path: '*',
    name: 'Remaining Routes',
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(!token) next({name : "Login"});
      else if (role !== "superadmin") next({name : "Dashboard"});
      else next({ name: "Accountants" });
    },
    meta: {
      name: "AccountingBot",
    },
  },
  {
    path: "/supervisor-ticketpool",
    name: "SupervisorTicketpool",
    component: SupervisorTicketpool,
    beforeEnter: (to, from, next) => {
      const token = store.getters["auth/getAuthToken"];
      const role = store.getters["auth/getUserRole"];
      if(!token) next({name : "Login"});
      else if (role === "superadmin") next({name : "Accountants"});
      else if (role === "supervisor") next();
      else next({name : "Dashboard"});
    },
  },
  // {
  //   path: "/xero-form",
  //   name: "XeroForm",
  //   component: XeroForm,
  //   beforeEnter: (to, from, next) => {
  //     const role = store.getters["auth/getUserRole"];
  //     if (role !== "superadmin") next();
  //     else next({ name: "admindashboard" });
  //   },
  //   meta: {
  //     name: "AccountingBot",
  //     auth: true,
  //   },
  // },
  // {
  //   path: "/xero",
  //   name: "Xero",
  //   component: XeroView,
  //   beforeEnter: (to, from, next) => {
  //     const role = store.getters["auth/getUserRole"];
  //     if (role === "superadmin") next();
  //     else next({ name: "dashboard" });
  //   },
  //   meta: {
  //     name: "AccountingBot",
  //     auth: true,
  //   },
  // },
  
  // {
  //   path: "/admindashboard",
  //   name: "AdminDashboard",
  //   component: AdminDashboard,
  //   beforeEnter: (to, from, next) => {
  //     const role = store.getters["auth/getUserRole"];
  //     if (role === "superadmin") next({ name: "users" });
  //     else next({ name: "dashboard" });
  //   },
  //   meta: {
  //     name: "AccountingBot",
  //     auth: true,
  //   },
  // },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const token = store.getters["auth/getAuthToken"];
//   const role = store.getters["auth/getUserRole"];
//   if (to.meta.auth) {
//     if (token) next();
//     else next({ name: "Login" });
//   } else {
//     if (token) {
//       if (role === "superadmin") next({ name: "Users" });
//       else next({ name: "Dashboard" });
//     } else next();
//   }
// });

export default router;
