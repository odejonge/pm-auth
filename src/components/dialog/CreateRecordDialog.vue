<template>
  <b-modal id="create-record-dialog" hide-footer title="Maak een record aan"
      @hidden="clearCreateRecordForm" >
      <div class="d-block text-left">
        <p>Selecteer een type record en voer een naam in.</p>
      </div>
      <!-- <b-form ref="createRecordForm" class="mb-4" @submit.stop.prevent="handleSubmit" > -->
        <b-row >
            <b-col >
               <b-form-group label="Naam (nl)" :invalid-feedback="naamInvalidFeedback" :state="naamState"  >
                  <b-form-input  
                    required
                    :state="naamState"
                    v-model="form.naam_nl" 
                    aria-describedby="errorFeedbackName"/>
               </b-form-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
               <b-form-group label="Recordtype" :invalid-feedback="recordTypeInvalidFeedback"  >
                  <b-form-select 
                    required
                    :state="recordTypeState"
                    v-model="recordType"
                    :options="recordTypeOptions" />
               </b-form-group>
            </b-col>
            <b-col v-if="recordType=='event'">
               <b-form-group label="Eventtype" :invalid-feedback="eventTypeInvalidFeedback"  >
                  <b-form-select
                    :state="eventTypeState"
                    v-model="form.eventType_select" 
                    :options="selectData.eventType" 
                    :value="null"
                    @change="$emit('updateRecord')"
                    />
               </b-form-group>
            </b-col>
        </b-row>
         <b-row v-if="recordType=='event' || recordType=='locatie'">
           <b-col>
               <GeoLocation :form="form" :selectData="selectData" :kavelVisible="false" 
                     @updateRecord="$emit('updateRecord')" :state="geoLocationState"/>
           </b-col>
         </b-row>
         <b-row v-if="recordType=='event'">
            <b-col class="col-6">
               <b-form-group label="Startdatum" :invalid-feedback="startdatumInvalidFeedback" >
                  <b-form-input
                     v-model="startdatum"
                     :state="startdatumState"
                     type="date"
                     @input="$emit('recordDirty')"
                     @blur="$emit('updateRecord')"
                     />
               </b-form-group>
            </b-col>
            <b-col class="col-6">
               <b-form-group label="Starttijd" :invalid-feedback="starttijdInvalidFeedback"  >
                  <b-form-input
                     v-model="starttijd"
                     :state="starttijdState"
                     type="time"
                     @input="$emit('recordDirty')"
                     @blur="$emit('updateRecord')"
                     />
               </b-form-group>
            </b-col>
          </b-row>
          <b-row v-if="recordType=='event'">
            <b-col class="col-6">
               <b-form-group label="Einddatum" :invalid-feedback="einddatumInvalidFeedback" >
                  <b-form-input
                     v-model="einddatum"
                     :state="einddatumState"
                     type="date"
                     @input="$emit('recordDirty')"
                     @blur="$emit('updateRecord')"
                     />
               </b-form-group>
            </b-col>
            <b-col class="col-6">
               <b-form-group label="Eindtijd" :invalid-feedback="eindtijdInvalidFeedback"  >
                  <b-form-input
                     v-model="eindtijd"
                     :state="eindtijdState"
                     type="time"
                     @input="$emit('recordDirty')"
                     @blur="$emit('updateRecord')"
                     />
               </b-form-group>
            </b-col>
         </b-row>
        <b-row>
            <b-col class="d-flex justify-content-end mt-4">
              <b-button @click="hideCreateRecordModal" variant="secondary" :disabled="requestPending" >Cancel</b-button>
              <b-button ref="submitButton" class="ml-2" :disabled="requestPending"
              @click="handleSubmit" type="submit" variant="primary" >Aanmaken</b-button> 
            </b-col>
        </b-row>
      <!-- </b-form> -->
  </b-modal>
</template>
<script>
import db from "../../db.js"
import GeoLocation from "../../components/GeoLocation";
export default {
  name: "create-record-dialog",
  props: ["selectData"],
  components: {GeoLocation},
  data() {
    return {
      requestPending: false,
      recordType: null,
      recordTypeOptions: [{text:"Locatie", value:"locatie" },{text: "Event", value:"event"},{text: "Story", value:"story"}],
      startdatum: this.getToday(),
      starttijd: "09:00",
      einddatum: this.getToday(),
      eindtijd: "17:00",
      naamState: null,
      recordTypeState: null,
      eventTypeState: null,
      geoLocationState: null,
      startdatumState: null,
      starttijdState: null,
      einddatumState: null,
      eindtijdState: null,
      naamInvalidFeedback: "Vul een naam in.",
      recordTypeInvalidFeedback: "Kies een recordtype.",
      eventTypeInvalidFeedback: "Kies een eventType.",
      geoLocationInvalidFeedback: "Kies een locatie.",
      startdatumInvalidFeedback: "Kies een startdatum.",
      starttijdInvalidFeedback: "Kies een starttijd.",
      einddatumInvalidFeedback: "Kies een einddatum.",
      eindtijdInvalidFeedback: "Kies een eindtijd.",
      form:{naam_nl: null },
    }
  },
  methods :{
    handleSubmit() {
      if (!this.checkFormValidity()) {
        return
      }
      this.requestPending = true
      const self = this
      this.form.recordType_select = this.recordType
      if(this.form.recordType_select == "event") {
        this.form.startdatum_date = this.startdatum
        this.form.starttijd_time = this.starttijd
        this.form.einddatum_date = this.einddatum
        this.form.eindtijd = this.eindtijd
      }
      db.collection("data").add(this.form)
        .then(docRef => {
            self.form.id = docRef.id
            self.$emit('recordSelected', self.form)
            self.hideCreateRecordModal();

          this.requestPending = false;
        }).catch(error => {
          this.requestPending = false;
          console.log(error)
        }) 

    },
    checkFormValidity() {
      let valid = true
      this.setValidationStates(true)
      if(this.form.naam_nl == "" || this.form.naam_nl === null) {
        valid = false;
        this.naamState = false;
      }
      if(this.recordType == null) {
        valid = false;
        this.recordTypeState = false;
      }
      if(this.recordType == "event" && this.form.eventType_select == null) {
        valid = false;
        this.eventTypeState = false
      }
      if((this.recordType == "event" || this.recordType == "locatie") && this.form.latlonlocatie_select == null) {
        valid = false;
        this.geoLocationState = false
      }
      if(this.recordType == "event" && this.startdatum == null) {
        valid = false;
        this.startdatumState = false
      }
      if(this.recordType == "event" && (this.starttijd == null || this.starttijd.length < 5)) {
        valid = false;
        this.starttijdState = false
      }
      if(this.recordType == "event" && this.einddatum == null) {
        valid = false;
        this.einddatumState = false
      }
      if(this.recordType == "event" && this.eindtijd == null) {
        valid = false;
        this.eindtijdState = false
      }
      return valid
    },
    setValidationStates(value){
      this.naamState = value;
      this.recordTypeState = value;
      this.eventTypeState = value;
      this.geoLocationState = value;
      this.startdatumState = value;
      this.starttijdState = value;
      this.einddatumState = value;
      this.eindtijdState = value;
    },
    clearCreateRecordForm() {
        this.form.naam_nl = null;
        this.recordType = null;
        this.form.eventType_select = null;
        this.form.startdatum_date = null;
        this.form.starttijd_time = null;
        this.form.einddatum_date = null;
        this.form.eindtijd_time = null;

        this.naamState = null;
        this.recordTypeState = null;
        this.eventTypeState = null;
        this.geoLocationState = null;
        this.startdatumState = null;
        this.starttijdState = null;
        this.einddatumState = null;
        this.eindtijdState = null;
    },
    hideCreateRecordModal() {
        this.clearCreateRecordForm()
        this.$bvModal.hide('create-record-dialog')
    },
    handleOK() {
        this.handleSubmit()
    },
    getToday() {
      const date = new Date().toISOString().slice(0,10)
      return date
    }
  }
}
</script>
