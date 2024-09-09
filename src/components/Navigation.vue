<template>
  <b-navbar class="shadow fixed-top" toggleable="lg" type="dark" variant="white"  >
    <b-img src="img/logo.svg" @click="$emit('navigateTo','/records')" />
    <b-navbar-toggle target="nav-collapse"/>
    <b-collapse id="nav-collapse" is-nav>
      <div v-if="user" class="ml-auto">
        <b-nav-item class="ml-auto" @click="$emit('navigateTo','/records')" href="#"><b>Records</b></b-nav-item>
        <b-nav-item class="ml-2" v-if="isAdmin" 
          @click="$emit('navigateTo','/admin')" href="#"><b>Admin</b></b-nav-item>
        <b-nav-item class="ml-2" @click="$emit('logout')" href="#" >Log uit</b-nav-item>
        <b-nav-item class="ml-2 mr-2">
          <p class="m-0">{{getDisplayName(user)}}</p>
        </b-nav-item>
      </div>
      <div v-if="!user" class="ml-auto">
        <b-nav-item class="ml-auto" @click="$emit('logout')" href="#" >Log in</b-nav-item>
      </div>
      <b-nav-item class="ml-1 mr-0">
        <p class="m-0"><small class="version ">v1.31</small></p>
      </b-nav-item>
    </b-collapse>
  </b-navbar>
</template>
<script>
export default {
  name: "Navigation",
  props: { user: Object, isAdmin: Boolean},
  methods:{
    getDisplayName( user ) {
      return user ? user.displayName : ""
    }
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #666666;
}
.version {
  color:#999999;
  opacity: 0.5; 
}

.dropdown-dark {
  color:#999999;
}

</style>
