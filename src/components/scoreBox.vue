<template>
  <div class="boxDiv" v-bind:class="[playerNumber == 0? 'player1':'player2', turnNumber==1 ? 'first' : '' , turnNumber==10 ? 'last' : '' ]">
        <p class="turn" v-bind:class="[playerNumber == 0? 'player1':'player2']">
            {{ turnNumber }}
        </p>
        <div class="scoresDiv">
            <div class="individualScore" v-for="(item, index) in dataValues.values" :key="dataValues.id+index" 
            v-bind:class="[playerNumber == 0 ? 'player1':'player2', verifyLast(index) ? 'lastScore' : '' ]">
                <p class="score">{{ item }}</p>
            </div>
        </div>
        <p class="total">{{ dataValues.total }}</p>
  </div>
</template>

<script>
export default {
    name:'scoreBox',
    props:['dataValues','playerNumber','turnNumber'],
    created() {
        //console.log(this.playerNumber)
    },
    methods:{
        verifyLast: function(index){
            if(this.turnNumber==10 && index=="value1")
                return true
            else
                return false
        }
    }
}
</script>

<style scoped>
    .player1{
        border: 2px solid crimson;
    }
    .player2{
        border: 2px solid darkblue;
    }
    .boxDiv{
        min-width: 90px;
        display: flex;
        flex-direction: column;
        border-top-width:4px;
        border-bottom-width: 4px;
    }
    .boxDiv *{
        font-weight: bold;
        margin:0;
    }
    
    .turn{
        padding: 5px;
        font-size: 1.2em;
        border-top: 0;
        border-left: 0;
        border-right: 0;
    }
    .scoresDiv{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    .individualScore{
        min-width: 30px;
        min-height: 30px;
        display: inline-block;
        font-size: 1.5em;
        border-top:0;
        border-right:0;
    }
    .score{
        align-self: center;
        justify-self: center;
        margin: 0;
    }
    .total{
        font-size: 2.5em;
        padding: 0px 10px;
        align-self: flex-start;
        min-height: 40px;
    }
    .first{
        border-left-width: 4px;
    }
    .last{
        border-right-width: 4px;
    }
    .lastScore{
        border-left-width: 0px;
    }
</style>