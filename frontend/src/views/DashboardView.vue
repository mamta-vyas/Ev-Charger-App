<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">Charging Stations</h1>
  
     <button
      @click="logout"
      class="bg-red-500 text-white px-4 py-2 mb-8 rounded hover:bg-red-600 float-end"
    >
      Logout
    </button>

    <!-- Map Section -->
    <div id="map" class="w-full h-[384px] rounded mb-6 shadow"></div>

    <!-- Add Charger Button -->
<div class="mb-4">
  <button
    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    @click="selectedCharger = {}"
  >
    + Add New Charger
  </button>
</div>


    <!-- Filters -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <select v-model="filters.status" class="p-2 border rounded">
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <input
        type="number"
        v-model.number="filters.powerOutput"
        placeholder="Min Power Output (kW)"
        class="p-2 border rounded"
      />

      <select v-model="filters.connectorType" class="p-2 border rounded">
        <option value="">All Connectors</option>
        <option value="Type1">Type1</option>
        <option value="Type2">Type2</option>
        <option value="CCS">CCS</option>
        <option value="CHAdeMO">CHAdeMO</option>
      </select>
    </div>

    <p class="text-sm text-gray-600 mb-4">Total Chargers Fetched: {{ chargers.length }}</p>
<p class="text-sm text-gray-600 mb-4">Filtered Chargers: {{ filteredChargers.length }}</p>


    <!-- Charger Form (Edit/Add) -->
    <div v-if="selectedCharger" class="mb-6 bg-white p-4 rounded shadow">
      <ChargerForm :editData="selectedCharger" @formSubmitted="handleFormSubmit" />
    </div>

    <!-- Chargers List -->
    <div v-if="filteredChargers.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ChargerCard
        v-for="charger in filteredChargers"
        :key="charger._id"
        :charger="charger"
        @edit="selectChargerForEdit"
        @delete="deleteCharger"
      />
    </div>
    <div v-else class="text-gray-500 text-center mt-10">No chargers found.</div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import L from 'leaflet'
import ChargerCard from '@/components/ChargerCard.vue'
import ChargerForm from '@/components/ChargerForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()


const route = useRoute()

const lat = ref(20.5937) // default to India center
const lon = ref(78.9629)

const chargers = ref([])



function logout() {
  localStorage.removeItem('token') // 🧹 Clear token
  router.push('/') // 🔁 Redirect to login
}

// Use reactive here so v-model works directly on filters.*
const filters = reactive({
  status: '',
  powerOutput: null,
  connectorType: ''
})

const selectedCharger = ref(null)
const map = ref(null)
const markers = ref([])

const fetchChargers = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:5000/api/chargers', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    chargers.value = res.data || []
    renderMarkers()
  } catch (err) {
    console.error(err)
  }
}

const deleteCharger = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:5000/api/chargers/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    // After delete, reset selectedCharger if it was deleted
    if (selectedCharger.value?._id === id) selectedCharger.value = null
    fetchChargers()
  } catch (err) {
    console.error(err)
  }
}

const selectChargerForEdit = (charger) => {
  selectedCharger.value = { ...charger } // spread to avoid mutating original
}

const handleFormSubmit = () => {
  selectedCharger.value = null
  fetchChargers()
}

const filteredChargers = computed(() => {
  return chargers.value.filter((c) => {
    const statusMatch = filters.status
      ? c.status?.toLowerCase() === filters.status.toLowerCase()
      : true

    const powerMatch = filters.powerOutput !== null && filters.powerOutput !== ''
      ? c.powerOutput >= filters.powerOutput
      : true

    const connectorMatch = filters.connectorType
      ? c.connectorType === filters.connectorType
      : true

    return statusMatch && powerMatch && connectorMatch
  })
})

// Init Leaflet Map
const initMap = () => {
  // Try to get from route query
  const queryLat = parseFloat(route.query.lat)
  const queryLon = parseFloat(route.query.lon)

  if (!isNaN(queryLat) && !isNaN(queryLon)) {
    lat.value = queryLat
    lon.value = queryLon
  }

  map.value = L.map('map').setView([lat.value, lon.value], 10)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map.value)
}

// Render map markers
const renderMarkers = () => {
  if (!map.value) return

  // Remove old markers
  markers.value.forEach((marker) => marker.remove())
  markers.value = []

  chargers.value.forEach((charger) => {
    if (charger.location && charger.location.latitude && charger.location.longitude) {
      const marker = L.marker([charger.location.latitude, charger.location.longitude])
        .addTo(map.value)
        .bindPopup(
          `<b>${charger.name}</b><br>${charger.connectorType} - ${charger.powerOutput}kW`
        )
      markers.value.push(marker)
    }
  })

  if (markers.value.length > 0) {
    const group = L.featureGroup(markers.value)
    map.value.fitBounds(group.getBounds().pad(0.2))
  }
}

onMounted(() => {
  initMap()
  fetchChargers()
})

// Re-render markers if chargers or map changes
watch(chargers, () => {
  renderMarkers()
})
</script>
