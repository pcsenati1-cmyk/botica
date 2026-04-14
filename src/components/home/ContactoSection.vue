<template>
  <section class="contacto" id="contacto">
    <div class="contacto-bg">
      <div class="bg-shape cs1"></div>
      <div class="bg-shape cs2"></div>
    </div>
    
    <div class="container">
      <div class="contacto-inner">
        <div class="contacto-info" data-aos="fade-right">
          <div class="section-tag">
            <Mail :size="14" />
            Contacto
          </div>
          <h2>Tienes alguna pregunta?</h2>
          <p>Nuestro equipo esta listo para ayudarte. Escribenos y te respondemos en menos de 24 horas.</p>

          <div class="contact-items">
            <div 
              class="contact-item" 
              v-for="(c, i) in contacts" 
              :key="c.label"
              :style="{ animationDelay: `${i * 0.15}s` }"
            >
              <div class="ci-icon" :class="c.iconClass">
                <component :is="c.icon" :size="20" />
              </div>
              <div>
                <div class="ci-label">{{ c.label }}</div>
                <div class="ci-value">{{ c.value }}</div>
              </div>
            </div>
          </div>

          <div class="social-links">
            <a 
              href="#" 
              class="social-btn" 
              v-for="(s, i) in socials" 
              :key="s.name" 
              :title="s.name"
              :style="{ animationDelay: `${i * 0.1}s` }"
            >
              <component :is="s.icon" :size="18" />
            </a>
          </div>
        </div>

        <div class="contacto-form-wrap" data-aos="fade-left" data-aos-delay="200">
          <form class="contacto-form" @submit.prevent="handleSubmit">
            <TransitionGroup name="form-field">
              <div class="form-row" key="row">
                <div class="field" :data-aos="animateFields ? 'fade-up' : ''" :data-aos-delay="0">
                  <label>
                    <User :size="14" />
                    Nombre
                  </label>
                  <input v-model="form.nombre" type="text" placeholder="Tu nombre completo" required />
                </div>
                <div class="field" :data-aos="animateFields ? 'fade-up' : ''" :data-aos-delay="100">
                  <label>
                    <Mail :size="14" />
                    Email
                  </label>
                  <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" required />
                </div>
              </div>
              
              <div class="field" key="asunto" :data-aos="animateFields ? 'fade-up' : ''" :data-aos-delay="200">
                <label>
                  <FileText :size="14" />
                  Asunto
                </label>
                <select v-model="form.asunto">
                  <option value="">Selecciona un asunto</option>
                  <option>Consulta sobre planes</option>
                  <option>Soporte tecnico</option>
                  <option>Demo personalizada</option>
                  <option>Otro</option>
                </select>
              </div>
              
              <div class="field" key="mensaje" :data-aos="animateFields ? 'fade-up' : ''" :data-aos-delay="300">
                <label>
                  <MessageSquare :size="14" />
                  Mensaje
                </label>
                <textarea v-model="form.mensaje" rows="5" placeholder="Cuentanos como podemos ayudarte..." required></textarea>
              </div>
            </TransitionGroup>

            <Transition name="success">
              <div v-if="sent" class="success-msg">
                <CheckCircle :size="20" />
                <span>Mensaje enviado! Te contactaremos pronto.</span>
              </div>
            </Transition>

            <button type="submit" class="btn-submit" :disabled="sending">
              <span v-if="sending" class="spinner"></span>
              <template v-else>
                <Send :size="16" />
                {{ sending ? 'Enviando...' : 'Enviar mensaje' }}
              </template>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  Mail, Phone, MapPin, Facebook, Instagram, MessageCircle, Linkedin, 
  CheckCircle, ArrowRight, User, FileText, MessageSquare, Send
} from 'lucide-vue-next'

const form = ref({ nombre: '', email: '', asunto: '', mensaje: '' })
const sending = ref(false)
const sent = ref(false)
const animateFields = ref(false)

onMounted(() => {
  setTimeout(() => animateFields.value = true, 500)
})

async function handleSubmit() {
  sending.value = true
  await new Promise(r => setTimeout(r, 1500))
  sending.value = false
  sent.value = true
  form.value = { nombre: '', email: '', asunto: '', mensaje: '' }
  setTimeout(() => { sent.value = false }, 5000)
}

const contacts = [
  { icon: Mail, iconClass: 'icon-blue', label: 'Email', value: 'hola@novasalud.pe' },
  { icon: Phone, iconClass: 'icon-green', label: 'Telefono', value: '+51 999 888 777' },
  { icon: MapPin, iconClass: 'icon-yellow', label: 'Direccion', value: 'Lima, Peru' },
]

const socials = [
  { name: 'Facebook', icon: Facebook },
  { name: 'Instagram', icon: Instagram },
  { name: 'WhatsApp', icon: MessageCircle },
  { name: 'LinkedIn', icon: Linkedin },
]
</script>

<style scoped>
.contacto {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 100px 24px;
  position: relative;
  overflow: hidden;
}
.contacto-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
}
.cs1 {
  width: 500px; height: 500px;
  background: #6366f1;
  top: -200px; right: -100px;
}
.cs2 {
  width: 400px; height: 400px;
  background: #06b6d4;
  bottom: -150px; left: -100px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.contacto-inner {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 80px;
  align-items: start;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #eef2ff, #e0e7ff);
  color: #6366f1;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: 99px;
  margin-bottom: 16px;
}
.contacto-info h2 {
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -1.5px;
  line-height: 1.15;
  margin-bottom: 16px;
}
.contacto-info p {
  font-size: 16px;
  color: #64748b;
  line-height: 1.75;
  margin-bottom: 36px;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: white;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s;
  animation: itemSlide 0.5s ease backwards;
}
@keyframes itemSlide {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
.contact-item:hover {
  border-color: #e0e7ff;
  box-shadow: 0 8px 24px rgba(99,102,241,0.1);
  transform: translateX(8px);
}
.ci-icon {
  width: 48px; height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s;
}
.contact-item:hover .ci-icon { transform: scale(1.1) rotate(5deg); }
.icon-blue { background: linear-gradient(135deg,#eef2ff,#e0e7ff); color: #6366f1; }
.icon-green { background: linear-gradient(135deg,#ecfdf5,#d1fae5); color: #059669; }
.icon-yellow { background: linear-gradient(135deg,#fffbeb,#fef3c7); color: #d97706; }
.ci-label { font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.ci-value { font-size: 15px; font-weight: 600; color: #0f172a; }

.social-links { display: flex; gap: 12px; }
.social-btn {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  animation: socialPop 0.4s ease backwards;
}
@keyframes socialPop {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
.social-btn:hover { 
  border-color: #6366f1; 
  color: #6366f1; 
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 20px rgba(99,102,241,0.2);
}

.contacto-form-wrap {
  background: white;
  border-radius: 28px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.08);
  border: 1px solid #f1f5f9;
}
.contacto-form { display: flex; flex-direction: column; gap: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.field { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
}
.field label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px; 
  font-weight: 600; 
  color: #475569; 
}
.field input,
.field select,
.field textarea {
  padding: 14px 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #0f172a;
  background: #fafbff;
  transition: all 0.3s;
  resize: none;
}
.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
  transform: translateY(-2px);
}
.field input::placeholder,
.field textarea::placeholder { color: #94a3b8; }

.success-msg {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  color: #059669;
  font-size: 14px;
  font-weight: 600;
}

.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(99,102,241,0.35);
}
.btn-submit:hover:not(:disabled) { 
  transform: translateY(-3px) scale(1.02); 
  box-shadow: 0 14px 36px rgba(99,102,241,0.45);
}
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transitions */
.form-field-enter-active,
.form-field-leave-active { transition: all 0.4s ease; }
.form-field-enter-from,
.form-field-leave-to { opacity: 0; transform: translateY(20px); }

.success-enter-active,
.success-leave-active { transition: all 0.4s ease; }
.success-enter-from,
.success-leave-to { opacity: 0; transform: scale(0.9); }

@media (max-width: 900px) {
  .contacto-inner { grid-template-columns: 1fr; gap: 48px; }
  .form-row { grid-template-columns: 1fr; }
  .contacto-form-wrap { padding: 28px 20px; }
}
</style>