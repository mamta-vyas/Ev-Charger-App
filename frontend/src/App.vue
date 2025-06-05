<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useGeolocation } from '@/composables/useGeolocation.js'
import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'

const { lat, lon, getLocation } = useGeolocation()
onMounted(() => {
  getLocation() // still triggers on load (warning may appear)
})
const router = useRouter()
const route = useRoute()

// When location is available, redirect to dashboard (unless already there)
watch([lat, lon], ([newLat, newLon]) => {
  if (newLat && newLon && route.name !== 'dashboard') {
    router.push({ name: 'dashboard', query: { lat: newLat, lon: newLon } })
  }
})
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

vite-inspect,
#vite-plugin-vue-inspector,
.vite-inspect {
  display: none !important;
  visibility: hidden;
  pointer-events: none;
  opacity: 0;
}
</style>
