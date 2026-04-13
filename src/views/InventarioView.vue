<template>
  <div class="inventario-view">
    <div class="page-header">
      <h1>Inventario</h1>
      <router-link v-if="authStore.isAdmin" to="/productos/nuevo" class="btn-primary">
        + Nuevo Producto
      </router-link>
    </div>

    <div class="search-bar">
      <input 
        v-model="inventarioStore.searchQuery" 
        type="text" 
        placeholder="Buscar productos..."
        class="search-input"
      />
    </div>

    <div v-if="inventarioStore.loading" class="loading">Cargando...</div>
    
    <div v-else class="products-table">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Fecha Vencimiento</th>
            <th v-if="authStore.isAdmin">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="producto in inventarioStore.filteredProductos" 
            :key="producto.id"
            :class="{ 'low-stock': producto.stock < 5 }"
          >
            <td class="product-name">{{ producto.nombre }}</td>
            <td>{{ producto.descripcion || '-' }}</td>
            <td>S/ {{ producto.precio?.toFixed(2) }}</td>
            <td :class="{ 'stock-warning': producto.stock < 5 }">
              {{ producto.stock }}
              <span v-if="producto.stock < 5" class="warning-badge">Bajo</span>
            </td>
            <td>{{ formatDate(producto.fecha_vencimiento) }}</td>
            <td v-if="authStore.isAdmin" class="actions">
              <router-link :to="`/productos/${producto.id}/editar`" class="btn-edit">
                Editar
              </router-link>
              <button @click="confirmDelete(producto.id)" class="btn-delete">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="inventarioStore.filteredProductos.length === 0" class="no-data">
        No se encontraron productos
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal" @click.stop>
        <h3>Confirmar Eliminación</h3>
        <p>¿Estás seguro de que deseas eliminar este producto?</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn-cancel">Cancelar</button>
          <button @click="handleDelete" class="btn-confirm">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInventarioStore } from '@/stores/inventario'
import { useAuthStore } from '@/stores/auth'

const inventarioStore = useInventarioStore()
const authStore = useAuthStore()

const showDeleteModal = ref(false)
const productoToDelete = ref(null)

function formatDate(fecha) {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString('es-PE')
}

function confirmDelete(id) {
  productoToDelete.value = id
  showDeleteModal.value = true
}

async function handleDelete() {
  if (productoToDelete.value) {
    await inventarioStore.deleteProducto(productoToDelete.value)
    showDeleteModal.value = false
    productoToDelete.value = null
  }
}

onMounted(async () => {
  await inventarioStore.fetchProductos()
})
</script>

<style scoped>
.inventario-view {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.btn-primary {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.search-bar {
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.loading, .no-data {
  text-align: center;
  padding: 60px;
  color: #999;
  font-size: 16px;
}

.products-table {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  color: #666;
  font-size: 14px;
  background: #f8fafc;
}

td {
  color: #333;
}

.product-name {
  font-weight: 600;
}

tr.low-stock {
  background: #fff5f5;
}

.stock-warning {
  color: #e53e3e;
  font-weight: 600;
}

.warning-badge {
  background: #e53e3e;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-edit, .btn-delete {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-edit {
  background: #e0f2fe;
  color: #0284c7;
}

.btn-delete {
  background: #fee;
  color: #e53e3e;
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
}

.modal h3 {
  margin-top: 0;
  font-size: 20px;
}

.modal p {
  color: #666;
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel, .btn-confirm {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: #f1f5f9;
  color: #333;
  border: none;
}

.btn-confirm {
  background: #e53e3e;
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>