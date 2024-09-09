<template>
  <b-container class="p-0">
    <b-row class="mb-2">
      <b-col class="col-12 col-md-2">
        <h5>Gebruikers</h5>
      </b-col>
      <b-col class="col-10 col-md-5 ">
        <b-form-input type="text" placeholder="Zoek gebruiker" v-model="searchQuery" ref="searchInput" />
      </b-col>
      <b-col class="col-2 col-md-5 d-flex justify-content-end">
        <b-button pill variant="light" @click="$emit('listAllUsers')">
          <b-icon icon="arrow-clockwise" /></b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="col-0 col-md-2" />
      <b-col class="col-12 col-md-10 ">
        <b-table sticky-header striped hover selectable select-mode="single" @row-clicked="userSelected"
          :items="filteredUsers" :fields="userTableFields" />
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {
  name: "table-users",
  props: ["users"],
  data() {
    return {
      filteredUsers: [],
      searchQuery: "",
      temp: [{ email: "nla" }, { email: "jfsafds" }],
      userTableFields: [
        { key: "displayName", label: "Naam", sortable: true },
        { key: "email", label: "E-mail", sortable: true },
        { key: "disabled", label: "Disabled", sortable: true },
        { key: "customClaims.rights", label: "Rights", sortable: true },
      ],
    }
  },
  watch: {
    searchQuery: function () {
      this.filterUsers()
    },
    users: function (value) {
      if (value != null) {
        this.filteredUsers = value
      }
    }
  },
  methods: {
    userSelected(row) {
      this.$emit("userSelected", row)
    },
    filterUsers: function () {
      this.filteredUsers = this.users
      if (this.searchQuery == "" || !this.searchQuery || !this.users) {
        return
      } else if (this.searchQuery.length > 0) {
        this.filteredUsers = this.users.filter(user => {
          const displName = user.displayName.toLowerCase()
          const email = user.email.toLowerCase()
          const searchQuery = this.searchQuery.toLowerCase()
          return displName.indexOf(searchQuery) != -1 || email.indexOf(searchQuery) != -1
        })
      }
    },
  },
  mounted() {
    if (this.users) {
      this.filteredUsers = [...this.users]
    }
  }
}
</script>
