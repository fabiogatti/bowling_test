<template>
  <div class="table">
    <div class="pins">
        <!--<img src="../assets/bowling_pin.png" alt="" id="pin10" class="pin">
        <img src="../assets/bowling_pin.png" alt="" id="pin9" class="pin">
        <img src="../assets/bowling_pin.png" alt="" id="pin8" class="pin">
        <img src="../assets/bowling_pin.png" alt="" id="pin7" class="pin">
        <img src="../assets/bowling_pin.png" alt="" id="pin6" class="pin">
        <img src="../assets/bowling_pin.png" alt="" id="pin5" class="pin">
        <img src="../assets/bowling_pin.png" alt="" id="pin4" class="pin">
        <img src="../assets/bowling_pin.png" alt="" id="pin3" class="pin">
        <img src="../assets/bowling_pin.png" alt="" id="pin2" class="pin">
        <img src="../assets/bowling_pin.png" alt="" id="pin1" class="pin">-->
        <img src="../assets/bowling_pin.png" alt="" class="pin" v-for="item in pinList" :key="item.name" v-bind:class="item.name" v-bind:style="{'grid-area':item.name}">
    </div>
    <transition name="slide">
        <div class="ball" v-if="!begin" v-bind:class="[ turn==0 ? 'ball1' : 'ball2']"></div>
    </transition>
        
    <p>{{ begin }}</p>
    <p>{{ turn }}</p>
  </div>
</template>

<script>
export default {
    name:"board",
    props: ['begin', 'pinList', 'turn'],
    data(){
        return{
            
        }
    },
    watch: { 
        begin: function(newVal, oldVal) { // watch it
            if(newVal)  {
                console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                //console.log(Math.random());
            }
        }
    },
    created(){
        /*for (let i = 1; i < 11; i++) {
            this.pinList.push("pin"+i);
            
        }*/
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
.pins{
    top:22.5%;
    left:5%;
    display:grid;
    grid-template-columns: repeat(4,3em);
    grid-template-rows: repeat(6,3em);
    position: absolute;
    width:50%;
    gap: 0px 20px;
    grid-template-areas: 
    "pin10 . . ."
    ". pin6 . ."
    "pin9 . pin3 ."
    ". pin5 . pin1"
    "pin8 . pin2 ."
    ". pin4 . ."
    "pin7 . . .";
}

.pin{
    height: 3em;
    width: 3em;
}
/*#pin10{
    grid-area: pin10;
}
#pin9{
    grid-area: pin10;
}
#pin8{
    grid-area: pin10;
}
#pin7{
    grid-area: pin10;
}
#pin6{
    grid-area: pin10;
}
#pin10{
    grid-area: pin10;
}
*/




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