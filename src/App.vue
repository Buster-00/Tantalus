<template>
  <div class="relative min-h-screen w-screen overflow-x-hidden">
    <NavBar />
    <router-view class="size-full" />
    <Footer />
  </div>
</template>

<script setup>
import NavBar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>
