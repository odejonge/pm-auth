<template>
  <b-container  class="px-0 mb-5 mt-0">
    <b-navbar type="dark" variant="white" class="shadow">
      <b-navbar-nav >
        <b-nav-form class="mt-0">
          <b-form-group>
            <h1>{{ recordTypeText }}</h1>
          </b-form-group>
          <b-form-group class="ml-1 ml-sm-2 ml-md-5">
            <b-form-checkbox size="lg" v-model="form.publiceerbaar" switch
              >Publiceerbaar</b-form-checkbox
            >
          </b-form-group>
          <b-form-group class="ml-1 ml-sm-2 ml-md-5">
            <b-form-checkbox size="lg" v-model="form.zakelijk" switch
              >Zakelijk</b-form-checkbox
            >
          </b-form-group>
        </b-nav-form>
      </b-navbar-nav>
      <b-navbar-nav class="ml-1 ml-auto mr-0">
        <b-nav-form class="mt-0 mt-sm-3">
          <b-button
            @click="showDeleteModal"
            class="ml-sm-3"
            type="submit"
            :disabled="requestPending"
            pill
            variant="secondary"
            >Verwijder</b-button
          >
          <b-button
            @click="updateRecord()"
            class="ml-sm-3 mr-1"
            type="submit"
            :disabled="requestPending"
            pill
            variant="primary"
            >Bewaar</b-button
          >
          <!-- <b-spinner class="ml-2" variant="secundary" v-if="state=='dirty'" label="Spinning"></b-spinner> -->
          <p class="h1 mb-1" v-if="state == 'dirty'">
            <b-icon variant="danger" icon="x" />
          </p>
          <b-spinner
            class="ml-2"
            variant="success"
            v-if="state == 'pending'"
            label="Spinning"
          ></b-spinner>
          <p class="h1 mb-1" v-if="state == 'saved'">
            <b-icon variant="success" icon="check" />
          </p>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
    <b-row v-if="form && form.recordType_select == 'locatie'">
      <b-col>
        <LocatieForm
          :user="user"
          :form="form"
          :selectData="selectData"
          :recordType="recordType"
          :eventTypeState="eventTypeState"
          :geoLocationState="geoLocationState"
          @recordDirty="setRecordDirty"
          @deleteRecord="deleteRecord"
        />
      </b-col>
    </b-row>
    <b-row v-if="form && form.recordType_select == 'event'">
      <b-col>
        <EventForm
          :user="user"
          :form="form"
          :selectData="selectData"
          :recordType="recordType"
          :eventTypeState="eventTypeState"
          :geoLocationState="geoLocationState"
          :startdatumState="startdatumState"
          :starttijdState="starttijdState"
          :einddatumState="einddatumState"
          :eindtijdState="eindtijdState"
          @recordDirty="setRecordDirty"
          @deleteRecord="deleteRecord"
        />
      </b-col>
    </b-row>
    <b-row v-if="form && form.recordType_select == 'story'">
      <b-col>
        <StoryForm
          :user="user"
          :form="form"
          :selectData="selectData"
          :recordType="recordType"
          @recordDirty="setRecordDirty"
          @deleteRecord="deleteRecord"
        />
      </b-col>
    </b-row>
    <b-modal
      id="delete-modal"
      ref="delete-modal"
      hide-footer
      title="Record verwijderen"
    >
      <div class="d-block text-left">
        <p>Record verwijderen?</p>
      </div>
      <b-row>
        <b-col class="d-flex justify-content-end">
          <b-button @click="$bvModal.hide('delete-modal')" variant="secondary"
            >Cancel</b-button
          >
          <b-button class="ml-2" @click="deleteRecord" variant="danger"
            >Delete</b-button
          >
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>
<script>
import EventForm from "./EventForm";
import LocatieForm from "./LocatieForm";
import StoryForm from "./StoryForm";
import db from "../db.js";
export default {
  name: "main-form",
  props: ["user", "selectedRecord", "selectData"],
  components: { EventForm, LocatieForm, StoryForm },
  data: function () {
    return {
      requestPending: false,
      dismissCountDown: 0,
      recordTypeText: "Record",
      oldRecordType: "",
      recordType: "",
      form: {},
      success: null,
      error: null,
      //dirty, pending, saved
      state: "saved",
      naamState: null,
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
    };
  },
  watch: {
    selectedRecord(value) {
      this.updateFormLayout(value);
    },
    recordType(value, oldValue) {
      if (oldValue) {
        this.oldRecordType = oldValue;
      }
    },
    error(value) {
      if (value) {
        this.$emit("makeToast", "Error", value, "danger");
      }
    },
  },
  methods: {
    cancelSwitchRecord(oldRecordType) {
      this.recordType = oldRecordType;
    },
    switchRecord() {
      if (this.selectData) {
        let record = { recordType_select: this.recordType };
        if (this.recordType == "locatie") {
          record.bedrijf = [];
          (record.kennisprogramma = []),
            (record.sdgType = []),
            (record.opmerkingen = []);
          record.themaFloriade = [];
        }
        this.$emit("recordSelected", record);
      }
    },
    setRecordDirty() {
      this.state = "dirty";
      // this.checkFormValidity()
    },
    updateRecord: function () {
      if (!this.checkFormValidity()) {
        this.state = "dirty";
        return;
      }

      this.state = "pending";
      this.requestPending = true;
      //let record = this.getRecord(this.recordType)
      this.error = this.success = null;
      const ref = db.collection("data").doc(this.form.id);
      ref.set(this.form).then(() => {
          this.requestPending = false;
          this.state = "saved";
          this.success = "Record aangepast";
          this.dismissCountDown = 4;
          //this.$emit('navigateTo','/records')
          this.$emit('closeDialog');
        })
        .catch((error) => {
          this.requestPending = false;
          this.error = error.message;
          console.log(error);
        });
    },
    checkFormValidity() {
      let valid = true; 
      this.setValidationStates(true);
      if (this.form.naam_nl == "" || this.form.naam_nl === null) {
        valid = false;
        this.naamState = false;
      }
      if (this.form.recordType_select == null) {
        valid = false;
        this.recordTypeState = false;
      }
      if (this.form.recordType_select == "event" 
        && (this.form.eventType_select == null || this.form.eventType_select == "")) {
        valid = false;
        this.eventTypeState = false;
      }
      if (
        (this.form.recordType_select == "event" || this.form.recordType_select == "locatie") &&
        this.form.latlonlocatie_select == null
      ) {
        valid = false;
        this.geoLocationState = false;
      }
      if (this.form.recordType_select == "event" && !this.form.startdatum_date) {
        valid = false;
        this.startdatumState = false;
      }
      if (
        this.form.recordType_select == "event" &&
        !this.form.starttijd_time
      ) {
        valid = false;
        this.starttijdState = false;
      }
      if (this.form.recordType_select == "event" && !this.form.einddatum_date) {
        valid = false;
        this.einddatumState = false;
      }
      if (this.form.recordType_select == "event" && !this.form.eindtijd) {
        valid = false;
        this.eindtijdState = false;
      }
      return valid;
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
    deleteRecord: function () {
      this.$refs["delete-modal"].hide();
      this.error = this.success = null;
      this.requestPending = true;
      const ref = db.collection("data").doc(this.form.id);
      ref
        .delete()
        .then(() => {
          this.requestPending = false;
          this.success = "Record verwijderd";
          this.dismissCountDown = 4;
          //this.$router.push("/records");
          this.$emit("closeDialog")
        })
        .catch((error) => {
          this.requestPending = false;
          this.error = error.message;
          console.log(error);
        });
    },
    updateFormLayout: function (value) {
      if (value) {
        this.recordType = value.recordType_select;
        this.recordTypeText = this.getItem(
          this.selectData.recordType,
          value.recordType_select
        ).text;
        this.form = value;
      }
    },
    showDeleteModal() {
      this.$refs["delete-modal"].show();
    },
  },
  mounted: function () {
    this.updateFormLayout(this.selectedRecord);
    if (this.selectedRecord && this.selectedRecord.id) {
      db.collection("data")
        .doc(this.selectedRecord.id)
        .onSnapshot((doc) => {
          this.form = doc.data();
          if (this.form != null) {
            this.form.id = doc.id;
            this.updateFormLayout(this.form);
          } else {
            this.form = {};
          }
        });
    }
  },
};
</script>
<style></style>
