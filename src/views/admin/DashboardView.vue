<template>
  <div class="animate-fade">
    <PageHeader :title="`Bienvenido, ${userName} 👋`" :subtitle="today">
      <router-link to="/admin/ventas" class="btn-venta">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Nueva Venta
      </router-link>
    </PageHeader>

    <!-- KPIs -->
    <div class="kpi-grid">
      <StatsCard
        v-for="(k, i) in kpis" :key="k.label"
        :value="k.value" :label="k.label" :icon="k.icon"
        :color="k.color" :trend="k.trend" :trendUp="k.trendUp"
        class="animate-fade" :style="{ animationDelay: i * 0.06 + 's' }"
      />
    </div>

    <!-- Main grid -->
    <div class="dash-grid">
      <!-- Ventas recientes -->
      <div class="card animate-fade delay-2">
        <div class="card-head">
          <div><h3>Ventas Recientes</h3><p>Últimas transacciones</p></div>
          <router-link to="/admin/ventas" class="card-link">Ver todas →</router-link>
        </div>
        <div v-if="ventasStore.loading" class="card-loading"><div class="spinner"></div></div>
        <div v-else-if="!ventasStore.ventas.length" class="card-empty">
          <span>🛒</span><p>Sin ventas aún</p>
          <router-link to="/admin/ventas" class="card-link">Registrar primera venta →</router-link>
        </div>
        <div v-else class="ventas-list">
          <div v-for="v in ventasStore.ventas.slice(0,8)" :key="v.id" class="venta-row">
            <span class="v-id">#{{ v.id }}</span>
            <div class="v-info">
              <span class="v-date">{{ fmtDate(v.fecha) }}</span>
              <span class="v-items">{{ v.detalles?.length || 0 }} productos</span>
            </div>
            <span class="v-total">S/ {{ v.total?.toFixed(2) }}</span>
            <span class="v-badge" :class="v.estado === 'ANULADA' ? 'danger' : 'success'">
              {{ v.estado || 'COMPLETADA' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Panel derecho -->
      <div class="right-col">
        <!-- Alertas -->
        <div class="card animate-fade delay-3">
          <div class="card-head">
            <div><h3>Alertas de Stock</h3><p>Requieren atención</p></div>
            <router-link to="/admin/alertas" class="card-link">Ver →</router-link>
          </div>
          <div v-if="!invStore.productosBajoStock.length" class="card-empty small">
            <span>✅</span><p>Todo el stock está bien</p>
          </div>
          <div v-else class="alerts-list">
            <div v-for="p in invStore.productosBajoStock.slice(0,6)" :key="p.id" class="alert-row">
              <span class="a-dot" :class="p.stock === 0 ? 'red' : 'amber'"></span>
              <div class="a-info">
                <span class="a-name">{{ p.nombre }}</span>
                <div class="a-bar"><div :class="p.stock === 0 ? 'red' : 'amber'" :style="{ width: Math.min(100, (p.stock / (p.stock_minimo || 5)) * 100) + '%' }"></div></div>
              </div>
              <span class="a-count" :class="p.stock === 0 ? 'danger' : 'warning'">{{ p.stock }}</span>
            </div>
          </div>
        </div>

        <!-- Top vendidos -->
        <div class="card animate-fade delay-4">
          <div class="card-head">
            <div><h3>Más Vendidos</h3><p>Top 5 productos</p></div>
          </div>
          <div v-if="!topVendidos.length" class="card-empty small">
            <span>📊</span><p>Sin datos aún</p>
          </div>
          <div v-else class="top-list">
            <div v-for="(item, i) in topVendidos" :key="item[0]" class="top-row">
              <span class="top-rank" :class="`r${i+1}`">{{ i+1 }}</span>
              <div class="top-info">
                <span class="top-name">{{ getProductName(item[0]) }}</span>
                <div class="top-bar"><div :style="{ width: (item[1] / topVendidos[0][1] * 100) + '%' }"></div></div>
              </div>
              <span class="top-qty">{{ item[1] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useVentasStore } from '@/stores/ventas'
import { useInventarioStore } from '@/stores/inventario'
import { useAuthStore } from '@/stores/auth'
import PageHeader from '@/components/admin/PageHeader.vue'
import StatsCard from '@/components/admin/StatsCard.vue'

const ventasStore = useVentasStore()
const invStore = useInventarioStore()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.user_metadata?.nombres || authStore.user?.email?.split('@')[0] || 'Usuario')
const today = computed(() => new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))

const kpis = computed(() => [
  { label: 'Ventas del Día', color: 'green', value: `S/ ${ventasStore.totalVendidoDia.toFixed(2)}`, trend: null, trendUp: true,
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2v16M4 6l6-4 6 4M4 14l6 4 6-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { label: 'Transacciones Hoy', color: 'blue', value: ventasStore.ventasDelDia.length, trend: null, trendUp: true,
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M3 8h14M7 4V2M13 4V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
  { label: 'Total Productos', color: 'purple', value: invStore.productos.length, trend: null, trendUp: true,
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l8 4v8l-8 4-8-4V6l8-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 2v12M2 6l8 4 8-4" stroke="currentColor" stroke-width="1.5"/></svg>' },
  { label: 'Stock Bajo', color: invStore.productosBajoStock.length > 0 ? 'orange' : 'green', value: invStore.productosBajoStock.length, trend: null, trendUp: false,
    icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3L2 17h16L10 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 9v4M10 15v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' },
])

const topVendidos = computed(() => ventasStore.productosMasVendidos)
const getProductName = (id) => invStore.productos.find(p => p.id == id)?.nombre || `#${id}`
const fmtDate = (f) => f ? new Date(f).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

onMounted(async () => {
  await Promise.all([ventasStore.fetchVentas(), invStore.fetchProductos()])
})
</script>

<style scoped>
.btn-venta {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 16px; background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white; border-radius: 9px; font-weight: 700; font-size: 13px;
  box-shadow: var(--shadow-colored); transition: all 0.2s; text-decoration: none;
}
.btn-venta:hover { transform: translateY(-2px); box-shadow: var(--shadow-colored-lg); }

.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 18px; }

.dash-grid { display: grid; grid-template-columns: 1fr 340px; gap: 16px; }
.card { background: var(--card-bg); border-radius: 14px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden; }
.card-head { display: flex; justify-content: space-between; align-items: flex-start; padding: 16px 16px 0; margin-bottom: 12px; }
.card-head h3 { font-size: 14px; font-weight: 700; color: var(--text); margin: 0 0 2px; }
.card-head p { font-size: 11px; color: var(--text-muted); margin: 0; }
.card-link { font-size: 12px; color: var(--primary); font-weight: 600; text-decoration: none; }
.card-link:hover { color: var(--primary-dark); }
.card-loading { display: flex; justify-content: center; padding: 40px; }
.spinner { width: 24px; height: 24px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
.card-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 28px; color: var(--text-muted); text-align: center; }
.card-empty.small { padding: 18px; }
.card-empty span { font-size: 26px; }
.card-empty p { font-size: 13px; font-weight: 600; color: var(--text-secondary); margin: 0; }

.ventas-list { padding: 0 4px 8px; }
.venta-row { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; transition: all 0.15s; }
.venta-row:hover { background: var(--bg); }
.v-id { font-size: 10px; font-weight: 700; color: var(--text-muted); background: var(--bg); padding: 2px 6px; border-radius: 5px; flex-shrink: 0; }
.v-info { flex: 1; display: flex; flex-direction: column; }
.v-date { font-size: 12px; font-weight: 600; color: var(--text); }
.v-items { font-size: 10px; color: var(--text-muted); }
.v-total { font-size: 13px; font-weight: 700; color: var(--text); flex-shrink: 0; }
.v-badge { font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 99px; text-transform: uppercase; flex-shrink: 0; }
.v-badge.success { background: var(--success-light); color: var(--success); }
.v-badge.danger  { background: var(--danger-light); color: var(--danger); }

.right-col { display: flex; flex-direction: column; gap: 16px; }

.alerts-list { padding: 0 8px 10px; display: flex; flex-direction: column; gap: 3px; }
.alert-row { display: flex; align-items: center; gap: 9px; padding: 7px 8px; border-radius: 7px; transition: all 0.15s; }
.alert-row:hover { background: var(--bg); }
.a-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.a-dot.red   { background: var(--danger); box-shadow: 0 0 0 3px var(--danger-light); }
.a-dot.amber { background: var(--warning); box-shadow: 0 0 0 3px var(--warning-light); }
.a-info { flex: 1; }
.a-name { font-size: 12px; font-weight: 600; color: var(--text); display: block; margin-bottom: 3px; }
.a-bar { height: 3px; background: var(--bg); border-radius: 99px; overflow: hidden; }
.a-bar div { height: 100%; border-radius: 99px; transition: width 0.6s; }
.a-bar .red   { background: var(--danger); }
.a-bar .amber { background: var(--warning); }
.a-count { font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 6px; flex-shrink: 0; }
.a-count.danger  { background: var(--danger-light); color: var(--danger); }
.a-count.warning { background: var(--warning-light); color: var(--warning); }

.top-list { padding: 0 8px 10px; display: flex; flex-direction: column; gap: 3px; }
.top-row { display: flex; align-items: center; gap: 9px; padding: 7px 8px; border-radius: 7px; transition: all 0.15s; }
.top-row:hover { background: var(--bg); }
.top-rank { width: 20px; height: 20px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }
.r1 { background: linear-gradient(135deg,#f59e0b,#d97706); color: white; }
.r2 { background: linear-gradient(135deg,#94a3b8,#64748b); color: white; }
.r3 { background: linear-gradient(135deg,#cd7c2f,#b45309); color: white; }
.r4,.r5 { background: var(--bg); color: var(--text-muted); }
.top-info { flex: 1; }
.top-name { font-size: 12px; font-weight: 600; color: var(--text); display: block; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-bar { height: 3px; background: var(--bg); border-radius: 99px; overflow: hidden; }
.top-bar div { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 99px; transition: width 0.8s; }
.top-qty { font-size: 11px; font-weight: 700; color: var(--text-muted); flex-shrink: 0; }

@media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } .dash-grid { grid-template-columns: 1fr; } }
@media (max-width: 480px) { .kpi-grid { grid-template-columns: 1fr; } }
</style>
