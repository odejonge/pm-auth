import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import "./plugins/bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "./app.scss";
import axios from "axios";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    /**
     * check if user has right to do action
     * @param user: the user object
     * @return boolean
     */
    hasRight: function (user, role = "") {
      if (!user || !user.rights) {
        return false;
      }
      return user.rights.indexOf(role) != -1;
    },
    /**
     * returns a string with first char in capital
     * @param {String} text
     * @returns text
     */
    capitalize(text) {
      if (text && text.length > 0) {
        const firstChar = text.charAt(0).toUpperCase();
        text = firstChar + text.substring(1);
      }
      return text;
    },
    /**
     * returns record of selectData of a value
     * @param {*} selectData
     * @param {*} value
     */
    getItem(selectDataArr, value) {
      if (!selectDataArr) {
        throw new Error("Selectdata is empty, try to log in again.");
      }
      for (let i = 0; i < selectDataArr.length; i++) {
        const element = selectDataArr[i];
        if (element.value == value) {
          return element;
        }
      }
      return {};
    },
    /**
     * Avoids redundand error when navigating to already active page
     */
    routerPush(route) {
      this.$router.push(route).catch((error) => {
        if (error.name != "NavigationDuplicated") {
          throw error;
        }
      });
    },
  },
});

new Vue({
  router,
  render: (h) => h(App),
  mounted() {
    // Construct de service URL op basis van window.location
    if(window.location.hostname === 'localhost') {
      const serviceUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
      const backendUrl = `http://localhost:8000/registerAuthorisationService?url=${encodeURIComponent(serviceUrl)}`;

      // Stuur de URL naar je backend-service
      axios.get(backendUrl)
        .then(response => {
          console.log('AuthorisationService geregistreerd:', response.data);
        })
        .catch(error => {
          console.error('Fout bij het registreren van de AuthorisationService:', error);
        });
    }
  }
}).$mount("#app");
