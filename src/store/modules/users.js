import { countObjectProperties, removeEmptyProperties } from "@/utils";
import firebase from "firebase";
import Vue from "vue";
import {
  makeAppendChildToParentMutation,
  deleteChildToParentMutation
} from "@/store/assetHelpers";

export default {
  namespaced: true,

  state: {
    items: {}
  },

  getters: {
    userTodos: (state, getters, rootState) => id => {
      const user = state.items[id];
      if (user.todos) {
        return Object.values(rootState.todos.items).filter(
          todo => todo.userId === id
        );
      }
      return [];
    },
    userTodosCount: state => id => countObjectProperties(state.items[id].todos)
  },

  actions: {
    createUser(
      { state, commit },
      { id, email, name, username, avatar = null }
    ) {
      return new Promise((resolve, reject) => {
        const registeredAt = Math.floor(Date.now() / 1000);
        const usernameLower = username.toLowerCase();
        email = email.toLowerCase();
        const user = {
          avatar,
          email,
          name,
          username,
          usernameLower,
          registeredAt
        };
        firebase
          .database()
          .ref("users")
          .child(id)
          .set(user)
          .then(() => {
            commit(
              "setItem",
              { resource: "users", id: id, item: user },
              { root: true }
            );
            resolve(state.items[id]);
          });
      });
    },

    updateUser({ commit }, user) {
      const updates = {
        username: user.username,
        name: user.name,
        bio: user.bio,
        email: user.email,
        location: user.location
      };
      return new Promise((resolve, reject) => {
        firebase
          .database()
          .ref("users")
          .child(user[".key"])
          .update(removeEmptyProperties(updates))
          .then(() => {
            commit("setUser", { userId: user[".key"], user });
            resolve(user);
          });
      });
    },

    fetchUser: ({ dispatch }, { id }) =>
      dispatch(
        "fetchItem",
        { resource: "users", id, emoji: "🙋" },
        { root: true }
      ),
    fetchUsers: ({ dispatch }, { ids }) =>
      dispatch(
        "fetchItems",
        { resource: "users", ids, emoji: "🙋" },
        { root: true }
      )
  },

  mutations: {
    setUser(state, { user, userId }) {
      Vue.set(state.items, userId, user);
    },

    appendTodoToUser: makeAppendChildToParentMutation({
      parent: "users",
      child: "todos"
    }),
    deleteUserTodo: deleteChildToParentMutation({
      parent: "users",
      child: "todos"
    })
  }
};
