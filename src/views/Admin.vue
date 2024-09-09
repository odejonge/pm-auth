<template>
  <b-tabs class="p-0">
    <b-tab title="Gebruiker">
    <b-row>
      <b-col class="m-2">
        <h3>Gebruiker gegevens</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="col-12">
        <rule/>
        <form-edited-user 
          :user="createUpdateUser"
          :endpoints="endpoints"
          :idToken="idToken" />
        <rule />
        <form-create-update-user
          :user="editedUser"
          :endpoints="endpoints"
          :idToken="idToken" />
        <rule />
        <table-users 
          :users="users"
          @listAllUsers="listAllUsers"
          @userSelected="userSelected" />
        <rule />
      </b-col>
    </b-row>
    </b-tab>
    <b-tab title="Import" >
      <import :user="user" />
    </b-tab>
    <b-tab title="Export" class="pt-3" >
      <b-row align-v="center">
        <b-col class="m-3 col-2">
          <b-button @click="downloadCSV" :disabled="csvLink === null">Generate csv <b-spinner v-if="csvLink === null" class="ml-1" small /></b-button><br>
        </b-col>
        <b-col>
          <b-link :href="csvLink" v-if="csvLink" target="blank" >download csv</b-link>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="m-3 col-2">
          <b-button @click="downloadJson" :disabled="backup === null" >Generate json <b-spinner v-if="backup === null" class="ml-1" small /></b-button>
        </b-col>
        <b-col>
          <b-textarea v-model="backup" rows="20" />
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col class="m-3 col-2">
          <b-button @click="downloadJsonLocation" :disabled="backupLocation === null" >Generate json location<b-spinner v-if="backupLocation === null" class="ml-1" small /></b-button>
        </b-col>
        <b-col>
          <b-textarea v-model="backupLocation" rows="20" />
        </b-col>
      </b-row>
    </b-tab>
  </b-tabs>
</template>
<script>
import firebase from "firebase"
import "firebase/functions"
import Rule from "../components/Rule"
import FormEditedUser from "../components/admin/FormEditedUser"
import FormCreateUpdateUser from "../components/admin/FormCreateUpdateUser"
import TableUsers from "../components/admin/TableUsers"
import Import from "./Import"
import db from "../db.js";

export default {
  name:"admin",
  props: ["user"],
  components: {Rule, FormEditedUser, FormCreateUpdateUser, TableUsers, Import},
  data() {
    return {
      email: null,
      editedUser: {},
      createUpdateUser: {},
      idToken: null,
      endpoints: null,
      users: null,
      error: null,
      backup: "",
      backupLocation: "",
      csvLink: "",
    }
  },
  watch: {
    error(value) {
        if(value) {
          this.$emit('makeToast', 'Error', value, 'danger')
        }
    }
  },
  methods: {
    async getAuthData(user, endpointFunc) {
      if(user) {
        try {
          const idToken = await user.getIdToken(false)
          this.idToken = idToken
          const getEndpoints = firebase.functions().httpsCallable(
            endpointFunc + "?idToken=" + this.idToken
          )

          const response = await getEndpoints()
          if(response.data) {
            this.endpoints = response.data.endpoints
          } else {
            this.error = "Something went wrong with getting the endpoints"
          }
        }catch(error) {
          console.log(error)
          this.error = error.message
        }
      } else {
        console.log("user is null")
      }
    },
    async downloadJson() {
      if(this.user) {
        try {
          this.backup = null;
          const idToken = await this.user.getIdToken(false)
          this.idToken = idToken
          const exportData = firebase.functions().httpsCallable(
            this.endpoints.exportData + "?idToken=" + this.idToken
          )
          exportData().then((response) => {
            if(response.data) {
              //console.log(response.data)
              this.backup = JSON.stringify(response.data) 
            } else {
              console.log("Something went wrong with getting the json backup")
            }
          }).catch(error => {
            console.log(error)
          })
        }catch(error) {
          console.log(error)
          this.error = error.message
        }
      } else {
        console.log("user is null")
      }
    },
    async downloadJsonLocation() {
      if(this.user) {
        try {
          this.backupLocation = null;
          const idToken = await this.user.getIdToken(false)
          this.idToken = idToken
          const ref = db.collection("data").where("recordType_select", "==", "locatie")
          ref.get().then((colRef) => {
            console.log(colRef)
            let records = []
            colRef.forEach(doc => {
               const record = doc.data()
               record.id = doc.id
               records.push(record)
            });
            this.backupLocation = JSON.stringify(records);
          }).catch(error => {
            this.backupLocation = ""
            console.log(error)
          })
        }catch(error) {
          console.log(error)
          this.error = error.message
        }
      } else {
        console.log("user is null")
      }
    },
    async downloadCSV() {
      if(this.user) {
        try {
          console.log("csv")
          this.csvLink = null;
          const idToken = await this.user.getIdToken(false)
          this.idToken = idToken
          const csv = firebase.functions().httpsCallable(
            this.endpoints.downloadCSV + "?idToken=" + this.idToken
          )

          csv().then((response) => {
            if(response) {
              this.loadFile(this.getStorageRef('database-download.csv'))
            } else {
              console.log("Something went wrong with getting the csv")
            }
          }).catch(error => {
            console.log(error)
          })
        }catch(error) {
          console.log(error)
          this.error = error.message
        }
      } else {
        console.log("user is null")
      }
    },
    getStorageRef(fileName) {
      const imagePath = fileName;
      const storageRef = firebase.storage().ref()
      return storageRef.child( imagePath );
    },
    loadFile(storageRef) {
      storageRef.getDownloadURL().then( url => {
        this.csvLink = url
      })
      .catch( error => {
        console.log(error)
        this.csvLink = null
      })
    },
    listAllUsers() {
      const listAllUsers = firebase.functions().httpsCallable(
        this.endpoints.listAllUsers + "?idToken=" + this.idToken
      )

      listAllUsers().then((response) => {
        if(response.data) {
          console.log(response.data)
          this.users = response.data.users
        } else {
          console.log("Something went wrong with getting the users")
        }
      }).catch(error => {
        console.log(error)
      })
    },
    userSelected(event) {
      // console.log(event)
      this.editedUser = {... event};
      this.createUpdateUser = {... event};
    },

  },
  mounted() {

    // if(!this.hasRight(this.user))  {
    //     this.$emit('navigateTo','/login')
    //     return
    // }
    console.log("mounted Admin!", this.user)
    if(this.user){
      this.user.getIdTokenResult(false).then(async token => {
        if(this.user != null && this.user.emailVerified && this.hasRight(this.user, 'admin') ) {
          await this.getAuthData(this.user, token.claims.endpoints);
          this.listAllUsers()
        }
      })
    }
  } 
}
</script>
