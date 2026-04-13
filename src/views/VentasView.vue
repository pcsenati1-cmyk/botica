<template>
  <div class="ventas-view">
    <h1>Nueva Venta</h1>

    <div class="venta-container">
      <div class="productos-section">
        <h3>Seleccionar Productos</h3>
        <div class="search-bar">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar producto..."
            class="search-input"
          />
        </div>
        <div class="productos-list">
          <div 
            v-for="producto in filteredProductos" 
            :key="producto.id"
            class="producto-card"
            :class="{ disabled: producto.stock === 0 }"
            @click="agregarProducto(producto)"
          >
            <div class="producto-info">
              <span class="producto-nombre">{{ producto.nombre }}</span>
              <span class="producto-desc">{{ producto.descripcion }}</span>
            </div>
            <div class="producto-precio">
              <span>S/ {{ producto.precio?.toFixed(2) }}</span>
              <span class="producto-stock">Stock: {{ producto.stock }}</span>
            </div>
          </div>
          <div v-if="filteredProductos.length === 0" class="no-data">
            No hay productos disponibles
          </div>
        </div>
      </div>

      <div class="carrito-section">
        <h3>Carrito de Compras</h3>
        <div class="carrito-items">
          <div v-for="(item, index) in carrito" :key="index" class="carrito-item">
            <div class="item-info">
              <span class="item-nombre">{{ item.nombre }}</span>
              <span class="item-precio">S/ {{ item.precio?.toFixed(2) }} c/u</span>
            </div>
            <div class="item-controls">
              <button @click="decrementarCantidad(index)" class="btn-qty">-</button>
              <span class="item-cantidad">{{ item.cantidad }}</span>
              <button @click="incrementarCantidad(index, item.stock)" class="btn-qty">+</button>
            </div>
            <div class="item-subtotal">
              S/ {{ (item.precio * item.cantidad).toFixed(2) }}
            </div>
            <button @click="eliminarDelCarrito(index)" class="btn-remove">✕</button>
          </div>
          <div v-if="carrito.length === 0" class="no-data">
            Agrega productos al carrito
          </div>
        </div>

        <div class="carrito-total">
          <div class="total-row">
            <span>Total:</span>
            <span class="total-amount">S/ {{ total.toFixed(2) }}</span>
          </div>
        </div>

        <button 
          @click="confirmarVenta" 
          class="btn-primary"
          :disabled="carrito.length === 0 || ventasStore.loading"
        >
          {{ ventasStore.loading ? 'Procesando...' : 'Confirmar Venta' }}
        </button>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal success">
        <div class="success-icon">✓</div>
        <h3>Venta Exitosa</h3>
        <p>La venta se ha registrado correctamente.</p>
        <p class="venta-id">Venta #{{ ventaId }}</p>
        <button @click="showSuccessModal = false" class="btn-primary">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useVentasStore } from '@/stores/ventas'
import { useInventarioStore } from '@/stores/inventario'
import { useAuthStore } from '@/stores/auth'

const ventasStore = useVentasStore()
const inventarioStore = useInventarioStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const carrito = ref([])
const showSuccessModal = ref(false)
const ventaId = ref(null)

const filteredProductos = computed(() => {
  if (!searchQuery.value) return inventarioStore.productos.filter(p => p.stock > 0)
  const query = searchQuery.value.toLowerCase()
  return inventarioStore.productos.filter(p => 
    p.stock > 0 && (p.nombre?.toLowerCase().includes(query) || p.descripcion?.toLowerCase().includes(query))
  )
})

const total = computed(() => {
  return carrito.value.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
})

function agregarProducto(producto) {
  const existing = carrito.value.find(item => item.id === producto.id)
  if (existing) {
    if (existing.cantidad < producto.stock) {
      existing.cantidad++
    }
  } else {
    carrito.value.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      cantidad: 1
    })
  }
}

function incrementarCantidad(index, maxStock) {
  if (carrito.value[index].cantidad < maxStock) {
    carrito.value[index].cantidad++
  }
}

function decrementarCantidad(index) {
  if (carrito.value[index].cantidad > 1) {
    carrito.value[index].cantidad--
  } else {
    eliminarDelCarrito(index)
  }
}

function eliminarDelCarrito(index) {
  carrito.value.splice(index, 1)
}

async function confirmarVenta() {
  if (carrito.value.length === 0) return

  try {
    const venta = await ventasStore.crearVenta(carrito.value, authStore.user.id)
    ventaId.value = venta.id
    showSuccessModal.value = true
    carrito.value = []
  } catch (e) {
    alert('Error al procesar la venta: ' + e.message)
  }
}

onMounted(async () => {
  await inventarioStore.fetchProductos()
})
</script>

<style scoped>
.ventas-view {
  max-width: 1200px;
}

.ventas-view h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 24px;
}

.venta-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
}

.productos-section, .carrito-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.productos-section h3, .carrito-section h3 {
  font-size: 18px;
  color: #333;
  margin-top: 0;
  margin-bottom: 16px;
}

.search-bar {
  margin-bottom: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.productos-list {
  max-height: 500px;
  overflow-y: auto;
}

.producto-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.producto-card:hover:not(.disabled) {
  border-color: #667eea;
  background: #f8faff;
}

.producto-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.producto-info {
  display: flex;
  flex-direction: column;
}

.producto-nombre {
  font-weight: 600;
  color: #333;
}

.producto-desc {
  font-size: 13px;
  color: #666;
}

.producto-precio {
  text-align: right;
  display: flex;
  flex-direction: column;
}

.producto-precio span:first-child {
  font-weight: 600;
  color: #667eea;
  font-size: 16px;
}

.producto-stock {
  font-size: 12px;
  color: #666;
}

.carrito-items {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.carrito-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-nombre {
  font-weight: 500;
  font-size: 14px;
}

.item-precio {
  font-size: 12px;
  color: #666;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
}

.btn-qty {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-weight: bold;
}

.btn-qty:hover {
  background: #f0f4ff;
}

.item-cantidad {
  width: 30px;
  text-align: center;
  font-weight: 600;
}

.item-subtotal {
  font-weight: 600;
  width: 70px;
  text-align: right;
}

.btn-remove {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
}

.carrito-total {
  padding: 16px 0;
  border-top: 2px solid #eee;
  margin-bottom: 16px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
}

.total-amount {
  color: #667eea;
  font-size: 24px;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal.success {
  background: white;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin: 0 auto 16px;
}

.modal h3 {
  font-size: 24px;
  margin: 0 0 8px;
}

.modal p {
  color: #666;
}

.venta-id {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .venta-container {
    grid-template-columns: 1fr;
  }
}
</style>