<template>
  <div class="ventas animate-fade">

    <!-- Header -->
    <PageHeader title="Punto de Venta" subtitle="Registra ventas rápidamente" icon="🛒">
      <div class="day-stats">
        <div class="ds-item">
          <span class="ds-val">{{ ventasStore.ventasDelDia.length }}</span>
          <span class="ds-lbl">Ventas hoy</span>
        </div>
        <div class="ds-sep"></div>
        <div class="ds-item">
          <span class="ds-val green">S/ {{ ventasStore.totalVendidoDia.toFixed(2) }}</span>
          <span class="ds-lbl">Total del día</span>
        </div>
      </div>
    </PageHeader>

    <!-- POS Layout -->
    <div class="pos-layout">
      <div class="pos-catalogo">
        <ProductoCatalogo
          :productos="inventarioStore.productos"
          :cartIds="carrito.map(i => i.id)"
          @add="agregarProducto"
        />
      </div>
      <div class="pos-carrito">
        <CarritoPanel
          :items="carrito"
          v-model="metodoPago"
          :loading="ventasStore.loading"
          @increment="(i) => { if (carrito[i].cantidad < carrito[i].stock) carrito[i].cantidad++ }"
          @decrement="(i) => { if (carrito[i].cantidad > 1) carrito[i].cantidad--; else carrito.splice(i, 1) }"
          @remove="(i) => carrito.splice(i, 1)"
          @clear="carrito = []"
          @confirm="confirmarVenta"
        />
      </div>
    </div>

    <!-- Modal éxito -->
    <VentaExitosa
      :show="showSuccess"
      :ventaId="ventaId"
      :total="lastTotal"
      :metodo="metodoPago"
      :fecha="fechaVenta"
      @close="showSuccess = false"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useVentasStore } from '@/stores/ventas'
import { useInventarioStore } from '@/stores/inventario'
import { useAuthStore } from '@/stores/auth'
import PageHeader from '@/components/admin/PageHeader.vue'
import ProductoCatalogo from '@/components/admin/ventas/ProductoCatalogo.vue'
import CarritoPanel from '@/components/admin/ventas/CarritoPanel.vue'
import VentaExitosa from '@/components/admin/ventas/VentaExitosa.vue'

const ventasStore = useVentasStore()
const inventarioStore = useInventarioStore()
const authStore = useAuthStore()

const carrito = ref([])
const metodoPago = ref('EFECTIVO')
const showSuccess = ref(false)
const ventaId = ref(null)
const lastTotal = ref('0.00')
const fechaVenta = ref('')

function agregarProducto(p) {
  if (p.stock === 0) return
  const ex = carrito.value.find(i => i.id === p.id)
  if (ex) { if (ex.cantidad < p.stock) ex.cantidad++ }
  else carrito.value.push({ id: p.id, nombre: p.nombre, precio: p.precio, stock: p.stock, cantidad: 1 })
}

async function confirmarVenta() {
  if (!carrito.value.length) return
  try {
    const total = carrito.value.reduce((s, i) => s + i.precio * i.cantidad, 0)
    lastTotal.value = total.toFixed(2)
    fechaVenta.value = new Date().toLocaleString('es-PE')
    const venta = await ventasStore.crearVenta(carrito.value, authStore.user?.id, metodoPago.value)
    ventaId.value = venta.id
    showSuccess.value = true
    carrito.value = []
  } catch (e) {
    alert('Error: ' + e.message)
  }
}

onMounted(() => inventarioStore.fetchProductos())
</script>

<style scoped>
.ventas { max-width: 100%; }

.day-stats {
  display: flex; align-items: center; gap: 16px;
  padding: 10px 16px; background: var(--card-bg);
  border: 1px solid var(--border); border-radius: 10px;
}
.ds-item { text-align: center; }
.ds-val { display: block; font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
.ds-val.green { color: var(--success); }
.ds-lbl { font-size: 10px; color: var(--text-muted); font-weight: 500; }
.ds-sep { width: 1px; height: 26px; background: var(--border); }

.pos-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 16px;
  height: calc(100vh - 160px);
}

.pos-catalogo,
.pos-carrito {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@media (max-width: 900px) {
  .pos-layout { grid-template-columns: 1fr; height: auto; }
  .pos-catalogo { height: 420px; }
}
</style>
