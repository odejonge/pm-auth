<template>
  <b-form >
    <b-list-group  class="bg-light m-0"  >
      <b-list-group-item v-for="item in kennisprogramma" :key="item.created" class="p-0 border-0">
        <b-row class="m-0" >
         <b-col class="col-6 p-0">
          <b-form-group >
               <b-form-select
                  v-model="item.kennisprogramma_select"
                  :options="selectData.kennisprogramma"
                  @change="$emit('updateRecord')" 
                  />
          </b-form-group>
         </b-col>
         <b-col class="col-5 ">
          <b-form-group>
               <b-form-select
                  v-model="item.kennisprogrammaType_select"
                  :options="selectData.kennisprogrammaType"
                  @change="$emit('updateRecord')"
                  />
          </b-form-group>
         </b-col>
         <b-col class="col-1">
            <b-button pill class="px-3" variant="danger" alt="Verwijderen" 
              @click="deleteItem(item),$emit('updateRecord')">x</b-button>
         </b-col>
        </b-row>
      </b-list-group-item>
      <b-link @click="addItem" style="background:white;">Voeg item toe</b-link>
    </b-list-group>
  </b-form>
</template>
<script>
export default {
  name: "expand-list-kennisprogramma",
  props: [ "form", "selectData"],
  data() {
    return {
      kennisprogramma: []
    }
  },
  watch: {
    form(value) {
      if(value && value.kennisprogramma) {
        this.kennisprogramma = value.kennisprogramma
      }
    }
  },
  methods: {
    addItem() {
      if(!this.form) return;

      var now = new Date().toString()
      let obj = {kennisprogramma_select: null, 
        kennisprogrammaType_select: null, created:now}
      this.kennisprogramma.push(obj)
      this.form.kennisprogramma = this.kennisprogramma
    },
    deleteItem(itm) {
      let i
      for ( i = 0; i < this.form.kennisprogramma.length; i++) {
        const item = this.form.kennisprogramma[i];
        if(itm === item) {
          break;
        }
      }
      this.form.kennisprogramma.splice(i, 1)
    },
  },
  
}
</script>
