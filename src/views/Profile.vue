<template>
  <div class="flex-grid">
    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead">{{ user.username }}'s todos</span>
        <a @click="filterTodos">See only uncompleted todos?</a>
      </div>

      <hr />
      <AddTodo />
      <div v-if="!user.todos">You don't have any todos yet</div>
      <TodoList v-else :todos="userTodos" />
    </div>
  </div>
</template>

<script>
import TodoList from "@/components/TodoList";
import AddTodo from "@/components/AddTodo";
import { mapGetters } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  data() {
    return {
      todosKey: 0
    };
  },
  components: {
    TodoList,
    AddTodo
  },
  mixins: [asyncDataStatus],
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filter: false
    };
  },
  methods: {
    filterTodos(e) {
      e.preventDefault();
      this.filter = true;
    }
  },
  computed: {
    ...mapGetters({
      user: "auth/authUser"
    }),
    userTodos() {
      let arrayTodos = this.filter
        ? this.$store.getters["users/userTodos"](this.user[".key"]).filter(
            todo => !todo.completed
          )
        : this.$store.getters["users/userTodos"](this.user[".key"]);
      return this.user.todos ? arrayTodos : null;
    }
  },
  created() {
    if (this.user.todos) {
      this.$store
        .dispatch("todos/fetchTodos", { ids: this.user.todos })
        .then(() => this.asyncDataStatus_fetched());
    } else {
      this.asyncDataStatus_fetched();
    }
  }
};
</script>

<style scoped></style>
