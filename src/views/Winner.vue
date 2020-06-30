<template>
  <div class="flexRow">
        <h1>
            THE WINNER IS
        </h1>
        <h1 v-bind:class="[ winner==playerData.player1 ? 'color1' : 'color2']">
            {{ this.winner }}
        </h1>
        <h1>
            Congratulations!
        </h1>
        <scoreBoard class="space" :propData="score1" :playerNumber='0' :playerName="this.playerData.player1"  />
        <scoreBoard class="space " :propData="score2" :playerNumber='1' :playerName="this.playerData.player2"  />
        <div class="space">
            <router-link :to="{ name:'Game', params: { playerData: this.playerData } }" tag="button" class="normal-button cyan">
                Restart game
            </router-link>
        </div>
        <div class="space">
            <router-link to="/" tag="button" class="normal-button">Back</router-link>
        </div>
  </div>
</template>

<script>
import scoreBoard from '@/components/scoreBoard.vue'

export default {
    name:"Winner",
    data(){
        return{
            score1:{},
            score2:{}
        }
    },
    components:{
        scoreBoard
    },
    created() {
      this.playerData = this.$route.params.playerData
      this.winner = this.$route.params.winner
      this.score1 = this.$route.params.scoreboard1
      this.score2 = this.$route.params.scoreboard2
      console.log(this.score1)
    },
}
</script>

<style scoped>
    .flexRow{
        display: flex;
        flex-direction: column;
        height: auto;
        width: 100%;
        margin-top:100px;
        justify-content: center;
        align-items: center;
    }
    .space{
        margin-top: 1.5em;
    }
    .cyan{
        background-color: darkcyan;
    }
    .color1{
        color:crimson;
    }
    .color2{
        color:darkblue;
    }
</style>