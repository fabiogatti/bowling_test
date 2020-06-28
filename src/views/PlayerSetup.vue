<template>
    <div>
        <playerSelection />
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
            },
            pinList: []
        }
    }
}
</script>


<style scoped>

</style>