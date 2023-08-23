import axios from "axios";
import Vue from "vue";
import UrlServices from "@/services/Url";
const initialState = () => {
  return {
    tickets: [],
    faq: [],
    ticket: {},
    totalItems : "",
    search : "",
    status : 'All',
    page : "",
    messages : []
  };
};
const state = initialState();
const getters = {
  
  getMessages(state){
    return state.messages
  },
  getTickets(state) {
    return state.tickets;
  },
  getFaq(state) {
    return state.faq
  },
  getTicket(state) {
    return state.ticket
  },
  getTotalItems(state){
    return state.totalItems
  },
  getSearch(state){
    return state.search;
  },
  getStatus(state){
    return state.status;
  },
  getPage(state){
    return state.page
  }
}
const mutations = {
  addTickets(state, payload) {
    state.tickets = payload
  },
  updateFaq(state, value) {
    let foundIndex = state.faq.findIndex((x) => x._id == value._id);
    Vue.set(state.faq, foundIndex, value);
  },
  setFaq(state, value) {
    state.faq = value;
  },
  logout(state) {
    Object.assign(state, initialState());
  },
  setTicketAsReadable(state, payload) {
    Vue.set(state.faq, state.tickets.findIndex((x) => x.ticket_no == payload.ticket_no), payload);
  },
  setTotalItems(state,payload){
    state.totalItems = payload;
  },
  setStatus(state,payload){
    state.status = payload
  },
  setPage(state,payload){
    state.page = payload
  },
  setSearch(state,payload){
    state.search = payload
  },
  setTicket(state,payload){
    state.ticket = payload
  },
  setMessages(state,payload){
    state.messages = payload
  },
};

const actions = {
  getAllMessagesByTicketId({commit, rootState}, payload){
    const { authToken } = rootState.auth;
    return new Promise((resolve, reject) => {
      axios
        .get(`${UrlServices.getAllMessagesByTicketId}?ticketId=${payload.id}`, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((res) => {
          commit("setMessages", res.data.messages);
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  updateFaq({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      const body = {
        type: payload.type,
        questions: payload.questions,
      };
      axios
        .put(`${UrlServices.updateFaq}${payload._id}`, body, {
          headers: {
            Authorization: state.authToken,
          },
        })
        .then((res) => {
          commit("updateFaq", payload);
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  getFaq({ commit, state }) {
    return new Promise((resolve, reject) => {
      axios
        .get(UrlServices.getFaq, {
          headers: {
            Authorization: state.authToken,
          },
        })
        .then((res) => {
          commit("setFaq", res.data.data);
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  getTasks({ commit, rootState , state}, payload) {
    const obj = {
      page : payload,
      search : state.search,
      status : [state.status]
    }
    if(payload === undefined) obj['page'] = 1
    if(state.search.trim() === "") obj['search'] = null
    if(state.status === 'All') delete obj.status
    const { currentWorkspace, authToken } = rootState.auth;
    if(!currentWorkspace || currentWorkspace == {}) return;
    return new Promise((resolve, reject) => {
      axios
      .get(`${UrlServices.getTasks}${currentWorkspace["workspaceId"]}`, {
        params: obj,
        headers :  {
            Authorization: authToken,
        }
      })
        .then((res) => {
          const { tickets ,count} = res.data;
          if (tickets) {
            commit("addTickets", tickets)
            commit("setTotalItems", {count : count, pageNo : obj['page']})
            resolve(false);
          }
          resolve(true);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  setTicketAsReadable({ commit, rootState , state}, payload1 ,payload2){
    return new Promise((resolve, reject) => {
    const obj = {
      page : payload2,
      search : state.search,
      status : state.status,
    }
    if(payload2 === undefined) obj['page'] = 1
    if(state.search.trim() === "") obj['search'] = null
    if(state.status === 'All') obj['status'] = null  
    const { currentWorkspace, authToken } = rootState.auth;
    if(!currentWorkspace || currentWorkspace == {}) return; 
    axios.post(`${UrlServices.setTicketAsReadable}?workspaceId=${currentWorkspace["workspaceId"]}&status=${obj.status}&page=${obj.page}`,
            {
              ticketId: payload1._id,
            },
            {
              headers: {
                Authorization: authToken,
              },
            }
          )
          .then((res) => {
            const { tickets ,count} = res.data;
            if (tickets) {
              commit("addTickets", tickets)
              commit("setTotalItems", {count : count, pageNo : obj['page']})
              resolve(false);
            }
            resolve(true);
          })
          .catch((e) => {
            reject(e);
          });
    })
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
