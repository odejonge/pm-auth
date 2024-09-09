<template>
   <b-container class="p-2" >
      <b-form title="EventForm" @submit="onSubmit" @reset="onReset" >
         <b-row >
            <b-col class="col-12 col-md-2 ">
               <h5>Info</h5>
            </b-col>
            <b-col class="col-12 col-md-4 ">
               <b-form-group label="Naam">
                  <form-input 
                     :form="form"
                     @input="$emit('recordDirty')"
                     @blur="$emit('updateRecord')"
                  />
               </b-form-group>
               <b-form-group label="Korte omschrijving">
                  <TextArea :form="form" :property="'omschrijvingKort'" :rows="2" :maxChars="280" 
                     @input="$emit('recordDirty')"            
                     @blur="$emit('updateRecord')" />
               </b-form-group>
            </b-col>
            <b-col class="col-12 col-md-6 ">
                  <b-form-group label="Omschrijving" >
                     <TextArea :form="form" :property="'omschrijving'" :rows="5" :maxChars="560"
                     @input="$emit('recordDirty')"
                     @blur="$emit('updateRecord')" />
                  </b-form-group>
            </b-col>
         </b-row>
         <b-row >
            <b-col class="col-12 col-md-2 "/>
            <b-col class="col-0 col-md-4 ">
               <image-firebase :form="form" />
            </b-col>
            <b-col align-self="end" class="col-12 col-md-6 ">
               <ImageUpload :form="form" />
            </b-col>
         </b-row>
         <b-row >
            <b-col class="col-12 col-md-2 "/>
            <b-col class="col-12 col-md-7 ">
               <b-form-group label="Link / QR code"  >
                  <b-form-input 
                     v-model="form.bookingLink"
                     type="url"
                     @input="$emit('recordDirty')"
                     @blur="$emit('updateRecord')"
                  />
               </b-form-group>
            </b-col>
            <b-col class="col-12 col-md-3 ">
               <b-form-group label="Linktype" >
                  <b-form-select
                     v-model="form.linkType_select" 
                     :options="selectData.linkType" 
                     :value="null"
                     @change="$emit('updateRecord')"
                     />
               </b-form-group>
            </b-col>
         </b-row>
         <b-row >
            <b-col class="col-12 col-md-2 "/>
            <b-col class="col-12 col-md-7 ">
               <tag :form="form" 
                  :selectData="selectData"
                  @recordDirty="$emit('recordDirty')"
                  @updateRecord="$emit('updateRecord')" 
                  />
            </b-col>
            <b-col class="col-12 col-md-3 ">
               <b-form-group label="Bezichtigingsduur" >
                  <b-form-select
                     v-model="form.bezichtingsduur_select" 
                     :options="selectData.bezichtigingsduur" 
                     :value="null"
                     @change="$emit('updateRecord')"
                     />
               </b-form-group>
            </b-col>
         </b-row>
         <rule/>
         <b-row>
            <b-col class="col-12 col-md-2 ">
               <h5>Story-locatie</h5>
            </b-col>
            <b-col class="col-12 col-md-4 ">
               <b-form-group label="Functie" >
                  <b-form-select
                     v-model="form.kavelfunctie_select" 
                     :options="selectData.kavelfunctie" 
                     :value="null"
                     @change="$emit('updateRecord')"
                     />
               </b-form-group>
            </b-col>
            <b-col class="col-6 col-md-3">
               <b-form-group label="District"> 
                  <b-form-select
                     v-model="form.districtType_select" 
                     :options="selectData.districtType"
                     @change="$emit('updateRecord')"
                     />
               </b-form-group>
            </b-col>
            <b-col class="col-6 col-md-3">
               <b-form-group label="Knooppunt" > 
                  <b-form-select
                     v-model="form.knooppunt_select" 
                     :options="selectData.knooppunt"
                     @change="$emit('updateRecord')" 
                     />
               </b-form-group>
            </b-col>
         </b-row>
         <b-row >
            <b-col class="col-12 col-md-2 "/>
            <b-col class="col-12 col-md-10 ">
               <GeoLocation :form="form" :selectData="selectData" 
                  @updateRecord="$emit('updateRecord')" :kavelVisible="true"
                  />
            </b-col>
         </b-row>
         <rule />
         <b-row>
            <b-col class="col-12 col-md-2 "><h5>Organisator - Bedrijf</h5> </b-col>
            <expand-list-bedrijf 
               class="col-12 col-md-10" 
               :form="form" 
               :selectData="selectData" 
               @recordDirty="$emit('recordDirty')"
               @updateRecord="$emit('updateRecord')"
               />
         </b-row>
         <rule />
         <b-row >
            <b-col class="col-12 col-md-2 "><H5>Thema Floriade</H5></b-col>
            <expand-list-thema-floriade
               class="col-12 col-md-10" 
               :form="form" 
               :selectData="selectData"
               @recordDirty="$emit('recordDirty')"
               @updateRecord="$emit('updateRecord')"
               />
         </b-row>
         <rule/>
         <b-row >
            <b-col class="col-12 col-md-2 "><H5>Kennisprogramma</H5></b-col>
            <expand-list-kennisprogramma 
               class="col-12 col-md-10" 
               :form="form" 
               :selectData="selectData"
               @recordDirty="$emit('recordDirty')"
               @updateRecord="$emit('updateRecord')"
               />
         </b-row>
         <rule/>
         <b-row >
            <b-col class="col-12 col-md-2 "><H5>SDG type</H5></b-col>
            <expand-list-sdg-type 
               class="col-12 col-md-10" 
               :form="form" 
               :selectData="selectData"
               @recordDirty="$emit('recordDirty')"
               @updateRecord="$emit('updateRecord')"
               />
         </b-row>
         <rule/>
         <b-row >
            <b-col class="col-12 col-md-2 "><H5>Opmerkingen</H5></b-col>
            <expand-list-opmerkingen
               class="col-12 col-md-10" 
               :form="form" 
               :selectData="selectData"
               @recordDirty="$emit('recordDirty')"
               @updateRecord="$emit('updateRecord')"
               />
         </b-row>
      </b-form>
   </b-container>
</template>

<script>
import GeoLocation from "../components/GeoLocation"
import Rule from "../components/Rule"
import ImageUpload from "../components/image/ImageUpload"
import ImageFirebase from "../components/image/ImageFirebase"
import ExpandListKennisprogramma from "../components/form/ExpandListKennisprogramma"
import ExpandListBedrijf from "../components/form/ExpandListBedrijf"
import ExpandListSdgType from "../components/form/ExpandListSdgType"
import ExpandListOpmerkingen from "../components/form/ExpandListOpmerkingen"
import ExpandListThemaFloriade from "../components/form/ExpandListThemaFloriade"
import TextArea from "../components/TextArea"
import FormInput from "../components/FormInput"
import Tag from "../components/form/Tag"
export default {
   name: "locatie-form",
   props: ["user", "form", "record", "selectData", "recordType"],
   components: {GeoLocation, Rule, ImageUpload, TextArea, ImageFirebase, ExpandListBedrijf, 
      ExpandListSdgType, ExpandListOpmerkingen, ExpandListThemaFloriade, ExpandListKennisprogramma, Tag, FormInput},
   data() {
      return {
        kavelFuncties: ["nationaal", "internationaal", "horeca", "kunst", "toilet"]
      }
   },
   methods: {
      onSubmit(event) {
        event.preventDefault()
        if(this.form.id !== null) {
           this.$emit("updateRecord", this.form)
        } else {
           this.$emit("createRecord", this.form)
        }
      },
      onReset(event) {
        event.preventDefault()
        this.form = {recordType: "story"}
      },
      deleteRecord() {
         this.$emit("deleteRecord", this.form)
      }
   },
}
</script>
<style>
hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
}
</style>

