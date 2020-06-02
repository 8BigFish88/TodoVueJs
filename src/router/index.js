import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Register from "@/views/Register";
import LogIn from "@/views/LogIn";
import Profile from "@/views/Profile";
import HelloWorld from "@/views/Home";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Register",
      component: Register
    },
    {
      path: "/login",
      name: "LogIn",
      component: LogIn,
      meta: { requiresGuest: true }
    },
    {
      path: "/logout",
      name: "SignOut",
      beforeEnter(to, from, next) {
        store.dispatch("auth/signOut");
      },
      meta: { requiresAuth: true }
    },
    {
      path: "/me",
      name: "Profile",
      component: Profile,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: "/home",
      name: "Home",
      component: HelloWorld
    }
  ],
  mode: "history"
});

router.beforeEach((to, from, next) => {
  console.log(`🚦 navigating to ${to.name} from ${from.name}`);
  store.dispatch("auth/initAuthentication").then(user => {
    if (to.matched.some(route => route.meta.requiresAuth)) {
      // protected route
      if (user) {
        next();
      } else {
        next({ name: "LogIn", query: { redirectTo: to.path } });
      }
    } else if (to.matched.some(route => route.meta.requiresGuest)) {
      // protected route
      if (!user) {
        next();
      } else {
        next({ name: "Home" });
      }
    } else {
      next();
    }
  });
});

export default router;
