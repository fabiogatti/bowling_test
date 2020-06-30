<template>
  <div class="flexColumn">
    <h1>Player turn: <span v-bind:class="[ turn==0 ? 'color1' : 'color2']">{{ turn==0 ? this.playerData.player1 : this.playerData.player2 }}</span></h1>
    <h1>Last Score: {{ lastScore }}</h1>
    <h1>Turn: {{ Math.ceil((this.turnCounter)/2) }}</h1>

  
    <scoreBoard class="board1" :key="0" :propData="scoreboard1" :playerNumber='0' :playerName="this.playerData.player1" v-bind:class="[ turn==1 ? 'disabled' : '' ]" />

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
    <div class="dev">
      <p>SubTurn: {{ subTurn }}</p>
      <p>turnCounter: {{ turnCounter }}</p>
      <p>begin: {{ begin }}</p>
      <p>Turn: {{ turn }}</p>
    </div>
    
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
//import Vue from 'vue'

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
        spare:false,
        lastIndexScore1:1,
        lastIndexScore2:1,
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
      //returns: true if random is a strike 
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

        if(random==temp.length){
          this.lastScore = random
          for (let i = 0; i < temp.length; i++) {
            var x = this.pinList.indexOf(temp[i])
            this.pinList[x].show = false
          }
          if(this.subTurn==0){
            return true
          }
          else{
            this.spare = true
            return false
          }
        }

        
        
        /*if(random==1 && temp.length==1){
          this.lastScore = random
          removed.push(temp[0])
          temp = temp.filter(elem => elem!=temp[random2])
          //resolve = true
        }
        else{*/
          if(random>temp.length){
            random = temp.length-1
            random2 = temp.length-1
          }
          this.lastScore = random
          console.log("Random is: "+random)
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
        //}
        
        for (let i = 0; i < removed.length; i++) {
          
          var y = this.pinList.indexOf(removed[i])
          this.pinList[y].show = false
        }
        return resolve
      },
      transformScore:function(val,prev=0){
        if(val=='X')
          return 10
        else if(val=='/')
          return 10 - parseInt(prev)
        else if(val=='-' || val=='')
          return 0
        else
          return parseInt(val)
      },
      calculateSubtotal:function(actualTurn,temp){

        var scoreIndex
        if(this.turn==0)
          scoreIndex = this.lastIndexScore1
        else
          scoreIndex = this.lastIndexScore2

        var sumToIndex = 0

        if(actualTurn==10){
          if(this.subTurn==2 || (this.subTurn==1 && (!this.strike && !this.spare))){
            if(actualTurn-scoreIndex==2){
              temp[scoreIndex+1]["total"] = (parseInt(temp[scoreIndex]["total"])||0)+10+this.transformScore(temp[scoreIndex+2]["values"]["value1"])+this.transformScore(temp[scoreIndex+2]["values"]["value2"],temp[scoreIndex+2]["values"]["value1"])
              temp[scoreIndex+2]["total"] = (parseInt(temp[scoreIndex+1]["total"])||0)+this.transformScore(temp[scoreIndex+2]["values"]["value1"])+this.transformScore(temp[scoreIndex+2]["values"]["value2"],temp[scoreIndex+2]["values"]["value1"])+this.transformScore(temp[scoreIndex+2]["values"]["value3"],temp[scoreIndex+2]["values"]["value2"])
            }
            else{
              temp[scoreIndex+1]["total"] = (parseInt(temp[scoreIndex]["total"])||0)+this.transformScore(temp[scoreIndex+1]["values"]["value1"])+this.transformScore(temp[scoreIndex+1]["values"]["value2"],temp[scoreIndex+1]["values"]["value1"])+this.transformScore(temp[scoreIndex+1]["values"]["value3"],temp[scoreIndex+1]["values"]["value2"])
            }
            sumToIndex = 1
          }
        }


        if(this.strike){
          if(actualTurn-scoreIndex>2){
            temp[scoreIndex+1]["total"] = (parseInt(temp[scoreIndex]["total"])||0)+10+10+10
            sumToIndex = 1
          }
        }
        else{
        console.log(actualTurn)
            if(actualTurn==1 && this.subTurn==1){
              console.log("Entro 1")
              temp[scoreIndex]["total"] = this.transformScore(temp[scoreIndex]["values"]["value1"])+this.transformScore(temp[scoreIndex]["values"]["value2"])
            }
            if(this.subTurn==0){
              if(actualTurn-scoreIndex>2){
                console.log("Entro 2")
                if(temp[scoreIndex+1]["values"]["value1"]=='X'){
                  temp[scoreIndex+1]["total"] = (parseInt(temp[scoreIndex]["total"])||0)+10+10+this.lastScore
                }
                else{
                  temp[scoreIndex+1]["total"] = (parseInt(temp[scoreIndex]["total"])||0)+10+10
                }
                sumToIndex = 1
              }
              else if(actualTurn-scoreIndex==2){
                if(temp[scoreIndex+1]["values"]["value2"]=='/'){
                  temp[scoreIndex+1]["total"] = (parseInt(temp[scoreIndex]["total"])||0)+this.transformScore(temp[scoreIndex+1]["values"]["value1"])+this.transformScore(temp[scoreIndex+1]["values"]["value2"],temp[scoreIndex+1]["values"]["value1"])+this.lastScore
                  sumToIndex = 1
                }
              }
            }
            else{
              if(actualTurn-scoreIndex==2){
                console.log("Entro 4")
                if(temp[actualTurn]["values"]["value2"]!='/'){
                  temp[scoreIndex+1]["total"] = (parseInt(temp[scoreIndex]["total"])||0)+10+this.transformScore(temp[scoreIndex+2]["values"]["value1"])+this.transformScore(temp[scoreIndex+2]["values"]["value2"],temp[scoreIndex+2]["values"]["value1"])
                  temp[scoreIndex+2]["total"] = (parseInt(temp[scoreIndex+1]["total"])||0)+this.transformScore(temp[scoreIndex+2]["values"]["value1"])+this.transformScore(temp[scoreIndex+2]["values"]["value2"],temp[scoreIndex+2]["values"]["value1"])
                  sumToIndex = 2
                }else{
                  temp[scoreIndex+1]["total"] = (parseInt(temp[scoreIndex]["total"])||0)+10+this.transformScore(temp[scoreIndex+2]["values"]["value1"])+this.transformScore(temp[scoreIndex+2]["values"]["value2"],temp[scoreIndex+2]["values"]["value1"])
                  sumToIndex = 1
                }
                
              }
              if(actualTurn-scoreIndex==1){
                console.log("Entro 5")
                if(temp[scoreIndex+1]["values"]["value2"]=='/'){
                  sumToIndex = 0
                }else{
                  temp[scoreIndex+1]["total"] = (parseInt(temp[scoreIndex]["total"])||0)+this.transformScore(temp[scoreIndex+1]["values"]["value1"])+this.transformScore(temp[scoreIndex+1]["values"]["value2"],temp[scoreIndex+1]["values"]["value1"])
                  sumToIndex = 1
                }
                
              }  
            }
        //}
        }

        if(this.turn==0)
          this.lastIndexScore1 += sumToIndex
        else
          this.lastIndexScore2 += sumToIndex


        return temp
      },
      modifyScoreBoard:function(strike,actualTurn){
        var temp1
        var temp2
        if(actualTurn==10){
          if(this.subTurn==0){
            if(this.turn==0){
              temp1 = this.scoreboard1
              this.scoreboard1 = null
              if(this.lastScore==0)
                temp1[actualTurn]["values"].value1 = '-'
              else if(strike)
                temp1[actualTurn]["values"].value1 = 'X'
              else
                temp1[actualTurn]["values"].value1 = this.lastScore
              temp1 = this.calculateSubtotal(actualTurn,temp1)
              setTimeout(() => {
                this.scoreboard1 = temp1
              }, 1);
            }else{
              temp2 = this.scoreboard2
              this.scoreboard2 = null
              if(this.lastScore==0)
                temp2[actualTurn]["values"].value1 = '-'
              else if(strike)
                temp2[actualTurn]["values"].value1 = 'X'
              else
                temp2[actualTurn]["values"].value1 = this.lastScore
              temp2 = this.calculateSubtotal(actualTurn,temp2)
              setTimeout(() => {
                this.scoreboard2 = temp2
              }, 1);
            }

          }else if(this.subTurn==1){
            if(this.turn==0){
              temp1 = this.scoreboard1
              this.scoreboard1 = null
              if(this.lastScore==0)
                temp1[actualTurn]["values"].value2 = '-'
              else if(strike)
                temp1[actualTurn]["values"].value2 = 'X'
              else if(this.spare)
                temp1[actualTurn]["values"].value2 = '/'
              else
                temp1[actualTurn]["values"].value2 = this.lastScore
              temp1 = this.calculateSubtotal(actualTurn,temp1)
              setTimeout(() => {
                this.scoreboard1 = temp1
              }, 1);
            }else{
              temp2 = this.scoreboard2
              this.scoreboard2 = null
              if(this.lastScore==0)
                temp2[actualTurn]["values"].value2 = '-'
              else if(strike)
                temp2[actualTurn]["values"].value2 = 'X'
              else if(this.spare)
                temp2[actualTurn]["values"].value2 = '/'
              else
                temp2[actualTurn]["values"].value2 = this.lastScore
              temp2 = this.calculateSubtotal(actualTurn,temp2)
              setTimeout(() => {
                this.scoreboard2 = temp2
              }, 1);
            }
          }else{
            if(this.turn==0){
              if(this.turn==0){
              temp1 = this.scoreboard1
              this.scoreboard1 = null
              if(this.lastScore==0)
                temp1[actualTurn]["values"].value3 = '-'
              else if(strike)
                temp1[actualTurn]["values"].value3 = 'X'
              else if(this.spare)
                temp1[actualTurn]["values"].value3 = '/'
              else
                temp1[actualTurn]["values"].value3 = this.lastScore
              temp1 = this.calculateSubtotal(actualTurn,temp1)
              setTimeout(() => {
                this.scoreboard1 = temp1
              }, 1);
            }else{
              temp2 = this.scoreboard2
              this.scoreboard2 = null
              if(this.lastScore==0)
                temp2[actualTurn]["values"].value3 = '-'
              else if(strike)
                temp2[actualTurn]["values"].value3 = 'X'
              else if(this.spare)
                temp2[actualTurn]["values"].value3 = '/'
              else
                temp2[actualTurn]["values"].value3 = this.lastScore
              temp2 = this.calculateSubtotal(actualTurn,temp2)
              setTimeout(() => {
                this.scoreboard2 = temp2
              }, 1);
            }
          }
          }
        }else{
          if(this.subTurn==0){
            if(this.turn==0){
              //this.total1 += this.lastScore

              
              temp1 = this.scoreboard1
              this.scoreboard1 = null
              
              //window.Vue.$set(temp1[actualTurn]["values"], 'value1', this.lastScore)
              //Vue.set(temp1[actualTurn]["values"], 'value1', this.lastScore)
              if(this.lastScore==0)
                temp1[actualTurn]["values"].value1 = '-'
              else if(strike)
                temp1[actualTurn]["values"].value1 = 'X'
              else
                temp1[actualTurn]["values"].value1 = this.lastScore

              //console.log(temp1)
              temp1 = this.calculateSubtotal(actualTurn,temp1)
              //console.log(temp1)
              setTimeout(() => {
                this.scoreboard1 = temp1
                //var x = this.transformScore(temp1)
                //console.log(x)
              }, 1);
              
              //this.$set(this.scoreboard1[actualTurn]["values"], 'value1', this.lastScore)
              
              
              //console.log( "El valor dentro del board cambio a:" + this.scoreboard1[actualTurn]["values"].value1 )
            }
            else{
              //this.total2 += this.lastScore

              temp2 = this.scoreboard2
              this.scoreboard2 = {}

              //Vue.set(temp2[actualTurn]["values"], 'value1', this.lastScore)
              if(this.lastScore==0)
                temp2[actualTurn]["values"].value1 = '-'
              else if(strike)
                temp2[actualTurn]["values"].value1 = 'X'
              else
                temp2[actualTurn]["values"].value1 = this.lastScore
              
              //console.log(temp2)
              temp2 = this.calculateSubtotal(actualTurn,temp2)
              //console.log(temp2)
              setTimeout(() => {
                this.scoreboard2 = temp2
              }, 1);
              //this.$set(this.scoreboard2[actualTurn]["values"], 'value1', this.lastScore)

              //console.log( "El valor dentro del board cambio a:" + this.scoreboard2[actualTurn]["values"].value1 )
            }
          }else{
            if(this.turn==0){
              //this.total1 += this.lastScore

              temp1 = this.scoreboard1
              this.scoreboard1 = {}
              //this.$set(this.scoreboard1[actualTurn]["values"], 'value2', this.lastScore)
              //Vue.set(temp1[actualTurn]["values"], 'value2', this.lastScore)
              if(this.lastScore==0)
                temp1[actualTurn]["values"].value2 = '-'
              else if(this.spare)
                temp1[actualTurn]["values"].value2 = '/'
              else
                temp1[actualTurn]["values"].value2 = this.lastScore
              
              //console.log(temp1)
              temp1 = this.calculateSubtotal(actualTurn,temp1)
              //console.log(temp1)
              setTimeout(() => {
                this.scoreboard1 = temp1
              }, 1);

              //console.log( "El valor dentro del board cambio a:" + this.scoreboard1[actualTurn]["values"].value2 )
            }
            else{
              //this.total2 += this.lastScore

              temp2 = this.scoreboard2
              this.scoreboard2 = {}
              //this.$set(this.scoreboard2[actualTurn]["values"], 'value2', this.lastScore)
              //Vue.set(temp2[actualTurn]["values"], 'value2', this.lastScore)
              if(this.lastScore==0)
                temp2[actualTurn]["values"].value2 = '-'
              else if(this.spare)
                temp2[actualTurn]["values"].value2 = '/'
              else
                temp2[actualTurn]["values"].value2 = this.lastScore
              
              //console.log(temp2)
              temp2 = this.calculateSubtotal(actualTurn,temp2)
              //console.log(temp2)
              setTimeout(() => {
                this.scoreboard2 = temp2
              }, 1);
              //console.log( "El valor dentro del board cambio a:" + this.scoreboard2[actualTurn]["values"].value2 )
            }
          }
        }

        
      },
      winner:function(){
        console.log("Se acabo!")
        var win = 0
        if(parseInt(this.scoreboard1[10]["total"])>parseInt(this.scoreboard2[10]["total"]))
          win = this.playerData.player1
        else
          win = this.playerData.player2
        this.$router.push({ name: 'Winner', params: {playerData:this.playerData, winner:win, scoreboard1:this.scoreboard1, scoreboard2:this.scoreboard2 } })
      },
      //Function that controls the variables and the game logic
      beginTurn:function(type){
        this.begin = true
        this.clickType = type

        
        
        //this.scoreboard1 = temp

        setTimeout(() => {
          var strike = this.randomFunction(type)
          var actualTurn = Math.ceil((this.turnCounter)/2)

          //var temp1 = this.scoreboard1
          console.log("ACTUAL TURN: "+actualTurn)
          //console.log('Is Strike or spare? '+strike)


          /*if(actualTurn>10){
            console.log("turno11")
            var win = 0
            if(this.total1>this.total2)
              win = this.playerData.player1
            else
              win = this.playerData.player2
            this.$router.push({ name: 'Winner', params: {playerData:this.playerData, winner:win, scoreboard1:this.scoreboard1, scoreboard2:this.scoreboard2 } })
          }*/
          if(actualTurn==10){
            this.modifyScoreBoard(strike,actualTurn)
            if(this.subTurn==2){
              if(strike){
                this.strike = true
              }
              setTimeout(() => {
                if(this.turn==0){
                  this.turn = 1
                }
                else{
                  this.winner()
                }
                this.subTurn=0
                this.begin = false
                this.clickType = 0
                this.turnCounter++
                this.strike = false
                this.spare = false
                for (let i = 0; i < this.pinList.length; i++) {
                  this.pinList[i].show = true
                }
              }, 2000);
            }else if(this.subTurn==1){
              if(strike){
                this.strike = true
              }
              setTimeout(() => {
                if(this.spare || strike){
                  this.subTurn++
                }
                else{
                  if(this.turn==0){
                    if(this.scoreboard1[10]["values"]["value1"]=='X'){
                      this.subTurn++
                      this.begin = false
                      this.clickType = 0
                      this.strike = false
                      this.spare = false
                      return
                    }
                    else{
                      this.turn = 1
                    }
                  }
                  else{
                    if(this.scoreboard2[10]["values"]["value1"]=='X'){
                      this.subTurn++
                      this.begin = false
                      this.clickType = 0
                      this.strike = false
                      this.spare = false
                      return
                    }
                    else{
                      this.winner()
                    }
                  }
                  this.turnCounter++
                  this.subTurn = 0
                }
                this.begin = false
                this.clickType = 0
                this.strike = false
                this.spare = false
                for (let i = 0; i < this.pinList.length; i++) {
                  this.pinList[i].show = true
                }
                
              }, 2000);
            }else if(this.subTurn == 0){
              if(strike){
                this.strike = true
              }
              setTimeout(() => {
                if(strike){
                  for (let i = 0; i < this.pinList.length; i++) {
                    this.pinList[i].show = true
                  }
                }
                this.subTurn++
                this.begin = false
                this.clickType = 0
                this.strike = false
                this.spare = false
                
              }, 2000);
            }
          }
          else{
            this.modifyScoreBoard(strike,actualTurn)

            this.subTurn++

            if(this.subTurn==2 || strike){
              if(strike){
                this.strike = true
              }
              setTimeout(() => {
                if(this.turn==0){
                  this.turn = 1
                }
                else{
                  this.turn = 0
                }
                this.subTurn=0
                this.begin = false
                this.clickType = 0
                this.turnCounter++
                this.strike = false
                this.spare = false
                for (let i = 0; i < this.pinList.length; i++) {
                  this.pinList[i].show = true
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
    z-index: 10;
  }
  .board2{
    margin-top:1.5em;
    z-index: 10;
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
    top:50px;
    left:0;
  }



  /*@media (max-width: 1700px) {
    .tooltip{
      bottom:6em;
    }
  }*/
</style>