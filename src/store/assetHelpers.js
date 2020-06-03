import Vue from "vue";

const makeAppendChildToParentMutation = ({ parent, child }) => (
  state,
  { childId, parentId }
) => {
  const resource = state.items[parentId];
  if (!resource[child]) {
    Vue.set(resource, child, {});
  }
  Vue.set(resource[child], childId, childId);
};

const deleteChildToParentMutation = ({ parent, child }) => (
  state,
  { childId, parentId }
) => {
  console.log(state);
  const resource = state.items[parentId];
  Vue.delete(resource[child], childId);
};

export { makeAppendChildToParentMutation, deleteChildToParentMutation };
