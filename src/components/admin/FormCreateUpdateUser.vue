<template>
  <b-container class="p-0">
    <b-form ref="form" class="col-12  " @submit.stop.prevent="handleSubmit()">
      <b-row>
        <b-col >
          <b-alert class="m-0 mb-2" v-model="showFormAlert" :variant="alertVariant" dismissible>
            {{alertMessage}}
          </b-alert>
        </b-col>
      </b-row>
      <b-row >
        <b-col class="col-12 col-md-2 ">
          <h5>Gegevens</h5>
        </b-col>
        <b-col class="col-12 col-md-5 ">
            <b-form-group  :state= "displayNameState"  >
              <b-form-input
                placeholder="Naam"
                :state= "displayNameState"
                type="text"
                v-model="user.displayName"  
                required
                />
            </b-form-group>
        </b-col>
        <b-col class="col-12 col-md-5">
            <b-form-group  :state= "emailState" >
              <b-form-input
                placeholder="E-mail"
                :state= "emailState"
                type="email"
                v-model="user.email"  
                required
                />
            </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="d-flex justify-content-end col-12 " >
          <b-button type="submit" pill
            variant="primary">Submit</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>
<script>
import firebase from "firebase"
import "firebase/functions"
export default {
  name: "form-create-update-user",
  props: ["user", "endpoints", "idToken"],
  data() {
    return {
      emailState: null,
      displayNameState: null,
      passwordState: null,
      alertMessage: "",
      alertVariant: null,
      showFormAlert: false,
    }
  },
  methods: {
    handleSubmit() {
      this.showFormAlert = false;
      this.$refs.form.checkValidity()
      this.emailState = this.email != ''
      if(!this.emailState ) {
        return
      }
      const createUpdateUser = firebase.functions().httpsCallable(
        this.endpoints.createUpdateUser + "?email=" + this.user.email 
                                        + "&displayName=" + (this.user.displayName ? this.user.displayName : "")
                                        + "&phoneNumber=" + (this.user.phoneNumber ? this.user.phoneNumber : "")
                                        + "&uid=" + this.user.uid
                                        + "&idToken=" + this.idToken
      )
      createUpdateUser().then((response) => {
        this.showFormAlert = true;
        if(response.data.result) {
          this.alertMessage = response.data.message
          this.alertVariant = "success"
          this.user = response.data.user
        } else {
          this.alertMessage = response.data.message
          this.alertVariant = "danger"
        }
      })
      .catch(error => {
        console.log(error) 
          this.alertMessage = error.message
          this.alertVariant = "danger"
      })
    },
  }
}
</script>
