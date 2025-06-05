// composables/useGeolocation.js
import { ref } from 'vue'

export function useGeolocation() {
  const lat = ref(null)
  const lon = ref(null)
  const error = ref(null)

  const getLocation = () => {
    if (!navigator.geolocation) {
      error.value = 'Geolocation not supported.'
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat.value = position.coords.latitude
        lon.value = position.coords.longitude
      },
      (err) => {
        error.value = err.message
      }
    )
  }

  return { lat, lon, error, getLocation }
}
