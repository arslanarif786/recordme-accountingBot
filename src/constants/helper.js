import UrlServices from "@/services/Url";
import EventBus from "@/js/EventBus";
import axios from "axios";
import store from "@/app/store";

/**
 * This function sets the not available lineitems
 * @param {*} item 
 */
function setnotAvailableLineItems(item) {
  if (!item.description) item.description = ""
  if (!item.unitAmount) item.unitAmount = 0
  if (!item.quantity) item.quantity = 0
  if (!item.taxAmount) item.taxAmount = 0
  if (!item.disc) item.disc = 0
}

/**
 * This function sets the formats of the lineItem
 * @param {*} item 
 */
 function setAvaiableLineItemsFormat(item) {
  if (typeof item.quantity === 'string') item.quantity = parseFloat(item.quantity);
  if (typeof item.unitAmount === 'string') item.unitAmount = parseFloat(item.unitAmount);
  if (typeof item.disc === 'string') item.disc = parseFloat(item.disc);
  if (typeof item.taxAmount === 'string') item.taxAmount = parseFloat(item.taxAmount);
  if (typeof item.lineAmount === 'string') item.lineAmount = parseFloat(item.lineAmount);
}

/**
 *
 * @param {*} payload
 * @param {*} invoices
 * @param {*} rootState
 * Helper method to fetch categories from Xero and prepare array for Xero invoice form
 */
export const xeroInvoices = async (payload, invoices, rootState) => {
  if(rootState.xeroForm.isTicketAccountingSoftConnected) {
  var resCat;
  // getCategories
  await axios
    .get(`${UrlServices.getWorkspaceCategories}/${payload.workspaceId}`, {
      headers: {
        Authorization: rootState.auth.authToken,
      },
    })
    .then((resCate) => {
      resCat = resCate;
      store.commit("xeroForm/addCategories", resCate.data);
    })
    .catch((e) => {
      EventBus.$emit("show-snackbar", {
        text: e.response.data.message,
        type: "error",
      });
    });
  }  

  invoices["request_type"] = rootState.ticket.ticket.requestType;
  invoices["ticket_id"] = rootState.ticket.ticket.ticketId;
  invoices.invoices = invoices.invoices.map((v) => {
    // set date format
    if (typeof v.date === "string") setDate(v, 'date');
    if (typeof v.dueDate === "string") setDate(v, 'dueDate');

    if (!v.lineItems) {
      let obj = {
        description: "",
        unitAmount: 0,
        quantity: 0,
        taxAmount: 0,
        lineAmount: 0,
        disc: 0,
      };
      v["lineItems"] = [obj];
    }
    if (resCat?.data.trackingCategories.length != 0 && v.lineItems) {
      // creating an array for categories//
      v.lineItems = v?.lineItems.map((item) => {
        let result = resCat?.data.trackingCategories.map((a) => {
          return {
            trackingCategoryID: a.trackingCategoryID,
            trackingOptionID: "",
          };
        });
        setnotAvailableLineItems(item);
        // end creation of an array
        return {
          ...item,
          tracking: result,
          itemCode: "",
          accountCode: "",
          taxType: "",
        };
      });
    } else if (v.lineItems) {
      v.lineItems = v?.lineItems.map((item) => {
        setnotAvailableLineItems(item);
        setAvaiableLineItemsFormat(item);
        return {
          ...item,
          itemCode: "",
          accountCode: "",
          taxType: "",
        };
      });
    }

    if (v.type) return { ...v, status: "DRAFT" };
    else
      return {
        ...v,
        status: "DRAFT",
        type: "ACCREC",
        lineAmountTypes: "Exclusive",
      };
  });
  store.commit("xeroForm/setSkeletonLoader", false);
};

/**
 * This function takes in two arguments, an object and a key. 
 * It assumes that the value associated with the key is a string 
 * in the format "YYYY-MM-DD", "DD-MM-YYYY" or something else. 
 * It validates the string and modifies the object accordingly.
 * If the condition is true, it reverses the order of the fields and joins them together with "-".
 * @param {*} passedObject 
 * @param {*} passedKey 
 */
function setDate(passedObject, passedKey) {
  var fields = passedObject[passedKey].split("-");
  if (
    typeof fields[2] === "string" &&
    fields[0].length == 4 &&
    fields[1].length == 2 &&
    fields[2].length == 2
  ) {
    console.log("right type");
  } else if (
    typeof fields[2] === "string" &&
    fields[0].length == 2 &&
    fields[1].length == 2 &&
    fields[2].length == 4
  )
    passedObject[passedKey] = fields.reverse().join("-");
  else {
    passedObject[passedKey] = null;
    passedObject[`validation${passedKey}`] = true;
  }
}
