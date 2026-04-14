<template>
  <header class="topbar">
    <div class="topbar-left">
      <button class="topbar-toggle" @click="$emit('toggle')" title="Menú">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
      <div class="topbar-bread">
        <span class="bread-root">Panel</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M3 2l4 3-4 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <span class="bread-page">{{ pageTitle }}</span>
      </div>
    </div>

    <div class="topbar-right">
      <!-- Alert bell -->
      <button
        v-if="alertCount > 0"
        class="tb-btn tb-btn--warn"
        @click="$emit('toggleAlerts')"
        :title="`${alertCount} alertas de stock`"
      >
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
          <path d="M9 2L1.5 15.5h15L9 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M9 8v3M9 13.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="tb-dot">{{ alertCount }}</span>
      </button>

      <!-- Dark mode -->
      <button class="tb-btn" @click="$emit('toggleDark')" :title="isDark ? 'Modo claro' : 'Modo oscuro'">
        <svg v-if="!isDark" width="16" height="16" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.2 3.2l1.4 1.4M13.4 13.4l1.4 1.4M3.2 14.8l1.4-1.4M13.4 4.6l1.4-1.4"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 18 18" fill="none">
          <path d="M15 10.5A7 7 0 017.5 3a7 7 0 100 12 7 7 0 007.5-4.5z"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- User menu -->
      <div class="tb-user" ref="userRef">
        <button class="tb-user-btn" @click="menuOpen = !menuOpen">
          <div class="tb-av">{{ userInitial }}</div>
          <span v-if="!isMobile" class="tb-uname">{{ userName }}</span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
            :style="{ transform: menuOpen ? 'rotate(180deg)' : '', transition: 'transform .2s' }">
            <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <transition name="drop">
          <div v-if="menuOpen" class="tb-drop">
            <div class="drop-head">
              <div class="drop-av">{{ userInitial }}</div>
              <div>
                <div class="drop-name">{{ userName }}</div>
                <div class="drop-email">{{ userEmail }}</div>
              </div>
            </div>
            <div class="drop-sep"></div>
            <button class="drop-item drop-danger" @click="$emit('logout'); menuOpen = false">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 3H4a1 1 0 00-1 1v8a1 1 0 001 1h2M10 11l4-4-4-4M14 7H6"
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Cerrar sesión
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  pageTitle: String,
  userName: String,
  userInitial: String,
  userEmail: String,
  isDark: Boolean,
  alertCount: Number,
  isMobile: Boolean,
})

defineEmits(['toggle', 'toggleAlerts', 'toggleDark', 'logout'])

const menuOpen = ref(false)
const userRef = ref(null)
onClickOutside(userRef, () => { menuOpen.value = false })
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  background: var(--header-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
  flex-shrink: 0;
}

.topbar-left { display: flex; align-items: center; gap: 10px; min-width: 0; }

.topbar-toggle {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: none; border: none;
  cursor: pointer; color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.topbar-toggle:hover { background: var(--bg); color: var(--text); }

.topbar-bread {
  display: flex; align-items: center; gap: 5px;
  font-size: 13px; min-width: 0;
}
.bread-root { color: var(--text-muted); font-weight: 500; flex-shrink: 0; }
.topbar-bread svg { color: var(--text-muted); flex-shrink: 0; }
.bread-page { color: var(--text); font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.topbar-right { display: flex; align-items: center; gap: 3px; flex-shrink: 0; }

.tb-btn {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: none; border: none;
  cursor: pointer; color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; position: relative;
}
.tb-btn:hover { background: var(--bg); color: var(--text); }
.tb-btn--warn { color: var(--warning); }
.tb-btn--warn:hover { background: var(--warning-light); }
.tb-dot {
  position: absolute; top: 4px; right: 4px;
  width: 14px; height: 14px;
  background: var(--danger); color: white;
  font-size: 8px; font-weight: 700;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

.tb-user { position: relative; margin-left: 4px; }
.tb-user-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 5px 10px; border-radius: 9px;
  background: none; border: 1px solid var(--border);
  cursor: pointer; transition: all 0.2s; color: var(--text);
}
.tb-user-btn:hover { background: var(--bg); border-color: var(--primary); }
.tb-av {
  width: 26px; height: 26px; border-radius: 7px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 11px; flex-shrink: 0;
}
.tb-uname { font-size: 12px; font-weight: 600; color: var(--text); white-space: nowrap; }

.tb-drop {
  position: absolute; top: calc(100% + 8px); right: 0;
  background: var(--card-bg); border: 1px solid var(--border);
  border-radius: 13px; min-width: 200px;
  box-shadow: var(--shadow-lg); overflow: hidden; z-index: 300;
}
.drop-head { display: flex; align-items: center; gap: 10px; padding: 14px; }
.drop-av {
  width: 36px; height: 36px; border-radius: 9px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px;
}
.drop-name { font-size: 13px; font-weight: 700; color: var(--text); }
.drop-email { font-size: 11px; color: var(--text-muted); }
.drop-sep { height: 1px; background: var(--border); }
.drop-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 11px 14px;
  background: none; border: none; cursor: pointer;
  font-size: 13px; font-weight: 500; transition: all 0.2s; text-align: left;
}
.drop-danger { color: var(--danger); }
.drop-danger:hover { background: var(--danger-light); }

.drop-enter-active, .drop-leave-active { transition: opacity 0.15s, transform 0.15s; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-8px) scale(0.97); }

@media (max-width: 768px) {
  .topbar { padding: 0 14px; height: 56px; }
}
</style>
