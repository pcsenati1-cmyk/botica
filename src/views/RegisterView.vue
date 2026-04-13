<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Nova Salud</h1>
        <p>Crear Cuenta</p>
      </div>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="nombre">Nombre Completo</label>
          <input 
            id="nombre"
            v-model="form.nombre" 
            type="text" 
            required
            placeholder="Juan Pérez"
          />
        </div>
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input 
            id="email"
            v-model="form.email" 
            type="email" 
            required
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            id="password"
            v-model="form.password" 
            type="password" 
            required
            placeholder="••••••••"
            minlength="6"
          />
        </div>
        <div class="form-group">
          <label for="rol">Rol</label>
          <select id="rol" v-model="form.rol" required>
            <option value="empleado">Empleado</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
        </button>
      </form>
      <div class="auth-footer">
        <p>¿Ya tienes cuenta? <router-link to="/login">Inicia Sesión</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  nombre: '',
  email: '',
  password: '',
  rol: 'empleado'
})

const loading = ref(false)
const error = ref(null)

async function handleRegister() {
  try {
    loading.value = true
    error.value = null
    await authStore.signUp(
      form.value.email,
      form.value.password,
      form.value.nombre,
      form.value.rol
    )
    alert('Cuenta creada exitosamente. Por favor, verifica tu correo electrónico.')
    router.push({ name: 'Login' })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.auth-header p {
  color: #666;
  font-size: 14px;
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
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
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

.auth-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;
}

.auth-footer a {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>