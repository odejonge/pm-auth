<template>
    <b-modal id="edit-record-dialog" size="xl" scrollable hide-footer title="Pas een record aan"  >
        <main-form 
            @closeDialog="closeDialog"
            :user="user" 
            :selectedRecord="selectedRecord" 
            :selectData="selectData" /> 
    </b-modal>
</template>
<script>
import MainForm from '../../views/MainForm.vue'
export default {
    name:"edit-record-dialog",
    props:["user", "selectedRecord", "selectData"],
    components: { MainForm },
    methods: {
        closeDialog() {
            this.$emit('closeDialog')
        }
    }
}
</script>