<template>
  <div class="border rounded-lg p-4 shadow-sm bg-white">
    <h3 class="text-lg font-semibold mb-2">{{ charger.name }}</h3>

    <div class="text-sm text-gray-600 mb-2">
      <p><strong>Location:</strong> {{ charger.location.latitude }}, {{ charger.location.longitude }}</p>
      <p><strong>Status:</strong> 
        <span :class="charger.status === 'Active' ? 'text-green-600' : 'text-red-600'">
          {{ charger.status }}
        </span>
      </p>
      <p><strong>Power Output:</strong> {{ charger.powerOutput }} kW</p>
      <p><strong>Connector:</strong> {{ charger.connectorType }}</p>
    </div>

    <div class="flex gap-2 mt-4">
      <button 
        @click="$emit('edit', charger)" 
        class="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm"
      >
        Edit
      </button>
      <button 
        @click="$emit('delete', charger._id)" 
        class="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700 text-sm"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  charger: Object
})

defineEmits(['edit', 'delete'])
</script>
