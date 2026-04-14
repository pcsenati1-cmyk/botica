<template>
  <div class="login-page">
    <div class="login-bg"></div>
    
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#g)"/>
              <path d="M16 8v16M8 16h16" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#6366f1"/>
                  <stop offset="100%" stop-color="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1>Nova Salud</h1>
          <p>Ingresa a tu cuenta</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Correo</label>
            <input 
              v-model="form.email" 
              type="email" 
              required 
              placeholder="correo@ejemplo.com"
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label>Contrasena</label>
            <input 
              v-model="form.password" 
              :type="showPass ? 'text' : 'password'" 
              required 
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </div>

          <div v-if="error" class="error-text">{{ error }}</div>

          <button type="submit" class="btn-login" :disabled="loading">
            {{ loading ? 'Iniciando...' : 'Iniciar Sesion' }}
          </button>
        </form>

        <div class="login-footer">
          Sistema de Gestion Farmaceutica
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSweetAlert } from '@/composables/useSweetAlert'

const router = useRouter()
const authStore = useAuthStore()
const { error: showError } = useSweetAlert()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref(null)
const showPass = ref(false)

async function handleLogin() {
  try {
    loading.value = true
    error.value = null
    await authStore.signIn(form.value.email, form.value.password)
    router.push({ name: 'Dashboard' })
  } catch (e) {
    error.value = e.message
    showError('Error', e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.login-bg {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.login-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 40%);
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
}

.login-card {
  background: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.logo {
  display: inline-flex;
  margin-bottom: 16px;
}

.login-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.login-header p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.form-group input {
  padding: 12px 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  transition: border-color 0.2s, background 0.2s;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.form-group input:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
}

.error-text {
  padding: 10px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  color: #f87171;
  font-size: 12px;
  text-align: center;
}

.btn-login {
  padding: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 4px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 400px) {
  .login-card {
    padding: 24px;
    border-radius: 12px;
  }
  
  .login-header h1 {
    font-size: 20px;
  }
  
  .form-group input {
    padding: 10px 12px;
    font-size: 13px;
  }
  
  .btn-login {
    padding: 10px;
    font-size: 13px;
  }
}
</style>