<template>
  <b-container class="p-0">
    <b-row>
      <b-col >
        <b-alert class="m-0 mb-2" v-model="showFormAlert" :variant="alertVariant" dismissible>
          {{alertMessage}}
        </b-alert>
      </b-col>
    </b-row>
    <csv-import @success="showSuccess" @error="showError" />
    <rule />
    <b-row >
      <b-col class="col-12 col-md-2 ">
        <h5>DB Backup JSON</h5>
      </b-col>
      <b-col class="col-12 col-md-10 ">
        <b-form-group >
          <b-form-file 
              v-model="jsonUploadURL"
              placeholder="Kies of sleep [backup].json file"
              drop-placeholder="Sleep hem hier..."
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row >
      <b-col class="d-flex justify-content-end col-12 " >
        <b-button @click="handleBackupSubmit" pill
          variant="primary">Submit</b-button>
      </b-col>
    </b-row>
    <rule />
    <b-row >
      <b-col class="col-12 col-md-2 ">
        <h5>JSON Folder</h5>
      </b-col>
      <b-col class="col-12 col-md-4">
          <b-form-group  >
            <b-form-input
              placeholder="path"
              type="text"
              v-model="folderPath" 
              required
              />
          </b-form-group>
      </b-col>
      <b-col class="col-12 col-md-6">
        <b-form-file
            v-model="files"
            directory multiple no-traverse
            placeholder="Kies of sleep een folder"
            drop-placeholder="Sleep hem hier..."/>
      </b-col>
    </b-row>
    <b-row >
      <b-col class="d-flex justify-content-end col-12 " >
        <b-button @click="handleFileSubmit" pill
          variant="primary">Submit</b-button>
      </b-col>
    </b-row>
    <rule />
    <b-row >
      <b-col class="col-12 col-md-2 ">
        <h5>JSON file</h5>
      </b-col>
      <b-col class="col-12 col-md-4">
          <b-form-group  >
            <b-form-input
              placeholder="path/subPath"
              type="text"
              v-model="firebasePathStr" 
              :state="firebasePathState"
              required
              />
          </b-form-group>
      </b-col>
      <b-col class="col-12 col-md-6 ">
        <b-form-group >
          <b-form-file 
              v-model="jsonUploadURL"
              placeholder="Kies of sleep een json file"
              drop-placeholder="Sleep hem hier..."
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row >
      <b-col class="d-flex justify-content-end col-12 " >
        <b-button @click="handleSubmit" pill
          variant="primary">Submit</b-button>
      </b-col>
    </b-row>
    <rule />
    <b-row >
      <b-col class="col-12 col-md-2 ">
        <h5>Import JSON backup file</h5>
      </b-col>
      <b-col class="col-12 col-md-10">
          <b-form-group  >
            <b-form-input
              placeholder="filename.json"
              type="text"
              v-model="importJsonFileStr" 
              :state="importJsonFileState"
              required
              />
          </b-form-group>
      </b-col>
    </b-row>
    <b-row >
      <b-col class="d-flex justify-content-end col-12 " >
        <b-button @click="importBackup" pill
          variant="primary">Submit</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import axios from 'axios';
import db from "../../db.js"
import Rule from "../../components/Rule"
import CsvImport from "./CsvImport"
export default {
  name:"form-import",
  components: {Rule, CsvImport},
  data() {
    return {
      files: null,
      maxFiles: null,
      countFiles: 0,
      folderPath: "selectData",
      jsonUploadURL: null,
      firebasePathStr: null,
      firebasePathState: null,
      importJsonFileStr: null,
      importJsonFileState: null,
      showFormAlert: false,
      alertVariant: "success",
      alertMessage: "Success",
      countBackupRecords: 0,
    }
  },
  watch: {
    files: function (value) {
        if(value == null) return;
        this.maxFiles = value.length
        this.countFiles = 0
    },
    countFiles: function( value) {
        if(value == this.maxFiles) {
          //this.createSelectData(this.)
        }
    }
  },
  methods: {
    async handleBackupSubmit() {
      try {
        const result = await axios.get(location.origin + "/backup/" + this.jsonUploadURL.name)
        this.saveCollectionData(result.data.data, "data")
        this.saveCollectionData(result.data.selectData, "selectData", true)
        this.saveCollectionData(result.data.users, "users", true)
        this.showSuccess("Record aangemaakt")
        console.log(result.data)
      } catch (error) {
        this.showError(error.message)
      }
    },
    async handleFileSubmit() {
      try {
        this.countFiles = 0
        for (let i = 0; i < this.files.length; i++) {
          const file = this.files[i]
          
          if(file.name.indexOf(".json") != -1) {
              console.log(file.name)
              const result = await axios.get(location.origin + "/import/" + file.name)
              let docName = file.name.substring(0, (file.name.length-5));
              console.log(docName)
              this.importJsonData(result.data, this.folderPath + "/" + docName)
              this.countFiles++
          }
        }
      }catch(error) {
        console.log("Error uploading selectData: ", error)
      }
    },
    async handleSubmit() {
      try {
        const result = await axios.get(location.origin + "/import/" + this.jsonUploadURL.name)
        this.importJsonData(result.data, this.firebasePathStr)
        this.showSuccess("Record aangemaakt")
        console.log(result.data)
      } catch(error) {
        this.showError(error.message)
      }
    },
    async importJsonData(data, path) {
      this.firebasePathState = null
      this.showFormAlert = false
      this.alertMessage = ""

      const pathArr = path.split("/")
      if(pathArr.length < 2 || pathArr.length % 2 != 0 ) {
        this.firebasePathState = false
        this.showError("Het pad moet minimaal uit 2 elementen bestaan en moet een veelvoud van 2 zijn")
        return
      }
      this.saveData(data, pathArr)
    },
    async saveData(data, pathArr){
      try {
        var ref = db.collection(pathArr[0]);
        for (let i = 1; i < pathArr.length; i++) {
          const element = pathArr[i];
          if (i % 2 == 1) {
            ref = ref.doc(element)
          } else {
            ref = ref.collection(element)
          }
          
        }
        var docRef = await ref.set(data)
        this.showSuccess("Record aangemaakt")
        console.log(docRef)
        
      } catch(error) {
        this.showError(error.message)
      }
    },
    async saveCollectionData(dataArr, colName, namedColIds = false){
      try {
        for (let i = 0; i < dataArr.length; i++) {
          const element = dataArr[i];
          if (!namedColIds) {
            var ref = db.collection(colName);
            var docRef = await ref.add(element)
          } else {
            ref = db.collection(colName).doc(element.id)
            docRef = await ref.set(element.data)
          }

          this.showSuccess("Record aangemaakt")
          console.log(docRef)
        }
      } catch(error) {
        this.showError(error.message)
      }
    },
    showSuccess(message) {
          this.showFormAlert = true
          this.alertMessage = message;
          this.alertVariant = "success"
    },
    showError(message) {
        this.showFormAlert = true
        this.alertVariant = "danger"
        this.alertMessage = message
    },
    async importBackup() {
      try {
        const result = await axios.get(location.origin + "/backup/" + this.importJsonFileStr)
        this.importJsonBackupFile(result.data)
      } catch(error) {
        this.showError(error.message)
      }
    },
    importJsonBackupFile(data) {
      this.importJsonFileStr = null
      this.showFormAlert = false
      this.alertMessage = ""

      try {
        this.countBackupRecords = 0;
        data.forEach(element => {
          var ref = db.collection("data").doc(element.id);
          ref.get().then(doc => {
            if(!doc.data()) {
              ref.set(element).then(()=> {
                this.countBackupRecords++;
                console.log(this.countBackupRecords)
              })
            }
          })
          .catch(error => {
            console.log(error);
          })
        });

        this.showSuccess("Backup geimporteerd")
        
      } catch(error) {
        this.showError(error.message)
      }
    },
  }
  
}
</script>
