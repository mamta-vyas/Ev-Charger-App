<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup>
// No geolocation logic here now
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
