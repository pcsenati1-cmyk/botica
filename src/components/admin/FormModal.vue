<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="show" class="backdrop" @click.self="$emit('close')">
        <div class="modal animate-scale" :style="{ maxWidth: width }">
          <div class="modal-head">
            <div class="modal-head-left">
              <span v-if="icon" class="modal-icon">{{ icon }}</span>
              <div>
                <h3>{{ title }}</h3>
                <p v-if="subtitle">{{ subtitle }}</p>
              </div>
            </div>
            <button class="modal-x" @click="$emit('close')">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  subtitle: String,
  icon: String,
  width: { type: String, default: '500px' },
})
defineEmits(['close'])
</script>

<style scoped>
.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); padding: 16px; }
.modal { background: var(--card-bg); border-radius: 20px; width: 100%; box-shadow: var(--shadow-xl); overflow: hidden; }
.modal-head { display: flex; align-items: flex-start; justify-content: space-between; padding: 22px 22px 0; gap: 12px; }
.modal-head-left { display: flex; align-items: flex-start; gap: 12px; }
.modal-icon { font-size: 28px; flex-shrink: 0; line-height: 1; }
.modal-head h3 { font-size: 17px; font-weight: 800; color: var(--text); margin: 0 0 3px; }
.modal-head p { font-size: 12px; color: var(--text-muted); margin: 0; }
.modal-x { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 6px; display: flex; align-items: center; transition: all 0.15s; flex-shrink: 0; }
.modal-x:hover { background: var(--bg); color: var(--text); }
.modal-body { padding: 20px 22px; }
.modal-footer { padding: 14px 22px; border-top: 1px solid var(--border); display: flex; justify-content: flex-end; gap: 10px; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
