<template>
  <div id="app" v-bind:class="[ darkMode ? 'dark' : '' ]">
    <div class="position">
      <div v-if="!darkMode" class="bulb" v-on:click="darkMode=!darkMode"><i class="fas fa-lightbulb"></i></div>
      <div v-if="darkMode" class="bulb" v-on:click="darkMode=!darkMode"><i class="far fa-lightbulb"></i></div>
    </div>
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data(){
      return{
        darkMode:false
      }
    }
})
</script>

<style>
body{
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0;
  height: 100vh;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.flexAlign{
  height: 99%;
  width: 99%;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}


.normal-button{
  width: 200px;
  border-radius: 15px;
  background-color:crimson;
  border:none;
  padding:10px;
  color:white;
  font-size: 1.15em;
  transition: all 0.5 ease-in-out;
}

.bulb{
  font-size: 2.5em;
}
.position{
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 5;
}
.dark{
  background-color: darkslategrey;
  color:white !Important;
}

</style>
