<template>
  <div class="data-table">
    <!-- Toolbar -->
    <div class="dt-toolbar">
      <div class="dt-search">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input v-model="search" type="text" :placeholder="searchPlaceholder" />
        <button v-if="search" class="dt-clear" @click="search = ''">✕</button>
      </div>
      <div class="dt-toolbar-right">
        <slot name="toolbar" />
        <span class="dt-count">{{ filteredRows.length }} registros</span>
      </div>
    </div>

    <!-- Filter chips -->
    <div v-if="filters?.length" class="dt-filters">
      <button
        v-for="f in filters" :key="f.key"
        class="dt-chip" :class="{ active: activeFilter === f.key }"
        @click="activeFilter = f.key"
      >
        {{ f.label }}
        <span v-if="f.count > 0" class="chip-badge" :class="f.badgeColor">{{ f.count }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="dt-loading">
      <div class="spinner"></div>
      <span>Cargando...</span>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredRows.length === 0" class="dt-empty">
      <div class="dt-empty-icon">{{ emptyIcon }}</div>
      <p>{{ emptyText }}</p>
      <span>{{ emptySubtext }}</span>
      <slot name="empty-action" />
    </div>

    <!-- Table -->
    <div v-else class="dt-scroll">
      <table>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key" :class="col.class">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in filteredRows"
            :key="row.id || i"
            class="dt-row"
            :class="rowClass?.(row)"
          >
            <slot :row="row" :index="i" />
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div v-if="!loading && filteredRows.length > 0" class="dt-footer">
      <span>Mostrando {{ filteredRows.length }} de {{ rows.length }}</span>
      <slot name="footer-right" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  rows: Array,
  columns: Array,
  loading: Boolean,
  searchPlaceholder: { type: String, default: 'Buscar...' },
  searchFields: Array,
  filters: Array,
  emptyIcon: { type: String, default: '📋' },
  emptyText: { type: String, default: 'No hay datos' },
  emptySubtext: { type: String, default: '' },
  rowClass: Function,
})

const search = ref('')
const activeFilter = ref(props.filters?.[0]?.key || '')

const filteredRows = computed(() => {
  let list = props.rows || []

  // Apply filter tab
  const f = props.filters?.find(f => f.key === activeFilter.value)
  if (f?.filter) list = list.filter(f.filter)

  // Apply search
  if (search.value && props.searchFields) {
    const q = search.value.toLowerCase()
    list = list.filter(row =>
      props.searchFields.some(field => row[field]?.toString().toLowerCase().includes(q))
    )
  }
  return list
})
</script>

<style scoped>
.data-table { background: var(--card-bg); border-radius: 14px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; }

.dt-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; border-bottom: 1px solid var(--border); gap: 10px; flex-wrap: wrap;
}
.dt-search {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 11px; background: var(--bg);
  border: 1.5px solid var(--border); border-radius: 9px;
  flex: 1; max-width: 340px; transition: all 0.2s;
}
.dt-search:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }
.dt-search svg { color: var(--text-muted); flex-shrink: 0; }
.dt-search input { flex: 1; border: none; background: none; color: var(--text); font-size: 13px; outline: none; }
.dt-search input::placeholder { color: var(--text-muted); }
.dt-clear { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 11px; padding: 2px 4px; border-radius: 4px; }
.dt-clear:hover { background: var(--bg-secondary); }
.dt-toolbar-right { display: flex; align-items: center; gap: 8px; }
.dt-count { font-size: 11px; color: var(--text-muted); font-weight: 600; white-space: nowrap; }

.dt-filters { display: flex; gap: 6px; padding: 10px 14px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
.dt-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 12px; border-radius: 99px;
  border: 1.5px solid var(--border); background: var(--card-bg);
  color: var(--text-secondary); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
}
.dt-chip:hover { border-color: var(--primary); color: var(--primary); }
.dt-chip.active { background: var(--primary-bg); border-color: var(--primary); color: var(--primary); }
.chip-badge { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 99px; background: var(--primary); color: white; }
.chip-badge.red { background: var(--danger); }
.chip-badge.amber { background: var(--warning); }

.dt-loading { display: flex; align-items: center; gap: 10px; padding: 60px; justify-content: center; color: var(--text-muted); font-size: 13px; }
.spinner { width: 22px; height: 22px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }

.dt-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 56px; color: var(--text-muted); text-align: center; }
.dt-empty-icon { font-size: 40px; }
.dt-empty p { font-size: 14px; font-weight: 700; color: var(--text-secondary); margin: 0; }
.dt-empty span { font-size: 12px; }

.dt-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead tr { background: var(--bg); }
th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.6px; white-space: nowrap; }
.dt-row { border-bottom: 1px solid var(--border); transition: background 0.15s; }
.dt-row:last-child { border-bottom: none; }
.dt-row:hover { background: var(--bg); }
:deep(td) { padding: 11px 14px; vertical-align: middle; font-size: 13px; color: var(--text); }

.dt-footer { display: flex; justify-content: space-between; align-items: center; padding: 9px 14px; border-top: 1px solid var(--border); font-size: 11px; color: var(--text-muted); background: var(--bg); }
</style>
