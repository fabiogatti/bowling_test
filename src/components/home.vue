<template>
  <div class="flexAlign">
    <div class="form">
      <h1>2D BOWLING</h1>
      <router-link to="/PlayerSetup" tag="button" class="normal-button">Start New Game</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form{
  width:50%;
  height: 50%;
  margin:auto;
}
h1{
  color:crimson;
}
</style>
