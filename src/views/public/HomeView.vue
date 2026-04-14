<template>
  <div class="home-page">
    <NavbarHome />
    <HeroSection />
    <NosotrosSection />
    <CaracteristicasSection />
    <PlanesSection />
    <ContactoSection />
    <FooterHome />
  </div>
</template>

<script setup>
import NavbarHome from '@/components/home/NavbarHome.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import NosotrosSection from '@/components/home/NosotrosSection.vue'
import CaracteristicasSection from '@/components/home/CaracteristicasSection.vue'
import PlanesSection from '@/components/home/PlanesSection.vue'
import ContactoSection from '@/components/home/ContactoSection.vue'
import FooterHome from '@/components/home/FooterHome.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}
</style>