<template>
  <div class="flex-grid">
    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead"> {{ user.username }}'s recent activity </span>
        <a href="#">See only uncompleted todos?</a>
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

  computed: {
    ...mapGetters({
      user: "auth/authUser"
    }),

    userTodos() {
      return this.user.todos
        ? this.$store.getters["users/userTodos"](this.user[".key"])
        : null;
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
