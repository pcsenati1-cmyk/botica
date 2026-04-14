<template>
  <div class="field">
    <label v-if="label">
      {{ label }}
      <span v-if="required" class="req">*</span>
    </label>
    <slot>
      <input
        v-if="type !== 'textarea' && type !== 'select'"
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="{ 'has-error': error }"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <textarea
        v-else-if="type === 'textarea'"
        v-bind="$attrs"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :rows="rows"
        :class="{ 'has-error': error }"
        @input="$emit('update:modelValue', $event.target.value)"
      ></textarea>
      <select
        v-else
        v-bind="$attrs"
        :value="modelValue"
        :disabled="disabled"
        :class="{ 'has-error': error }"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <slot name="options" />
      </select>
    </slot>
    <span v-if="error" class="field-error">{{ error }}</span>
    <span v-else-if="hint" class="field-hint">{{ hint }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String, modelValue: [String, Number, Boolean],
  type: { type: String, default: 'text' },
  placeholder: String, required: Boolean, disabled: Boolean,
  error: String, hint: String, rows: { type: Number, default: 3 },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.field { display: flex; flex-direction: column; gap: 5px; }
label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.req { color: var(--danger); margin-left: 2px; }
:deep(input), :deep(textarea), :deep(select) {
  padding: 10px 12px; border: 1.5px solid var(--border); border-radius: 9px;
  background: var(--bg); color: var(--text); font-size: 13px;
  transition: all 0.2s; width: 100%; font-family: inherit; resize: none;
}
:deep(input:focus), :deep(textarea:focus), :deep(select:focus) {
  outline: none; border-color: var(--primary); background: var(--card-bg);
  box-shadow: 0 0 0 3px var(--primary-glow);
}
:deep(input:disabled), :deep(textarea:disabled), :deep(select:disabled) {
  opacity: 0.55; cursor: not-allowed; background: var(--bg-secondary);
}
:deep(.has-error) { border-color: var(--danger) !important; }
.field-error { font-size: 11px; color: var(--danger); font-weight: 500; }
.field-hint { font-size: 11px; color: var(--text-muted); }
</style>
