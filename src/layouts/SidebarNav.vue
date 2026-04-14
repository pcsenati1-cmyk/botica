<template>
  <aside class="sidebar" :class="{ 'sidebar--mini': mini }">

    <!-- Logo -->
    <div class="sb-logo">
      <div class="sb-logo-icon">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="9" fill="url(#sbg)"/>
          <path d="M16 8v16M8 16h16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          <defs>
            <linearGradient id="sbg" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stop-color="#818cf8"/>
              <stop offset="100%" stop-color="#06b6d4"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div v-if="!mini" class="sb-logo-text">
        <span class="sb-logo-name">NovaSalud</span>
        <span class="sb-logo-sub">Botica</span>
      </div>
    </div>

    <!-- User -->
    <div class="sb-user" :class="{ 'sb-user--mini': mini }">
      <div class="sb-user-av">{{ userInitial }}</div>
      <div v-if="!mini" class="sb-user-info">
        <span class="sb-user-name">{{ userName }}</span>
        <span class="sb-user-role">{{ userRole }}</span>
      </div>
      <span v-if="!mini" class="sb-user-dot"></span>
    </div>

    <!-- Nav -->
    <nav class="sb-nav">
      <span v-if="!mini" class="sb-group">PRINCIPAL</span>

      <router-link
        v-for="item in mainNav"
        :key="item.to"
        :to="item.to"
        class="sb-item"
        :class="{ active: isActive(item.to) }"
        :title="mini ? item.label : ''"
        @click="$emit('close')"
      >
        <span class="sb-item-icon" v-html="item.icon"></span>
        <span v-if="!mini" class="sb-item-label">{{ item.label }}</span>
        <span v-if="!mini && item.badge" class="sb-item-badge">{{ item.badge }}</span>
        <span v-if="mini && item.badge" class="sb-item-dot"></span>
      </router-link>

      <template v-if="isAdmin">
        <span v-if="!mini" class="sb-group">ADMINISTRACIÓN</span>
        <router-link
          v-for="item in adminNav"
          :key="item.to"
          :to="item.to"
          class="sb-item"
          :class="{ active: isActive(item.to) }"
          :title="mini ? item.label : ''"
          @click="$emit('close')"
        >
          <span class="sb-item-icon" v-html="item.icon"></span>
          <span v-if="!mini" class="sb-item-label">{{ item.label }}</span>
        </router-link>
      </template>
    </nav>

    <!-- Logout at bottom -->
    <div class="sb-bottom">
      <div class="sb-sep"></div>
      <button
        class="sb-item sb-logout"
        :title="mini ? 'Cerrar sesión' : ''"
        @click="$emit('logout')"
      >
        <span class="sb-item-icon">
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
            <path d="M7 3H4a1 1 0 00-1 1v10a1 1 0 001 1h3M12 13l4-4-4-4M16 9H7"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span v-if="!mini" class="sb-item-label">Cerrar Sesión</span>
      </button>
      <div v-if="!mini" class="sb-version">
        <span class="sb-version-dot"></span>
        Sistema activo · v1.0
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Users } from 'lucide-vue-next'

const props = defineProps({
  mini: Boolean,
  userName: String,
  userInitial: String,
  userRole: String,
  isAdmin: Boolean,
  alertCount: Number,
  mainNav: Array,
  adminNav: Array,
})

defineEmits(['close', 'logout'])

const route = useRoute()

function isActive(path) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: var(--card-bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar--mini {
  width: 64px;
}

/* Logo */
.sb-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 60px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  overflow: hidden;
}
.sb-logo-icon { flex-shrink: 0; display: flex; }
.sb-logo-text { display: flex; flex-direction: column; white-space: nowrap; overflow: hidden; }
.sb-logo-name { font-size: 15px; font-weight: 800; color: var(--text); letter-spacing: -0.3px; line-height: 1.1; }
.sb-logo-sub { font-size: 10px; color: var(--primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

/* User */
.sb-user {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 12px;
  margin: 10px 8px 4px;
  background: var(--bg);
  border-radius: 10px;
  border: 1px solid var(--border);
  flex-shrink: 0;
  overflow: hidden;
}
.sb-user--mini {
  justify-content: center;
  padding: 10px 0;
  background: transparent;
  border-color: transparent;
  margin: 8px 8px 4px;
}
.sb-user-av {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}
.sb-user-info { flex: 1; min-width: 0; overflow: hidden; }
.sb-user-name { display: block; font-size: 12px; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sb-user-role { font-size: 10px; color: var(--text-muted); }
.sb-user-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--success); flex-shrink: 0;
  box-shadow: 0 0 0 2px var(--success-light);
  animation: pulse 2s infinite;
}

/* Nav */
.sb-nav {
  flex: 1;
  padding: 4px 8px;
  overflow-y: auto;
  overflow-x: hidden;
}
.sb-group {
  display: block;
  font-size: 9px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 10px 8px 4px;
  white-space: nowrap;
}
.sb-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 9px;
  color: var(--text-light);
  text-decoration: none;
  transition: all 0.18s;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 1px;
  white-space: nowrap;
  position: relative;
  text-align: left;
  overflow: hidden;
}
.sidebar--mini .sb-item {
  justify-content: center;
  padding: 10px 0;
}
.sb-item:hover { background: var(--bg); color: var(--primary); }
.sb-item.active {
  background: var(--primary-bg);
  color: var(--primary);
  font-weight: 600;
}
.sb-item.active::after {
  content: '';
  position: absolute;
  right: 0; top: 20%; bottom: 20%;
  width: 3px;
  background: var(--primary);
  border-radius: 3px 0 0 3px;
}
.sidebar--mini .sb-item.active::after { display: none; }
.sb-item-icon {
  width: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sb-item-label { flex: 1; }
.sb-item-badge {
  font-size: 9px; font-weight: 700;
  padding: 2px 5px; border-radius: 99px;
  background: var(--danger-bg); color: var(--danger);
}
.sb-item-dot {
  position: absolute;
  top: 6px; right: 6px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--danger);
}
.sb-logout:hover { background: var(--danger-light); color: var(--danger); }

/* Bottom */
.sb-bottom {
  padding: 0 8px 10px;
  flex-shrink: 0;
}
.sb-sep { height: 1px; background: var(--border); margin-bottom: 6px; }
.sb-version {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
}
.sb-version-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--success);
  animation: pulse 2s infinite;
  flex-shrink: 0;
}
</style>
