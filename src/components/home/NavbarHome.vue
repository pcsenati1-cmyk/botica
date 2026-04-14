<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">
        <div class="brand-icon" :class="{ 'icon-bounce': isScrolled }">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="10" fill="url(#ng1)"/>
            <path d="M16 7v18M7 16h18" stroke="white" stroke-width="3" stroke-linecap="round"/>
            <defs>
              <linearGradient id="ng1" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#06b6d4"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span class="brand-name">Nova<span>Salud</span></span>
      </router-link>

      <div class="nav-links">
        <a 
          v-for="(link, index) in navLinks" 
          :key="link.href"
          :href="link.href"
          class="nav-link"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <component :is="link.icon" :size="16" />
          {{ link.text }}
        </a>
      </div>

      <div class="nav-actions">
        <router-link to="/login" class="btn-ghost">
          <LogIn :size="16" />
          Iniciar Sesion
        </router-link>
        <router-link to="/register" class="btn-nav-cta">
          <UserPlus :size="16" />
          Empezar Gratis
        </router-link>
      </div>

      <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen" :class="{ open: mobileOpen }">
        <Menu :size="24" />
      </button>
    </div>

    <Transition name="slide">
      <div class="mobile-menu" v-if="mobileOpen">
        <div class="mobile-header">
          <span class="brand-name">Nova<span>Salud</span></span>
          <button class="close-btn" @click="mobileOpen = false">
            <X :size="24" />
          </button>
        </div>
        <div class="mobile-links">
          <a 
            v-for="(link, index) in navLinks" 
            :key="link.href"
            :href="link.href" 
            @click="mobileOpen = false"
            class="mobile-link"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <component :is="link.icon" :size="20" />
            {{ link.text }}
          </a>
        </div>
        <div class="mobile-actions">
          <router-link to="/login" @click="mobileOpen = false" class="btn-ghost-mobile">
            <LogIn :size="18" />
            Iniciar Sesion
          </router-link>
          <router-link to="/register" @click="mobileOpen = false" class="btn-cta-mobile">
            <UserPlus :size="18" />
            Empezar Gratis
          </router-link>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { 
  Home, Users, Package, CreditCard, Mail, 
  LogIn, UserPlus, Menu, X 
} from 'lucide-vue-next'

const isScrolled = ref(false)
const mobileOpen = ref(false)

const navLinks = [
  { href: '#inicio', text: 'Inicio', icon: Home },
  { href: '#nosotros', text: 'Nosotros', icon: Users },
  { href: '#caracteristicas', text: 'Caracteristicas', icon: Package },
  { href: '#planes', text: 'Planes', icon: CreditCard },
  { href: '#contacto', text: 'Contacto', icon: Mail },
]

const handleScroll = () => { 
  isScrolled.value = window.scrollY > 20 
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(mobileOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 16px 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.navbar.scrolled {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 30px rgba(0,0,0,0.1);
  padding: 8px 0;
}
.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 32px;
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 0.3s;
}
.nav-brand:hover {
  transform: scale(1.02);
}
.brand-icon {
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.brand-icon.icon-bounce {
  animation: bounce 0.6s ease;
}
@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
.brand-name {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
}
.brand-name span { color: #6366f1; }
.nav-links {
  display: flex;
  gap: 8px;
  flex: 1;
  justify-content: center;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
  animation: fadeIn 0.5s ease backwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.nav-link:hover {
  color: #6366f1;
  background: rgba(99,102,241,0.08);
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.btn-ghost {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  color: #475569;
  font-weight: 600;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.2s;
  border: 1px solid transparent;
  text-decoration: none;
}
.btn-ghost:hover { 
  background: #f1f5f9; 
  color: #0f172a; 
  border-color: #e2e8f0;
  transform: translateY(-1px);
}
.btn-nav-cta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-weight: 700;
  font-size: 14px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(99,102,241,0.35);
  text-decoration: none;
}
.btn-nav-cta:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(99,102,241,0.45);
}
.btn-nav-cta:active {
  transform: translateY(0) scale(0.98);
}
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #475569;
  transition: transform 0.3s;
}
.mobile-menu-btn:hover {
  transform: scale(1.1);
}
.mobile-menu-btn.open {
  transform: rotate(90deg);
}
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  z-index: 999;
}
.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}
.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #475569;
  padding: 8px;
  transition: transform 0.2s;
}
.close-btn:hover {
  transform: rotate(90deg);
}
.mobile-links {
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mobile-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  color: #475569;
  font-weight: 500;
  font-size: 16px;
  border-radius: 12px;
  text-decoration: none;
  animation: slideIn 0.4s ease backwards;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
.mobile-link:hover {
  background: #f1f5f9;
  color: #6366f1;
}
.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}
.btn-ghost-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #475569;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-ghost-mobile:hover {
  border-color: #6366f1;
  color: #6366f1;
}
.btn-cta-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-weight: 700;
  font-size: 15px;
  border-radius: 10px;
  text-decoration: none;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
@media (max-width: 900px) {
  .nav-links, .nav-actions { display: none; }
  .mobile-menu-btn { display: flex; }
}
</style>