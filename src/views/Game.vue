<template>
  <div class="flexColumn">
    <h1>Player turn: <span v-bind:class="[ turn==0 ? 'color1' : 'color2']">{{ turn==0 ? this.playerData.player1 : this.playerData.player2 }}</span></h1>
    <div class="flexRow">
      <board class="board" :begin="begin" :clickType="clickType" :turn="turn"/>
      <div class="flexColumnButton">
        <button class="btn btn1" @click="beginTurn(1)">Lanzamiento seguro<i class="fas fa-hard-hat"></i></button>
        <button class="btn btn2" @click="beginTurn(2)">Lanzamiento aleatorio<i class="fas fa-random"></i></button>
        <button class="btn btn3" @click="beginTurn(3)">Lanzamiento arriesgado<i class="fas fa-fire"></i></button>
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
        turn:0
      }
    },
    created() {
      this.playerData = this.$route.params.playerData;
    },
    methods:{
      beginTurn:function(type){
        
        this.begin = true
        this.clickType = type
        setTimeout(() => {
          if(this.turn==0)
            this.turn = 1
          else
            this.turn =0
          this.begin = false
          this.clickType = 0
        }, 2000);
      }
    }
}
</script>

<style scoped>
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