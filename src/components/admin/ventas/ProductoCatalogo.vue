<template>
  <div class="catalogo">
    <div class="cat-header">
      <div>
        <h3>Catálogo de Productos</h3>
        <p>{{ productos.length }} disponibles</p>
      </div>
    </div>

    <div class="cat-search">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <input v-model="q" type="text" placeholder="Buscar por nombre o laboratorio..." />
      <button v-if="q" class="clear-btn" @click="q = ''">✕</button>
    </div>

    <div class="cat-list">
      <div
        v-for="p in filtered"
        :key="p.id"
        class="prod-row"
        :class="{ selected: inCart(p.id), disabled: p.stock === 0 }"
        @click="$emit('add', p)"
      >
        <div class="prod-av" :style="{ background: color(p.nombre) }">
          {{ p.nombre.charAt(0).toUpperCase() }}
        </div>
        <div class="prod-info">
          <span class="prod-name">{{ p.nombre }}</span>
          <span class="prod-lab">{{ p.laboratorio || p.descripcion || '—' }}</span>
        </div>
        <div class="prod-right">
          <span class="prod-price">S/ {{ p.precio?.toFixed(2) }}</span>
          <span class="prod-stock" :class="{ low: p.stock > 0 && p.stock < 5, out: p.stock === 0 }">
            {{ p.stock === 0 ? 'Agotado' : `${p.stock} uds` }}
          </span>
        </div>
        <div v-if="inCart(p.id)" class="prod-check">✓</div>
      </div>

      <div v-if="filtered.length === 0" class="cat-empty">
        <span>📦</span>
        <p>No se encontraron productos</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  productos: Array,
  cartIds: Array,
})
defineEmits(['add'])

const q = ref('')
const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#3b82f6']
const color = (n) => COLORS[n.charCodeAt(0) % COLORS.length]
const inCart = (id) => props.cartIds?.includes(id)

const filtered = computed(() => {
  const s = q.value.toLowerCase()
  return props.productos.filter(p =>
    !s || p.nombre?.toLowerCase().includes(s) ||
    p.laboratorio?.toLowerCase().includes(s) ||
    p.descripcion?.toLowerCase().includes(s)
  )
})
</script>

<style scoped>
.catalogo { display: flex; flex-direction: column; height: 100%; }

.cat-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 16px 16px 0;
}
.cat-header h3 { font-size: 14px; font-weight: 700; color: var(--text); margin: 0 0 2px; }
.cat-header p { font-size: 11px; color: var(--text-muted); margin: 0; }

.cat-search {
  display: flex; align-items: center; gap: 8px;
  margin: 12px 12px 8px;
  padding: 9px 12px;
  background: var(--bg); border: 1.5px solid var(--border);
  border-radius: 10px; transition: all 0.2s;
}
.cat-search:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-glow); }
.cat-search svg { color: var(--text-muted); flex-shrink: 0; }
.cat-search input { flex: 1; border: none; background: none; color: var(--text); font-size: 13px; outline: none; }
.cat-search input::placeholder { color: var(--text-muted); }
.clear-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 11px; padding: 2px 4px; border-radius: 4px; }
.clear-btn:hover { background: var(--bg-secondary); color: var(--text); }

.cat-list {
  flex: 1; overflow-y: auto; padding: 0 8px 12px;
  display: flex; flex-direction: column; gap: 5px;
}

.prod-row {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  border: 1.5px solid var(--border); cursor: pointer;
  transition: all 0.15s; position: relative;
}
.prod-row:hover:not(.disabled) { border-color: var(--primary); background: var(--primary-bg); transform: translateX(2px); }
.prod-row.selected { border-color: var(--primary); background: var(--primary-bg); }
.prod-row.disabled { opacity: 0.4; cursor: not-allowed; }

.prod-av {
  width: 36px; height: 36px; border-radius: 9px;
  color: white; display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 14px; flex-shrink: 0;
}
.prod-info { flex: 1; min-width: 0; }
.prod-name { display: block; font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.prod-lab { font-size: 11px; color: var(--text-muted); }
.prod-right { text-align: right; flex-shrink: 0; }
.prod-price { display: block; font-size: 13px; font-weight: 700; color: var(--primary); }
.prod-stock { font-size: 10px; color: var(--text-muted); }
.prod-stock.low { color: var(--warning); font-weight: 600; }
.prod-stock.out { color: var(--danger); font-weight: 600; }

.prod-check {
  position: absolute; top: 6px; right: 6px;
  width: 18px; height: 18px; background: var(--primary);
  border-radius: 50%; color: white; font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}

.cat-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px; color: var(--text-muted); }
.cat-empty span { font-size: 28px; }
.cat-empty p { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
</style>
