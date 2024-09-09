<template>
  <b-container class="p-0">
    <b-form ref="form" class="col-12" @submit.stop.prevent="handleSubmit()">
      <b-row>
        <b-col>
          <b-alert class="m-0 mb-2" v-model="showFormAlert" :variant="alertVariant" dismissible>
            {{alertMessage}}
          </b-alert>
        </b-col>
      </b-row>
      <b-row  >
        <b-col class="col-12 col-md-2 ">
          <h5>Rol</h5>
        </b-col>
        <b-col class="col-12 col-md-5 ">
          <b-form-group  :state="emailState" >
            <b-form-input
              placeholder="E-mail"
              disabled
              type="email"
              v-model="user.email"  
              required
              />
          </b-form-group>
        </b-col>
        <b-col class="col-12 col-md-5 ">
          <b-form-group  >
            <b-form-select 
              v-model="customClaims.rights" 
              :options="selectRights" 
              required
              />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row >
        <b-col class="d-flex justify-content-end col-12 " >
          <b-button pill
            variant="primary"
            type="submit">Submit</b-button>
        </b-col>
      </b-row>
    </b-form>
    <b-modal id="modal" hide-footer title="Let op: aanpassing naar Admin rol!">
      <div class="d-block text-left">
        <p>De admin-rol is voorbehouden aan gebruikers die rechtstreeks in de database aanpassingen mogen doen.</p>
        <p>Weet je zeker dat je <b>'{{user.email}}'</b> Admin wilt maken?</p>
      </div>
      <b-row>
        <b-col class="m-2 d-flex justify-content-end">
          <b-button class="ml-auto" @click="$bvModal.hide('modal')">Cancel</b-button>
          <b-button class="ml-2" variant="danger" @click="handleSubmitNext" >Maak admin</b-button>
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>
<script>
import firebase from "firebase"
import "firebase/functions"
export default {
  name: "form-edited-user",
  props: ["user", "endpoints", "idToken"],
  data() {
    return {
      alertMessage: "",
      emailState: null,
      alertVariant: null,
      showFormAlert: false,
      customClaims: {},
      selectRights: [{text: "-- Selecteer rol --", value: null}, 
        {text: "Viewer", value: "view"},
        {text: "Editor", value: "edit,view"}, 
        {text: "Admin", value: "admin,edit,view"}, 
      ]
    }
  },
  watch: {
    user(obj) {
      if(obj && obj.customClaims) {
        this.customClaims = obj.customClaims;
      } else {
        this.customClaims = {};
      }
    }
  },
  methods: {
    handleSubmit() {
      this.showFormAlert = false
      if(this.hasRight(this.customClaims, "admin")) {
        this.$bvModal.show('modal')
      } else {
        this.handleSubmitNext() ;
      }
    },
    handleSubmitNext() {
      this.$bvModal.hide('modal')
      this.$refs.form.checkValidity()
      const updateRole = firebase.functions().httpsCallable(
        this.endpoints.updateRoleUser + "?email=" + this.user.email 
                                      + "&rights=" + this.customClaims.rights 
                                      + "&idToken=" + this.idToken
      )
      updateRole().then((response) => {
        this.showFormAlert = true;
        if(response.data.result) {
          this.alertMessage = response.data.message
          this.alertVariant = "success"
        } else {
          this.alertMessage = response.message
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
