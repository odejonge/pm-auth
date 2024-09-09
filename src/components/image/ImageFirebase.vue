<template>
  <b-container class="p-0">
    <b-img class="mb-3" ref="image" v-if="form && form.image" :src="imageURL" rounded fluid  />
  </b-container>
</template>
<script>
import firebase from "firebase"
export default {
  name:"image-firebase",
  props: [ 'form'],
  data () {
     return {
        imageURL: null
     }
  },
  watch: {
     form(value) {
        if(value) this.loadImage();
     }
  },
  methods: {
      loadImage: function() {
         if(this.form && this.form.image) {
            const imagePath = "images/records/" + this.form.image;
            const storageRef = firebase.storage().ref();
            storageRef.child( imagePath ).getDownloadURL().then( imageURL => {
               this.imageURL = imageURL
            })
         } 
      }
   },
   mounted() {
      this.$nextTick( () => {
            this.loadImage()
         }
      )
   }
}
</script>
