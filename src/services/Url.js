const UrlServices = {
    //auth.js
    login : "/login",
    resendEmail : "/signup/resend-email/",
    signUp : "/signup/",
    selectWorkspace : "/workspace/by-id/",
    getUsers : "/user/",
    getWorkspaces : "/workspace/",
    getTickets : "/ticket",
    getWorkspacesForSpecificUser : "/user-workspaces/by-user-id",
    forgotPassword : "/forget-password",
    resetPassword : "/reset-password",
    //ticket.js
    getAllMessagesByTicketId : "message/by-ticket-id",
    updateFaq : "faq/",
    getFaq : "faq",
    getTasks : "ticket/by-workspace-id/",
    setTicketAsReadable : "ticket/mark-as-read",
    //user.js
    addUserWorkspaces: "/user-workspaces/assign-user",
    getworkspacesWithFilter : "workspace/by-filter/",
    getWorkspaces : "workspace/",
    createUser : "/user/",
    deleteUser : "/user/",
    unAssignWorkspace : "/user-workspaces/unassign-user",
    updateSupervisor: "/user/supervisor/update-profile",
    //xeroForm.js
    getInvoices : "xero/ocr/fileUrl",
    submitInvoices :"/xero/submit/",
    // Verification.vue
    verification : "signup/verify",
    //ListAllinWorkspace.vue
    ListAllinWorkspace: "/user-workspaces/by-workspace-id-and-role",
    // DataTable.vue
    getTicketDetails : "ticket/by-id/",
    //CompleteStatusDialog.vue
    changeStatus : "ticket/update-status/",
    //CreateTicket.vue
    createTicket : "ticket/",
    ticketTypes : "/ticket-types/",
    // CreateWorkspace.vue
    createWorkspace : 'workspace/',
    //TicketDetails.vue
    slack : "slack",
    // TicketDetailsFooter
    sendMessage: "slack/add-message/", 
    //Reroute ticket 
    getActiveSupervisorsForSpecificWorkspace : "/user-workspaces/get-supervisors",
    rerouteTicketToSupervisor : "ticket/route-supervisor",
    getActiveAccountantsForSpecificWorkspace : "/user-workspaces/get-accountants",
    rerouteTicketToAccountant : "ticket/route-accountant",
    // Update Ticket  Type 
    changeRequestType : "ticket/update-type/",
    // Update User Type (Public, Specific)
    updateUserType : "/user/update-type",
    // Update Workspace  Type (Public, Specific)
    updateWorkspaceType : "/workspace/update-type",
    // Xeroform Get Categories
    getWorkspaceCategories : "xero/get-categories",
    // Xeroform Get Accounts
    getAccounts : "/xero/get-accounts",
    // Xeroform Get Items
    getItems : "/xero/get-items",
    // Xeroform Get tax rates
    getTaxRates : "/xero/get-tax-rates",
    // Xeroform Get Paid Invoices
    getPaymentApprovalInvoices : "/xero/invoices",
    // Xeroform Get Paid Invoices
    submitInvoicePayment : "/xero/invoices/payments",
    // Draft API's 
    saveTicketDraft : "ticket/draft",
    // Get Accounts and Items
    getAccountItems : "xero/items-accounts",
    // Get Accounts and Items without pagination
    getTotalAccountItems : "xero/total-items-accounts",
    // Create Accounts and Items
    createAccountItems : "xero/create-items-accounts",
    // Update Accounts and Items
    updateAccountItems : "xero/update-item-account",
    // Create Accounts to Xero
    createAccountsToXero : "xero/create-accounts-to-xero",
    // get Accounts to db
    mapAccountsTodb : "xero/map-xero-accounts-to-db",
    // get items from xero
    getItemsFromXero : "xero/fetch-items",
    // create items to xero
    createitemsToXero: "xero/create-item"
};
  
export default UrlServices;