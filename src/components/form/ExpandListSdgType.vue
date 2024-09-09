<template>
  <b-form >
    <b-list-group  class="bg-light m-0"  >
      <b-list-group-item v-for="item in sdgType" :key="item.created" class="p-0 border-0">
        <b-row class="m-0" >
         <b-col class="col-11 p-0">
            <b-form-group >
                <b-form-select
                    v-model="item.sdgType_select"
                    :options="selectData.sdgType"
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
  name: "expand-list-sdg-type",
  props: [ "form", "selectData"],
  data() {
    return {
      sdgType: []
    }
  },
  watch: {
    form(value) {
      if(value && value.sdgType) {
        this.sdgType = value.sdgType
      }
    }
  },
  methods: {
    addItem() {
      if(!this.form) return;
      var now = new Date().toString()
      let obj = {sdgType_select:null, created:now}
      this.sdgType.push(obj)
      this.form.sdgType = this.sdgType
    },
    deleteItem(itm) {
      let i
      for ( i = 0; i < this.form.sdgType.length; i++) {
        const item = this.form.sdgType[i];
        if(itm === item) {
          break;
        }
      }
      this.form.sdgType.splice(i, 1)
    },
  },
  
}
</script>
