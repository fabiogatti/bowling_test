<template>
    <div>
        <playerSelection/>
    </div>
</template>

<script>
import playerSelection from '@/components/playerSelection.vue'

export default {
    name: 'PlayerSetup',
    components:{
        playerSelection
    }
}
</script>


<style scoped>
.flexAlign{
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>