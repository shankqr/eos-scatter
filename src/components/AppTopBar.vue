<template>
  <span>
    <v-toolbar app color="black darken-4" dark>
      <v-spacer class="hidden-md-and-up"></v-spacer>
      <v-toolbar-title>{{appTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="handleLogout()" v-if="$store.state.loggedIn">Logout</v-btn>
    </v-toolbar>
  </span>
</template>

<script>
export default {
  name: 'AppTopBar',
  data() {
    return {
      appTitle: 'My EOS Dapp'
    };
  },
  methods: {
    handleLogout: async function() {
      this.$store.commit('loginStatus', false);
      this.$router.push('/');
      //this.scatter.forgetIdentity();
    }
  }
};
</script>

<style scoped>
</style>
