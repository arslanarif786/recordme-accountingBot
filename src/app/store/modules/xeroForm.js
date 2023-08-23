import axios from "axios";
import UrlServices from "@/services/Url";
import EventBus from "@/js/EventBus";
import { xeroInvoices } from "@/constants/helper";
import { newInvoiceForm } from "@/constants/invoiceForm";
import Vue from "vue";

const initialState = () => {
  return {
    fromMLSide: {
      response: false,
      data: null
    },
    invoices: [],
    invoicesArr: [],
    pdfLink: "",
    attachementUrl: "",
    categories: "",
    workspaceId: "",
    draftCheck: false,
    skeletonLoader: true,
    isTicketAccountingSoftConnected: false,
    accountItems: [],
    allItems: [],
    xeroHashMaps: {
      accountsHashmap: { ids: {}, all: [] },
      itemsHashmap: { ids: {}, all: [] },
    },
    moreItems: [],
    allItemsUp: [],
    accountsUp: [],
    page: 1,
    totalItems: 10,
    noOfRecords: 10,
    totalItemsInList: 10,
  };
};
const state = initialState();
const getters = {
  getfromMLSide(state) {
    return state.fromMLSide
  },
  getDraftCheck(state) {
    return state.draftCheck;
  },
  getInvoices(state) {
    return state.invoices;
  },
  getPdfLink(state) {
    return state.pdfLink;
  },
  getAttachmentUrl(state) {
    return state.attachementUrl;
  },
  getCategories(state) {
    return state.categories;
  },
  getWorkspaceId(state) {
    return state.workspaceId;
  },
  getAccountItems(state) {
    return state.accountItems;
  },
  getXeroHashMaps(state) {
    return state.xeroHashMaps;
  },
  getAccountsUp(state) {
    return state.accountsUp;
  },
  getAllItems(state) {
    return state.allItems;
  },
  getMoreItems(state) {
    return state.moreItems;
  },
  getTotalItems(state) {
    return state.totalItems;
  },
  getNoOfRecords(state) {
    return state.noOfRecords;
  },
  getPage(state) {
    return state.page;
  },
  getSkeletonLoader(state) {
    return state.skeletonLoader;
  },
  getIsTicketAccountingSoftConnected(state) {
    return state.isTicketAccountingSoftConnected
  },
  getTotalItemsInList(state) {
    return state.totalItemsInList;
  }
};
const mutations = {
  setFromMLSide(state, payload) {
    state.fromMLSide = payload
  },
  setTotalItems(state, payload) {
    state.totalItems = payload;
  },
  setTotalItemsInList(state, payload) {
    state.totalItemsInList = payload;
  },
  setPage(state, payload) {
    state.page = payload;
  },
  setNoOfRecords(state, payload) {
    state.noOfRecords = payload;
  },
  addDraftCheck(state, checkValue) {
    state.draftCheck = checkValue;
  },
  setSkeletonLoader(state, payload) {
    state.skeletonLoader = payload;
  },
  addNewInvoice(state, invoiceObj) {
    state.invoices.invoices.push(invoiceObj);
  },
  removeInvoiceForm(state, index) {
    state.invoices.invoices.splice(index, 1);
  },
  logout(state) {
    Object.assign(state, initialState());
  },
  setPdfLink(state, value) {
    state.pdfLink = value;
  },
  setAttachementUrl(state, value) {
    state.attachementUrl = value;
  },
  addInvoices(state, payload) {
    Vue.set(state, "invoices", payload);
  },
  addCategories(state, payload) {
    state.categories = payload;
  },
  setWorkspaceId(state, workspaceId) {
    state.workspaceId = workspaceId;
  },
  performActionOnInvoiceTypeChanged(state, index) {
    if (
      state.invoices.invoices &&
      state.invoices.invoices[index] &&
      Array.isArray(state.invoices.invoices[index].lineItems)
    ) {
      const lineItems = state.invoices.invoices[index].lineItems.map((el) => {
        delete el.taxAmount;
        el.taxType = "NONE";
      });
    }
  },
  setAccountsToXero(state, payload) {
    state.accountsUp = payload;
  },
  setAccountItems(state, payload) {
    state.accountItems = payload;
  },
  addAccountItems(state, payload) {
    if (Array.isArray(payload) && payload[0])
      state.accountItems.unshift(payload[0]);
  },
  setAllItems(state, payload) {
    state.allItems = payload;
  },
  addMoreItems(state, payload) {
    if (payload.reset) {
      state.moreItems = payload.response;
      state.allItemsUp = payload.response;
    }
    else {
      state.allItemsUp = state.moreItems.concat(payload.response);
      state.moreItems = state.allItemsUp;
    }
  },
  addNewItem(state, payload) {
    state.allItems.unshift(payload);
  },
  setAccountItemsHashMaps(state, accounts) {
    const accountsHashmap = { ids: {}, all: [] };
    const itemsHashmap = { ids: {}, all: [] };

    if (accounts) {
      /**
       * Making hashmap for all Accounts
       */
      accounts.forEach((account) => {
        accountsHashmap.ids[account._id] = {
          name: account.accountName,
          items: account.itemIds,
          type: account.accountType,
        };
        accountsHashmap.all.push({
          id: account._id,
          name: account.accountName,
          type: account.accountType,
        });
      });

      /**
       * Making hashmap for all Items
       */
      for (const key in accountsHashmap.ids) {
        const account = accountsHashmap.ids[key];
        account.items = account.items.map((item) => {
          if (!itemsHashmap.ids[item._id]) {
            const accountNamesAndIds = item.accountIds.map((accountId) => ({
              name: accountsHashmap.ids[accountId]?.name,
              id: accountId,
              type: accountsHashmap.ids[accountId]?.type,
            }));
            itemsHashmap.ids[item._id] = {
              name: item.itemName,
              accounts: accountNamesAndIds,
            };
            itemsHashmap.all.push({ name: item.itemName, id: item._id });
          }
          return { name: item.itemName, id: item._id };
        });
      }

      state.xeroHashMaps = {
        accountsHashmap: accountsHashmap,
        itemsHashmap: itemsHashmap
      }
    } else
      (state.xeroHashMaps = {
        accountsHashmap: { ids: {}, all: [] },
        itemsHashmap: { ids: {}, all: [] },
      }),
        console.log(
          "store hashmap>>",
          state.xeroHashMaps.itemsHashmap,
          state.xeroHashMaps.accountsHashmap
        );
  },
  setXeroKeys(state, invoices) {
    state.invoicesArr = [];
    for (let index = 0; index < invoices.length; ++index) {
      const invoiceObj = {};
      const invoice = invoices[index];

      invoiceObj['address'] = invoice['address'] ? invoice['address'] : '';
      invoiceObj['name'] = invoice['name'] ? invoice['name'] : '';
      invoiceObj['invoiceNumber'] = invoice['invoiceNumber'] ? invoice['invoiceNumber'] : '';
      invoiceObj['email'] = invoice['email'] ? invoice['email'] : '';
      invoiceObj['date'] = invoice['date'] ? invoice['date'] : '';
      invoiceObj['dueDate'] = invoice['dueDate'] ? invoice['dueDate'] : '';
      invoiceObj['expectedPaymentDate'] = invoice['expectedPaymentDate'] ? invoice['expectedPaymentDate'] : '';
      invoiceObj['plannedPaymentDate'] = invoice['plannedPaymentDate'] ? invoice['plannedPaymentDate'] : '';
      invoiceObj['type'] = invoice['type'] ? invoice['type'] : '';
      invoiceObj['invType'] = invoice['invType'] ? invoice['invType'] : '';
      invoiceObj['brandingThemeID'] = invoice['brandingThemeID'] ? invoice['brandingThemeID'] : '';
      invoiceObj['lineAmountTypes'] = invoice['lineAmountTypes'] ? invoice['lineAmountTypes'] : '';
      invoiceObj['status'] = invoice['status'] ? invoice['status'] : '';
      invoiceObj['currencyCode'] = invoice['currencyCode'] ? invoice['currencyCode'] : '';
      invoiceObj['subTotal'] = invoice['subTotal'] ? invoice['subTotal'] : '';
      invoiceObj['totalTax'] = invoice['totalTax'] ? invoice['totalTax'] : '';
      invoiceObj['total'] = invoice['total'] ? invoice['total'] : '';
      invoiceObj['reference'] = invoice['reference'] ? invoice['reference'] : '';
      if (invoice['url']) invoiceObj['url'] = invoice['url'];

      invoiceObj['lineItems'] = invoice.lineItems.map((ele) => {
        // Type is ACCPAY
        if(invoice['type'] === 'ACCPAY') {
          return ({
            itemCode: ele.itemCode ? ele.itemCode : '',
            description: ele.description ? ele.description : '',
            quantity: ele.quantity ? ele.quantity : 0,
            unitAmount: ele.unitAmount ? ele.unitAmount : 0,
            taxAmount: ele.taxAmount ? ele.taxAmount : 0,
            accountCode: ele.accountCode ? ele.accountCode : '',
            taxType: ele.taxType ? ele.taxType : '',
            lineAmount: ele.lineAmount ? ele.lineAmount : 0,
          })
        }
        else {
        return ({
          itemCode: ele.itemCode ? ele.itemCode : '',
          description: ele.description ? ele.description : '',
          quantity: ele.quantity ? ele.quantity : 0,
          unitAmount: ele.unitAmount ? ele.unitAmount : 0,
          disc: ele.disc ? ele.disc : 0,
          discountRate: ele.discountRate ? ele.discountRate : 0,
          taxAmount: ele.taxAmount ? ele.taxAmount : 0,
          accountCode: ele.accountCode ? ele.accountCode : '',
          taxType: ele.taxType ? ele.taxType : '',
          lineAmount: ele.lineAmount ? ele.lineAmount : 0,
        })
      }
      })

      state.invoicesArr.push(invoiceObj);
      state.invoices.invoices = state.invoicesArr;
    }
  },
  setInvoiceArr(state, payload) {
    state.invoicesArr = payload;
  },
  setIsTicketAccountingSoftConnected(state, payload) {
    state.isTicketAccountingSoftConnected = payload;
  }
};

const actions = {
  // Action to get invoices with attachments in ticket
  async getInvoices({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit("setWorkspaceId", payload.workspaceId);
      axios
        .get(
          `${UrlServices.getInvoices}?fileUrl=${payload.url}&botToken=${payload.token}`
        )
        .then(async (res) => {
          let { invoices } = res.data;
          commit("setFromMLSide", {
            response: true,
            data: JSON.parse(JSON.stringify(invoices))
          })
          if (!Array.isArray(invoices.invoices)) invoices = JSON.parse(JSON.stringify(newInvoiceForm));
          await xeroInvoices(payload, invoices, rootState);
          console.log(invoices);
          commit("addInvoices", invoices);
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },

  // Action to get invoices without attachments in ticket
  async getInvoicesWithoutAttachment({ commit, rootState }, payload) {
    commit("setWorkspaceId", payload.data.workspaceId);
    await xeroInvoices(payload.data, payload.invoice, rootState);
    commit("addInvoices", payload.invoice);
    return;
  },

  /**
   *  Action to submit invoices on Xero
   */
  async submitInvoices({ commit, rootState, state, dispatch }, payload) {
    const percentLookupRegex = /^%|%$/g;
    let inv = JSON.parse(JSON.stringify(state.invoices));
    let draft = JSON.parse(JSON.stringify(state.invoices));
    let invoices = inv.invoices;
    // Declare hashmaps for unique Items and unique Accounts
    // Declare empty arrays for unique Items and unique Accounts
    const uniqueAccountsHashMap = {},
      uniqueAccounts = [];
    for (let i = 0; i < invoices.length; i++) {
      console.log(uniqueAccounts);
      const { subTotal, totalTax, total, ...ele } = invoices[i];
      ele.name = ele.hasOwnProperty("name") ? ele.name : "";
      /**
       * xeroform header fields validations here
       */
      if (!ele.invoiceNumber) {
        return Promise.reject(`Invoice number is required`);
      }
      if (!ele.name) {
        return Promise.reject(`Name is required`);
      }
      if (!ele.date) {
        return Promise.reject(`Created at is required`);
      }
      if (!ele.dueDate) {
        return Promise.reject(`Due date is required`);
      }
      // xeroform header fields validations END

      if (Array.isArray(ele.lineItems)) {
        for (
          let lineItemIndex = 0;
          lineItemIndex < ele.lineItems.length;
          lineItemIndex++
        ) {
          const r = ele.lineItems[lineItemIndex];
          /**
           * Remove the duplication of all accounts with user accounts
           * and add the unique accounts in uniqueAccounts array
           */
          if (
            r.accountCode?.name &&
            !uniqueAccountsHashMap[r.accountCode.name]
          ) {
            uniqueAccounts.push({
              name: r.accountCode.name,
              type: r.accountCode.type,
            });
            uniqueAccountsHashMap[r.accountCode.name] = true;
          }
          console.log("uniqueAccounts and uniqueItems>>>", uniqueAccounts);

          // xeroform lineitems accountCode & itemCode validations here
          if (r.itemCode && !r.accountCode) {
            r.itemCode = ''
            // EventBus.$emit("show-snackbar", {
            //   text: "Account code is required",
            //   type: "error",
            // });
            // return Promise.reject(`Account code is required`);
          }

          /**
           * xeroform lineitems validations here
           */
          if (!r.description) {
            return Promise.reject(`Description is required`);
          }
          r.disc == "" ? (r.disc = 0) : r.disc;
          r.taxAmount == "" ? (r.taxAmount = 0) : r.taxAmount;
          if (!r.quantity) {
            return Promise.reject(`Quantity is required`);
          }
          if (!r.unitAmount) {
            return Promise.reject(`Unit Price is required`);
          }
          // xeroform lineitems validations END

          if (r.itemCode === "") delete r["itemCode"];
          r["taxAmount"] =
            typeof r["taxAmount"] === "string"
              ? r["taxAmount"].replace(percentLookupRegex, "")
              : r["taxAmount"];
          if (ele.type == "ACCREC") {
            r["discountRate"] =
              typeof r.disc === "string"
                ? r.disc.replace(percentLookupRegex, "")
                : r.disc;
          } else {
            delete r["taxRate"];
            delete r["discountRate"];
            delete r.disc;
          }
        }
      } else ele.lineItems = [];

      /**
       * xeroform footer fields validations here
       */
      if (!ele.currencyCode) {
        return Promise.reject(`Currency is required`);
      }
      // xeroform footer fields validations END
    }
    let userAccountsHashMapNameToCode = {};
    // Dispatch createAccountsToXero API here to get user's accounts name to code
    if (uniqueAccounts.length) {
      userAccountsHashMapNameToCode = await dispatch(
        "createAccountsToXero",
        uniqueAccounts
      );
      EventBus.$emit("show-snackbar", {
        text: "Checked Accounts",
        type: "success",
      });
    }

    // Display snackbar "Accounts are created to Xero"
    const uniqueItems = [],
      uniqueItemsHashMap = {};
    for (let i = 0; i < invoices.length; i++) {
      const { lineItems } = invoices[i];
      if (Array.isArray(lineItems)) {
        for (
          let lineItemIndex = 0;
          lineItemIndex < lineItems.length;
          lineItemIndex++
        ) {
          const currentLineItem = lineItems[lineItemIndex];
          console.log("curentLineItems>>>", currentLineItem);
          /**
           * Conversion of accounts code to item names
           */
          if (currentLineItem.accountCode) {
            currentLineItem.accountCode =
              userAccountsHashMapNameToCode[currentLineItem.accountCode.name];
          }
          /**
           * Remove the duplication of all items with user items
           * and add the unique items in uniqueItems array
           */
          if (
            currentLineItem.itemCode &&
            !uniqueItemsHashMap[currentLineItem.itemCode]
          ) {
            uniqueItems.push({
              name: state.xeroHashMaps.itemsHashmap.ids[
                currentLineItem.itemCode
              ]?.name,
              code: `bot-${currentLineItem.itemCode}`,
              // salesDetails: {
              //   accountCode: currentLineItem.accountCode,
              // },
            });
            uniqueItemsHashMap[currentLineItem.itemCode] = true;
            // Fixed 'price List Item Code must not be more than than 30 characters long'
            if(currentLineItem?.itemCode?.includes("bot-bot-")) {
              currentLineItem.itemCode = currentLineItem.itemCode.slice(4);
            }
          }
          /**
           * Conversion of `itemCode` to `bot-itemCode`
           */
          if (currentLineItem.itemCode)
            currentLineItem.itemCode = `bot-${currentLineItem.itemCode}`;
            // Fixed 'price List Item Code must not be more than than 30 characters long'
            if(currentLineItem?.itemCode?.includes("bot-bot-")) {
              currentLineItem.itemCode = currentLineItem.itemCode.slice(4);
            }
        }
      }
    }

    // Fixed 'price List Item Code must not be more than than 30 characters long'
    uniqueItems.forEach((ele) => {
      if(ele?.code?.includes("bot-bot-")){
          ele.code = ele.code.slice(4);
      }
    })

    // trim the contact name in the invoices
    // as xero does not accept whitespace from both sides of a contact name
    invoices.forEach((e) => {
      let trimContactName = '';
      trimContactName = e.name.trim();
      e.name = trimContactName;

      // Here sets the formats of the lineItem fields
      e.lineItems.forEach((el) => {
        el.quantity = parseFloat(el.quantity);
        el.unitAmount = parseFloat(el.unitAmount);
        el.disc = parseFloat(el.disc);
        el.taxAmount = parseFloat(el.taxAmount);
        el.lineAmount = parseFloat(el.lineAmount);
      })
      e.subTotal = parseFloat(e.subTotal);
      e.totalTax = parseFloat(e.totalTax);
      e.total = parseFloat(e.total);
    })

    // create copy of permanent Xero keys that have to pass as payload
    commit('setXeroKeys', invoices);

    // return promise to submit invoices on Xero
    return axios
      .post(
        `${UrlServices.submitInvoices}${payload.workspaceId}`,
        { invoices: state.invoices.invoices, ticketId: payload._id, draft: { invoices : state.invoices.invoices }, items: uniqueItems },
        { headers: { Authorization: rootState.auth.authToken } }
      )
      .catch((e) => {
        throw e?.response?.data?.message
          ? e.response.data.message
          : "Error occurred";
      });
  },

  // Action to get Account Items
  async getAccountItems({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${UrlServices.getAccountItems}?page=${payload ? payload.page : ""
          }&size=${payload ? payload.size : ""}&search=${payload && payload.search && payload.isAdmin ? payload.search : ""
          }`
        )
        .then(async (res) => {
          if (payload.isAdmin) {
            commit("setAccountItems", res.data.data);
          } else {
            commit("setAccountItemsHashMaps", res.data.data);
            commit("setPage", payload.page);
          }
          commit("setTotalItems", res.data.count);
          commit("setNoOfRecords", res.data.noOfRecords);
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },

  // Action to get all account items without pagination
  getTotalAccountItems({ commit }) {
    return axios.get(UrlServices.getTotalAccountItems)
      .then((res) => {
        commit("setAccountItemsHashMaps", res.data.data);
      })
      .catch((e) => {
        console.log(e)
      });
  },

  // Action to create AccountsToXero
  async createAccountsToXero({ commit, rootState, state }, payload) {
    return axios
      .put(
        `${UrlServices.createAccountsToXero}/${state.workspaceId}`,
        {
          accounts: payload,
        },
        { headers: { Authorization: rootState.auth.authToken } }
      )
      .then((response) => response.data);
  },

  // Action to create Account Items
  async createAccountItems({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${UrlServices.createAccountItems}`,
          { accounts: [payload], populate: true },
          { headers: { Authorization: rootState.auth.authToken } }
        )
        .then((res) => {
          commit("addAccountItems", res.data.data);
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },

  // Action to get Account to Db
  async getAccountsToDb({ commit, state }) {
    return axios
      .get(`${UrlServices.mapAccountsTodb}/${state.workspaceId}`)
      .then((res) => {
        console.log("res accounts to DB>>>>", res.data);
      })
      .catch((e) => {
        console.log("error>>", e);
      });
  },

  // Action to update Account Items
  async updateAccountItems({ commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.updateAccountItems, payload, {
          headers: { Authorization: rootState.auth.authToken },
        })
        .then((response) => {
          console.log("updateAccountItems response>>>", response.data);
          resolve(true);
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        });
    });
  },

  // Action to get Items from Xero
  async getItemsFromXero({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `${UrlServices.getItemsFromXero}?page=${payload.page}&size=${payload.size
          }&search=${payload.search ? payload.search : ""}`
        )
        .then((res) => {
          if (payload.moreItems) {
            commit("addMoreItems", { response: res.data.data, reset: false });
            commit("setPage", payload.page);
            commit("setTotalItemsInList", res.data.metadata[0].total);
          }
          if (payload?.changeCounter && res.data.metadata[0]) {
            commit("setTotalItems", res.data.metadata[0].total);
            commit("setNoOfRecords", res.data.metadata[0].noOfRecords);
          }
          if (res.data.metadata.length === 0) {
            const obj = { total: 0, noOfRecords: 0 };
            commit("setTotalItems", obj.total);
            commit("setNoOfRecords", obj.noOfRecords);
          }
          else if (!payload.moreItems) commit("setAllItems", res.data.data);
          resolve(true);
        })
        .catch((e) => {
          console.log("error>>", e);
          reject(e);
        });
    });
  },

  // Action to create Items to Xero
  createitemsToXero({ commit, rootState }, payload) {
    return axios
      .post(
        UrlServices.createitemsToXero,
        { itemName: payload },
        { headers: { Authorization: rootState.auth.authToken } }
      )
      .then((res) => {
        commit("addNewItem", res.data.data);
      });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
