import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
import todos from "./modules/todos";
import users from "./modules/users";
import auth from "./modules/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters,
  actions,
  mutations,
  modules: {
    todos,
    users,
    auth
  }
});
