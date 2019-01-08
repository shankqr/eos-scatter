<template>
  <v-card-title primary-title>
    <h4>Welcome to my Dapp main page!</h4>
  </v-card-title>
</template>

<script>
export default {
  components: {}
};
/*
getProfiles() {
    this.rpc
      .get_table_rows({
        json: true,
        code: "youraccname1", // contract who owns the table
        scope: "youraccname1", // scope of the table
        table: "users", // name of the table as specified by the contract abi
        limit: 100
      })
      .then(result => this.setState({ users: result.rows }));
  }
*/
</script>
