<template>
   <b-container class="p-2">
      <b-form title="LocatieForm" @submit="onSubmit" @reset="onReset" >
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
               <b-form-group label="Korte omschrijving" >
                  <TextArea :form="form" :property="'omschrijvingKort'" :rows="2" :maxChars="280" 
                     @input="$emit('recordDirty')"
                     @blur="$emit('updateRecord')"  />
               </b-form-group>
            </b-col>
            <b-col class="col-12 col-md-6 ">
                  <b-form-group label="Omschrijving" >
                     <TextArea :form="form" :property="'omschrijving'" :rows="9" :maxChars="560"
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
                     @change="$emit('updateRecord')"
                     :value="null"
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
               <h5>Kavel</h5>
            </b-col>
            <b-col class="col-6 col-md-2 ">
               <b-form-group label="Kavelfunctie 1 (verplicht)" >
                  <b-form-select
                     v-model="form.kavelfunctie_select" 
                     :options="selectData.kavelfunctie" 
                     :value="null"
                     @change="$emit('updateRecord')"/>
               </b-form-group>
            </b-col>
            <b-col class="col-6 col-md-2 ">
               <b-form-group label="Kavelfunctie 2 (optioneel)" >
                  <b-form-select
                     v-model="form.kavelfunctie2_select" 
                     :options="selectData.kavelfunctie" 
                     :value="null"
                     @change="$emit('updateRecord')"/>
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
               <GeoLocation :form="form" :selectData="selectData" :state="geoLocationState"
                  @updateRecord="$emit('updateRecord')" :kavelVisible="true"
                  />
            </b-col>
         </b-row>
         <b-row>
            <b-col>
               <Rule v-if="form.kavelfunctie_select !== undefined"/>  
               <b-row  v-if="form.kavelfunctie_select != 'horeca'">
                  <b-col>
                     <LocatieFormDefault 
                        :form="form" 
                        :selectData="selectData"
                        @recordDirty="$emit('recordDirty')"
                        @updateRecord="$emit('updateRecord')" />
                  </b-col>
               </b-row>
               <b-row v-if="form.kavelfunctie_select == 'horeca'">
                  <b-col>
                     <LocatieFormHoreca 
                        :form="form"
                        @input="$emit('recordDirty')"
                        @recordDirty="$emit('recordDirty')"
                        @updateRecord="$emit('updateRecord')" />
                  </b-col>
               </b-row>
            </b-col>
         </b-row>
      </b-form>
   </b-container>
</template>

<script>
import Rule from "../components/Rule"
import ImageUpload from "../components/image/ImageUpload"
import TextArea from "../components/TextArea"
import FormInput from "../components/FormInput"
import LocatieFormDefault from "../components/form/LocatieFormDefault"
import LocatieFormHoreca from  "../components/form/LocatieFormHoreca"
import ImageFirebase from "../components/image/ImageFirebase"
import GeoLocation from "../components/GeoLocation"
import { setTimeout } from 'timers';
import Tag from "../components/form/Tag"

export default {
   name: "locatie-form",
   props: ["user", "form", "selectData", "recordType", "geoLocationState"],
   components: {Rule, ImageUpload, TextArea, LocatieFormDefault, LocatieFormHoreca, ImageFirebase, Tag, GeoLocation, FormInput},
   data() {
      return {
      }
   },
   methods: {
      selectLatlonLocatie() {
         setTimeout(() => {
            if(this.form && this.form.kavelnummer && this.selectData && this.selectData.latlonlocatie) {
               let found = false
               for (let i = 0; i < this.selectData.latlonlocatie.length; i++) {
                  const element = this.selectData.latlonlocatie[i];
                  const cluster = element.cluster.trim()
                  const clusterArr = cluster.split("/")
                  for (let j = 0; j < clusterArr.length; j++) {
                     const clusterNr = clusterArr[j].trim();
                     if(Number(this.form.kavelnummer) == Number(clusterNr)) {
                        this.form.latlonlocatie = element.value
                        found = true
                        break;
                     }
                  }
                  if (found) break;
               }
            }
         }, 200)
      },
      getLatLon(latlonlocatie, index) {
         if(latlonlocatie) {
            return latlonlocatie[index]
         }
         return ""
      },
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
        this.form = {recordType: "locatie"}
      },
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

