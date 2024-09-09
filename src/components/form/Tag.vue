<template>
  <b-row>
    <b-col>
      <b-form-group label="Tags" label-for="tags-validation" :state="state">
        <b-form-tags
            input-id="tags-validation"
            v-model="form.tags"
            tag-variant="primary"
            tag-pills
            remove-on-delete
            :input-attrs="{ 'aria-describedby': 'tags-validation-help' }"
            :tag-validator="tagValidator"
            :state="state"
            separator=" "
            @tag-state="onTagState"
            @input="$emit('updateRecord')"
        ></b-form-tags>

        <template #invalid-feedback>
            <!-- You must provide at least 3 tags and no more than 8 -->
        </template>

        <template #description>
          <div id="tags-validation-help">
              Tags moeten 2 tot 64 karakter lang zijn. Voer een tag in gevolgd door een spatie of enter toets
          </div>
        </template>
      </b-form-group>
    </b-col>
    <b-col class="col-3">
      <b-form-group label="Selecteer tag" label-for="tags-validation" :state="state">
        <b-form-select v-model="selectedTag" :options="selectData.tags" @change="addTagFromSelect" />
      </b-form-group>
    </b-col>
  </b-row>
</template>
<script>
export default {
  name: "tag",
  props: ["form", "selectData"],
  data() {
    return {
      //tags: [],
      dirty: false,
      valid:null,
      invalid: null,
      duplicate: null,
      selectedTag: null,
      tags: [{text:'aap', value:'aap'}, {text:'noot', value:'noot'}, {text:'mies', value:'mies'}]
    }
  },
  computed: {
    state() {
      // Overall component validation state
      //return this.dirty ? (this.tags.length > 2 && this.tags.length < 36) : null
      return this.dirty ? true : null
    }
  },
  watch: {
    tags() {
      // Set the dirty flag on first change to the tags array
      this.dirty = true
    }
  },
  methods: {
    onTagState(valid, invalid, duplicate){ 
      this.valid = valid
      this.invalid = invalid
      this.duplicate = duplicate
      if(valid.length > 0 || duplicate.length> 0 || invalid.length > 0) {
        this.$emit('recordDirty')
      } else if(valid.length == 0) {
        this.$emit('updateRecord')
      }
    },
    addTagFromSelect() {
      if(this.form ) {
        if(!this.form.tags) this.form.tags = [];
        let found = false;
        for (let i = 0; i < this.form.tags.length; i++) {
          const tg = this.form.tags[i];
          if(this.selectedTag === tg) {
            found = true
            break
          }
        }
        if(!found) {
          this.form.tags.push(this.selectedTag)
          this.$emit('updateRecord')
        }
      }
    },
    tagValidator(tag) {
      // Individual tag validator function
      return tag === tag.toLowerCase() && tag.length > 1 && tag.length <= 64 && this.inTagsArr(tag)
    },
    inTagsArr(tag) {
      for (let i = 0; i < this.tags.length; i++) {
        const element = this.tags[i];
        if(tag === element.value) {
          return true
        }
      }
      return false
    }
  }
  
}
</script>
