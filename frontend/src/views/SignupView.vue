<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white p-8 rounded shadow">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input v-model="name" id="name" type="text" required
                 class="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" id="email" type="email" required
                 class="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" id="password" type="password" required
                 class="mt-1 block w-full border border-gray-300 rounded p-2" />
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign Up
        </button>
      </form>

      <p class="mt-4 text-center text-sm">
        Already have an account?
        <router-link to="/" class="text-blue-600 hover:underline">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGeolocation } from '@/composables/useGeolocation.js'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const { lat, lon, getLocation } = useGeolocation()

async function handleSignup() {
  try {
    const res = await fetch('https://ev-charger-app.onrender.com/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    })

    if (!res.ok) throw new Error('Signup failed')

    const data = await res.json()
    const token = data.token

    if (token) {
      localStorage.setItem('token', token)
      alert('Signup successful!')

      // Get location and then navigate
      getLocation()
      setTimeout(() => {
        if (lat.value && lon.value) {
          router.push({ name: 'dashboard', query: { lat: lat.value, lon: lon.value } })
        } else {
          router.push({ name: 'dashboard' }) // fallback
        }
      }, 1000)
    } else {
      alert('No token received. Please login manually.')
    }
  } catch (error) {
    alert(error.message || 'Something went wrong')
  }
}
</script>
