<template>
  <div class="boxDiv" v-bind:class="[playernumber == 0? 'player1':'player2']">
        <p class="turn" v-bind:class="[playernumber == 0? 'player1':'player2']">
            {{ turnNumber }}
        </p>
        <div class="scoresDiv">
            <div class="individualScore" v-for="(item, index) in data.values" :key="index" v-bind:class="[playernumber == 0? 'player1':'player2']">
                <p class="score">{{ item +5 }}</p>
            </div>
        </div>
        <p class="total">{{ data.total+5 }}</p>
  </div>
</template>

<script>
export default {
    name:'scoreBox',
    props:['data','playerNumber','turnNumber'],

}
</script>

<style>
    .boxDiv{
        min-width: 100px;
        display: flex;
        flex-direction: column;
    }
    .boxDiv *{
        font-weight: bold;
        margin:0;
    }
    .player1{
        border: 2px solid crimson;
    }
    .player2{
        border: 2px solid darkblue;
    }
    .turn{
        padding: 5px;
        font-size: 1.2em;
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
</style>