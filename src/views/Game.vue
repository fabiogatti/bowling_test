<template>
  <div class="flexColumn">
    <h1>Player turn: <span v-bind:class="[ turn==0 ? 'color1' : 'color2']">{{ turn==0 ? this.playerData.player1 : this.playerData.player2 }}</span></h1>
    <p>{{ subTurn }}</p>
    <p>{{ turnCounter }}</p>
    <div class="flexRow">
      <board class="board" :begin="begin" :pinList="pinList" :turn="turn" :strike="strike"/>
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
import random from 'random'

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
        strike:false,
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
      //Normalizes the random function so the values get inside of defined values (min-max)
      normalize:function(min,max,random){
        return Math.floor(random * (max - min + 1)) + min;
      },
      //Applies binomial distribution to the random numbers, so they get biased thorwards the center
      getRandomSkewedCenter:function (min, max) {
        var z = random.binomial(20,0.5)
        return this.normalize(min,max,z()/20)
      },
      //Gets a random int from 0-1 and normalizes it between the given range
      getRandomInt:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      //Applies binomial distribution to the random numbers, so they get biased thorwards the edges
      getRandomSkewedEdges:function (min, max) {
        var x = random.binomial(20,0.125)
        var y = random.binomial(20,0.875)
        var rand = Math.random()
        if(rand<=0.5){
          return this.normalize(min,max,x()/20)
        }
        else{
          return this.normalize(min,max-1,y()/20)
        }
      },
      //Function that applies the changes to the view, specifically the "pinList" data that describes the visual value of the dropped pins
      //returns: true if dropped 
      randomFunction:function(type){
        var removed = []
        var temp = this.pinList.filter(element=> element.show)
        var resolve = false
        //var random = Math.floor(Math.random() * (temp.length)) 
        var random = 0
        if(type==1)
          random = this.getRandomSkewedCenter(0,temp.length)
        else if(type==2)
          random = this.getRandomInt(0,temp.length)
        else
          random = this.getRandomSkewedEdges(0,temp.length)
        var random2 = random;

        console.log("Temp before:" + temp)
        console.log("Random: "+random)
        
        
        if(random==1 && temp.length==1){
          removed.push(temp[0])
          temp = temp.filter(elem => elem!=temp[random2])
          resolve = true
        }
        else{
          if(random>=temp.length){
            random = temp.length-1
            random2 = temp.length-1
          }

          if(random2==temp.length){
            resolve = true
          }
          console.log(temp.length)
          for (let index = 0; index < random; index++) {
            console.log('Temp before: '+temp[random2].name+" random: "+random2+" index: "+index)
            removed.push(temp[random2])
            
            temp = temp.filter(elem => elem!=temp[random2])
            //random2 = Math.floor(Math.random() * (temp.length))           
            if(type==1)
              random2 = this.getRandomSkewedCenter(0,temp.length)
            else if(type==2)
              random2 = this.getRandomInt(0,temp.length)
            else
              random2 = this.getRandomSkewedEdges(0,temp.length)
            if(random2>=temp.length)
              random2 = temp.length-1
          }
        }
        /*console.log("Removed: "+removed)
        console.log("Temp after: "+temp)
        for (let a = 0; a < this.pinList.length; a++) {
          console.log("Pinlist before "+a+" : "+this.pinList[a].show)
        }*/
        for (let i = 0; i < removed.length; i++) {
          var x = this.pinList.indexOf(removed[i])
          this.pinList[x].show = false
        }
        /*for (let a = 0; a < this.pinList.length; a++) {
          console.log("Pinlist after "+a+" : "+this.pinList[a].show)
        }*/
        //console.log("PinList after: "+this.pinList)
        return resolve
      },
      beginTurn:function(type){
        
        
        
        this.begin = true
        this.clickType = type
        setTimeout(() => {
          var strikeOrSpare = this.randomFunction(type);
          console.log('Is Strike or spare? '+strikeOrSpare)
          this.subTurn++
          if(this.subTurn==2 || strikeOrSpare){
            if(strikeOrSpare){
              this.strike = true
            }
            if(this.turn==0){
              this.turn = 1
              this.subTurn=0
            }
            else{
              this.turn = 0
              this.subTurn=0
            }
            setTimeout(() => {
              this.begin = false
              this.clickType = 0
              this.turnCounter++
              this.strike = false
              for (let i = 0; i < this.pinList.length; i++) {
                this.pinList[i].show = true
              }
            }, 2000);
          }
          else{
            this.begin = false
            this.clickType = 0
          }
        }, 1500);

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