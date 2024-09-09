<template>
  <b-container class="p-0">
    <b-row>
      <b-col class="m-2">
        <h3>Import</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="col-12">
        <rule/>
        <form-import :user="user" />
        <rule/>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import Rule from "../components/Rule"
import FormImport from "../components/import/FormImport"
export default {
  name: "import",
  props: ["user"],
  components: {Rule, FormImport},
}
</script>
