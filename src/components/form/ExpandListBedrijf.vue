<template>
  <b-form >
    <b-list-group  class="bg-light m-0"  >
      <b-list-group-item v-for="item in bedrijf" :key="item.created" class="p-0 border-0">
        <b-row class="m-0" >
         <b-col class="col-6 p-0">
          <b-form-group >
               <b-form-input
                  type="url"
                  v-model="item.bedrijf"
                  @input="$emit('recordDirty')"
                  @blur="$emit('updateRecord')" />
          </b-form-group>
         </b-col>
         <b-col class="col-5 ">
          <b-form-group>
               <b-form-select
                  v-model="item.bedrijfType_select"
                  :options="selectData.bedrijfType"
                  @change="$emit('updateRecord')"/>
          </b-form-group>
         </b-col>
         <b-col class="col-1">
            <b-button pill class="px-3" variant="danger" alt="Verwijderen" @click="deleteItem(item), $emit('updateRecord')">x</b-button>
         </b-col>
        </b-row>
      </b-list-group-item>
      <b-link @click="addItem" style="background:white;">Voeg item toe</b-link>
    </b-list-group>
  </b-form>
</template>
<script>
export default {
  name: "expand-list-bedrijf",
  props: [ "form", "selectData"],
  data() {
    return {
      bedrijf: []
    }
  },
  watch: {
    form(value) {
      if(value && value.bedrijf) {
        this.bedrijf = value.bedrijf
      }
    }
  },
  methods: {
    addItem() {
      if(!this.form) return;

      var now = new Date().toString()
      let obj = {bedrijf:"", bedrijfIndeling_select: null, created:now}
      this.bedrijf.push(obj)
      this.form.bedrijf = this.bedrijf
    },
    deleteItem(itm) {
      let i
      for ( i = 0; i < this.form.bedrijf.length; i++) {
        const item = this.form.bedrijf[i];
        if(itm === item) {
          break;
        }
      }
      this.form.bedrijf.splice(i, 1)
    },
  },
  
}
</script>
