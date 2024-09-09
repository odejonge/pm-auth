<template>
   <b-card no-body header-bg-variant="primary" class="border-0">
      <b-tabs active-nav-item-class="font-weight-bold" small card >
         <b-tab :title="title_nl" >
            <b-form-textarea 
               v-model="form[property + '_nl']"
               @keyup="liveCountDown('nl'),updateHeader('nl')" 
               :rows="rows"
               :state="valid_nl"
               @input="$emit('input')"
               @blur="$emit('blur')"
            />
            <p class="ml-2 mb-0"><small>Karakters: <span :class="textColor_nl">{{totalRemainCount_nl}}</span></small></p>
         </b-tab>
         <b-tab :title="title_en" >
            <b-form-textarea 
               v-model="form[property + '_en']"
               @keyup="liveCountDown('en'),updateHeader('en')" 
               :rows="rows"
               :state="valid_en"
               @input="$emit('input')"
               @blur="$emit('blur')"
            />
            <p class="ml-2"><small>Karakters: <span :class="textColor_en">{{totalRemainCount_en}}</span></small></p>
         </b-tab>
         <b-tab :title="title_de" >
            <b-form-textarea 
               v-model="form[property + '_de']"
               @keyup="liveCountDown('de'),updateHeader('de')" 
               :rows="rows"
               :state="valid_de"
               @input="$emit('input')"
               @blur="$emit('blur')"
            />
            <p class="ml-2"><small>Karakters: <span :class="textColor_de">{{totalRemainCount_de}}</span></small></p>
         </b-tab>
      </b-tabs>
   </b-card>
</template>
<script>
export default {
   name: "text-area",
   props: ["form", "rows", "property", "maxChars"],
   data() {
      return {
         totalRemainCount_nl: null,
         totalRemainCount_en: null,
         totalRemainCount_de: null,
         valid_nl: null,
         valid_en: null,
         valid_de: null,
         textColor_nl: 'text-primary',
         textColor_en: 'text-primary',
         textColor_de: 'text-primary',
         title_nl: null,
         title_en: null,
         title_de: null
      }
   },
   watch: {
      valid_nl (value) {
         if (value !== false) {
            this.textColor_nl = "text-primary"
         } else {
            this.textColor_nl = "text-danger"
         }
      },
      valid_en (value) {
         if (value !== false) {
            this.textColor_en = "text-primary"
         } else {
            this.textColor_en = "text-danger"
         }
      },
      valid_de (value) {
         if (value !== false) {
            this.textColor_de = "text-primary"
         } else {
            this.textColor_de = "text-danger"
         }
      },
   },
   methods: {
      updateHeader(lang) {
         if(!this.form[this.property + "_" + lang] ) {
            this["title_" + lang] = lang + "*"
         } else {
         this["title_" + lang] = lang
         }
      },
      liveCountDown: function(lang) {
         const prop = this.property + '_' + lang
         const textLength = (this.form[prop] ? this.form[prop].length : 0)
         const totalRemainCount = 'totalRemainCount_' + lang
         this[totalRemainCount] = this.maxChars - textLength;
         this.valid = (this[totalRemainCount] >= 0 ? null : false);
      }        
   },
   mounted() {
      this.updateHeader("nl")
      this.updateHeader("en")
      this.updateHeader("de")
      this.$nextTick(()=> {
         if(!this.maxChars) {
            this.maxChars = 280
         }
         this.liveCountDown('nl')
         this.liveCountDown('en')
         this.liveCountDown('de')
      })
      
   }
}
</script>
<style>
.card-header {
   background-color: #ffffff;
}
</style>

