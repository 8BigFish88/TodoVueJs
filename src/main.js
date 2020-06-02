// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import firebase from "firebase";
import App from "./App";
import router from "./router";
import store from "./store";
import vuelidate from "vuelidate";

Vue.use(vuelidate);

Vue.config.productionTip = false;

// Initialize Firebase
const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
firebase.initializeApp(config);

console.log(process.env);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  template: "<App/>",
  components: { App }
});
