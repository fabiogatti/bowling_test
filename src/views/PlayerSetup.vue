<template>
    <div>
        <playerSelection @newdata="handleData($event)" />
    </div>
</template>

<script>
import playerSelection from '@/components/playerSelection.vue'

export default {
    name: 'PlayerSetup',
    components:{
        playerSelection
    },
    data(){
        return{
            playerInfo:{
                player1:"",
                player2:""
            }
        }
    },
    methods: {
        handleData: function(e) {
            [this.playerInfo.player1, this.playerInfo.player2] = e;
        }
    }
}
</script>


<style scoped>

</style>