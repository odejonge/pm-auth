<template>
  <b-container class="mt-5">
    <b-form v-if="!showVerifyEmailMessage" @submit.prevent="register" >
      <b-container >
        <b-row class="justify-content-center">
          <b-col class="col-lg-8 mt-5">
            <b-card class="card bg-light">
              <b-card-body class="card-body">
                <h3 class="mb-3">Registreer</h3>
                <b-form-row >
                  <b-alert :show="errorVisible" variant="danger" class="col-12 px-3" >
                    {{ error }}
                  </b-alert>
                  <b-form-group class="col-sm-12">
                    <label
                      class="form-control-label sr-only"
                      for="displayName"
                    >Display Name</label>
                    <b-form-input
                      class="form-control"
                      type="text"
                      id="displayName"
                      placeholder="Display Name"
                      name="displayName"
                      required
                      v-model="displayName"
                    />
                  </b-form-group>
                </b-form-row>
                <b-form-group >
                  <label
                    class="form-control-label sr-only"
                    for="email"
                  >Email</label>
                  <b-form-input
                    class="form-control"
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    required
                    name="email"
                    v-model="email"
                  />
                </b-form-group>
                <b-form-row >
                  <b-form-group class="col-sm-6">
                    <b-form-input
                      class="form-control"
                      type="password"
                      placeholder="Password"
                      v-model="passOne"
                    />
                  </b-form-group>
                  <b-form-group class="col-sm-6">
                    <b-form-input
                      class="form-control"
                      type="password"
                      required
                      placeholder="Repeat Password"
                      v-model="passTwo"
                    />
                  </b-form-group>
                </b-form-row>
                <b-form-group class="text-right mb-0">
                  <b-button pill variant="primary"
                    type="submit">
                    Registreer
                  </b-button>
                </b-form-group>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
        <p v-if="!showVerifyEmailMessage"  class="text-center mt-2">
          or
          <router-link to="/login">login</router-link>
        </p>
      </b-container>
    </b-form>
    <b-row v-if="showVerifyEmailMessage" class="justify-content-center py-5">
      <b-col class="mt-5">
        <p>Er is een e-mail ter verificatie gestuurd. Klik op de link in de e-mail om in te kunnen loggen.</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Firebase from "firebase"; 
import db from "../db.js";

export default ({
  name:"register",
  data:function() {
    return {
      displayName: null,
      email: null,
      passOne: null,
      passTwo: null,
      error: null,
      errorVisible: false,
      showVerifyEmailMessage: false,
    }
  },
  methods: {
    register: function() {
      const info = {
        email: this.email,
        password: this.passOne,
        displayName: this.displayName
      }
      if(!this.error) {
        Firebase.auth().createUserWithEmailAndPassword(info.email, info.password)
        .then((userCredentials) => {
          Firebase.auth().currentUser.sendEmailVerification()
          .then(() => {
            console.log("Email verification sent!")
            console.log(userCredentials)
            userCredentials.user.updateProfile({
              displayName: info.displayName
            })
            .then(()=> {
              this.showVerifyEmailMessage = true
              Firebase.auth().signInWithEmailAndPassword(info.email, info.password)
                .then((userCredentials)=> {
                var userRef = db.collection('users').doc(userCredentials.user.uid);
                userRef.get().then (doc => {
                  if(!doc.exists) {
                    userRef.set({name: this.displayName, uid: userCredentials.user.uid})
                    .catch (error => {
                      console.log("Error creating user: ", error);
                    })
                  } 
                });
              }).catch (error => {
                console.log(error)
              })
            })
            .catch(error => {
              console.log(error)
            })
          });

          }, error => {
            this.error = error.message;
            this.errorVisible = true;
          }
        )
      }
    }
  },
  watch: {
    passTwo: function() {
      if(
        this.passOne !== "" &&
        this.passTwo !== "" &&
        this.passTwo !== this.passOne
      ) {
        this.error = "Wachtwoorden moeten gelijk zijn";
        this.errorVisible = true
      } else {
        this.error = null;
        this.errorVisible = false
      }
    }
  }
})
</script>
