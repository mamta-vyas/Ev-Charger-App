<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-semibold text-center mb-6">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            v-model="email"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            v-model="password"
            required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Login
        </button>

        <p v-if="error" class="text-red-500 text-sm text-center mt-2">
          {{ error }}
        </p>
      </form>
      <p class="mt-4 text-center text-sm">
  Don't have an account?
  <router-link to="/signup" class="text-blue-600 hover:underline">Sign up here</router-link>
</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const response = await axios.post('https://ev-charger-app.onrender.com/api/login', {
      email: email.value,
      password: password.value
    })
    const token = response.data.token
    localStorage.setItem('token', token)
    router.push('/dashboard')
  } catch (err) {
    err.value = 'Invalid email or password'
  }
}
</script>
