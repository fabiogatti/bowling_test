<template>
  <div class="flexColumn">
    <h1>Player turn: <span v-bind:class="[ turn==0 ? 'color1' : 'color2']">{{ turn==0 ? this.playerData.player1 : this.playerData.player2 }}</span></h1>
    <h1>Last Score: {{ lastScore }}</h1>
    <h1>Turn: {{ Math.ceil((this.turnCounter)/2) }}</h1>

    <scoreBoard class="board1" :propData="scoreboard1" :playerNumber='0' :playerName="this.playerData.player1" v-bind:class="[ turn==1 ? 'disabled' : '' ]" />

    <div class="closeDiv">
      <transition name="fade">
        <div class="innerClose" v-if="close">
          <p>End game?</p>
          <router-link to="/" tag="button" class="yesClose">Yes</router-link>
          <a @click="close=false" class="noClose">No</a>
        </div>
      </transition>
      <!--<img src="../assets/close.png" class="closeImg" alt="" @click="close=!close">-->
      <i class="fas fa-times close" @click="close=!close"></i>
    </div>
    <!--<div class="dev">
      <p>SubTurn: {{ subTurn }}</p>
      <p>turnCounter: {{ turnCounter }}</p>
      <p>begin: {{ begin }}</p>
      <p>Turn: {{ turn }}</p>
      <p>Total1: {{ total1 }}</p>
      <p>Total2: {{ total2 }}</p>
    </div>-->
    
    <div class="flexRow">
      <board class="board" :begin="begin" :pinList="pinList" :turn="turn" :strike="strike"/>
      <div class="flexColumnButton">
        <div class="buttonDiv">
          <div class="tooltip">
            <p>Random shot with bias thorwards the middle </p>
          </div>
          <button class="btn btn1" @click="beginTurn(1)" v-bind:disabled="begin" v-bind:class="[begin?'disabled':'']">Safe shot<i class="fas fa-hard-hat"></i></button>
        </div>
        <div class="buttonDiv">
          <div class="tooltip">
            <p>Totally random shot</p>
          </div>
          <button class="btn btn2" @click="beginTurn(2)" v-bind:disabled="begin" v-bind:class="[begin?'disabled':'']">Random shot<i class="fas fa-random"></i></button>
        </div>
        <div class="buttonDiv">
          <div class="tooltip">
            <p>Random shot biased thorwards the low and high end</p>
          </div>
          <button class="btn btn3" @click="beginTurn(3)" v-bind:disabled="begin" v-bind:class="[begin?'disabled':'']">Risky shot<i class="fas fa-fire"></i></button>
        </div>
      </div>
    </div>

 
    <scoreBoard class="board2" :propData="scoreboard2" :playerNumber='1' :playerName="this.playerData.player2" v-bind:class="[ turn==0 ? 'disabled' : '' ]" />

    <!--<p>{{ playerData }}</p>-->
  </div>
</template>

<script>
import board from '@/components/board.vue'
import scoreBoard from '@/components/scoreBoard.vue'
import random from 'random'

export default {
    name:"Game",
    components:{
      board,
      //scoreBoard
      scoreBoard
    },
    data(){
      return{
        playerData:{ player1:"", player2:"" },
        begin:false,
        clickType:0,
        turn:0,
        subTurn:0,
        turnCounter:1,
        strike:false,
        lastScore:0,
        close:false,
        scoreboard1:{},
        scoreboard2:{},
        total1:0,
        total2:0,
        pinList:[]
      }
    },
    created() {
      
      for (let i = 1; i < 11; i++) {
        this.pinList.push({"name":"pin"+i,show:true})
      }

      for (let i = 1; i < 11; i++) {
        if(i!=10){
          this.scoreboard1[i] = { total:"",id:i,values:{value1:"", value2:""} }
          this.scoreboard2[i] = { total:"",id:i,values:{value1:"", value2:""} }
        }
        else{
          this.scoreboard1[i] = { total:"",id:i,values:{value1:"", value2:"", value3:""} }
          this.scoreboard2[i] = { total:"",id:i,values:{value1:"", value2:"", value3:""} }
        }
      }

      this.playerData = this.$route.params.playerData
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

        
        
        if(random==1 && temp.length==1){
          this.lastScore = random
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
          this.lastScore = random
          //console.log(temp.length)
          for (let index = 0; index < random; index++) {
            //console.log('Temp before: '+temp[random2].name+" random: "+random2+" index: "+index)
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
        for (let i = 0; i < removed.length; i++) {
          var x = this.pinList.indexOf(removed[i])
          this.pinList[x].show = false
        }
        return resolve
      },
      //Function that controls the variables and the game logic
      beginTurn:function(type){
        this.begin = true
        this.clickType = type

        

        setTimeout(() => {
          var strikeOrSpare = this.randomFunction(type)
          var actualTurn = Math.ceil((this.turnCounter)/2)
          //var temp1 = this.scoreboard1
          console.log("ACTUAL TURN: "+actualTurn)
          //console.log('Is Strike or spare? '+strikeOrSpare)

          if(actualTurn>=10){
            console.log("turno10")
            var win = 0
            if(this.total1>this.total2)
              win = this.playerData.player1
            else
              win = this.playerData.player2
            this.$router.push({ name: 'Winner', params: {playerData:this.playerData, winner:win, scoreboard1:this.scoreboard1, scoreboard2:this.scoreboard2 } })
          }
          else{
            if(this.subTurn==0){
              if(this.turn==0){
                this.total1 += this.lastScore
                //window.Vue.$set(temp1[actualTurn]["values"], 'value1', this.lastScore)
                //Vue.set(temp1[actualTurn]["values"], 'value1', this.lastScore)
                //this.$set(this.scoreboard1[actualTurn]["values"], 'value1', this.lastScore)
                
                
                if(this.lastScore==0)
                  this.scoreboard1[actualTurn]["values"].value1 = '-'
                else if(strikeOrSpare)
                  this.scoreboard1[actualTurn]["values"].value1 = 'X'
                else
                  this.scoreboard1[actualTurn]["values"].value1 = this.lastScore
                //console.log( "El valor dentro del board cambio a:" + this.scoreboard1[actualTurn]["values"].value1 )
              }
              else{
                this.total2 += this.lastScore
                //this.$set(this.scoreboard2[actualTurn]["values"], 'value1', this.lastScore)
                if(this.lastScore==0)
                  this.scoreboard2[actualTurn]["values"].value1 = '-'
                else if(strikeOrSpare)
                  this.scoreboard2[actualTurn]["values"].value1 = 'X'
                else
                  this.scoreboard2[actualTurn]["values"].value1 = this.lastScore
                //console.log( "El valor dentro del board cambio a:" + this.scoreboard2[actualTurn]["values"].value1 )
              }
            }else{
              this.total1 += this.lastScore
              if(this.turn==0){
                //this.$set(this.scoreboard1[actualTurn]["values"], 'value2', this.lastScore)
                if(this.lastScore==0)
                  this.scoreboard1[actualTurn]["values"].value2 = '-'
                else if(strikeOrSpare)
                  this.scoreboard1[actualTurn]["values"].value2 = '/'
                else
                  this.scoreboard1[actualTurn]["values"].value2 = this.lastScore
                //console.log( "El valor dentro del board cambio a:" + this.scoreboard1[actualTurn]["values"].value2 )
              }
              else{
                this.total2 += this.lastScore
                //this.$set(this.scoreboard2[actualTurn]["values"], 'value2', this.lastScore)
                if(this.lastScore==0)
                  this.scoreboard2[actualTurn]["values"].value2 = '-'
                else if(strikeOrSpare)
                  this.scoreboard2[actualTurn]["values"].value2 = 'X'
                else
                  this.scoreboard2[actualTurn]["values"].value2 = this.lastScore
                //console.log( "El valor dentro del board cambio a:" + this.scoreboard2[actualTurn]["values"].value2 )
              }
            }

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
                if(this.turnCounter==21){
                  var win = 0
                  if(this.total1>this.total2)
                    win = this.playerData.player1
                  else
                    win = this.playerData.player2
                  this.$router.push({ name: 'Winner', params: {playerData:this.playerData, winner:win, scoreboard1:this.scoreboard1, scoreboard2:this.scoreboard2 } })
                }
              }, 2000);
            }
            else{
              this.begin = false
              this.clickType = 0
            }
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
    margin: 0.25em 0;
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

  .closeDiv{
    position: absolute;
    right: 10px;
    top:10px;
    display: flex;
  }
  .closeImg{
    display: inline;
    cursor: pointer;
    height: 2em;
  }
  .innerClose{
    display: inline;
    margin-right: 10px;
  }
  .innerClose *{
    display: inline;
    padding: 7.5px;
    font-weight: bold;
    font-size: 1.1em;
  }
  .innerClose p:first-child{
    cursor:default;
  }
  .yesClose{
    cursor: pointer;
    color:rgb(238, 42, 81);
    border: none;
    background-color: transparent;
  }
  .noClose{
    cursor: pointer;
    color:rgb(0, 156, 0);
  }
  .fade-enter-active {
  transition: all .3s ease-in;
  }
  .fade-leave-active {
    transition: all .3s ease-out;
  }
  .fade-enter, .fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(25px);
    opacity: 0;
  }
  .buttonDiv{
    position: relative;
    margin:15px 0px;
    width: 100%;
  }
  .tooltip{
    display: inline-block;
    opacity: 0;
    position: absolute;
    width: 100%;
    left: 51%;
    transform-origin: 50% 100%;
    transform: scaleY(0) translateX(-50%);
    transition: all 0.25s ease-in-out;
    bottom:5em;
    background-color: rgba(47, 79, 79,0.75);
    color: white;
    padding:0 5px;
    border-radius: 25px;
  }
  .buttonDiv:hover .tooltip{
    opacity: 1;
    transform: scaleY(1) translateX(-50%);
    transform-origin: 50% 100%;
    transition-delay:0.5s;
  }
  .board1{
    margin-bottom: 1.5em;
  }
  .board2{
    margin-top:1.5em;
  }
  .disabled{
    opacity: 0.55;
  }
  .close{
    cursor: pointer;
    font-size: 2em;
  }


  .dev{
    position:absolute;
    top:0;
    left:0;
  }



  @media (max-width: 1700px) {
    .tooltip{
      bottom:6em;
    }
  }
</style>