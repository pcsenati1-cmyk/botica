<template>
  <div class="auth-page">
    <div class="auth-left">
      <div class="auth-left-content">
        <div class="brand">
          <div class="brand-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="url(#lg1)"/>
              <path d="M16 7v18M7 16h18" stroke="white" stroke-width="3" stroke-linecap="round"/>
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#818cf8"/>
                  <stop offset="100%" stop-color="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="brand-name">Nova<span>Salud</span></span>
        </div>
        <div class="left-hero">
          <h1>Empieza hoy mismo</h1>
          <p>Crea tu cuenta gratis y transforma la gestión de tu farmacia en minutos.</p>
        </div>
        <div class="steps-list">
          <div class="step-item" v-for="(s, i) in steps" :key="i">
            <div class="step-num">{{ i + 1 }}</div>
            <div>
              <div class="step-title">{{ s.title }}</div>
              <div class="step-desc">{{ s.desc }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="left-bg-blobs">
        <div class="blob b1"></div>
        <div class="blob b2"></div>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-form-wrap">
        <div class="form-header">
          <h2>Crear Cuenta</h2>
          <p>Completa el formulario para comenzar</p>
        </div>

        <div v-if="success" class="success-banner">
          <div class="success-icon">✓</div>
          <div>
            <strong>¡Cuenta creada!</strong>
            <p>Revisa tu correo para verificar tu cuenta.</p>
          </div>
        </div>

        <form v-else @submit.prevent="handleRegister" class="auth-form">
          <div class="field-group">
            <label>Nombre Completo</label>
            <div class="input-wrap">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
              <input v-model="form.nombre" type="text" required placeholder="Juan Pérez" autocomplete="name"/>
            </div>
          </div>

          <div class="field-group">
            <label>Correo Electrónico</label>
            <div class="input-wrap">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4l6 5 6-5M2 4h12v9H2V4z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <input v-model="form.email" type="email" required placeholder="correo@ejemplo.com" autocomplete="email"/>
            </div>
          </div>

          <div class="field-group">
            <label>Contraseña</label>
            <div class="input-wrap">
              <span class="input-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
              <input v-model="form.password" :type="showPass ? 'text' : 'password'" required placeholder="Mínimo 6 caracteres" minlength="6" autocomplete="new-password"/>
              <button type="button" class="pass-toggle" @click="showPass = !showPass">
                <svg v-if="!showPass" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 2l12 12M6.5 6.6A2 2 0 0010 10M4.5 4.6C2.8 5.7 1.5 7.5 1.5 8s2.5 5 6.5 5c1.2 0 2.3-.3 3.2-.8M7 3.1C7.3 3 7.7 3 8 3c4 0 6.5 5 6.5 5s-.5 1-1.5 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="field-group">
            <label>Rol en la farmacia</label>
            <div class="role-selector">
              <label class="role-option" :class="{ active: form.rol === 'empleado' }">
                <input type="radio" v-model="form.rol" value="empleado" hidden/>
                <span class="role-icon">👤</span>
                <div>
                  <div class="role-name">Empleado</div>
                  <div class="role-desc">Ventas e inventario</div>
                </div>
                <div class="role-check" v-if="form.rol === 'empleado'">✓</div>
              </label>
              <label class="role-option" :class="{ active: form.rol === 'administrador' }">
                <input type="radio" v-model="form.rol" value="administrador" hidden/>
                <span class="role-icon">👑</span>
                <div>
                  <div class="role-name">Administrador</div>
                  <div class="role-desc">Acceso completo</div>
                </div>
                <div class="role-check" v-if="form.rol === 'administrador'">✓</div>
              </label>
            </div>
          </div>

          <div v-if="error" class="form-error">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 5v3M8 11v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" :disabled="loading" class="btn-submit">
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? 'Creando cuenta...' : 'Crear Cuenta Gratis' }}</span>
          </button>
        </form>

        <div class="form-footer">
          <p>¿Ya tienes cuenta? <router-link to="/login">Iniciar Sesión</router-link></p>
        </div>
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

const form = ref({ nombre: '', email: '', password: '', rol: 'empleado' })
const loading = ref(false)
const error = ref(null)
const success = ref(false)
const showPass = ref(false)

const steps = [
  { title: 'Crea tu cuenta', desc: 'Registro gratuito en menos de 2 minutos' },
  { title: 'Configura tu farmacia', desc: 'Agrega productos y configura tu inventario' },
  { title: 'Empieza a vender', desc: 'Registra ventas y genera reportes al instante' },
]

async function handleRegister() {
  try {
    loading.value = true
    error.value = null
    await authStore.signUp(form.value.email, form.value.password, form.value.nombre, form.value.rol)
    success.value = true
    setTimeout(() => router.push({ name: 'Login' }), 3000)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
}

.auth-left {
  flex: 1;
  background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 48px;
  position: relative;
  overflow: hidden;
}

.auth-left-content {
  position: relative;
  z-index: 2;
  max-width: 440px;
  width: 100%;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 56px;
}

.brand-name {
  font-size: 22px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
}

.brand-name span { color: #818cf8; }

.left-hero { margin-bottom: 40px; }

.left-hero h1 {
  font-size: 36px;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  letter-spacing: -1px;
  margin-bottom: 16px;
}

.left-hero p {
  font-size: 16px;
  color: rgba(255,255,255,0.55);
  line-height: 1.7;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.step-num {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99,102,241,0.4);
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 2px;
}

.step-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.45);
}

.left-bg-blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.b1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, #6366f1, #4f46e5);
  top: -100px; right: -100px;
}

.b2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #06b6d4, #0891b2);
  bottom: -50px; left: -50px;
}

.auth-right {
  width: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 48px;
  background: var(--card-bg);
  overflow-y: auto;
}

.auth-form-wrap {
  width: 100%;
  max-width: 380px;
  animation: fadeIn 0.5s ease-out;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.form-header p {
  font-size: 14px;
  color: var(--text-muted);
}

.success-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--success-light);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
}

.success-icon {
  width: 40px;
  height: 40px;
  background: var(--success);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.success-banner strong {
  display: block;
  color: var(--success);
  font-size: 15px;
  margin-bottom: 2px;
}

.success-banner p {
  font-size: 13px;
  color: var(--text-secondary);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  pointer-events: none;
}

.input-wrap input {
  width: 100%;
  padding: 12px 44px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
  transition: var(--transition);
}

.input-wrap input:focus {
  outline: none;
  border-color: var(--primary);
  background: var(--card-bg);
  box-shadow: 0 0 0 3px var(--primary-glow);
}

.pass-toggle {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
  transition: var(--transition);
}

.pass-toggle:hover { color: var(--text); background: var(--border); }

.role-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  background: var(--bg);
  position: relative;
}

.role-option:hover {
  border-color: var(--primary-light);
  background: var(--primary-bg);
}

.role-option.active {
  border-color: var(--primary);
  background: var(--primary-bg);
}

.role-icon { font-size: 20px; }

.role-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.role-desc {
  font-size: 11px;
  color: var(--text-muted);
}

.role-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
}

.form-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--danger-light);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: var(--radius);
  color: var(--danger);
  font-size: 13px;
  font-weight: 500;
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow-colored);
  margin-top: 4px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-colored-lg);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.form-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--text-muted);
}

.form-footer a {
  color: var(--primary);
  font-weight: 600;
}

.form-footer a:hover { text-decoration: underline; }

@media (max-width: 900px) {
  .auth-left { display: none; }
  .auth-right { width: 100%; padding: 40px 24px; }
}
</style>
