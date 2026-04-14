<template>
  <div class="animate-fade">
    <PageHeader title="Usuarios" subtitle="Gestiona el acceso al sistema">
      <template #icon>
        <Users :size="20" />
      </template>
      <button class="btn-add" @click="openModal()">
        <Plus :size="16" /> Nuevo Usuario
      </button>
    </PageHeader>

    <!-- Stats -->
    <div class="stats-row">
      <StatsCard :value="usuarios.length" label="Total usuarios" color="blue">
        <template #icon><Users :size="20" /></template>
      </StatsCard>
      <StatsCard :value="admins" label="Administradores" color="purple">
        <template #icon><Shield :size="20" /></template>
      </StatsCard>
      <StatsCard :value="vendedores" label="Vendedores" color="green">
        <template #icon><UserCheck :size="20" /></template>
      </StatsCard>
      <StatsCard :value="activos" label="Activos" color="orange">
        <template #icon><CheckCircle :size="20" /></template>
      </StatsCard>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="filter-chips">
        <button class="chip" :class="{ active: filterActivo === 'todos' }" @click="filterActivo = 'todos'">
          Todos <span class="chip-count">{{ usuarios.length }}</span>
        </button>
        <button class="chip" :class="{ active: filterActivo === 'activos' }" @click="filterActivo = 'activos'">
          Activos <span class="chip-count">{{ activos }}</span>
        </button>
        <button class="chip" :class="{ active: filterActivo === 'inactivos' }" @click="filterActivo = 'inactivos'">
          Inactivos <span class="chip-count">{{ inactivos }}</span>
        </button>
      </div>
    </div>

    <!-- Info -->
    <div class="info-banner">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 7v4M8 5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      <span><strong>Administrador:</strong> acceso completo. <strong>Vendedor:</strong> solo ventas e inventario (lectura).</span>
    </div>

    <!-- Tabla -->
    <DataTable
      :rows="filteredUsuarios"
      :loading="loading"
      :columns="cols"
      :searchFields="['nombres','apellidos','email','rol']"
      searchPlaceholder="Buscar por nombre, email o rol..."
      emptyIcon="👥"
      emptyText="No hay usuarios registrados"
      emptySubtext="Crea el primer usuario del sistema"
    >
      <template #empty-action>
        <button class="btn-add" @click="openModal()" style="margin-top:12px">Crear primer usuario</button>
      </template>

      <template #default="{ row }">
        <td>
          <div class="user-cell">
            <div class="user-av" :style="{ background: color(row.nombres || row.email) }">
              {{ (row.nombres || row.email || 'U').charAt(0).toUpperCase() }}
            </div>
            <div>
              <div class="fw6">{{ row.nombres }} {{ row.apellidos }}</div>
              <div class="sub">Desde {{ fmtDate(row.created_at) }}</div>
            </div>
          </div>
        </td>
        <td><span class="sub">{{ row.email }}</span></td>
        <td>
          <span class="role-pill" :class="row.rol === 'administrador' ? 'admin' : 'vendor'">
            {{ row.rol === 'administrador' ? 'Admin' : 'Vendedor' }}
          </span>
        </td>
        <td><span class="sub">{{ row.dni || '—' }}</span></td>
        <td><span class="sub">{{ row.telefono || '—' }}</span></td>
        <td>
          <button class="status-btn" :class="row.estado !== false ? 'active' : 'inactive'" @click="toggleEstado(row)">
            <Circle :size="8" :fill="row.estado !== false ? 'currentColor' : 'none'" />
            {{ row.estado !== false ? 'Activo' : 'Inactivo' }}
          </button>
        </td>
        <td>
          <div class="action-btns">
            <button class="action-btn edit" @click="openModal(row)" title="Editar">
              <Pencil :size="14" />
            </button>
            <button class="action-btn delete" @click="toDelete = row; showDel = true" :disabled="row.auth_id === currentUserId" title="Eliminar">
              <Trash2 :size="14" />
            </button>
          </div>
        </td>
      </template>
    </DataTable>

    <!-- Modal crear/editar -->
    <FormModal
      :show="showModal"
      :title="editing ? 'Editar Usuario' : 'Nuevo Usuario'"
      :subtitle="editing ? 'Actualiza la información del usuario' : 'Completa los datos para crear el acceso'"
      @close="showModal = false"
    >
      <form @submit.prevent="handleSave" id="user-form">
        <div class="form-grid">
          <FormField label="Nombres" v-model="form.nombres" placeholder="Juan" required :error="errors.nombres" />
          <FormField label="Apellidos" v-model="form.apellidos" placeholder="Pérez" required :error="errors.apellidos" />
        </div>
        <FormField label="Correo electrónico" v-model="form.email" type="email" placeholder="correo@ejemplo.com" required :disabled="!!editing" :hint="editing ? 'El email no se puede modificar' : ''" :error="errors.email" />
        <FormField v-if="!editing" label="Contraseña" v-model="form.password" type="password" placeholder="Mínimo 6 caracteres" required :error="errors.password" />
        <div class="form-grid">
          <FormField label="Rol" v-model="form.rol" type="select" required>
            <template #options>
              <option value="vendedor">Vendedor</option>
              <option value="administrador">Administrador</option>
            </template>
          </FormField>
          <FormField label="DNI" v-model="form.dni" placeholder="12345678" />
        </div>
        <FormField label="Teléfono" v-model="form.telefono" placeholder="999 888 777" />

        <div v-if="formError" class="form-err">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 5v3M8 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          {{ formError }}
        </div>
      </form>

      <template #footer>
        <button class="btn-cancel" @click="showModal = false">Cancelar</button>
        <button class="btn-save" type="submit" form="user-form" :disabled="saving">
          <span v-if="saving" class="spinner"></span>
          <svg v-else width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ saving ? 'Guardando...' : (editing ? 'Actualizar' : 'Crear usuario') }}
        </button>
      </template>
    </FormModal>

    <!-- Confirm delete -->
    <ConfirmModal
      :show="showDel"
      title="Eliminar Usuario"
      :message="`¿Estás seguro de eliminar a ${toDelete?.nombres} ${toDelete?.apellidos}? Esta acción no se puede deshacer.`"
      confirmText="Eliminar"
      variant="danger"
      :loading="saving"
      @confirm="doDelete"
      @cancel="showDel = false"
    />

    <AppToast :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase, auth as supaAuth } from '@/supabase'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { Users, Shield, UserCheck, CheckCircle, Plus, Pencil, Trash2, Circle } from 'lucide-vue-next'
import PageHeader from '@/components/admin/PageHeader.vue'
import StatsCard from '@/components/admin/StatsCard.vue'
import DataTable from '@/components/admin/DataTable.vue'
import FormModal from '@/components/admin/FormModal.vue'
import FormField from '@/components/admin/FormField.vue'
import ConfirmModal from '@/components/admin/ConfirmModal.vue'
import AppToast from '@/components/admin/AppToast.vue'

const authStore = useAuthStore()
const { toast, showToast } = useToast()

const usuarios = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const showDel = ref(false)
const editing = ref(null)
const toDelete = ref(null)
const formError = ref(null)
const errors = ref({})

const currentUserId = computed(() => authStore.userProfile?.auth_id)
const admins = computed(() => usuarios.value.filter(u => u.rol === 'administrador').length)
const vendedores = computed(() => usuarios.value.filter(u => u.rol !== 'administrador').length)
const activos = computed(() => usuarios.value.filter(u => u.estado !== false).length)
const inactivos = computed(() => usuarios.value.filter(u => u.estado === false).length)
const filterActivo = ref('todos')

const filteredUsuarios = computed(() => {
  if (filterActivo.value === 'todos') return usuarios.value
  if (filterActivo.value === 'activos') return usuarios.value.filter(u => u.estado !== false)
  return usuarios.value.filter(u => u.estado === false)
})

const cols = [
  { key: 'usuario', label: 'Usuario' },
  { key: 'email', label: 'Email' },
  { key: 'rol', label: 'Rol' },
  { key: 'dni', label: 'DNI' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'estado', label: 'Estado' },
  { key: 'acciones', label: 'Acciones', class: 'th-center' },
]

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#3b82f6']
const color = (n) => COLORS[(n || 'U').charCodeAt(0) % COLORS.length]
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-PE') : '—'

const form = ref({ nombres: '', apellidos: '', email: '', password: '', rol: 'vendedor', dni: '', telefono: '' })

const handleError = (error) => {
  if (!error) return 'Error desconocido'
  if (error.message?.includes('already been registered')) return 'Este correo ya está registrado'
  if (error.message?.includes('Invalid login')) return 'Credenciales inválidas'
  if (error.message?.includes('password')) return 'La contraseña debe tener al menos 6 caracteres'
  return error.message || 'Error al guardar'
}

function openModal(user = null) {
  editing.value = user
  formError.value = null
  errors.value = {}
  form.value = user
    ? { nombres: user.nombres || '', apellidos: user.apellidos || '', email: user.email || '', password: '', rol: user.rol || 'vendedor', dni: user.dni || '', telefono: user.telefono || '' }
    : { nombres: '', apellidos: '', email: '', password: '', rol: 'vendedor', dni: '', telefono: '' }
  showModal.value = true
}

function validate() {
  errors.value = {}
  if (!form.value.nombres?.trim()) errors.value.nombres = 'Requerido'
  if (!form.value.apellidos?.trim()) errors.value.apellidos = 'Requerido'
  if (!form.value.email?.trim()) errors.value.email = 'Requerido'
  if (!editing.value && !form.value.password) errors.value.password = 'Requerido'
  if (!editing.value && form.value.password && form.value.password.length < 6) errors.value.password = 'Mínimo 6 caracteres'
  return Object.keys(errors.value).length === 0
}

async function handleSave() {
  if (!validate()) return
  formError.value = null
  saving.value = true
  try {
    if (editing.value) {
      const { error } = await supabase.from('usuarios').update({
        nombres: form.value.nombres,
        apellidos: form.value.apellidos,
        rol: form.value.rol,
        dni: form.value.dni || null,
        telefono: form.value.telefono || null,
      }).eq('id', editing.value.id)
      if (error) throw error
      
      showToast('Usuario actualizado correctamente', 'success')
    } else {
      const { data: authData, error: authErr } = await supaAuth.signUp({
        email: form.value.email,
        password: form.value.password,
        options: { data: { nombres: form.value.nombres, rol: form.value.rol } }
      })
      if (authErr) throw authErr
      
      if (!authData.user) {
        throw new Error('No se pudo crear el usuario en autenticación')
      }
      
      const { error: dbErr } = await supabase.from('usuarios').insert([{
        auth_id: authData.user.id,
        nombres: form.value.nombres,
        apellidos: form.value.apellidos,
        email: form.value.email,
        rol: form.value.rol,
        dni: form.value.dni || null,
        telefono: form.value.telefono || null,
        estado: true
      }])
      if (dbErr) throw dbErr
      
      showToast('Usuario creado correctamente. Se ha enviado un correo de confirmación.', 'success')
    }
    showModal.value = false
    await fetchUsuarios()
  } catch (e) {
    formError.value = handleError(e)
  } finally {
    saving.value = false
  }
}

async function doDelete() {
  if (!toDelete.value) return
  saving.value = true
  try {
    const { error } = await supabase.from('usuarios').delete().eq('id', toDelete.value.id)
    if (error) throw error
    showToast('Usuario eliminado correctamente', 'success')
    showDel.value = false
    await fetchUsuarios()
  } catch (e) {
    showToast(e.message, 'error')
  } finally {
    saving.value = false
  }
}

async function toggleEstado(user) {
  if (!user || user.auth_id === currentUserId.value) return
  try {
    const nuevoEstado = user.estado === false ? true : false
    const { error } = await supabase.from('usuarios').update({ estado: nuevoEstado }).eq('id', user.id)
    if (error) throw error
    showToast(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`, 'success')
    await fetchUsuarios()
  } catch (e) {
    showToast(e.message, 'error')
  }
}

async function fetchUsuarios() {
  loading.value = true
  try {
    const { data, error } = await supabase.from('usuarios').select('*').order('created_at', { ascending: false })
    if (error) throw error
    usuarios.value = data || []
  } catch (e) { showToast(e.message, 'error') }
  finally { loading.value = false }
}

onMounted(fetchUsuarios)
</script>

<style scoped>
.btn-add {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px; background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white; border: none; border-radius: 9px; font-weight: 700; font-size: 13px;
  cursor: pointer; box-shadow: var(--shadow-colored); transition: all 0.2s;
}
.btn-add:hover { transform: translateY(-2px); box-shadow: var(--shadow-colored-lg); }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }

.info-banner {
  display: flex; align-items: center; gap: 9px;
  padding: 10px 14px; background: #eff6ff; border: 1px solid #bfdbfe;
  border-radius: 10px; margin-bottom: 16px; font-size: 12px; color: #1e40af;
}
.info-banner svg { flex-shrink: 0; color: #3b82f6; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-av { width: 34px; height: 34px; border-radius: 9px; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; }
.fw6 { font-weight: 600; font-size: 13px; }
.sub { font-size: 11px; color: var(--text-muted); margin-top: 1px; }

.role-pill { font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 99px; }
.role-pill.admin  { background: #ede9fe; color: #7c3aed; }
.role-pill.vendor { background: var(--success-light); color: var(--success); }

.status-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 99px; }
.status-pill.active   { background: var(--success-light); color: var(--success); }
.status-pill.inactive { background: var(--danger-light); color: var(--danger); }
.s-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

.status-btn {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 700; padding: 4px 10px;
  border-radius: 99px; border: none; cursor: pointer;
  transition: all 0.2s;
}
.status-btn.active { background: var(--success-light); color: var(--success); }
.status-btn.inactive { background: var(--danger-light); color: var(--danger); }
.status-btn:hover { transform: scale(1.05); }

.action-btns { display: flex; gap: 6px; justify-content: center; }
.action-btn {
  width: 28px; height: 28px; border-radius: 6px;
  border: 1px solid var(--border); background: var(--card-bg);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s; color: var(--text-secondary);
}
.action-btn:hover { border-color: var(--primary); color: var(--primary); }
.action-btn.delete:hover { border-color: var(--danger); color: var(--danger); }
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.filters-bar { margin-bottom: 16px; }
.filter-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 99px;
  border: 1.5px solid var(--border); background: var(--card-bg);
  font-size: 12px; font-weight: 600; color: var(--text-secondary);
  cursor: pointer; transition: all 0.15s;
}
.chip:hover { border-color: var(--primary); color: var(--primary); }
.chip.active { background: var(--primary-bg); border-color: var(--primary); color: var(--primary); }
.chip-count { font-size: 10px; padding: 2px 6px; border-radius: 99px; background: var(--bg); }
.chip.active .chip-count { background: var(--primary); color: white; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
.form-err { display: flex; align-items: center; gap: 7px; padding: 10px 12px; background: var(--danger-light); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; color: var(--danger); font-size: 12px; font-weight: 500; margin-top: 8px; }

.btn-cancel { padding: 10px 20px; border-radius: 9px; background: var(--bg); border: 1px solid var(--border); color: var(--text); font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; }
.btn-cancel:hover { background: var(--border); }
.btn-save { display: flex; align-items: center; gap: 7px; padding: 10px 20px; border-radius: 9px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; border: none; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; box-shadow: var(--shadow-colored); }
.btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: var(--shadow-colored-lg); }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
.spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }

:deep(.th-center) { text-align: center; }
:deep(td:last-child) { text-align: center; }

@media (max-width: 900px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .stats-row { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr; } }
</style>
