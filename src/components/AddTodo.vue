<template>
  <div>
    <h3>Add Todo</h3>
    <div class="add">
      <form @submit.prevent="save">
        <input type="text" v-model="title" placeholder="Add Todo..." />
        <input type="submit" value="Submit" />
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "AddTodo",
  data() {
    return {
      title: ""
    };
  },
  methods: {
    ...mapActions("todos", ["addTodo"]),

    save() {
      this.persist().then(todo => {
        this.$emit("save", { todo });
      });
    },
    create() {
      const todo = {
        title: this.title
      };
      this.title = "";

      return this.addTodo(todo);
    },
    persist() {
      return this.isUpdate ? this.update() : this.create();
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
}
input[type="text"] {
  flex: 10;
  padding: 10px;
  border: 1px solid #41b883;
  outline: 0;
}
input[type="submit"] {
  flex: 2;
  background: #41b883;
  color: #fff;
  border: 1px #41b883 solid;
  cursor: pointer;
}
</style>
