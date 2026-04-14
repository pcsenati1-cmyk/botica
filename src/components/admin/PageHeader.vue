<template>
  <div class="page-header">
    <div class="ph-left">
      <div class="ph-icon" v-if="icon || $slots.icon">
        <slot name="icon">{{ icon }}</slot>
      </div>
      <div>
        <h1 class="ph-title">{{ title }}</h1>
        <p class="ph-sub" v-if="subtitle">{{ subtitle }}</p>
      </div>
    </div>
    <div class="ph-actions">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ 
  title: String, 
  subtitle: String, 
  icon: [String, Object] 
})
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 14px;
}
.ph-left { display: flex; align-items: center; gap: 12px; }
.ph-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--primary-bg);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
}
.ph-title {
  font-size: 22px; font-weight: 800;
  color: var(--text); letter-spacing: -0.5px; margin: 0 0 2px;
}
.ph-sub { font-size: 12px; color: var(--text-muted); margin: 0; }
.ph-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
</style>
