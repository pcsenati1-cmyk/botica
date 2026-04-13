<template>
  <div class="dashboard-view">
    <h1>Dashboard</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-value">S/ {{ ventasStore.totalVendidoDia.toFixed(2) }}</div>
          <div class="stat-label">Ventas del Día</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-content">
          <div class="stat-value">{{ ventasStore.ventasDelDia.length }}</div>
          <div class="stat-label">Transacciones Hoy</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <div class="stat-value">{{ inventarioStore.productos.length }}</div>
          <div class="stat-label">Total Productos</div>
        </div>
      </div>
      <div class="stat-card warning">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <div class="stat-value">{{ inventarioStore.productosBajoStock.length }}</div>
          <div class="stat-label">Stock Bajo</div>
        </div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart-card">
        <h3>Productos Más Vendidos</h3>
        <div class="top-products">
          <div 
            v-for="(item, index) in productosMasVendidos" 
            :key="item[0]" 
            class="product-item"
          >
            <span class="rank">{{ index + 1 }}</span>
            <span class="product-name">{{ getProductName(item[0]) }}</span>
            <span class="product-count">{{ item[1] }} unidades</span>
          </div>
          <div v-if="productosMasVendidos.length === 0" class="no-data">
            No hay ventas registradas
          </div>
        </div>
      </div>

      <div class="chart-card">
        <h3>Alertas de Stock</h3>
        <div class="stock-alerts">
          <div 
            v-for="product in inventarioStore.productosBajoStock" 
            :key="product.id"
            class="alert-item"
          >
            <span class="alert-name">{{ product.nombre }}</span>
            <span class="alert-stock">Stock: {{ product.stock }}</span>
          </div>
          <div v-if="inventarioStore.productosBajoStock.length === 0" class="no-data">
            No hay productos con stock bajo
          </div>
        </div>
      </div>
    </div>

    <div class="recent-sales">
      <h3>Ventas Recientes</h3>
      <div class="sales-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="venta in ventasStore.ventas.slice(0, 10)" :key="venta.id">
              <td>#{{ venta.id }}</td>
              <td>{{ formatDate(venta.fecha) }}</td>
              <td>S/ {{ venta.total?.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="ventasStore.ventas.length === 0" class="no-data">
          No hay ventas registradas
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useVentasStore } from '@/stores/ventas'
import { useInventarioStore } from '@/stores/inventario'

const ventasStore = useVentasStore()
const inventarioStore = useInventarioStore()

const productosMasVendidos = computed(() => ventasStore.productosMasVendidos)

function getProductName(productoId) {
  const producto = inventarioStore.productos.find(p => p.id === productoId)
  return producto?.nombre || `Producto #${productoId}`
}

function formatDate(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await Promise.all([
    ventasStore.fetchVentas(),
    inventarioStore.fetchProductos()
  ])
})
</script>

<style scoped>
.dashboard-view {
  max-width: 1200px;
}

.dashboard-view h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stat-card.warning {
  background: #fffbeb;
}

.stat-icon {
  font-size: 36px;
  margin-right: 16px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.chart-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.product-item,
.alert-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f8fafc;
}

.rank {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  margin-right: 12px;
}

.product-name,
.alert-name {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.product-count,
.alert-stock {
  font-size: 14px;
  color: #666;
}

.alert-stock {
  color: #e53e3e;
  font-weight: 600;
}

.recent-sales {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.recent-sales h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
}

.sales-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

td {
  color: #333;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>