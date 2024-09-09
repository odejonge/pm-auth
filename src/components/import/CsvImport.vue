<template>
  <b-container class="p-0">
    <b-row >
      <b-col class="col-12 col-md-2 ">
        <h5>CSV record file</h5>
      </b-col>
      <b-col class="col-12 col-md-10 ">
        <b-form-group >
          <b-form-file 
              v-model="csvUploadURL"
              accept="csv"
              placeholder="Kies of sleep [backup].csv file"
              drop-placeholder="Sleep hem hier..."
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row >
      <b-col class="d-flex justify-content-end col-12 " >
        <b-button @click="handleCsvSubmit" pill
          variant="primary">Submit</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Papa from 'papaparse';
import axios from 'axios';
import db from "../../db.js"
import firebase from "firebase"
export default {
  name:"csv-import",
  data() {
    return {
      csvUploadURL: null,
      csvFileURL: null,
    }
  },
  watch: {
    csvUploadURL(value) {
      if(value) {
        try {
          const importName =  "import" + "-" + new Date().toString()
          const fileRef = this.createFileRef(importName)
          fileRef.put(value)
          .then( snapshot => {
              console.log("uploaded!", snapshot)
              this.csvFileURL = this.getFileUrl(importName)
          })
          .catch( error => {
              console.log("File put error: " + error)
          })
        }
        catch(error) {
          console.log("Storage Error: " + error)
        }
      }
    }
  },
  methods: {
    async handleCsvSubmit() {
      console.log("uploadURL: ", this.csvFileURL)
      try {
        this.csvResult = await axios.get(this.csvFileURL)
        Papa.parse(this.csvResult.data,{
          header: true,
          complete: results => {
            console.log('Complete', results.data.length, 'records.'); 
            this.csvArr = results.data;
            for (let i = 0; i < this.csvArr.length; i++) {
              const record = this.csvArr[i];
              if('opmerkingen' in record) {
                record.opmerkingen = JSON.parse(record.opmerkingen);
              }
            }
          }
        });
        
        this.saveCollectionData(this.csvArr, "data")
        console.log(this.csvArr)
      } catch (error) {
        this.showFormAlert = true
        this.alertMessage = error.message
        console.log(error.message)
      }
    },
    getFileUrl: function(csvFileName) {
      const csvFilePath = "import/" + csvFileName;
      const storageRef = firebase.storage().ref();
      storageRef.child( csvFilePath ).getDownloadURL().then( csvFileURL => {
          this.csvFileURL = csvFileURL
      })
    },
    createFileRef(name) {
        const csvFilePath = "import/" + name;
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child( csvFilePath );
        return fileRef
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
          console.log(docRef)
          this.$emit("success", i + "/" + dataArr.length + " records aangemaakt.")
        }
        this.$emit("success", dataArr.length + " records aangemaakt. Klaar!")
      } catch(error) {
        this.$emit("error", error.message)
      }
    },
  }
}
</script>
