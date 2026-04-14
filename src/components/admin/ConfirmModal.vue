<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="show" class="backdrop" @click.self="$emit('cancel')">
        <div class="modal animate-scale">
          <div class="modal-icon" :class="variant">
            <slot name="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4M12 17v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10.3 4l-8 14h19.4l-8-14a2 2 0 00-3.4 0z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
            </slot>
          </div>
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-body">{{ message }}</p>
          <div class="modal-actions">
            <button class="btn-cancel" @click="$emit('cancel')" :disabled="loading">
              Cancelar
            </button>
            <button class="btn-confirm" :class="variant" @click="$emit('confirm')" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Procesando...' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: 'Confirmar acción' },
  message: String,
  confirmText: { type: String, default: 'Confirmar' },
  variant: { type: String, default: 'danger' },
  loading: Boolean,
})
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; backdrop-filter: blur(4px);
}
.modal {
  background: var(--card-bg); border-radius: 20px; padding: 32px;
  max-width: 380px; width: 90%; text-align: center;
  box-shadow: var(--shadow-xl);
}
.modal-icon {
  width: 56px; height: 56px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.modal-icon.danger { background: var(--danger-light); color: var(--danger); }
.modal-icon.warning { background: var(--warning-light); color: var(--warning); }
.modal-icon.primary { background: var(--primary-bg); color: var(--primary); }
.modal-title { font-size: 18px; font-weight: 800; color: var(--text); margin: 0 0 8px; }
.modal-body { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0 0 24px; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }
.btn-cancel {
  padding: 10px 22px; border-radius: 9px;
  background: var(--bg); border: 1px solid var(--border);
  color: var(--text); font-weight: 600; font-size: 13px;
  cursor: pointer; transition: all 0.2s;
}
.btn-cancel:hover:not(:disabled) { background: var(--border); }
.btn-confirm {
  padding: 10px 22px; border-radius: 9px;
  border: none; font-weight: 700; font-size: 13px;
  cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; gap: 6px;
}
.btn-confirm.danger { background: var(--danger); color: white; }
.btn-confirm.danger:hover:not(:disabled) { background: #dc2626; transform: translateY(-1px); }
.btn-confirm.primary { background: var(--primary); color: white; }
.btn-confirm.primary:hover:not(:disabled) { background: var(--primary-dark); transform: translateY(-1px); }
.btn-confirm:disabled, .btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }
.spinner {
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
