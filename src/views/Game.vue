<template>
  <div class="flexColumn">
    <h1>Player turn: <span v-bind:class="[ turn==0 ? 'color1' : 'color2']">{{ turn==0 ? this.playerData.player1 : this.playerData.player2 }}</span></h1>
    <p>{{ subTurn }}</p>
    <div class="flexRow">
      <board class="board" :begin="begin" :pinList="pinList" :turn="turn"/>
      <div class="flexColumnButton">
        <button class="btn btn1" @click="beginTurn(1)" v-bind:disabled="begin" v-bind:class="[begin?'disabled':'']">Lanzamiento seguro<i class="fas fa-hard-hat"></i></button>
        <button class="btn btn2" @click="beginTurn(2)" v-bind:disabled="begin" v-bind:class="[begin?'disabled':'']">Lanzamiento aleatorio<i class="fas fa-random"></i></button>
        <button class="btn btn3" @click="beginTurn(3)" v-bind:disabled="begin" v-bind:class="[begin?'disabled':'']">Lanzamiento arriesgado<i class="fas fa-fire"></i></button>
      </div>
    </div>
    <!--<p>{{ playerData }}</p>-->
  </div>
</template>

<script>
import board from '@/components/board.vue'

export default {
    name:"Game",
    components:{
      board
    },
    data(){
      return{
        playerData:{},
        begin:false,
        clickType:0,
        turn:0,
        subTurn:0,
        turnCounter:0,
        pinList:[]
      }
    },
    created() {
      for (let i = 1; i < 11; i++) {
        this.pinList.push({"name":"pin"+i,show:true});
      }
      this.playerData = this.$route.params.playerData;
    },
    methods:{
      getRandomInt:function (min, max) {
        
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      betaRandom:function(){
        var removed = []
        var temp = this.pinList.filter(element=> element.show)
        //var random = Math.floor(Math.random() * (temp.length)) 
        var random = this.getRandomInt(0,temp.length)
        var random2 = random;
        if(random==temp.length)
          random2 = 0
        console.log("Temp before:" + temp)
        console.log("Random: "+random)
        if(random==1){
          removed.push(temp[random2])
          temp = temp.filter(elem => elem!=temp[random2])
        }
        else{
          for (let index = 0; index < random-1; index++) {
            console.log('Temp before: '+temp[random2].name+" random: "+random2+" index: "+index)
            removed.push(temp[random2])
            
            temp = temp.filter(elem => elem!=temp[random2])
            //random2 = Math.floor(Math.random() * (temp.length))           
            random2 = this.getRandomInt(0,temp.length)
            if(random2==temp.length)
              random2 = 0
          }
        }
        console.log("Removed: "+removed)
        console.log("Temp after: "+temp)
        for (let a = 0; a < this.pinList.length; a++) {
          console.log("Pinlist before "+a+" : "+this.pinList[a].show)
        }
        for (let i = 0; i < removed.length; i++) {
          var x = this.pinList.indexOf(removed[i])
          this.pinList[x].show = false
        }
        for (let a = 0; a < this.pinList.length; a++) {
          console.log("Pinlist after "+a+" : "+this.pinList[a].show)
        }
        //console.log("PinList after: "+this.pinList)
      },
      totalRandom:function(max){
        return Math.floor(Math.random() * (max + 1)) 
      },
      totalRandom2:function(){

      },
      beginTurn:function(type){
        this.betaRandom(10);
        //console.log(temp);
        /*if(type==1){
          for (let i = 0; i < this.pinList; i++) {
            
            console.log(this.betaRandom());
          }
        }else if(type==2){
          for (let i = 0; i < this.pinList; i++) {
            if(Math.random>0.5)
              this.pinList[i].show = true
            else 
              this.pinList[i].show = false
          }
        }else{
          for (let i = 0; i < this.pinList; i++) {
            if(Math.random>0.5)
              this.pinList[i].show = true
            else 
              this.pinList[i].show = false
          }
        }*/

        console.log(this.pinList);
        
        
        this.begin = true
        this.clickType = type
        setTimeout(() => {
          this.subTurn++
          if(this.subTurn==2){
            if(this.turn==0){
              this.turn = 1
              this.subTurn=0
            }
            else{
              this.turn =0
              this.subTurn=0
            }
          }
          this.begin = false
          this.clickType = 0
        }, 2000);
      }
    }
}
</script>

<style scoped>
.disabled{
  opacity: 0.5;
}
  h1{
    width: 100%;
  }
  .color1{
    color:crimson;
  }
  .color2{
    color:darkblue;
  }
  .flexColumn{
    height: 90vh;
    width: 99vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .flexColumnButton{
    width: 15vw;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .flexRow{
    height: 99%;
    width: 99%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
  .board{
    min-width: 70vw;
    min-height: 50%;
  }
  .btn{
    width: 95%;
    margin:1.5em 0.5em;
    border:none;
    border-radius: 50px;
    padding:15px;
    color:white;
    font-size: 1em;
  }
  .btn1{
    background-color:rgba(0, 128, 128,0.75);
    border: 3px solid rgb(0, 128, 128);
  }
  .btn2{
    background-color: rgba(128, 0, 128,0.75);
    border: 3px solid rgb(128, 0, 128);
  }
  .btn3{
    background-color: rgba(139, 0, 0,0.75);
    border: 3px solid rgb(139, 0, 0);
  }
  .fas{
    margin-left: 5px;
  }
</style>