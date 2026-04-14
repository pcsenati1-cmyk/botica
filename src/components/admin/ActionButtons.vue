<template>
  <div class="action-btns">
    <button v-if="showEdit" class="act-btn edit" @click="$emit('edit')" title="Editar">
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <slot />
    <button v-if="showDelete" class="act-btn delete" @click="$emit('delete')" :disabled="deleteDisabled" title="Eliminar">
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M2 4h10M5 4V3h4v1M11 4l-.8 8H3.8L3 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  showEdit: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  deleteDisabled: Boolean,
})
defineEmits(['edit', 'delete'])
</script>

<style scoped>
.action-btns { display: flex; gap: 5px; align-items: center; }
.act-btn { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all 0.15s; }
.act-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.act-btn.edit { background: #eff6ff; color: #3b82f6; }
.act-btn.edit:hover:not(:disabled) { background: #dbeafe; transform: scale(1.1); }
.act-btn.delete { background: var(--danger-light); color: var(--danger); }
.act-btn.delete:hover:not(:disabled) { background: var(--danger-bg); transform: scale(1.1); }
</style>
