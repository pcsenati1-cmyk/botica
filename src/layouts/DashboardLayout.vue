<template>
  <div class="app-shell">

    <!-- Mobile overlay -->
    <div
      v-if="isMobile && mobileOpen"
      class="mob-overlay"
      @click="mobileOpen = false"
    ></div>

    <!-- SIDEBAR — desktop: siempre visible, mini o full -->
    <!-- mobile: oculto por defecto, se abre con overlay -->
    <div
      class="sidebar-wrap"
      :class="{
        'sidebar-wrap--mini': !isMobile && mini,
        'sidebar-wrap--mobile-open': isMobile && mobileOpen,
        'sidebar-wrap--mobile': isMobile
      }"
    >
      <SidebarNav
        :mini="!isMobile && mini"
        :userName="userName"
        :userInitial="userInitial"
        :userRole="userRole"
        :isAdmin="authStore.isAdmin"
        :alertCount="alertCount"
        :mainNav="mainNav"
        :adminNav="adminNav"
        @close="mobileOpen = false"
        @logout="handleLogout"
      />
    </div>

    <!-- MAIN CONTENT -->
    <div
      class="main-wrap"
      :class="{
        'main-wrap--mini': !isMobile && mini,
        'main-wrap--full': !isMobile && !mini
      }"
    >
      <TopBar
        :pageTitle="currentPageTitle"
        :userName="userName"
        :userInitial="userInitial"
        :userEmail="authStore.user?.email"
        :isDark="isDark"
        :alertCount="alertCount"
        :isMobile="isMobile"
        @toggle="toggleSidebar"
        @toggleAlerts="showAlerts = !showAlerts"
        @toggleDark="toggleDark()"
        @logout="handleLogout"
      />

      <!-- Alert bar -->
      <transition name="slide-down">
        <div v-if="showAlerts && alertCount > 0" class="alert-bar">
          <span class="alert-bar-title">⚠️ {{ alertCount }} productos con stock bajo</span>
          <div class="alert-bar-chips">
            <span
              v-for="p in inventarioStore.productosBajoStock.slice(0, 5)"
              :key="p.id"
              class="alert-chip"
              :class="p.stock === 0 ? 'chip-red' : 'chip-amber'"
            >{{ p.nombre }} ({{ p.stock }})</span>
          </div>
          <button class="alert-bar-close" @click="showAlerts = false">✕</button>
        </div>
      </transition>

      <!-- Page -->
      <main class="page-content">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useInventarioStore } from '@/stores/inventario'
import { useDark, useToggle, useMediaQuery, useLocalStorage } from '@vueuse/core'
import SidebarNav from './SidebarNav.vue'
import TopBar from './TopBar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const inventarioStore = useInventarioStore()

const isDark = useDark()
const toggleDark = useToggle(isDark)
const isMobile = useMediaQuery('(max-width: 768px)')

// Desktop: mini (64px) vs full (240px)
const mini = useLocalStorage('sb-mini', false)
// Mobile: open/close
const mobileOpen = ref(false)

const showAlerts = ref(false)

// On mobile resize, reset
watch(isMobile, (val) => {
  if (val) mobileOpen.value = false
})

function toggleSidebar() {
  if (isMobile.value) {
    mobileOpen.value = !mobileOpen.value
  } else {
    mini.value = !mini.value
  }
}

const userName = computed(() =>
  authStore.user?.user_metadata?.nombres ||
  authStore.user?.email?.split('@')[0] ||
  'Usuario'
)
const userInitial = computed(() => userName.value.charAt(0).toUpperCase())
const userRole = computed(() => {
  const r = authStore.user?.user_metadata?.rol || authStore.user?.user_metadata?.role
  return (r === 'administrador' || r === 'ADMIN') ? 'Administrador' : 'Vendedor'
})
const currentPageTitle = computed(() => route.meta?.title || 'Dashboard')
const alertCount = computed(() => inventarioStore.productosBajoStock?.length || 0)

const mainNav = computed(() => [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: `<svg width="17" height="17" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="2" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="2" width="6" height="6" rx="2" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="10" width="6" height="6" rx="2" stroke="currentColor" stroke-width="1.5"/><rect x="10" y="10" width="6" height="6" rx="2" stroke="currentColor" stroke-width="1.5"/></svg>`
  },
  {
    to: '/admin/ventas',
    label: 'Punto de Venta',
    icon: `<svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path d="M2 3h2l2.5 8h7l2-5H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="14.5" r="1.2" fill="currentColor"/><circle cx="13" cy="14.5" r="1.2" fill="currentColor"/></svg>`
  },
  {
    to: '/admin/inventario',
    label: 'Inventario',
    icon: `<svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path d="M9 2l7 4v6l-7 4-7-4V6l7-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 2v12M2 6l7 4 7-4" stroke="currentColor" stroke-width="1.5"/></svg>`,
    badge: alertCount.value > 0 ? alertCount.value : null
  },
  {
    to: '/admin/alertas',
    label: 'Alertas de Stock',
    icon: `<svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path d="M9 2L1.5 15.5h15L9 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 8v3M9 13.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    badge: alertCount.value > 0 ? alertCount.value : null
  },
  {
    to: '/admin/reportes',
    label: 'Reportes',
    icon: `<svg width="17" height="17" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5 10l2.5-3 2.5 2 3-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  },
])

const adminNav = computed(() => [
  {
    to: '/admin/usuarios',
    label: 'Usuarios',
    icon: `<svg width="17" height="17" viewBox="0 0 18 18" fill="none"><circle cx="7" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M1 16c0-3.3 2.7-6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="14" cy="11" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M11.5 16h5M14 13.5v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
  },
])

onMounted(async () => {
  await inventarioStore.fetchProductos()
})

async function handleLogout() {
  await authStore.signOut()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
  position: relative;
}

/* Mobile overlay */
.mob-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 199;
  backdrop-filter: blur(2px);
}

/* ── SIDEBAR WRAPPER ── */
.sidebar-wrap {
  /* Desktop full */
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

/* Desktop mini */
.sidebar-wrap--mini {
  width: 64px;
}

/* Mobile: hidden by default */
.sidebar-wrap--mobile {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 240px;
  transform: translateX(-100%);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 200;
}

/* Mobile: open */
.sidebar-wrap--mobile-open {
  transform: translateX(0);
}

/* ── MAIN WRAPPER ── */
.main-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Alert bar */
.alert-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 8px 20px;
  background: #fffbeb;
  border-bottom: 1px solid #fde68a;
}
.alert-bar-title { font-size: 12px; font-weight: 700; color: #92400e; flex-shrink: 0; }
.alert-bar-chips { display: flex; gap: 5px; flex-wrap: wrap; flex: 1; }
.alert-chip { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 99px; }
.chip-red { background: #fee2e2; color: #991b1b; }
.chip-amber { background: #fef3c7; color: #92400e; }
.alert-bar-close { background: none; border: none; cursor: pointer; color: #92400e; font-size: 13px; flex-shrink: 0; }

/* Page content */
.page-content {
  flex: 1;
  padding: 24px;
  overflow-x: hidden;
  min-width: 0;
}

/* Transitions */
.slide-down-enter-active, .slide-down-leave-active { transition: opacity 0.2s, transform 0.2s; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }

.page-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 768px) {
  .sidebar-wrap { display: none; }
  .sidebar-wrap--mobile { display: block; }
  .page-content { padding: 14px; }
}
</style>
