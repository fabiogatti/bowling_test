import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PlayerSetup from '../views/PlayerSetup.vue'
import Game from '../views/Game.vue'
import Winner from '../views/Winner.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/playersetup',
    name: 'PlayerSetup',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: PlayerSetup
  },
  {
    path: '/game/:playerData',
    name: 'Game',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Game
  },
  {
    path: '/Winner',
    name: 'Winner',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Winner
  }
]

const router = new VueRouter({
  routes
})

export default router
