<template>
  <div class="animate-fade">
    <PageHeader title="Inventario" :subtitle="`${store.productos.length} productos · Valor: S/ ${store.valorInventario.toFixed(2)}`" icon="📦">
      <router-link v-if="auth.isAdmin" to="/admin/productos/nuevo" class="btn-add">
        + Nuevo Producto
      </router-link>
    </PageHeader>

    <DataTable
      :rows="store.productos"
      :columns="cols"
      :loading="store.loading"
      :filters="tabFilters"
      :searchFields="['nombre','descripcion','laboratorio','codigo_barras']"
      searchPlaceholder="Buscar por nombre, laboratorio o código..."
      emptyIcon="📦"
      emptyText="No hay productos registrados"
      emptySubtext="Agrega el primer producto al inventario"
    >
      <template #empty-action>
        <router-link v-if="auth.isAdmin" to="/admin/productos/nuevo" class="btn-add" style="margin-top:12px">
          + Agregar producto
        </router-link>
      </template>

      <template #default="{ row }">
        <td>
          <div class="prod-cell">
            <div class="prod-av" :style="{ background: color(row.nombre) }">{{ row.nombre.charAt(0) }}</div>
            <div>
              <div class="fw6">{{ row.nombre }}</div>
              <div class="sub">{{ row.laboratorio || row.descripcion || '—' }}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="fw7">S/ {{ row.precio?.toFixed(2) }}</div>
          <div v-if="row.precio_compra" class="sub">Costo: S/ {{ row.precio_compra?.toFixed(2) }}</div>
        </td>
        <td>
          <div class="stock-cell">
            <span class="stock-num" :class="stockClass(row)">{{ row.stock }}</span>
            <div class="stock-bar"><div :class="stockClass(row)" :style="{ width: stockPct(row) + '%' }"></div></div>
          </div>
        </td>
        <td>
          <span class="date-tag" :class="vencClass(row.fecha_vencimiento)">
            {{ fmtDate(row.fecha_vencimiento) }}
          </span>
        </td>
        <td><span class="pill" :class="statusClass(row)">{{ statusLabel(row) }}</span></td>
        <td v-if="auth.isAdmin">
          <ActionButtons
            @edit="$router.push(`/admin/productos/${row.id}/editar`)"
            @delete="toDelete = row; showDel = true"
          />
        </td>
      </template>

      <template #footer-right>
        <span v-if="store.productosBajoStock.length > 0" class="footer-warn">
          ⚠️ {{ store.productosBajoStock.length }} con stock bajo
        </span>
      </template>
    </DataTable>

    <ConfirmModal
      :show="showDel"
      title="Eliminar Producto"
      :message="`¿Eliminar &quot;${toDelete?.nombre}&quot;? Esta acción no se puede deshacer.`"
      confirmText="Eliminar"
      variant="danger"
      :loading="store.loading"
      @confirm="doDelete"
      @cancel="showDel = false"
    />

    <AppToast :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInventarioStore } from '@/stores/inventario'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import PageHeader from '@/components/admin/PageHeader.vue'
import DataTable from '@/components/admin/DataTable.vue'
import ActionButtons from '@/components/admin/ActionButtons.vue'
import ConfirmModal from '@/components/admin/ConfirmModal.vue'
import AppToast from '@/components/admin/AppToast.vue'

const store = useInventarioStore()
const auth = useAuthStore()
const router = useRouter()
const { toast, showToast } = useToast()

const showDel = ref(false)
const toDelete = ref(null)

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#3b82f6']
const color = (n) => COLORS[n.charCodeAt(0) % COLORS.length]

const cols = computed(() => [
  { key: 'nombre', label: 'Producto' },
  { key: 'precio', label: 'Precio' },
  { key: 'stock', label: 'Stock' },
  { key: 'vence', label: 'Vencimiento' },
  { key: 'estado', label: 'Estado' },
  ...(auth.isAdmin ? [{ key: 'acciones', label: 'Acciones', class: 'th-center' }] : []),
])

const tabFilters = computed(() => [
  { key: 'todos', label: 'Todos', count: store.productos.length },
  { key: 'bajo', label: 'Stock bajo', count: store.productosBajoStock.length, badgeColor: 'amber', filter: p => p.stock > 0 && p.stock < (p.stock_minimo || 5) },
  { key: 'agotado', label: 'Agotados', count: store.productos.filter(p => p.stock === 0).length, badgeColor: 'red', filter: p => p.stock === 0 },
])

const stockClass = (p) => p.stock === 0 ? 'danger' : p.stock < (p.stock_minimo || 5) ? 'warning' : 'success'
const stockPct = (p) => Math.min(100, Math.round((p.stock / Math.max(p.stock, (p.stock_minimo || 5) * 4)) * 100))
const statusClass = (p) => p.stock === 0 ? 'pill-danger' : p.stock < (p.stock_minimo || 5) ? 'pill-warning' : 'pill-success'
const statusLabel = (p) => p.stock === 0 ? 'Agotado' : p.stock < (p.stock_minimo || 5) ? 'Stock bajo' : 'Disponible'
const vencClass = (f) => { if (!f) return ''; const d = (new Date(f) - new Date()) / 86400000; return d < 0 ? 'expired' : d < 30 ? 'soon' : '' }
const fmtDate = (f) => f ? new Date(f).toLocaleDateString('es-PE') : '—'

async function doDelete() {
  try {
    await store.deleteProducto(toDelete.value.id)
    showToast(`"${toDelete.value.nombre}" eliminado`)
    showDel.value = false
  } catch (e) { showToast(e.message, 'error') }
}

onMounted(() => store.fetchProductos())
</script>

<style scoped>
.btn-add {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px; background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white; border: none; border-radius: 9px; font-weight: 700; font-size: 13px;
  cursor: pointer; box-shadow: var(--shadow-colored); transition: all 0.2s; text-decoration: none;
}
.btn-add:hover { transform: translateY(-2px); box-shadow: var(--shadow-colored-lg); }

.prod-cell { display: flex; align-items: center; gap: 10px; }
.prod-av { width: 34px; height: 34px; border-radius: 9px; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }
.fw6 { font-weight: 600; }
.fw7 { font-weight: 700; }
.sub { font-size: 11px; color: var(--text-muted); margin-top: 1px; }

.stock-cell { display: flex; flex-direction: column; gap: 4px; min-width: 70px; }
.stock-num { font-size: 13px; font-weight: 700; }
.stock-num.success { color: var(--success); }
.stock-num.warning { color: var(--warning); }
.stock-num.danger  { color: var(--danger); }
.stock-bar { height: 3px; background: var(--bg); border-radius: 99px; overflow: hidden; }
.stock-bar div { height: 100%; border-radius: 99px; transition: width 0.5s; }
.stock-bar .success { background: var(--success); }
.stock-bar .warning { background: var(--warning); }
.stock-bar .danger  { background: var(--danger); }

.date-tag { font-size: 12px; color: var(--text-secondary); }
.date-tag.expired { color: var(--danger); font-weight: 600; }
.date-tag.soon    { color: var(--warning); font-weight: 600; }

.pill { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.3px; }
.pill-success { background: var(--success-light); color: var(--success); }
.pill-warning { background: var(--warning-light); color: var(--warning); }
.pill-danger  { background: var(--danger-light);  color: var(--danger); }

.footer-warn { color: var(--warning); font-weight: 600; }
:deep(.th-center) { text-align: center; }
</style>
