<template>
    <div class="flexAlign">
        <div class="container">
            <h1>2D BOWLING</h1>
            <br>
            <p><span>Player 1:</span> {{ formData.player1 }}</p>
            <input v-model="formData.player1" placeholder="Name">
            <p><span>Player 2:</span> {{ formData.player2 }}</p>
            <input v-model="formData.player2" placeholder="Name">
            <div class="space">
                <router-link :to="{ name:'Game', params: { playerData: this.formData } }" tag="button" class="normal-button" v-bind:disabled="smallLength()" v-bind:class="{ disabled : smallLength() }">
                    Go!
                </router-link>
            </div>
            <div class="space">
                <router-link to="/" tag="button" class="normal-button">Back</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"playerSelection",
    data(){
        return{
            formData:{
                player1:"",
                player2:""
            }
        }
    },
    methods:{
        smallLength: function(){
            if(this.formData.player1.length<3 || this.formData.player2.length<3)
                return true;
            else
                return false;
        }
    }
}
</script>

<style scoped>
h1{
  color:crimson;
}
.container{
    width: 25%;
}
span{
    color: crimson;
    font-weight: bold;
}
p{
    text-align: start;
    color:rgba(220, 20, 60,0.45);
    font-size: 1.2em;
}
input{
    width: 100%;
    color:crimson;
    border: none;
    /*border:2px solid rgba(220, 20, 60,0.5);*/
    border:2px solid rgba(220, 20, 60,0.15);
    border-radius: 10px;
    padding: 5px;
    margin-bottom: 1.5em;
    font-size: 1em;
}
input::placeholder {
    color:rgba(220, 20, 60,0.45);
}
.space{
    width: 100%;
    margin-top:1.5em;
}
.disabled{
    background-color:rgba(220, 20, 60,0.25);
}
</style>