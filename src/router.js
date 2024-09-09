import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login";
import Register from "./views/Register";
import MainForm from "./views/MainForm";
import Records from "./views/Records"
import Admin from "./views/Admin"
import Import from "./views/Import"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/main-form",
      name: "MainForm",
      component: MainForm
    },
    {
      path: "/records",
      name: "Records",
      component: Records
    },
    {
      path: "/admin",
      name: "Admin",
      component: Admin
    },
    {
      path: "/import",
      name: "Import",
      component: Import
    },
    {
      path: "*",
      redirect: '/Login'
    }
  ]
});
