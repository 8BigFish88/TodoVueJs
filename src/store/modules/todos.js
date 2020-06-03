import Vue from "vue";
import firebase from "firebase";
import { deleteChildToParentMutation } from "@/store/assetHelpers";

export default {
  namespaced: true,

  state: {
    items: {}
  },

  actions: {
    fetchTodo: ({ dispatch }, { id }) =>
      dispatch(
        "fetchItem",
        { resource: "todos", id, emoji: "💬" },
        { root: true }
      ),
    fetchTodos: ({ dispatch }, { ids }) =>
      dispatch(
        "fetchItems",
        { resource: "todos", ids, emoji: "💬" },
        { root: true }
      ),
    addTodo({ commit, state, rootState }, todo) {
      const todoId = firebase
        .database()
        .ref("todos")
        .push().key;
      todo.userId = rootState.auth.authId;
      todo.completed = false;

      const updates = {};
      updates[`todos/${todoId}`] = todo;
      updates[`users/${todo.userId}/todos/${todoId}`] = todoId;
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          commit(
            "setItem",
            { resource: "todos", item: todo, id: todoId },
            { root: true }
          );
          commit(
            "users/appendTodoToUser",
            { parentId: todo.userId, childId: todoId },
            { root: true }
          );
          return Promise.resolve(state.items[todoId]);
        });
    },
    deleteTodo({ commit, state, rootState }, todoId) {
      todoId = todoId.todo;
      const userId = rootState.auth.authId;
      //const updates = {};
      //updates[`todos/${todoId}`] = todo;
      //updates[`users/${userId}/todos/${todoId}`] = todoId;
      firebase
        .database()
        .ref(`todos/${todoId}`)
        .remove()
        .then(() => {
          firebase
            .database()
            .ref(`users/${userId}/todos/${todoId}`)
            .remove()
            .then(() => {
              commit(
                "deleteItem",
                { resource: "todos", id: todoId },
                { root: true }
              );
              console.log(userId);
              commit(
                "users/deleteUserTodo",
                {
                  parentId: userId,
                  childId: todoId
                },
                { root: true }
              );
              //commit(
              //  "deleteItem",
              //  { resource: "users/todos", id: todoId },
              //  { root: true }
              // );
              return Promise.resolve(state.items);
            });
        });
    },
    updateTodo({ state, commit }, id) {
      console.log(id);
      return new Promise(resolve => {
        const todo = state.todos[id];
        const completed = !todo.completed;

        const updates = { completed };
        firebase
          .database()
          .ref("todos")
          .child(id)
          .update(updates)
          .then(() => {
            commit("setTodo", { todo: { ...todo, completed }, id });
            resolve(todo);
          });
      });
    },
    updateUser({ commit }, user) {
      commit("setUser", { userId: user[".key"], user });
    }
  },

  mutations: {
    setTodos: (state, todos) => (state.todos = todos),
    newTodo: (state, todo) => state.todos.unshift(todo),
    removeTodo: (state, id) => delete state.todos[id],
    updateTodo: (state, id) => {
      const index = state.todos.keys().findIndex(todo => todo === id);
      if (index !== -1) {
        console.log("update");
      }
    },
    setTodo(state, { todo, id }) {
      Vue.set(state.todos, id, todo);
    }
  }
};
