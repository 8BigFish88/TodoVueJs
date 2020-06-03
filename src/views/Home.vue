<template>
  <div class="col-full push-top">
    <LogIn v-if="!user" />
    <Profile v-else />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Profile from "./Profile";
import LogIn from "./LogIn";
export default {
  name: "HelloWorld",
  components: {
    Profile,
    LogIn
  },
  computed: {
    ...mapGetters({
      user: "auth/authUser"
    })
  }
};
</script>

