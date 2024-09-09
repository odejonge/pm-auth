<template>
<b-card no-body header-bg-variant="primary" class="border-0" >
  <b-tabs active-nav-item-class="font-weight-bold" small card  >
    <b-tab :title="title_nl" >
      <b-form-input 
          v-model="form.naam_nl"
          @input="$emit('input'),updateHeader('nl')"
          @blur="$emit('blur')"
          type="text"
          required
      />
    </b-tab>
    <b-tab ref="en" :title="title_en">
      <b-form-input 
          v-model="form.naam_en"
          @input="$emit('input'),updateHeader('en')"
          @blur="$emit('blur')"
          type="text"
          required
      />
    </b-tab>
    <b-tab :title="title_de">
      <b-form-input 
          v-model="form.naam_de"
          @input="$emit('input'),updateHeader('de')"
          @blur="$emit('blur')"
          type="text"
          required
      />
    </b-tab>
  </b-tabs>
</b-card>
</template>
<script>
export default {
  name: "form-input",
  props: ["form"],
  data() {
    return {
      title_nl: null,
      title_en: null,
      title_de: null
    }
  },
  methods: {
    updateHeader(lang) {
      if(!this.form["naam_" + lang] ) {
        this["title_" + lang] = lang + "*"
      } else {
        this["title_" + lang] = lang
      }
    }
  },
  mounted() {
    this.updateHeader("nl")
    this.updateHeader("en")
    this.updateHeader("de")
  }
  
}
</script>
<style>
.card-header {
   background-color: #ffffff;
}
</style>
