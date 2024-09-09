<template>
  <b-form >
    <b-list-group  class="bg-light m-0"  >
      <b-list-group-item v-for="item in themaFloriade" :key="item.created" class="p-0 border-0">
        <b-row class="m-0" >
         <b-col class="col-md-7 col-lg-8 p-0">
          <b-form-group >
               <b-form-select
                  v-model="item.themaFloriade_select"
                  :options="selectData.themaFloriade" 
                    @change="$emit('updateRecord')" 
                    />
          </b-form-group>
         </b-col>
         <b-col class="col-md-4 col-lg-3 ">
          <b-form-group>
                <b-form-rating variant="warning" v-model="item.themaFloriadeRating"
                  @change="$emit('updateRecord')" 
                  />
          </b-form-group>
         </b-col>
         <b-col class="col-1">
            <b-button pill class="px-3" variant="danger" alt="Verwijderen" @click="deleteItem(item)">x</b-button>
         </b-col>
        </b-row>
      </b-list-group-item>
      <b-link @click="addItem" style="background:white;">Voeg item toe</b-link>
    </b-list-group>
  </b-form>
</template>
<script>
export default {
  name: "expand-list-thema-floriade",
  props: [ "form", "selectData"],
  data() {
    return {
      themaFloriade: []
    }
  },
  watch: {
    form(value) {
      if(value && value.themaFloriade) {
        this.themaFloriade = value.themaFloriade
      }
    }
  },
  methods: {
    addItem() {
      if(!this.form) return;

      let obj = {themaFloriade_select:null, 
        themaFloriadeRating: 0}
      this.themaFloriade.push(obj)
      this.form.themaFloriade = this.themaFloriade
    },
    deleteItem(itm) {
      let i
      for ( i = 0; i < this.form.themaFloriade.length; i++) {
        const item = this.form.themaFloriade[i];
        if(itm === item) {
          break;
        }
      }
      this.form.themaFloriade.splice(i, 1)
    },
  },
  
}
</script>
