<template>
  <b-form >
    <b-list-group  class="bg-light m-0"  >
      <b-list-group-item v-for="item in opmerkingen" :key="item.created" class="p-0 border-0">
        <b-row class="m-0" >
         <b-col class="col-11 p-0">
          <b-form-group >
               <b-form-textarea
                  placeholder="Maak een opmerking"
                  v-model="item.opmerking"
                  @input="$emit('recordDirty')"
                  @blur="$emit('updateRecord')" />
          </b-form-group>
         </b-col>
         <b-col class="col-1">
            <b-button pill class="px-3" variant="danger" alt="Verwijderen" @click="deleteItem(item),$emit('updateRecord')">x</b-button>
         </b-col>
        </b-row>
      </b-list-group-item>
      <b-link @click="addItem" style="background:white;">Voeg item toe</b-link>
    </b-list-group>
  </b-form>
</template>
<script>
export default {
  name: "expand-list-opmerkingen",
  props: [ "form", "selectData"],
  data() {
    return {
      opmerkingen: []
    }
  },
  watch: {
    form(value) {
      if(value && value.opmerkingen) {
        this.opmerkingen = value.opmerkingen
      }
    }
  },
  methods: {
    addItem() {
      if(!this.form) return;

      var now = new Date().toString()
      let obj = {created:now}
      this.opmerkingen.push(obj)
      this.form.opmerkingen = this.opmerkingen
    },
    deleteItem(itm) {
      let i
      for ( i = 0; i < this.form.opmerkingen.length; i++) {
        const item = this.form.opmerkingen[i];
        if(itm === item) {
          break;
        }
      }
      this.form.opmerkingen.splice(i, 1)
    },
  },
  
}
</script>
