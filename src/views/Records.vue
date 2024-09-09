<template>
   <b-container style="margin-top:-80px" class="px-0 mb-5">
      <b-navbar sticky type="dark" variant="white" class="shadow " >
            <b-navbar-nav class="mt-5 " >
               <h1 class="mt-4">Records</h1>
               <div class="ml-4 mt-4 ">
                  <b-button-group class="mt-1 ">
                     <b-button :variant="multiEditMode ? 'outline-primary' : 'primary'" 
                        @click="setMultiEditMode(false)" >Single Edit</b-button>
                     <b-button :variant="multiEditMode ? 'primary' : 'outline-primary'" 
                        @click="setMultiEditMode(true)" >Multi Edit</b-button>
                  </b-button-group>
                  <b-button pill variant="primary" v-if="multiEditMode" disabled class="ml-2 mt-1" >
                        <b-icon font-scale="1.5" icon="pencil" /></b-button>
                  <b-button pill variant="primary" v-if="multiEditMode" :disabled="!isAdmin" @click="deleteSelectedRecords()" class="ml-2 mt-1" >
                        <b-icon font-scale="1.5" icon="trash" /></b-button>
               </div>
               <div class="ml-4 mt-4 " v-if="multiEditMode && selectedRecords.length>0">
                  <h5 class="mt-3">{{selectedRecords.length}} geselecteerd</h5>
               </div>
            </b-navbar-nav>
            <b-navbar-nav class="ml-1 ml-auto mt-5 mr-0">
               <b-nav-form class="mt-0 mt-sm-3">
                  <b-button pill variant="secondary" v-b-toggle.search-collapse class="mb-1" @click="clearSearch">
                        <b-icon font-scale="1.5" icon="search" /></b-button>
                  <b-button pill variant="success" class="ml-2 mb-1" v-b-modal.create-record-dialog >
                        <b-icon font-scale="1.5" icon="plus" /></b-button>
               </b-nav-form>
            </b-navbar-nav>
      </b-navbar>
      <b-collapse id="search-collapse" v-model="preferences.records_search_visible" class="mt-2">
         <b-card>
            <b-row>
               <b-col>
                  <h2>Search</h2>
               </b-col>
            </b-row>
            <b-row >
               <b-col class="col-12 col-sm-6">
                     <b-form-input class="mt-2" 
                        type="text"
                        placeholder="Zoek op naam"
                        v-model="searchQuery"
                        ref="searchInput"
                        />
               </b-col>
               <b-col class="col-6 col-sm-3">
                     <b-form-select class="mt-2"
                        v-model="recordType" 
                        @change="filterRecords"
                        :options="selectData.recordType" 
                        :value="null">
                        <template #first>
                           <b-form-select-option :value="null" >recordtype --</b-form-select-option>
                        </template>
                     </b-form-select>
               </b-col>
               <b-col class="col-6 col-sm-3">
                     <b-form-select class="mt-2"
                        v-model="recordType2" 
                        @change="filterRecords"
                        :options="selectData.recordType" 
                        :value="null">
                        <template #first>
                           <b-form-select-option :value="null" >recordtype --</b-form-select-option>
                        </template>
                     </b-form-select>
               </b-col>
            </b-row>
            <b-row>
               <b-col class="col-6 col-sm-3">
                     <b-form-select class="mt-2"
                        v-model="kavelfunctie" 
                        @change="filterRecords"
                        :options="selectData.kavelfunctie" 
                        :value="null">
                        <template #first>
                           <b-form-select-option :value="null" >kavelfunctie --</b-form-select-option>
                        </template>
                     </b-form-select>
               </b-col>
               <b-col class="col-6 col-sm-3">
                     <b-form-select class="mt-2"
                        v-model="kavelfunctie2" 
                        @change="filterRecords"
                        :options="selectData.kavelfunctie" 
                        :value="null">
                        <template #first>
                           <b-form-select-option :value="null" >kavelfunctie --</b-form-select-option>
                        </template>
                     </b-form-select>
               </b-col>
               <b-col class="col-12 col-sm-6">
                     <b-form-select class="mt-2"
                        v-model="districtType" 
                        @change="filterRecords"
                        :options="selectData.districtType" 
                        :value="null">
                        <template #first>
                           <b-form-select-option :value="null" >districttype --</b-form-select-option>
                        </template>
                     </b-form-select>
               </b-col>
            </b-row>
            <b-row>
               <b-col class="col-12 col-sm-6">
                     <b-form-select class="mt-2"
                        v-model="themaFloriade" 
                        @change="filterRecords"
                        :options="selectData.themaFloriade" 
                        :value="null">
                        <template #first>
                           <b-form-select-option :value="null" >thema --</b-form-select-option>
                        </template>
                     </b-form-select>
               </b-col>
               <b-col class="col-12 col-sm-6">
                     <b-form-select class="mt-2"
                        v-model="kavelnummer" 
                        @change="filterRecords"
                        :options="selectData.kavelnummer" 
                        :value="null">
                        <template #first>
                           <b-form-select-option :value="null" >kavel --</b-form-select-option>
                        </template>
                     </b-form-select>
               </b-col>
            </b-row>
            <b-row>
               <b-col class="col-12 col-sm-6">
                     <b-form-input class="mt-2"
                        v-model="startdatum"
                        type="date"
                        @change="filterRecords"
                        @emptied="filterRecords"
                        />
               </b-col>
               <b-col class="col-12 col-sm-6">
                     <b-form-input class="mt-2"
                        v-model="einddatum"
                        type="date"
                        @change="filterRecords"
                        @emptied="filterRecords"
                        />
               </b-col>
            </b-row>
         </b-card>
      </b-collapse>
      <b-row class="mr-2 mt-4" align-h="end" >
         <b-col class="ml-3 col-3 mr-auto" v-if="multiEditMode">
            <b-form-group 
               label-cols-md 
               label="Select pagina:">
               <b-form-checkbox v-model="selectAll" class="mt-2" @change="updateSelectAll"/> 
            </b-form-group>
         </b-col>
         <b-col class="col-4">
            <b-form-group label-for="input" 
               label-cols-md 
               label="Records per pagina:">
               <b-form-input class="col-9" id="input" type="number" v-model="recordsPerPage" /> 
            </b-form-group>
         </b-col>
         <b-col md="auto"> 
            <b-form-group label-for="input" 
               label-cols-md 
               :label="(filteredRecords ? filteredRecords.length : '#') + ' records'">
            <b-pagination
               v-model="currentPage"
               :total-rows="rows"
               :per-page="recordsPerPage"
               aria-controls="recordTable"
               />
            </b-form-group>
         </b-col>
      </b-row>
      <b-row class="mt-0 ml-1 mr-1"    >
         <b-col class="col-12">
            <b-table striped hover ref="recordTable" 
               id="recordTable"
               selectable
               :per-page="recordsPerPage"
               :current-page="currentPage"
               select-mode="range"
               @row-clicked="recordSelected"
               @row-selected="onRowSelected"
               :items="filteredRecords" 
               :fields="recordFields">
               <template #cell(selected)="{ rowSelected }">
                  <template v-if="rowSelected">
                     <span aria-hidden="true">&check;</span>
                     <span class="sr-only">Selected</span>
                  </template>
                  <template v-else>
                     <span aria-hidden="true">&nbsp;</span>
                     <span class="sr-only">Not selected</span>
                  </template>
               </template>
            </b-table>
         </b-col>
      </b-row>
      <edit-record-dialog :user="user" :selectedRecord="selectedRecord" :selectData="selectData" @closeDialog="closeDialog" />
      <create-record-dialog  :selectData="selectData" @recordSelected="recordSelected"  />
   </b-container>
</template>

<script>
import db from "../db.js"
import CreateRecordDialog from "../components/dialog/CreateRecordDialog.vue";
import EditRecordDialog from "../components/dialog/EditRecordDialog.vue";


export default {
   name: "records",
   props: ["user", "record", "selectData", "preferences", "isAdmin"],
   components: { CreateRecordDialog, EditRecordDialog },
   data() {
      return {
         selectAll: false,
         recordsPerPage: 15,
         currentPage: 1,
         selectedRecords:[],
         multiEditMode: false,
         recordType: null,
         recordType2: null,
         selectedRecord: null,
         kavelfunctie: null,
         kavelfunctie2: null,
         districtType: null,
         themaFloriade: null,
         kavelnummer: null,
         startdatum: null,
         einddatum: null,
         filteredRecords: null,
         searchQuery: "",
         records: [],
         recordFields: [
            {key:"naam_nl", label:"Naam", sortable: true},
            {key:"recordType_select", label:"Record", sortable: true},
            {key:"startdatum_date", label:"Datum", sortable: true},
            {key:"kavelnummer_select", label:"Kavel", sortable: true},
         ],
      }
   },
   watch: {
      searchQuery: function() {
         this.filterRecords()
      },
      selectedRecords: function(value) {
         if(value && value.length==0) {
            this.selectAll = false;
         }
      }
   },
   computed: {
      rows() {
        return this.filteredRecords ? this.filteredRecords.length : 0;
      }
   },
   methods: {
      deleteSelectedRecords() {
         if(!this.isAdmin) {
            this.$bvModal.msgBoxOk('Je hebt geen rechten om records te verwijderen.')
            return;
         }
         if(!this.selectedRecords || this.selectedRecords.length == 0) {
            this.$bvModal.msgBoxOk('Selecteer eerst records voor je ze kunt verwijderen.')
            return;
         }
         this.$bvModal.msgBoxConfirm('Weet je zeker dat je '+ this.selectedRecords.length + ' records wilt verwijderen?', {
            title: 'Verwijder records',
            size: 'md',
            buttonSize: 'md',
            okVariant: 'danger',
            okTitle: 'Ja',
            cancelTitle: 'Nee',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: false
         })
         .then(goOn => {
            if(goOn) {
               this.deleteRecords([...this.selectedRecords]);
            }  
         })
         .catch(err => {
            console.log(err.message)
         })
      },
      async deleteRecords(records) {
         records.map(async (record) => { 
            console.log(record.id + " will be deleted.")
            await this.deleteRecord(record)
         })
      },
      async deleteRecord(record) {
         const recordRef = db.collection("data").doc(record.id)
         return recordRef.delete()
      },
      updateSelectAll() {
         if(this.selectAll) {
            this.$refs.recordTable.selectAllRows();
         } else {
            this.$refs.recordTable.clearSelected();
         }
      },
      setMultiEditMode(value) {
         this.multiEditMode = value;
         if(this.multiEditMode) {
            this.recordFields.unshift("selected");
         } else {
            this.$nextTick(()=>{
               this.recordFields.shift()
            })  
            this.$refs['recordTable'].clearSelected();
         }
      },
      onRowSelected(items) {
        this.selectedRecords = items;
        console.log(this.selectedRecords)
      },
      getRecords() {
         const recordRef = db.collection("data")
         recordRef.onSnapshot(colRef => {
            this.records = [];
            colRef.forEach(doc => {
               const record = doc.data()
               record.id = doc.id
               this.records.push(record)
            });
            this.filteredRecords = this.records
            this.filterRecords();
         })
      },
      filterRecords: function() {
         this.filteredRecords = this.records
         this.filteredRecords = this.records.filter(record => {
            let displName = ""
            if(record.naam_nl){
               displName = record.naam_nl.toLowerCase()
            } 
            const searchQuery = this.searchQuery.toLowerCase()
            const recType = record.recordType_select
            const recType2 = record.recordType2_select
            const kavelFunc = record.kavelfunctie_select
            const kavelFunc2 = record.kavelfunctie2_select
            const districtTy = record.districtType_select
            const startDat = record.startdatum_date
            const eindDat = record.einddatum_date
            let themaFlor = ""
            if(record.themaFloriade) {
               for (let i = 0; i < record.themaFloriade.length; i++) {
                  const element = record.themaFloriade[i];
                  themaFlor += element.themaFloriade_select
               }
            }
            let kavelnu = ""
            if(record.latlonlocatie_select){
               kavelnu = record.latlonlocatie_select.cluster
            }
            
            return (this.searchQuery == "" || displName.indexOf(searchQuery) != -1) 
               && (this.recordType === null || this.recordType === recType )
               && (this.recordType2 === null || this.recordType2 === recType2 )
               && (this.kavelfunctie === null || this.kavelfunctie === kavelFunc )
               && (this.kavelfunctie2 === null || this.kavelfunctie2 === kavelFunc2 )
               && (this.districtType === null || this.districtType === districtTy )
               && (this.themaFloriade === null || themaFlor.indexOf(this.themaFloriade) != -1 )
               && (this.kavelnummer === null || kavelnu.indexOf(this.kavelnummer) != -1 )
               && (!this.startdatum || new Date(this.startdatum).getTime() <= new Date(startDat).getTime() )
               && (!this.einddatum || new Date(this.einddatum).getTime() >= new Date(eindDat).getTime() )
         })
        
      },
      recordSelected: function(item) {
         if(!this.multiEditMode) {
            this.selectedRecord = item
            this.$bvModal.show("edit-record-dialog")
            //this.$emit("recordSelected", item)
         }
      },
      clearSearch: function() {
         this.searchQuery = "";
         this.recordType = null;
         this.recordType2 = null;
         this.kavelfunctie = null;
         this.kavelfunctie2 = null;
         this.districtType = null;
         this.themaFloriade = null;
         this.kavelnummer = null;
         this.startdatum = null;
         this.einddatum = null;
         this.filterRecords();
      },
      closeDialog: function() {
         this.$bvModal.hide('edit-record-dialog')
      }
   },
   mounted: function() {

      this.getRecords()
   }
}
</script>


