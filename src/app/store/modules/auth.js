// import apiService from "@/services/Api";
import axios from "axios";
import router from "../../router";
import UrlServices from "@/services/Url";
import socket from "@/constants/socket-io/SocketIo";
axios.defaults.withCredentials = true;

const initialState = () => {
  return {
    authToken: "",
    user: {},
    workspaces: [],
    users: [],
    tickets: {},
    currentWorkspace: {},
    onlineStatus: false,
  };
};
const state = initialState();
const getters = {
  getAuthToken(state) {
    return state.authToken;
  },
  getUser(state) {
    return state.user;
  },
  getTickets(state) {
    return state.tickets;
  },
  getUserRole(state) {
    return state.user.role;
  },
  getUsers(state) {
    return state.users;
  },
  getAccountantUsers(state) {
    return state.users.filter((item) => item.role === "accountant");
  },
  getSupervisorUsers(state) {
    return state.users.filter((item) => item.role === "supervisor");
  },
  getClientUsers(state) {
    return state.users.filter((item) => item.role === "client");
  },
  getWorkspaces(state) {
    return state.workspaces;
  },
  getCurrentWorkspace(state) {
    return state.currentWorkspace;
  },
  getOnlineStatus(state) {
    return state.onlineStatus;
  },
};
const mutations = {
  updateWorkspace(state, payload) {
    let foundIndex = state.workspaces.findIndex(
      (x) => x._id == payload.workspaceId
    );
    if (foundIndex > -1) {
      delete payload.workspaceId;
      Vue.set(state.workspaces, foundIndex, {
        ...state.workspaces[foundIndex],
        ...payload,
      });
      // state.workspaces = JSON.parse(JSON.stringify(state.workspaces))
    }
  },
  setOnlineStatus(state, payload) {
    state.onlineStatus = payload;
  },
  addAuthToken(state, payload) {
    state.authToken = payload;
  },
  addWorkspaces(state, workspaces) {
    state.workspaces = [...workspaces];
  },
  addTickets(state, payload) {
    state.tickets = payload;
  },
  addCurrentWorkspace(state, payload) {
    state.currentWorkspace = payload;
  },
  addUser(state, user) {
    state.user = user;
  },
  addUsers(state, users) {
    state.users = users;
  },
  logout(state) {
    Object.assign(state, initialState());
  },
};

const actions = {
  async resendEmail(store, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${UrlServices.resendEmail}${payload}`)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  async signUp({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.signUp, payload)
        .then((res) => {
          resolve(res.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  async selectWorkspace({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${UrlServices.selectWorkspace}${payload._id}`, {
          headers: { Authorization: state.authToken },
        })
        .then((res) => {
          commit("addCurrentWorkspace", res.data.workspace);
          resolve(true);
        })
        .catch((e) => {
          console.log(e.message);
          reject(e);
        });
    });
  },
  async login({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.login, payload)
        .then((res) => {
          if (
            res.data.data.user.role === "accountant" ||
            res.data.data.user.role === "superadmin" ||
            res.data.data.user.role === "supervisor"
          ) {
            const role = res.data.data.user.role;
            state.onlineStatus = role == "supervisor" ? false : true;
            commit("addAuthToken", `Bearer ${res.data.token.toString()}`);

            // socket authenticated connection
            // socket.auth.token = res.data.token.toString()
            // socket.connect()

            commit("addUser", res.data.data.user);
            resolve(true);
          }
          reject("Nor client not employee");
        })
        .catch((e) => {
          reject(JSON.parse(e.request.response).data);
        });
    });
  },
  async getUsers({ commit, state }, payload) {
    axios
      .get("/user/", { headers: { Authorization: state.authToken } })
      .then((res) => {
        commit("addUsers", res.data.users);
      })
      .catch((e) => {
        console.log(e.message);
      });
  },
  async getWorkspaces({ commit, state }, payload) {
    axios
      .get(UrlServices.getWorkspaces, {
        headers: { Authorization: state.authToken },
      })
      .then((res) => {
        commit("addWorkspaces", res.data.workspaces);
      })
      .catch((e) => {
        console.log(e.message);
      });
  },
  async getTickets({ commit, state }, payload) {
    axios
      .get(`${UrlServices.getTickets}?page=${payload}`, {
        headers: { Authorization: state.authToken },
      })
      .then((res) => {
        commit("addTickets", res.data);
      })
      .catch((e) => {
        console.log(e.message);
      });
  },
  async getWorkspacesForSpecificUser(localStore, payload) {
    const { commit, state } = localStore;
    axios
      .get(
        `${UrlServices.getWorkspacesForSpecificUser}?userId=${state.user._id}`,
        { headers: { Authorization: state.authToken } }
      )
      .then((res) => {
        if (res.data.workspaces.length !== 0) {
          let newArray = []
          if(state.user.userType === 'specific'){
            newArray = res.data.workspaces.map((item) => {
              return item.workspaceId;
            });
            newArray = newArray.filter((n) => n);
          }
          else {
            newArray = res.data.workspaces
          }
          console.log("new Array", newArray)
          commit("addWorkspaces", newArray);
          if (payload?.ascSort == true)
            commit("addCurrentWorkspace", newArray[0]);
          else if (payload?.ascSort === false)
            commit("addCurrentWorkspace", newArray[newArray.length - 1]);
        }
        router.push({ path: "/" });
      })
      .catch((e) => {
        console.log(e.message);
      });
  },
  async forgotPassword({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.forgotPassword, payload)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  async setPassword({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.resetPassword, payload)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  async updateSupervisor({ commit, state, getters, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(UrlServices.updateSupervisor, payload, {
          headers: { Authorization: state.authToken },
        })
        .then((response) => {
          if (response.status == 200) {
            if (getters.getUsers.find((user) => user._id === payload.id)) {
              dispatch("getUsers");
              resolve(true);
            }
          } else {
            console.log(response);
          }
        })
        .catch((e) => {
          console.log(e);
        });
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
