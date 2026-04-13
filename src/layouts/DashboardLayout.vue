<template>
  <div class="dashboard-layout">
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <h2 v-if="!sidebarCollapsed">Nova Salud</h2>
        <span v-else>NS</span>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" exact-active-class="active">
          <span class="nav-icon">📊</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Dashboard</span>
        </router-link>
        <router-link to="/inventario" class="nav-item" active-class="active">
          <span class="nav-icon">📦</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Inventario</span>
        </router-link>
        <router-link to="/ventas" class="nav-item" active-class="active">
          <span class="nav-icon">🛒</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Ventas</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button @click="handleLogout" class="nav-item logout">
          <span class="nav-icon">🚪</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
    <main class="main-content">
      <header class="top-bar">
        <button @click="toggleSidebar" class="menu-toggle">
          <span>☰</span>
        </button>
        <div class="user-info">
          <span>{{ userName }}</span>
        </div>
      </header>
      <div class="content-area">
        <router-view />
      </div>
    </main>
    <div v-if="inventarioStore.productosBajoStock.length > 0" class="stock-alert">
      <span>⚠️ {{ inventarioStore.productosBajoStock.length }} productos con stock bajo</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useInventarioStore } from '@/stores/inventario'

const router = useRouter()
const authStore = useAuthStore()
const inventarioStore = useInventarioStore()

const sidebarCollapsed = ref(false)

const userName = computed(() => authStore.user?.user_metadata?.nombre || 'Usuario')

onMounted(async () => {
  await inventarioStore.fetchProductos()
})

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

async function handleLogout() {
  await authStore.signOut()
  router.push({ name: 'Login' })
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  width: 260px;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.sidebar-header h2 {
  font-size: 20px;
  color: #667eea;
  margin: 0;
}

.sidebar-header span {
  font-size: 20px;
  color: #667eea;
  font-weight: bold;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 8px;
  border-radius: 10px;
  color: #666;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  font-size: 15px;
}

.nav-item:hover {
  background: #f0f4ff;
  color: #667eea;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.nav-icon {
  font-size: 18px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.sidebar.collapsed .nav-icon {
  margin-right: 0;
}

.nav-label {
  font-weight: 500;
}

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid #eee;
}

.logout:hover {
  background: #fee;
  color: #e53e3e;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s;
  display: flex;
  flex-direction: column;
}

.sidebar.collapsed + .main-content {
  margin-left: 70px;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 50;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
}

.menu-toggle:hover {
  background: #f0f4ff;
}

.user-info {
  font-weight: 500;
  color: #333;
}

.content-area {
  flex: 1;
  padding: 24px;
}

.stock-alert {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #fc0;
  color: #333;
  padding: 12px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  z-index: 1000;
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }
  
  .main-content {
    margin-left: 70px;
  }
  
  .nav-label {
    display: none;
  }
  
  .content-area {
    padding: 16px;
  }
}
</style>