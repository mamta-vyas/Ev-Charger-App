<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <h2 class="text-xl font-bold">{{ isEdit ? 'Edit' : 'Add' }} Charger</h2>

    <div>
      <label class="block font-semibold">Name</label>
      <input v-model="form.name" type="text" required class="w-full p-2 border rounded" />
    </div>

    <div class="flex gap-4">
      <div class="flex-1">
        <label class="block font-semibold">Latitude</label>
        <input v-model.number="form.lat" type="number" required step="any" class="w-full p-2 border rounded" />
      </div>
      <div class="flex-1">
        <label class="block font-semibold">Longitude</label>
        <input v-model.number="form.lng" type="number" required step="any" class="w-full p-2 border rounded" />
      </div>
    </div>

    <div>
      <label class="block font-semibold">Status</label>
      <select v-model="form.status" required class="w-full p-2 border rounded">
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <div>
      <label class="block font-semibold">Power Output (kW)</label>
      <input v-model="form.powerOutput" type="number" required class="w-full p-2 border rounded" />
    </div>

    <div>
      <label class="block font-semibold">Connector Type</label>
      <input v-model="form.connectorType" type="text" required class="w-full p-2 border rounded" />
    </div>

    <div class="flex gap-4">
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        {{ isEdit ? 'Update' : 'Add' }}
      </button>
      <button type="button" class="text-red-600" @click="resetForm">Clear</button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import axios from 'axios'

const props = defineProps({
  editData: Object
})

const emit = defineEmits(['formSubmitted'])

const form = reactive({
  name: '',
  lat: '',
  lng: '',
  status: 'Active',
  powerOutput: '',
  connectorType: ''
})

const isEdit = computed(() => !!props.editData && !!props.editData._id)

const resetForm = () => {
  form.name = ''
  form.lat = ''
  form.lng = ''
  form.status = 'Active'
  form.powerOutput = ''
  form.connectorType = ''
}

const fillForm = () => {
  if (props.editData) {
    form.name = props.editData.name || ''
    form.lat = props.editData.location?.lat || ''
    form.lng = props.editData.location?.lng || ''
    form.status = props.editData.status || 'Active'
    form.powerOutput = props.editData.powerOutput || ''
    form.connectorType = props.editData.connectorType || ''
  } else {
    resetForm()
  }
}

watch(() => props.editData, fillForm, { immediate: true })

const handleSubmit = async () => {
  // ✅ Custom validation to prevent 400 error
  if (
    !form.name ||
    form.lat === '' || isNaN(form.lat) ||
    form.lng === '' || isNaN(form.lng) ||
    !form.status ||
    form.powerOutput === '' || isNaN(form.powerOutput) ||
    !form.connectorType
  ) {
    alert("Please fill all fields correctly.");
    return;
  }

  const token = localStorage.getItem('token')
  const payload = {
    name: form.name,
    location: {
      latitude: parseFloat(form.lat),
      longitude: parseFloat(form.lng)
    },
    status: form.status,
    powerOutput: parseFloat(form.powerOutput),
    connectorType: form.connectorType
  }

  try {
    if (isEdit.value) {
      await axios.put(`http://localhost:5000/api/chargers/${props.editData._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } else {
      await axios.post('http://localhost:5000/api/chargers', payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }
    resetForm()
    emit('formSubmitted')
  } catch (err) {
    console.error('Submit failed:', err)
    alert("Failed to submit. Please check input and try again.")
  }
}
</script>

