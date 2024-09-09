<template>
   <div>
      <b-row >
         <b-col class="col-12 col-md-2 ">
            <h5>{{this.capitalize( form.kavelfunctie_select )}}</h5>
         </b-col>
         <b-col class="col-12 col-md-4 ">
         <b-form-group label="Reserveringstelefoonnummer" >
            <b-form-input 
               v-model="form.reserveringsTel"
               type="tel"
               @input="$emit('recordDirty')"
               @blur="$emit('updateRecord')"
               />
         </b-form-group>
         </b-col>
         <b-col class="col-6 col-md-3">
         <b-form-group label="Menulink" >
            <b-form-input 
               v-model="form.menuLink"
               type="url"
               @input="$emit('recordDirty')"
               @blur="$emit('updateRecord')"
               />
         </b-form-group>
         </b-col>
         <b-col class="col-6 col-md-3">
            <b-form-group label="Reserveringslink" >
               <b-form-input 
                  v-model="form.reserveringsLink"
                  type="url"
                   @input="$emit('recordDirty')"
                  @blur="$emit('updateRecord')"
                  />
            </b-form-group>
         </b-col>
      </b-row>
   </div>
</template>
<script>
export default {
   name:"locatie-form-horeca",
   props: ["form"],
   mounted() {
      delete this.form.bedrijf
      delete this.form.kennisprogramma
      delete this.form.opmerkingen
      delete this.form.sdgType
      delete this.form.themaFloriade
   }
}
</script>
