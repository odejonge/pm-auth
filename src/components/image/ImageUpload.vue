<template>
   <div>
      <b-form-row>
         <b-form-group class="col-md-12" label="Foto">
            <b-form-file 
               :disabled="formFileDisabled"
               v-model="uploadURL"
               placeholder="Kies een file of sleep 'm erin..."
               drop-placeholder="Sleep hem hier..."
            />
         </b-form-group>
      </b-form-row>
   </div>
</template>
<script>
import db from "../../db.js"
import firebase from "firebase"
export default {
   name: "image-upload",
   props: ["form"],
   data() {
      return {
         uploadURL: null,
         imageURL: null,
         formFileDisabled: true,
      }
   },
   watch: {
    uploadURL(value) {
      if(value) {
        try {
            const imageName =  this.convertToSlug(this.form.naam_nl) + "-" + new Date().getTime()
            const imageRef = this.createImageRef(imageName)
            imageRef.put(value)
            .then( snapshot => {
               console.log("uploaded!", snapshot)
               return db.collection("data").doc(this.form.id).update({image: imageName}).then(()=> {
                  this.form.image = imageName;
                  console.log("Succesful update image prop on record in db")
               }).catch( error => {
                  console.log("Image prop not saved: ", error)
               })
            })
            .catch( error => {
               console.log("File put error: " + error)
            })
         }
         catch(error) {
            console.log("Storage Error: " + error)
         }
      }
    },
    form(value) {
       if( value && value.id && value.naam_nl && value.naam_nl != "") {
          this.formFileDisabled = false;
       }
    }
  },
  methods: {
   createImageRef(imageName) {
      const imagePath = "images/records/" + imageName;
      const storageRef = firebase.storage().ref()
      const imageRef = storageRef.child( imagePath );
      return imageRef
   },
   convertToSlug(text){
      return text
            .toLowerCase()
            .replace(/[^\w ]+/g,'')
            .replace(/ +/g,'-');
   }, 
   getControlDisabled (id) {
      return !id
   },
  },
  mounted() {
   if( this.form && this.form.id && this.form.naam_nl && this.form.naam_nl != "") {
      this.formFileDisabled = false;
   }
  }
}
</script>
