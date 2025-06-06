<template>
  <div class="flex flex-col md:flex-row h-screen">
    <!-- Map Section -->
    <div id="map" class="w-full md:w-2/3 h-1/2 md:h-full">
        </div>

    <!-- Form Section -->
    <div class="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto p-4 bg-gray-100">
      <ChargerForm :editData="editData" @formSubmitted="handleFormSubmit" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import L from 'leaflet'
import { useRoute } from 'vue-router'
import ChargerForm from '@/components/ChargerForm.vue'

const route = useRoute()
const map = ref(null)
const markers = ref([])
const chargers = ref([])
const editData = ref(null)

const fetchChargers = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('https://ev-charger-app.onrender.com/api/chargers', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    chargers.value = res.data
    renderMarkers()
  } catch (err) {
    console.error('Failed to fetch chargers', err)
  }
}

const renderMarkers = () => {
  // Remove old markers
  markers.value.forEach((marker) => marker.remove())
  markers.value = []

  chargers.value.forEach((charger) => {
   const marker = L.marker([charger.location.latitude, charger.location.longitude])
    .addTo(map.value)
      .bindPopup(`<b>${charger.name}</b><br>${charger.connectorType} - ${charger.powerOutput}kW`)
    markers.value.push(marker)
  })

  // Fit bounds to all markers
  if (markers.value.length > 0) {
    const group = L.featureGroup(markers.value)
    map.value.fitBounds(group.getBounds().pad(0.2))
  }
}

const initMap = () => {
  map.value = L.map('map').setView([20.5937, 78.9629], 5) // Default India center
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)
}

const handleFormSubmit = () => {
  console.log('Vue 3 onMounted is working ✅')
  fetchChargers()
  editData.value = null
}

// Check for ?editId in URL and populate form
watch(
  () => route.query.editId,
  (newId) => {
    if (newId) {
      const match = chargers.value.find((c) => c._id === newId)
      if (match) {
        editData.value = match
      }
    }
  }
)

onMounted(() => {
  initMap()
  fetchChargers()
})
</script>

<style scoped>
#map {
  height: 100%;
}
</style>
