<template>
  <div id="app">
    <Navigation @logout="logout" @navigateTo="navigateTo" @makeToast="makeToast" :user="user" :isAdmin="isAdmin"
      :preferences="preferences" />
    <router-view class="container" @initiateApp="initiateApp" @recordSelected="recordSelected" @navigateTo="navigateTo"
      @makeToast="makeToast" :user="user" :isAdmin="isAdmin" :selectedRecord="selectedRecord" :selectData="selectData"
      :preferences="preferences" />
  </div>
</template>

<script>
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import Navigation from "./components/Navigation";
import firebase from "firebase"
import db from "./db.js"

export default {
  name: 'App',
  data: function () {
    return {
      analytics: null,
      user: null,
      selectedRecord: null,
      selectData: {},
      selectDataUnsubscribe: null,
      isAdmin: false,
      preferences: {}
    };
  },
  components: {
    Navigation
  },
  methods: {
    navigateTo: function (target) {
      if (target == "/main-form") {
        this.selectedRecord = null
      }

      this.routerPush(target);
    },
    initiateApp() {
      this.routerPush("/records");
    },
    logout() {
      firebase.auth()
        .signOut()
        .then(() => {
          this.user = null;
          this.routerPush("/login");
        });
    },
    initUser(user) {
      this.user = user;
      console.log('user', this.user)
      this.isAdmin = this.hasRight(user, 'admin')
    },
    recordSelected(record) {
      this.selectedRecord = record
      this.routerPush("/main-form")
    },
    initSelectData() {
      const ref = db.collection("selectData")
      this.selectDataUnsubscribe = ref.onSnapshot(col => {
        col.forEach(doc => {
          const mdData = doc.data().array
          const mdName = doc.id
          this.selectData[mdName] = mdData
        })
      })
    },
    makeToast(title, message, variant = 'secondary', location = 'b-toaster-bottom-left', append = false) {
      this.$bvToast.toast(message, {
        title: title,
        autoHideDelay: 5000,
        variant: variant,
        toaster: location,
        appendToast: append
      })
    },
    clearData() {
      this.user = null
      this.selectData = {}
      if (this.selectDataUnsubscribe) this.selectDataUnsubscribe();
    }

  },
  mounted() {
    const firebaseConfig = {
      apiKey: "AIzaSyCPBHXebSbe3P9tMRz0RI-z6sEI8yrtTmM",
      authDomain: "projectmonitor-bfddb.firebaseapp.com",
      projectId: "projectmonitor-bfddb",
      storageBucket: "projectmonitor-bfddb.appspot.com",
      messagingSenderId: "100999010397",
      appId: "1:100999010397:web:ad4a43baa746d912ba15b4",
      measurementId: "G-PY7YFS0NFN"
    };

    //to prevent firebase being initialized twice
    if (!firebase.apps.length > 0) {
      firebase.initializeApp(firebaseConfig);
    }

    const useEmulator = false;
    if (useEmulator && location.hostname === "localhost") {
      try {
        firebase.firestore().useEmulator(location.hostname, 8085);
        firebase.auth().useEmulator("http://localhost:9099")
        firebase.functions().useEmulator(location.hostname, 5003);
        firebase.storage().useEmulator("localhost", 9199)
      } catch (err) {
        console.log("code: " + err.code, err.message)
      }
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult(false).then(token => {
          if (user.emailVerified) {
            user.rights = token.claims.rights
            this.initUser(user)
            this.initSelectData()
            this.routerPush("/records");
          } else {
            this.clearData()
          }
        });
      }
    });
  }

}
</script>

<style>
#app {
  color: #555555;
  margin-top: 80px;
}
</style>
