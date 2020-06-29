<template>
  <div class="flexScore">
      <h1>{{ playerName }}</h1>
      <div class="scoreBoard"> 
          <scoreBox class="box" v-for="(item2, index2) in propData" :key="index2"  :dataValues="item2" :playerNumber="playerNumber" :turnNumber="index2" />
      </div>
  </div>
</template>

<script>
import scoreBox from '@/components/scoreBox.vue'

export default {
    name:'scoreBoard',
    props:['propData','playerNumber','playerName'],
    components:{
        scoreBox
    },
    watch: { 
        propData: function(newVal, oldVal) { // watch it
            console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        },
        immediate: true, 
    }
}
</script>

<style scoped>
    .flexScore{
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .scoreBoard{
        display: flex;
        flex-direction: row;
    }
    h1{
        width: 15vw;
        margin-right: 1.5em;
    }
</style>