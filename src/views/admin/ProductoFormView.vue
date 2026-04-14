<template>
  <div class="form-page animate-fade">
    <div class="page-header">
      <router-link to="/admin/inventario" class="back-link">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 3l-4 4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Volver al inventario
      </router-link>
      <div>
        <h1>{{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}</h1>
        <p class="page-sub">{{ isEdit ? 'Actualiza la información del producto' : 'Agrega un nuevo producto al inventario' }}</p>
      </div>
    </div>

    <div class="form-grid">
      <!-- Form -->
      <div class="form-card animate-slide-left">
        <form @submit.prevent="handleSubmit" novalidate>

          <div class="form-section">
            <div class="fs-title">
              <span class="fs-num">1</span>
              Información básica
            </div>
            <div class="field">
              <label>Nombre del producto <span class="req">*</span></label>
              <input v-model="form.nombre" type="text" placeholder="Ej: Paracetamol 500mg"
                :class="{ 'field-error': errors.nombre }" required />
              <span v-if="errors.nombre" class="err-msg">{{ errors.nombre }}</span>
            </div>
            <div class="field">
              <label>Descripción</label>
              <textarea v-model="form.descripcion" rows="3" placeholder="Indicaciones, presentación, etc."></textarea>
            </div>
            <div class="fields-2">
              <div class="field">
                <label>Laboratorio</label>
                <input v-model="form.laboratorio" type="text" placeholder="Ej: Bayer, Pfizer" />
              </div>
              <div class="field">
                <label>Código de barras</label>
                <input v-model="form.codigo_barras" type="text" placeholder="Ej: 7501234567890" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="fs-title">
              <span class="fs-num">2</span>
              Precios y Stock
            </div>
            <div class="fields-2">
              <div class="field">
                <label>Precio de venta (S/) <span class="req">*</span></label>
                <div class="input-with-prefix">
                  <span class="prefix">S/</span>
                  <input v-model.number="form.precio" type="number" step="0.01" min="0.01"
                    placeholder="0.00" :class="{ 'field-error': errors.precio }" />
                </div>
                <span v-if="errors.precio" class="err-msg">{{ errors.precio }}</span>
              </div>
              <div class="field">
                <label>Precio de compra (S/)</label>
                <div class="input-with-prefix">
                  <span class="prefix">S/</span>
                  <input v-model.number="form.precio_compra" type="number" step="0.01" min="0" placeholder="0.00" />
                </div>
                <span v-if="form.precio && form.precio_compra" class="field-hint green">
                  Margen: {{ getMargen() }}%
                </span>
              </div>
            </div>
            <div class="fields-2">
              <div class="field">
                <label>Stock actual <span class="req">*</span></label>
                <input v-model.number="form.stock" type="number" min="0"
                  placeholder="0" :class="{ 'field-error': errors.stock }" />
                <span v-if="errors.stock" class="err-msg">{{ errors.stock }}</span>
              </div>
              <div class="field">
                <label>Stock mínimo</label>
                <input v-model.number="form.stock_minimo" type="number" min="0" placeholder="5" />
                <span class="field-hint">Alerta cuando baje de este valor</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="fs-title">
              <span class="fs-num">3</span>
              Información adicional
            </div>
            <div class="fields-2">
              <div class="field">
                <label>Fecha de vencimiento</label>
                <input v-model="form.fecha_vencimiento" type="date" />
              </div>
              <div class="field">
                <label>Registro sanitario</label>
                <input v-model="form.registro_sanitario" type="text" placeholder="Ej: E.F. 1234-2024" />
              </div>
            </div>
            <div class="field">
              <label class="check-wrap">
                <input type="checkbox" v-model="form.receta_obligatoria" />
                <span class="check-custom"></span>
                <span>Requiere receta médica obligatoria</span>
              </label>
            </div>
          </div>

          <div v-if="submitError" class="form-err-banner">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 5v3M8 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            {{ submitError }}
          </div>

          <div class="form-actions">
            <router-link to="/admin/inventario" class="btn-cancel">Cancelar</router-link>
            <button type="submit" class="btn-save" :disabled="loading">
              <span v-if="loading" class="spinner-sm"></span>
              <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l4 4 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear producto') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Preview -->
      <div class="preview-col animate-slide-right">
        <div class="preview-card">
          <div class="pc-label">Vista previa</div>
          <div class="pc-product">
            <div class="pcp-avatar" :style="{ background: getColor(form.nombre || 'P') }">
              {{ form.nombre ? form.nombre.charAt(0).toUpperCase() : '?' }}
            </div>
            <div class="pcp-name">{{ form.nombre || 'Nombre del producto' }}</div>
            <div class="pcp-desc">{{ form.descripcion || 'Sin descripción' }}</div>
            <div class="pcp-rows">
              <div class="pcp-row">
                <span>Precio venta</span>
                <span class="pcp-val">S/ {{ form.precio ? Number(form.precio).toFixed(2) : '0.00' }}</span>
              </div>
              <div class="pcp-row">
                <span>Stock</span>
                <span class="pcp-val" :class="(form.stock || 0) < 5 ? 'warn' : ''">
                  {{ form.stock || 0 }} unidades
                </span>
              </div>
              <div class="pcp-row" v-if="form.laboratorio">
                <span>Laboratorio</span>
                <span class="pcp-val">{{ form.laboratorio }}</span>
              </div>
              <div class="pcp-row" v-if="form.fecha_vencimiento">
                <span>Vence</span>
                <span class="pcp-val">{{ formatDate(form.fecha_vencimiento) }}</span>
              </div>
            </div>
            <div v-if="form.receta_obligatoria" class="pcp-badge">💊 Requiere receta</div>
          </div>
        </div>

        <div class="tips-card">
          <div class="tips-title">💡 Consejos</div>
          <ul>
            <li>Incluye la dosis en el nombre: <em>Paracetamol 500mg</em></li>
            <li>Configura el stock mínimo para alertas tempranas</li>
            <li>El precio de compra ayuda a calcular márgenes</li>
            <li>El código de barras agiliza las búsquedas en ventas</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast-anim">
      <div v-if="toast.show" class="toast" :class="toast.type">
        <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        {{ toast.msg }}
      </div>
    </transition>
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
const submitError = ref(null)
const toast = ref({ show: false, msg: '', type: 'success' })

const form = ref({
  nombre: '', descripcion: '', laboratorio: '',
  precio: '', precio_compra: '', stock: '', stock_minimo: 5,
  fecha_vencimiento: '', codigo_barras: '', registro_sanitario: '',
  receta_obligatoria: false,
})

const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#3b82f6']
const getColor = (name) => colors[(name || 'P').charCodeAt(0) % colors.length]
const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-PE') : ''
const getMargen = () => {
  if (!form.value.precio || !form.value.precio_compra) return 0
  return Math.round(((form.value.precio - form.value.precio_compra) / form.value.precio) * 100)
}

function showToast(msg, type = 'success') {
  toast.value = { show: true, msg, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

async function handleSubmit() {
  errors.value = {}
  submitError.value = null

  if (!form.value.nombre?.trim()) { errors.value.nombre = 'El nombre es requerido'; return }
  if (!form.value.precio || form.value.precio <= 0) { errors.value.precio = 'El precio debe ser mayor a 0'; return }
  if (form.value.stock === '' || form.value.stock < 0) { errors.value.stock = 'El stock debe ser 0 o mayor'; return }

  try {
    loading.value = true
    const data = {
      nombre: form.value.nombre.trim(),
      descripcion: form.value.descripcion || null,
      laboratorio: form.value.laboratorio || null,
      precio: Number(form.value.precio),
      precio_compra: form.value.precio_compra ? Number(form.value.precio_compra) : null,
      stock: Number(form.value.stock),
      stock_minimo: Number(form.value.stock_minimo) || 5,
      fecha_vencimiento: form.value.fecha_vencimiento || null,
      codigo_barras: form.value.codigo_barras || null,
      registro_sanitario: form.value.registro_sanitario || null,
      receta_obligatoria: form.value.receta_obligatoria,
    }

    if (isEdit.value) {
      await inventarioStore.updateProducto(route.params.id, data)
      showToast('Producto actualizado correctamente')
    } else {
      await inventarioStore.createProducto(data)
      showToast('Producto creado correctamente')
    }
    setTimeout(() => router.push({ name: 'Inventario' }), 800)
  } catch (e) {
    submitError.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEdit.value) {
    await inventarioStore.fetchProductos()
    const p = inventarioStore.productos.find(p => p.id == route.params.id)
    if (p) {
      form.value = {
        nombre: p.nombre || '',
        descripcion: p.descripcion || '',
        laboratorio: p.laboratorio || '',
        precio: p.precio || '',
        precio_compra: p.precio_compra || '',
        stock: p.stock ?? '',
        stock_minimo: p.stock_minimo ?? 5,
        fecha_vencimiento: p.fecha_vencimiento?.split('T')[0] || '',
        codigo_barras: p.codigo_barras || '',
        registro_sanitario: p.registro_sanitario || '',
        receta_obligatoria: p.receta_obligatoria || false,
      }
    }
  }
})
</script>

<style scoped>
.form-page { max-width: 100%; width: 100%; }
.page-header { margin-bottom: 24px; }
.back-link {
  display: inline-flex; align-items: center; gap: 5px;
  color: var(--primary); font-size: 12px; font-weight: 600;
  margin-bottom: 10px; transition: var(--transition);
}
.back-link:hover { color: var(--primary-dark); gap: 8px; }
.page-header h1 { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 3px; }
.page-sub { font-size: 12px; color: var(--text-muted); }

.form-grid { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }

.form-card {
  background: var(--card-bg); border-radius: 14px;
  border: 1px solid var(--border); box-shadow: var(--shadow-sm); padding: 24px;
}

.form-section { margin-bottom: 24px; }
.fs-title {
  display: flex; align-items: center; gap: 10px;
  font-size: 13px; font-weight: 700; color: var(--text);
  margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border);
}
.fs-num {
  width: 22px; height: 22px; border-radius: 6px;
  background: var(--primary-bg); color: var(--primary);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; flex-shrink: 0;
}

.field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.field label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
.req { color: var(--danger); }
.field input, .field textarea {
  padding: 10px 12px; border: 1.5px solid var(--border);
  border-radius: 9px; background: var(--bg); color: var(--text);
  font-size: 13px; transition: var(--transition); resize: none;
}
.field input:focus, .field textarea:focus {
  outline: none; border-color: var(--primary);
  background: var(--card-bg); box-shadow: 0 0 0 3px var(--primary-glow);
}
.field input.field-error { border-color: var(--danger); }
.err-msg { font-size: 11px; color: var(--danger); font-weight: 500; }
.field-hint { font-size: 10px; color: var(--text-muted); }
.field-hint.green { color: var(--success); font-weight: 600; }

.input-with-prefix { position: relative; display: flex; align-items: center; }
.prefix { position: absolute; left: 11px; font-size: 13px; font-weight: 600; color: var(--text-muted); pointer-events: none; }
.input-with-prefix input { padding-left: 26px; width: 100%; }

.fields-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.check-wrap {
  display: flex; align-items: center; gap: 9px;
  cursor: pointer; font-size: 13px; font-weight: 500; color: var(--text);
}
.check-wrap input[type="checkbox"] { display: none; }
.check-custom {
  width: 17px; height: 17px; border: 2px solid var(--border);
  border-radius: 5px; display: flex; align-items: center; justify-content: center;
  transition: var(--transition); flex-shrink: 0;
}
.check-wrap input:checked + .check-custom {
  background: var(--primary); border-color: var(--primary);
}
.check-wrap input:checked + .check-custom::after {
  content: '✓'; color: white; font-size: 10px; font-weight: 700;
}

.form-err-banner {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 14px; background: var(--danger-light);
  border: 1px solid rgba(239,68,68,0.2); border-radius: 9px;
  color: var(--danger); font-size: 12px; font-weight: 500; margin-bottom: 16px;
}

.form-actions {
  display: flex; gap: 10px; justify-content: flex-end;
  padding-top: 18px; border-top: 1px solid var(--border);
}
.btn-cancel {
  padding: 10px 18px; background: var(--bg);
  border: 1px solid var(--border); border-radius: 9px;
  font-weight: 600; font-size: 13px; color: var(--text); transition: var(--transition);
}
.btn-cancel:hover { background: var(--border); }
.btn-save {
  display: flex; align-items: center; gap: 7px;
  padding: 10px 22px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white; border: none; border-radius: 9px;
  font-size: 13px; font-weight: 700; cursor: pointer;
  transition: var(--transition); box-shadow: var(--shadow-colored);
}
.btn-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-colored-lg); }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
.spinner-sm {
  width: 13px; height: 13px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}

/* Preview */
.preview-col { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 84px; }
.preview-card {
  background: var(--card-bg); border-radius: 14px;
  border: 1px solid var(--border); box-shadow: var(--shadow-sm); padding: 20px;
}
.pc-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
.pc-product { text-align: center; }
.pcp-avatar {
  width: 52px; height: 52px; border-radius: 13px;
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 800; margin: 0 auto 10px;
}
.pcp-name { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.pcp-desc { font-size: 11px; color: var(--text-muted); margin-bottom: 14px; }
.pcp-rows { text-align: left; }
.pcp-row {
  display: flex; justify-content: space-between;
  font-size: 12px; color: var(--text-secondary);
  padding: 5px 0; border-bottom: 1px solid var(--border);
}
.pcp-row:last-child { border-bottom: none; }
.pcp-val { font-weight: 700; color: var(--text); }
.pcp-val.warn { color: var(--warning); }
.pcp-badge {
  margin-top: 10px; padding: 5px 10px;
  background: var(--warning-light); color: var(--warning);
  border-radius: 7px; font-size: 11px; font-weight: 600;
}

.tips-card {
  background: var(--primary-bg); border-radius: 12px; padding: 16px;
  border: 1px solid rgba(99,102,241,0.15);
}
.tips-title { font-size: 12px; font-weight: 700; color: var(--primary); margin-bottom: 10px; }
.tips-card ul { list-style: none; display: flex; flex-direction: column; gap: 7px; }
.tips-card li { font-size: 11px; color: var(--text-secondary); line-height: 1.5; padding-left: 12px; position: relative; }
.tips-card li::before { content: '→'; position: absolute; left: 0; color: var(--primary); font-size: 10px; }
.tips-card em { color: var(--primary); font-style: normal; font-weight: 600; }

/* Toast */
.toast {
  position: fixed; bottom: 24px; right: 24px;
  display: flex; align-items: center; gap: 8px;
  padding: 12px 18px; border-radius: 12px;
  font-size: 13px; font-weight: 600;
  box-shadow: var(--shadow-lg); z-index: 2000;
}
.toast.success { background: var(--success); color: white; }
.toast.error { background: var(--danger); color: white; }
.toast-anim-enter-active { animation: slideInRight 0.3s ease-out; }
.toast-anim-leave-active { animation: slideInRight 0.2s ease-in reverse; }

@media (max-width: 900px) {
  .form-grid { grid-template-columns: 1fr; }
  .preview-col { position: static; }
  .fields-2 { grid-template-columns: 1fr; }
}
</style>
