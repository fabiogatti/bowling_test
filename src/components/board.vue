<template>
  <div class="table">
      <transition name="slide">
        <div class="ball" v-if="!begin" v-bind:class="[ turn==0 ? 'ball1' : 'ball2']"></div>
      </transition>
        
        <p>{{ begin }}</p>
        <p>{{ clickType }}</p>
        <p>{{ turn }}</p>
  </div>
</template>

<script>
export default {
    name:"board",
    props: ['begin', 'clickType', 'turn'],
    data(){
        return{
        }
    },
    watch: { 
        begin: function(newVal, oldVal) { // watch it
            if(newVal)  {
                console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                console.log(Math.random());
            }
        }
      }
}
</script>

<style scoped>
.table{
    width: 100%;
    height: 100%;
    background: url("../assets/game_background.jpg");
    position: relative;
    border: 5px solid saddlebrown;
    border-radius: 10px;
}
.ball{
    height: 5em;
    width:5em;
    position: absolute;
    top:42.5%;
    margin-left:75vw;
}
.ball1{
    background: url("../assets/bowling_ball1.png");
    background-size: 100%;
}
.ball2{
    background: url("../assets/bowling_ball2.png");
    background-size: 100%;
}
.slide-enter-active {
  transition: all 1s ease;
  opacity: 0;
}
.slide-leave-active {
  transition: all 1s ease-in;
}
.slide-enter-to{
    opacity: 1;
}
.slide-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(-60vw) translateX(50px) rotate(-720deg);
}

</style>