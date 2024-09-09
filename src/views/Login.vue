<template>
  <div>
    <form class="py-3 mt-5" @submit.prevent="login">
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-lg-6">
            <div class="card bg-light">
              <div class="card-body">
                <h3 class="mb-3">Log in</h3>
                <section class="form-group">
                  <div class="col-12 alert alert-danger px-3" v-if="error">
                    {{ error }}
                  </div>
                  <label class="form-control-label sr-only" for="Email">Email</label>
                  <input required class="form-control" type="email" id="email" placeholder="Email" v-model="email" />
                </section>
                <section class="form-group">
                  <input required class="form-control" type="password" placeholder="Password" v-model="password" />
                </section>
                <div class="form-group text-right mb-0">
                  <b-button pill variant="primary" type="submit">Log in</b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <p class="text-center mt-2">
      or
      <router-link to="/register">register</router-link>
    </p>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  name: "login",
  data: function () {
    return {
      email: "",
      password: "",
      error: "",
      redirectUrl: null,
    }
  },
  methods: {
    login: function () {
      const info = {
        email: this.email,
        password: this.password
      }
      let self = this
      firebase.auth().signInWithEmailAndPassword(info.email, info.password)
        .then((userCredentials) => {
          var user = userCredentials.user
          user.getIdTokenResult(false).then(token => {
            if (user != null && user.emailVerified) {
              user.rights = token.claims.rights
              if (this.hasRight(user, 'view')) {
                if (this.redirectUrl) {
                  window.location.href = this.redirectUrl;
                } else {
                  this.$emit("initiateApp", user)
                }
              } else {
                self.error = "Je hebt geen toegang tot de website"
              }
            } else {
              self.error = "E-mail is niet gevalideert"
            }
          })
        }, error => {
          self.error = error.message;
        }
        )
    },
    getUrlParameter: function(name) {
      name = name.replace(/[[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
      var results = regex.exec(location.search);
      console.log('location.search:', location.search);
      console.log('results:', results);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
  },
  created() {
    this.redirectUrl = this.$route.query.redirectUrl || null;
    console.log('redirectUrl:', this.redirectUrl);
  }
}
</script>
