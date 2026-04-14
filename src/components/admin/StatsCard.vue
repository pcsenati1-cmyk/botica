<template>
  <div class="stat-card" :class="color">
    <div class="sc-icon">
      <slot name="icon">
        <span v-html="icon"></span>
      </slot>
    </div>
    <div class="sc-body">
      <div class="sc-val">{{ value }}</div>
      <div class="sc-lbl">{{ label }}</div>
    </div>
    <div v-if="trend" class="sc-trend" :class="trendUp ? 'up' : 'down'">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path v-if="trendUp" d="M2 7l3-4 3 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path v-else d="M2 3l3 4 3-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      {{ trend }}
    </div>
  </div>
</template>

<script setup>
defineProps({ 
  value: [String,Number], 
  label: String, 
  icon: String, 
  color: String, 
  trend: String, 
  trendUp: Boolean 
})
</script>

<style scoped>
.stat-card {
  background: var(--card-bg); border-radius: 14px; padding: 18px;
  border: 1px solid var(--border); box-shadow: var(--shadow-sm);
  display: flex; align-items: center; gap: 14px;
  transition: all 0.2s; position: relative; overflow: hidden;
}
.stat-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
}
.stat-card.green::before { background: linear-gradient(90deg,#10b981,#34d399); }
.stat-card.blue::before  { background: linear-gradient(90deg,#3b82f6,#60a5fa); }
.stat-card.purple::before{ background: linear-gradient(90deg,#8b5cf6,#a78bfa); }
.stat-card.orange::before{ background: linear-gradient(90deg,#f59e0b,#fbbf24); }
.stat-card.red::before   { background: linear-gradient(90deg,#ef4444,#f87171); }
.stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }

.sc-icon {
  width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.stat-card.green .sc-icon  { background: var(--success-light); color: var(--success); }
.stat-card.blue .sc-icon   { background: #eff6ff; color: #3b82f6; }
.stat-card.purple .sc-icon { background: #faf5ff; color: #8b5cf6; }
.stat-card.orange .sc-icon { background: var(--warning-light); color: var(--warning); }
.stat-card.red .sc-icon    { background: var(--danger-light); color: var(--danger); }

.sc-body { flex: 1; }
.sc-val { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -1px; line-height: 1.1; }
.sc-lbl { font-size: 11px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }

.sc-trend {
  font-size: 10px; font-weight: 700; padding: 3px 7px; border-radius: 99px;
  display: flex; align-items: center; gap: 2px; flex-shrink: 0;
}
.sc-trend.up   { background: var(--success-light); color: var(--success); }
.sc-trend.down { background: var(--danger-light); color: var(--danger); }
</style>
