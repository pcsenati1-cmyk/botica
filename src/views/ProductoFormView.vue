<template>
  <div class="producto-form-view">
    <div class="page-header">
      <router-link to="/inventario" class="back-link">← Volver</router-link>
      <h1>{{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="producto-form">
      <div class="form-group">
        <label for="nombre">Nombre *</label>
        <input 
          id="nombre"
          v-model="form.nombre" 
          type="text" 
          required
          placeholder="Ej: Paracetamol 500mg"
        />
        <span v-if="errors.nombre" class="error">{{ errors.nombre }}</span>
      </div>

      <div class="form-group">
        <label for="descripcion">Descripción</label>
        <textarea 
          id="descripcion"
          v-model="form.descripcion" 
          placeholder="Descripción del producto..."
          rows="3"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="precio">Precio (S/) *</label>
          <input 
            id="precio"
            v-model.number="form.precio" 
            type="number" 
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
          />
          <span v-if="errors.precio" class="error">{{ errors.precio }}</span>
        </div>

        <div class="form-group">
          <label for="stock">Stock *</label>
          <input 
            id="stock"
            v-model.number="form.stock" 
            type="number" 
            min="0"
            required
            placeholder="0"
          />
          <span v-if="errors.stock" class="error">{{ errors.stock }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="fecha_vencimiento">Fecha de Vencimiento</label>
        <input 
          id="fecha_vencimiento"
          v-model="form.fecha_vencimiento" 
          type="date"
        />
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
        </button>
        <router-link to="/inventario" class="btn-secondary">Cancelar</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInventarioStore } from '@/stores/inventario'

const route = useRoute()
const router = useRouter()
const inventarioStore = useInventarioStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const errors = ref({})

const form = ref({
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  fecha_vencimiento: ''
})

async function handleSubmit() {
  errors.value = {}
  
  if (!form.value.nombre?.trim()) {
    errors.value.nombre = 'El nombre es requerido'
    return
  }
  
  if (!form.value.precio || form.value.precio <= 0) {
    errors.value.precio = 'El precio debe ser mayor a 0'
    return
  }
  
  if (form.value.stock === '' || form.value.stock < 0) {
    errors.value.stock = 'El stock debe ser 0 o mayor'
    return
  }

  try {
    loading.value = true
    
    const productoData = {
      nombre: form.value.nombre,
      descripcion: form.value.descripcion || null,
      precio: form.value.precio,
      stock: form.value.stock,
      fecha_vencimiento: form.value.fecha_vencimiento || null
    }

    if (isEdit.value) {
      await inventarioStore.updateProducto(route.params.id, productoData)
    } else {
      await inventarioStore.createProducto(productoData)
    }
    
    router.push({ name: 'Inventario' })
  } catch (e) {
    alert('Error: ' + e.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    await inventarioStore.fetchProductos()
    const producto = inventarioStore.productos.find(p => p.id == route.params.id)
    if (producto) {
      form.value = {
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio,
        stock: producto.stock,
        fecha_vencimiento: producto.fecha_vencimiento?.split('T')[0] || ''
      }
    }
  }
})
</script>

<style scoped>
.producto-form-view {
  max-width: 600px;
}

.page-header {
  margin-bottom: 24px;
}

.back-link {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 8px;
}

.back-link:hover {
  text-decoration: underline;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.producto-form {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.error {
  color: #e53e3e;
  font-size: 13px;
  margin-top: 4px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary {
  flex: 1;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 14px 24px;
  background: #f1f5f9;
  color: #333;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  text-align: center;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>