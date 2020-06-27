<template>
  <div class="flexAlign">
    <div class="form">
      <h1>2D BOWLING</h1>
      <router-link to="/PlayerSetup" tag="button" class="button">Start New Game</router-link>
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
.flexAlign{
  height: 100%;
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form{
  width:50%;
  height: 50%;
  margin:auto;
}
h1{
  color:crimson;
}
.button{
  width: 200px;
  border-radius: 10px;
  background-color:crimson;
  border:none;
  padding:10px;
  color:white;
  font-size: 1.15em;
}
</style>
