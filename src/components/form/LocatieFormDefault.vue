<template>
   <div>
      <b-row >
         <b-col class="col-12 mb-3">
            <h4>{{this.capitalize( form.kavelfunctie_select )}}</h4>
         </b-col>
      </b-row>
      <b-row>
         <b-col class="col-12 col-md-2 "><h5>Bedrijven</h5> </b-col>
         <expand-list-bedrijf 
            class="col-12 col-md-10" 
            :form="form" 
            :selectData="selectData" 
            @recordDirty="$emit('recordDirty')"
            @updateRecord="$emit('updateRecord')"/>
      </b-row>
      <rule />
      <b-row >
         <b-col class="col-12 col-md-2 "><H5>Thema Floriade</H5></b-col>
         <expand-list-thema-floriade
            class="col-12 col-md-10" 
            :form="form" 
            :selectData="selectData"
            @recordDirty="$emit('recordDirty')"
            @updateRecord="$emit('updateRecord')" />
      </b-row>
      <rule/>
      <b-row >
         <b-col class="col-12 col-md-2 "><H5>Kennisprogramma</H5></b-col>
         <expand-list-kennisprogramma 
            class="col-12 col-md-10" 
            :form="form" 
            :selectData="selectData"
            @recordDirty="$emit('recordDirty')"
            @updateRecord="$emit('updateRecord')" />
      </b-row>
      <rule/>
      <b-row >
         <b-col class="col-12 col-md-2 "><H5>SDG type</H5></b-col>
         <expand-list-sdg-type 
            class="col-12 col-md-10" 
            :form="form" 
            :selectData="selectData"
            @recordDirty="$emit('recordDirty')"
            @updateRecord="$emit('updateRecord')" />
      </b-row>
      <rule/>
      <b-row >
         <b-col class="col-12 col-md-2 "><H5>Opmerkingen</H5></b-col>
         <expand-list-opmerkingen
            class="col-12 col-md-10" 
            :form="form" 
            :selectData="selectData"
            @recordDirty="$emit('recordDirty')"
            @updateRecord="$emit('updateRecord')" />
      </b-row>
      <rule/>
   </div>
</template>
<script>
import Rule from "../Rule"
import ExpandListKennisprogramma from "./ExpandListKennisprogramma"
import ExpandListBedrijf from "./ExpandListBedrijf"
import ExpandListSdgType from "./ExpandListSdgType"
import ExpandListOpmerkingen from "./ExpandListOpmerkingen"
import ExpandListThemaFloriade from "./ExpandListThemaFloriade"
export default {
   name:"locatie-form-default",
   props: ["form", "selectData"],
   components: {Rule, ExpandListKennisprogramma, ExpandListBedrijf, 
      ExpandListSdgType, ExpandListOpmerkingen, ExpandListThemaFloriade},
   data() {
      return {
        contactTypes: ["floriade", "deelnemer", "sub-deelnemer"],
        themaTypes: ["hoofd", "sub"],
      }
   },
   mounted() {
      delete this.form.reserveringsTel
      delete this.form.menuLink
      delete this.form.reserveringsLink
   }
}
</script>
