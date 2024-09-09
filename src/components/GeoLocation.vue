<template>
   <b-row>
      <b-col class="col-6 col-md-2 " v-if="kavelVisible" >
         <b-form-group label="Kavelnummer" :invalid-feedback="kavelInvalidFeedback" >
            <b-form-select
               @change="kavelnummerSelected"
               v-model="kavelnummer"
               :options="selectData.kavelnummer"
               :state="state"
               type="number"
            />
         </b-form-group>
      </b-col>
      <b-col :class="kavelVisible ? 'col-6 col-md-4' : 'col-12 col-md-6' ">
         <b-form-group label="Kavel/Cluster/Locatie" :invalid-feedback="latlonInvalidFeedback"    >
            <b-form-select
               @change="latlonlocatieSelected"
               v-model="latlonlocatie"
               :options="selectData.latlonlocatie"
               :state="state"
               type="number"
            />
         </b-form-group>
      </b-col>
      <b-col :class="kavelVisible ? 'col-6 col-md-3' : 'col-12 col-md-6' " v-if="kavelVisible">
         <b-form-group label="Latitude">
            <b-form-input 
               :value="getLatLon(latlonlocatie, 'lat')"
               type="text"
               disabled
            />
         </b-form-group>
      </b-col>
      <b-col :class="kavelVisible ? 'col-6 col-md-3' : 'col-12 col-md-6' " v-if="kavelVisible">
         <b-form-group label="Longitude">
            <b-form-input
               :value="getLatLon(latlonlocatie, 'lon')"
               type="text"
               disabled
            />
         </b-form-group>
      </b-col>
   </b-row>
</template>
<script>
export default {
   name: "geo-location",
   props: ["kavelVisible", "form", "selectData", "state"],
   data() {
      return {
         kavelnummer: null,
         latlonlocatie: null,
         kavelInvalidFeedback: "Vul kavel in.",
         latlonInvalidFeedback: "Vul een locatie in.",
         latlonValidState: null,
      }
   },
   watch: {
      form(value) {
         if(value) {
            this.latlonlocatie = value.latlonlocatie_select
            this.kavelnummer = value.kavelnummer_select
         }
      }
   },
   methods: {
      getLatLon(latlonlocatie, index) {
         if(latlonlocatie) {
            return latlonlocatie[index]
         }
         return ""
      },
      kavelnummerSelected() {
         this.form.kavelnummer_select = this.kavelnummer
         this.selectLatlonLocatie()
         this.updateRecordDelayed()
      },
      latlonlocatieSelected() {
         this.form.latlonlocatie_select = this.latlonlocatie
         this.selectKavelnummer(this.latlonlocatie)
         this.updateRecordDelayed()
      },
      updateRecordDelayed() {
         this.$nextTick( ()=> {
            this.$emit("updateRecord")
         })
      },
      selectKavelnummer(latlonlocatie) {
         console.log(latlonlocatie)
         const cluster = latlonlocatie.cluster.split("/")
         for (let j = 0; j < cluster.length; j++) {
            const kavel = cluster[j];
            let found = false
            for (let i = 0; i < this.selectData.kavelnummer.length; i++) {
               const kavelnummer = this.selectData.kavelnummer[i].value;
               if(kavel === kavelnummer) {
                  found = true
                  this.kavelnummer = kavelnummer
                  this.form.kavelnummer_select = kavelnummer
                  found = true
                  break;
               }
            }
            if(found) {
               break;
            }
         }
      },
      selectLatlonLocatie() {
         for (let i = 0; i < this.selectData.latlonlocatie.length; i++) {
            const item = this.selectData.latlonlocatie[i];
            const cluster = item.value.cluster.split("/")
            let found = false
            for (let j = 0; j < cluster.length; j++) {
               const kavel = cluster[j];
               if(kavel === this.kavelnummer) {
                  this.latlonlocatie = item.value
                  this.form.latlonlocatie_select = this.latlonlocatie
                  found = true
                  break;
               }
            }
            if(found) {
               break;
            }
         }
      },
   }
}
</script>
