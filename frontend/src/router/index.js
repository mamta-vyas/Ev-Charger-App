import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import DashboardView from '../views/DashboardView.vue'
import MapView from '../views/MapView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    props: route => {
    const lat = parseFloat(route.query.lat)
    const lon = parseFloat(route.query.lon)
    return {
      lat: isNaN(lat) ? 20.5937 : lat, // India default
      lon: isNaN(lon) ? 78.9629 : lon
    }
  }
  },
  {
    path: '/map',
    name: 'map',
    component: MapView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
