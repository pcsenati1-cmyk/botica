<template>
  <teleport to="body">
    <transition name="toast">
      <div v-if="show" class="toast" :class="type">
        <div class="toast-icon">
          <svg v-if="type === 'success'" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="currentColor" fill-opacity="0.2"/>
            <path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" fill="currentColor" fill-opacity="0.2"/>
            <path d="M8 5v3M8 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="toast-msg">{{ message }}</span>
        <button class="toast-close" @click="$emit('close')">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({ show: Boolean, message: String, type: { type: String, default: 'success' } })
defineEmits(['close'])
</script>

<style scoped>
.toast {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; align-items: center; gap: 10px;
  padding: 13px 16px; border-radius: 12px;
  font-size: 13px; font-weight: 600;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  z-index: 9999; max-width: 360px;
  border: 1px solid rgba(255,255,255,0.15);
}
.toast.success { background: #059669; color: white; }
.toast.error { background: #dc2626; color: white; }
.toast.warning { background: #d97706; color: white; }
.toast-icon { flex-shrink: 0; display: flex; }
.toast-msg { flex: 1; }
.toast-close {
  background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.7); display: flex; align-items: center;
  padding: 2px; border-radius: 4px; transition: all 0.15s; flex-shrink: 0;
}
.toast-close:hover { color: white; background: rgba(255,255,255,0.15); }
.toast-enter-active { animation: slideInRight 0.3s ease-out; }
.toast-leave-active { animation: slideInRight 0.2s ease-in reverse; }
</style>
