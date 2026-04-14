<template>
  <div class="alertas animate-fade">
    <div class="page-header">
      <div>
        <h1>Alertas de Stock</h1>
        <p class="page-sub">Productos que requieren reposicion urgente</p>
      </div>
      <router-link to="/admin/inventario" class="btn-primary-sm">
        Ver Inventario completo <ArrowRight :size="14" />
      </router-link>
    </div>

    <!-- Resumen -->
    <div class="summary-grid">
      <div class="sum-card red">
        <div class="sum-icon">
          <AlertCircle :size="24" />
        </div>
        <div class="sum-val">{{ sinStock.length }}</div>
        <div class="sum-lbl">Sin stock</div>
      </div>
      <div class="sum-card amber">
        <div class="sum-icon">
          <AlertTriangle :size="24" />
        </div>
        <div class="sum-val">{{ bajoStock.length }}</div>
        <div class="sum-lbl">Stock bajo</div>
      </div>
      <div class="sum-card orange">
        <div class="sum-icon">
          <CalendarClock :size="24" />
        </div>
        <div class="sum-val">{{ porVencer.length }}</div>
        <div class="sum-lbl">Por vencer (30 dias)</div>
      </div>
      <div class="sum-card green">
        <div class="sum-icon">
          <CheckCircle :size="24" />
        </div>
        <div class="sum-val">{{ enStock.length }}</div>
        <div class="sum-lbl">En stock normal</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button v-for="t in tabs" :key="t.key" class="tab" :class="{ active: activeTab === t.key }" @click="activeTab = t.key">
        {{ t.label }}
        <span class="tab-count" :class="t.color">{{ t.count }}</span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="inventarioStore.loading" class="loading-state">
      <div class="spinner"></div><span>Cargando...</span>
    </div>

    <!-- Lista -->
    <div v-else>
      <div v-if="listaActiva.length === 0" class="empty-state">
        <CheckCircle :size="48" class="empty-icon-success" />
        <p>No hay productos en esta categoria</p>
      </div>

      <div v-else class="alertas-grid">
        <div v-for="p in listaActiva" :key="p.id" class="alerta-card" :getCardClass(p)>
          <div class="ac-header">
            <div class="ac-avatar" :style="{ background: getColor(p.nombre) }">{{ p.nombre.charAt(0) }}</div>
            <div class="ac-info">
              <div class="ac-name">{{ p.nombre }}</div>
              <div class="ac-meta">{{ p.laboratorio || '-' }} | {{ p.categoria || 'Sin categoria' }}</div>
            </div>
            <div class="ac-stock" :class="getStockClass(p)">
              <span class="acs-num">{{ p.stock }}</span>
              <span class="acs-lbl">unds</span>
            </div>
          </div>
          
          <div class="ac-footer">
            <div v-if="p.fecha_vencimiento" class="ac-venc">
              <Calendar :size="14" />
              <span>Vence: {{ formatDate(p.fecha_vencimiento) }}</span>
            </div>
            <router-link :to="`/admin/productos/${p.id}/editar`" class="ac-action">
              <Edit :size="14" /> Editar
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInventarioStore } from '@/stores/inventario'
import { ArrowRight, AlertCircle, AlertTriangle, CalendarClock, CheckCircle, Calendar, Edit } from 'lucide-vue-next'

const inventarioStore = useInventarioStore()
const activeTab = ref('sinstock')

const sinStock = computed(() => inventarioStore.productos.filter(p => p.stock === 0))
const bajoStock = computed(() => inventarioStore.productos.filter(p => p.stock > 0 && p.stock < (p.stock_minimo || 5)))
const porVencer = computed(() => inventarioStore.productos.filter(p => {
  if (!p.fecha_vencimiento) return false
  const diff = (new Date(p.fecha_vencimiento) - new Date()) / 86400000
  return diff > 0 && diff < 30
}))
const enStock = computed(() => inventarioStore.productos.filter(p => p.stock >= (p.stock_minimo || 5)))

const tabs = computed(() => [
  { key: 'sinstock', label: 'Sin stock', count: sinStock.value.length, color: 'red' },
  { key: 'bajo', label: 'Stock bajo', count: bajoStock.value.length, color: 'amber' },
  { key: 'vencer', label: 'Por vencer', count: porVencer.value.length, color: 'orange' },
  { key: 'normal', label: 'Normal', count: enStock.value.length, color: 'green' },
])

const listaActiva = computed(() => {
  switch (activeTab.value) {
    case 'sinstock': return sinStock.value
    case 'bajo': return bajoStock.value
    case 'vencer': return porVencer.value
    case 'normal': return enStock.value
    default: return []
  }
})

const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#3b82f6']
const getColor = (name) => colors[name.charCodeAt(0) % colors.length]
const getStockClass = (p) => p.stock === 0 ? 'danger' : p.stock < (p.stock_minimo || 5) ? 'warning' : 'success'
const formatDate = (f) => f ? new Date(f).toLocaleDateString('es-PE') : '-'

onMounted(() => inventarioStore.fetchProductos())
</script>

<style scoped>
.alertas { max-width: 100%; width: 100%; }
.page-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 24px; flex-wrap: wrap; gap: 14px;
}
.page-header h1 { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 3px; }
.page-sub { font-size: 12px; color: var(--text-muted); }
.btn-primary-sm {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; background: var(--primary); color: white;
  border-radius: 8px; font-size: 12px; font-weight: 600;
  text-decoration: none;
}

.summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.sum-card {
  background: var(--card-bg); border-radius: 14px; padding: 20px;
  border: 1px solid var(--border); text-align: center;
}
.sum-icon {
  width: 48px; height: 48px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 12px;
}
.sum-card.red .sum-icon { background: var(--danger-light); color: var(--danger); }
.sum-card.amber .sum-icon { background: var(--warning-light); color: var(--warning); }
.sum-card.orange .sum-icon { background: #fff7ed; color: #ea580c; }
.sum-card.green .sum-icon { background: var(--success-light); color: var(--success); }
.sum-val { font-size: 28px; font-weight: 800; color: var(--text); }
.sum-lbl { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

.tabs { display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px; }
.tab {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 16px; background: var(--card-bg); border: 1px solid var(--border);
  border-radius: 10px; font-size: 13px; font-weight: 600; color: var(--text-secondary);
  cursor: pointer; white-space: nowrap; transition: var(--transition);
}
.tab:hover { border-color: var(--primary); }
.tab.active { background: var(--primary); color: white; border-color: var(--primary); }
.tab-count {
  padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 700;
}
.tab .tab-count.red { background: var(--danger-light); color: var(--danger); }
.tab .tab-count.amber { background: var(--warning-light); color: var(--warning); }
.tab .tab-count.orange { background: #fff7ed; color: #ea580c; }
.tab .tab-count.green { background: var(--success-light); color: var(--success); }
.tab.active .tab-count { background: rgba(255,255,255,0.2); color: white; }

.loading-state { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 60px; color: var(--text-muted); }
.spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }

.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 60px; color: var(--text-muted); }
.empty-icon-success { color: var(--success); }

.alertas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.alerta-card {
  background: var(--card-bg); border-radius: 14px; padding: 18px;
  border: 1px solid var(--border); transition: var(--transition);
}
.alerta-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }

.ac-header { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; }
.ac-avatar {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 16px; font-weight: 700; flex-shrink: 0;
}
.ac-info { flex: 1; }
.ac-name { font-size: 14px; font-weight: 700; color: var(--text); }
.ac-meta { font-size: 11px; color: var(--text-muted); }

.ac-stock {
  text-align: right; padding: 6px 12px; border-radius: 10px;
}
.ac-stock.danger { background: var(--danger-light); }
.ac-stock.warning { background: var(--warning-light); }
.ac-stock.success { background: var(--success-light); }
.acs-num { display: block; font-size: 18px; font-weight: 800; }
.acs-lbl { font-size: 10px; color: var(--text-muted); }

.ac-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; }
.ac-venc { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
.ac-action {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; color: var(--primary); font-weight: 600;
  text-decoration: none;
}

@media (max-width: 900px) { .summary-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 500px) { .summary-grid { grid-template-columns: 1fr; } }
</style>