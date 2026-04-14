<template>
  <div class="reportes animate-fade">
    <div class="page-header">
      <div>
        <h1>Reportes</h1>
        <p class="page-sub">Resumen general del negocio - {{ today }}</p>
      </div>
      <div class="header-actions">
        <select v-model="periodoFiltro" class="select-periodo">
          <option value="hoy">Hoy</option>
          <option value="semana">Esta semana</option>
          <option value="mes">Este mes</option>
          <option value="todo">Todo el historial</option>
        </select>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-row">
      <div class="kpi animate-fade" v-for="(k, i) in kpis" :key="k.label" :style="{ animationDelay: i * 0.06 + 's' }">
        <div class="kpi__icon" :class="k.color">
          <component :is="k.icon" :size="20" />
        </div>
        <div class="kpi__body">
          <div class="kpi__val">{{ k.value }}</div>
          <div class="kpi__lbl">{{ k.label }}</div>
        </div>
      </div>
    </div>

    <div class="reports-grid">
      <!-- Historial de ventas -->
      <div class="report-card full-width">
        <div class="rc-head">
          <div>
            <h3>Historial de Ventas</h3>
            <p>{{ ventasFiltradas.length }} ventas en el periodo seleccionado</p>
          </div>
          <div class="rc-total">
            Total: <strong>S/ {{ totalPeriodo.toFixed(2) }}</strong>
          </div>
        </div>
        <div v-if="ventasStore.loading" class="loading-state">
          <div class="spinner"></div>
        </div>
        <div v-else-if="ventasFiltradas.length === 0" class="empty-state">
          <BarChart3 :size="32" />
          <p>Sin ventas en este periodo</p>
        </div>
        <div v-else class="ventas-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Método pago</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in ventasFiltradas.slice(0, 20)" :key="v.id" class="tr-row">
                <td><span class="vt-id">#{{ v.id }}</span></td>
                <td><span class="vt-date">{{ formatDate(v.fecha) }}</span></td>
                <td><span class="vt-items">{{ v.detalles?.length || 0 }} item(s)</span></td>
                <td>
                  <span class="vt-metodo">{{ v.metodo_pago || 'EFECTIVO' }}</span>
                </td>
                <td><span class="vt-total">S/ {{ v.total?.toFixed(2) }}</span></td>
                <td>
                  <span class="vt-status" :class="v.estado === 'ANULADA' ? 'danger' : 'success'">
                    {{ v.estado || 'COMPLETADA' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="ventasFiltradas.length > 20" class="table-more">
            Mostrando 20 de {{ ventasFiltradas.length }} ventas
          </div>
        </div>
      </div>

      <!-- Productos más vendidos -->
      <div class="report-card">
        <div class="rc-head">
          <div><h3>Productos Más Vendidos</h3><p>Top 10 del período</p></div>
        </div>
        <div v-if="topProductos.length === 0" class="empty-state small">
          <Package :size="24" />
          <p>Sin datos</p>
        </div>
        <div v-else class="top-list">
          <div v-for="(item, i) in topProductos" :key="item.id" class="top-row">
            <div class="top-rank" :class="`rank-${Math.min(i+1, 4)}`">{{ i + 1 }}</div>
            <div class="top-info">
              <span class="top-name">{{ item.nombre }}</span>
              <div class="top-bar-wrap">
                <div class="top-bar" :style="{ width: (item.cantidad / topProductos[0].cantidad * 100) + '%' }"></div>
              </div>
            </div>
            <span class="top-qty">{{ item.cantidad }} uds</span>
          </div>
        </div>
      </div>

      <!-- Productos con bajo stock -->
      <div class="report-card">
        <div class="rc-head">
          <div><h3>Productos con Stock Bajo</h3><p>Requieren reposición</p></div>
          <router-link to="/admin/alertas" class="rc-link">Ver alertas →</router-link>
        </div>
        <div v-if="inventarioStore.productosBajoStock.length === 0" class="empty-state small">
          <CheckCircle :size="24" class="text-success" />
          <p>Todo el stock esta bien</p>
        </div>
        <div v-else class="stock-list">
          <div v-for="p in inventarioStore.productosBajoStock.slice(0, 8)" :key="p.id" class="stock-row">
            <div class="sr-dot" :class="p.stock === 0 ? 'red' : 'amber'"></div>
            <span class="sr-name">{{ p.nombre }}</span>
            <span class="sr-stock" :class="p.stock === 0 ? 'danger' : 'warning'">{{ p.stock }} uds</span>
          </div>
        </div>
      </div>

      <!-- Resumen inventario -->
      <div class="report-card">
        <div class="rc-head">
          <div><h3>Resumen de Inventario</h3><p>Estado actual del stock</p></div>
        </div>
        <div class="inv-summary">
          <div class="inv-row">
            <span>Total de productos</span>
            <strong>{{ inventarioStore.productos.length }}</strong>
          </div>
          <div class="inv-row">
            <span>Valor del inventario</span>
            <strong class="green">S/ {{ inventarioStore.valorInventario.toFixed(2) }}</strong>
          </div>
          <div class="inv-row">
            <span>Productos sin stock</span>
            <strong class="danger">{{ inventarioStore.productosSinStock.length }}</strong>
          </div>
          <div class="inv-row">
            <span>Productos con stock bajo</span>
            <strong class="warning">{{ inventarioStore.productosBajoStock.length }}</strong>
          </div>
          <div class="inv-row">
            <span>Productos por vencer</span>
            <strong class="orange">{{ inventarioStore.productosPorVencer.length }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVentasStore } from '@/stores/ventas'
import { useInventarioStore } from '@/stores/inventario'
import { ShoppingCart, DollarSign, BarChart3, Package, TrendingUp, CheckCircle, AlertCircle } from 'lucide-vue-next'

const ventasStore = useVentasStore()
const inventarioStore = useInventarioStore()
const periodoFiltro = ref('mes')

const today = computed(() => new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))

const ventasFiltradas = computed(() => {
  const ahora = new Date()
  return ventasStore.ventas.filter(v => {
    if (!v.fecha) return false
    const fecha = new Date(v.fecha)
    if (periodoFiltro.value === 'hoy') {
      return fecha.toDateString() === ahora.toDateString()
    } else if (periodoFiltro.value === 'semana') {
      const semana = new Date(ahora); semana.setDate(ahora.getDate() - 7)
      return fecha >= semana
    } else if (periodoFiltro.value === 'mes') {
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
    }
    return true
  })
})

const totalPeriodo = computed(() => ventasFiltradas.value.reduce((s, v) => s + (v.total || 0), 0))

const topProductos = computed(() => {
  const counts = {}
  ventasFiltradas.value.forEach(v => {
    v.detalles?.forEach(d => {
      if (!counts[d.producto_id]) {
        const p = inventarioStore.productos.find(p => p.id === d.producto_id)
        counts[d.producto_id] = { id: d.producto_id, nombre: p?.nombre || `#${d.producto_id}`, cantidad: 0 }
      }
      counts[d.producto_id].cantidad += d.cantidad
    })
  })
  return Object.values(counts).sort((a, b) => b.cantidad - a.cantidad).slice(0, 10)
})

const kpis = computed(() => [
  { label: 'Ventas del periodo', value: ventasFiltradas.value.length, icon: ShoppingCart, color: 'blue' },
  { label: 'Ingresos del periodo', value: `S/ ${totalPeriodo.value.toFixed(2)}`, icon: DollarSign, color: 'green' },
  { label: 'Ticket promedio', value: ventasFiltradas.value.length ? `S/ ${(totalPeriodo.value / ventasFiltradas.value.length).toFixed(2)}` : 'S/ 0.00', icon: TrendingUp, color: 'purple' },
  { label: 'Productos vendidos', value: ventasFiltradas.value.reduce((s, v) => s + (v.detalles?.reduce((a, d) => a + d.cantidad, 0) || 0), 0), icon: Package, color: 'orange' },
])

const formatDate = (f) => f ? new Date(f).toLocaleString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

onMounted(async () => {
  await Promise.all([ventasStore.fetchVentas(), inventarioStore.fetchProductos()])
})
</script>

<style scoped>
.reportes { max-width: 100%; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h1 { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 3px; }
.page-sub { font-size: 12px; color: var(--text-muted); text-transform: capitalize; }
.select-periodo {
  padding: 8px 12px; border: 1.5px solid var(--border); border-radius: 9px;
  background: var(--card-bg); color: var(--text); font-size: 13px; font-weight: 600;
  cursor: pointer; outline: none; transition: all 0.2s;
}
.select-periodo:focus { border-color: var(--primary); }

.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
.kpi {
  background: var(--card-bg); border-radius: 12px; padding: 18px;
  border: 1px solid var(--border); display: flex; align-items: center; gap: 14px;
  box-shadow: var(--shadow-sm); transition: all 0.2s;
}
.kpi:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
.kpi__icon { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
.kpi__icon.blue { background: #eff6ff; }
.kpi__icon.green { background: var(--success-light); }
.kpi__icon.purple { background: #faf5ff; }
.kpi__icon.orange { background: var(--warning-light); }
.kpi__val { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; line-height: 1.2; }
.kpi__lbl { font-size: 11px; color: var(--text-muted); font-weight: 500; margin-top: 2px; }

.reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.report-card {
  background: var(--card-bg); border-radius: 14px;
  border: 1px solid var(--border); box-shadow: var(--shadow-sm); overflow: hidden;
}
.full-width { grid-column: 1 / -1; }
.rc-head {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 18px 18px 0; margin-bottom: 14px;
}
.rc-head h3 { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.rc-head p { font-size: 11px; color: var(--text-muted); }
.rc-total { font-size: 13px; color: var(--text-secondary); }
.rc-total strong { color: var(--success); font-size: 15px; }
.rc-link { font-size: 12px; color: var(--primary); font-weight: 600; }

.loading-state { display: flex; justify-content: center; padding: 40px; }
.spinner { width: 24px; height: 24px; border: 3px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 36px; color: var(--text-muted); }
.empty-state.small { padding: 20px; }
.empty-state span { font-size: 28px; }
.empty-state p { font-size: 13px; font-weight: 600; color: var(--text-secondary); }

/* Ventas table */
.ventas-table { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead tr { background: var(--bg); }
th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
.tr-row { border-bottom: 1px solid var(--border); transition: all 0.15s; }
.tr-row:last-child { border-bottom: none; }
.tr-row:hover { background: var(--bg); }
td { padding: 11px 14px; vertical-align: middle; }
.vt-id { font-size: 11px; font-weight: 700; color: var(--text-muted); background: var(--bg); padding: 2px 6px; border-radius: 5px; }
.vt-date { font-size: 12px; color: var(--text); }
.vt-items { font-size: 12px; color: var(--text-secondary); }
.vt-metodo { font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 99px; background: var(--bg); color: var(--text-secondary); }
.vt-total { font-size: 13px; font-weight: 700; color: var(--text); }
.vt-status { font-size: 10px; font-weight: 700; padding: 3px 7px; border-radius: 99px; text-transform: uppercase; }
.vt-status.success { background: var(--success-light); color: var(--success); }
.vt-status.danger { background: var(--danger-light); color: var(--danger); }
.table-more { padding: 10px 14px; font-size: 11px; color: var(--text-muted); background: var(--bg); border-top: 1px solid var(--border); }

/* Top list */
.top-list { padding: 0 10px 14px; display: flex; flex-direction: column; gap: 6px; }
.top-row { display: flex; align-items: center; gap: 10px; padding: 8px 8px; border-radius: 8px; transition: all 0.15s; }
.top-row:hover { background: var(--bg); }
.top-rank { width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; flex-shrink: 0; }
.rank-1 { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
.rank-2 { background: linear-gradient(135deg, #94a3b8, #64748b); color: white; }
.rank-3 { background: linear-gradient(135deg, #cd7c2f, #b45309); color: white; }
.rank-4 { background: var(--bg); color: var(--text-muted); }
.top-info { flex: 1; }
.top-name { font-size: 12px; font-weight: 600; color: var(--text); display: block; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.top-bar-wrap { height: 3px; background: var(--bg); border-radius: 99px; overflow: hidden; }
.top-bar { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 99px; transition: width 0.8s ease; }
.top-qty { font-size: 11px; font-weight: 700; color: var(--text-muted); }

/* Stock list */
.stock-list { padding: 0 10px 14px; display: flex; flex-direction: column; gap: 4px; }
.stock-row { display: flex; align-items: center; gap: 8px; padding: 8px 8px; border-radius: 8px; transition: all 0.15s; }
.stock-row:hover { background: var(--bg); }
.sr-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.sr-dot.red { background: var(--danger); }
.sr-dot.amber { background: var(--warning); }
.sr-name { flex: 1; font-size: 12px; font-weight: 600; color: var(--text); }
.sr-stock { font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 99px; }
.sr-stock.danger { background: var(--danger-light); color: var(--danger); }
.sr-stock.warning { background: var(--warning-light); color: var(--warning); }

/* Inv summary */
.inv-summary { padding: 0 14px 14px; display: flex; flex-direction: column; gap: 2px; }
.inv-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); font-size: 13px; color: var(--text-secondary); }
.inv-row:last-child { border-bottom: none; }
.inv-row strong { font-weight: 700; color: var(--text); }
.inv-row strong.green { color: var(--success); }
.inv-row strong.danger { color: var(--danger); }
.inv-row strong.warning { color: var(--warning); }
.inv-row strong.orange { color: #f97316; }

@media (max-width: 900px) {
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .reports-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: 1; }
}
@media (max-width: 480px) {
  .kpi-row { grid-template-columns: 1fr; }
}
</style>
