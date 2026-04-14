<template>
  <section class="hero" id="inicio">
    <div class="hero-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="hero-grid"></div>
      <div class="floating-shapes">
        <div class="shape s1"></div>
        <div class="shape s2"></div>
        <div class="shape s3"></div>
      </div>
    </div>

    <div class="hero-inner">
      <div class="hero-content">
        <div class="hero-badge" data-aos="fade-down">
          <span class="badge-dot"></span>
          Sistema #1 para farmacias y boticas en Peru
        </div>

        <h1 class="hero-title" data-aos="fade-up" data-aos-delay="100">
          Gestiona tu farmacia<br/>
          <span class="gradient-text">de forma inteligente</span>
        </h1>

        <p class="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
          Control total de inventario, ventas y reportes en tiempo real.
          Disenado para farmacias y boticas que quieren crecer sin complicaciones.
        </p>

        <div class="hero-actions" data-aos="fade-up" data-aos-delay="300">
          <router-link to="/register" class="btn-primary-hero">
            Comenzar gratis
            <ArrowRight :size="18" />
          </router-link>
          <router-link to="/login" class="btn-secondary-hero">
            <Play :size="18" />
            Ver demo
          </router-link>
        </div>

        <div class="hero-trust" data-aos="fade-up" data-aos-delay="400">
          <div class="trust-avatars">
            <div class="avatar av1" v-for="n in 4" :key="n" :style="{ animationDelay: `${n * 0.1}s` }">
              {{ ['F', 'B', 'S', '+'][n-1] }}
            </div>
          </div>
          <div class="trust-text">
            <span class="trust-num">500+</span> farmacias confian en nosotros
          </div>
        </div>

        <div class="hero-stats" data-aos="fade-up" data-aos-delay="500">
          <div class="stat-item" v-for="(stat, i) in stats" :key="stat.label" :style="{ animationDelay: `${i * 0.1}s` }">
            <component :is="stat.icon" :size="20" class="stat-icon" />
            <span class="stat-val">{{ stat.value }}</span>
            <span class="stat-lbl">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <div class="hero-visual" data-aos="fade-left" data-aos-delay="300">
        <div class="dashboard-mockup">
          <div class="mockup-bar">
            <div class="dots">
              <span></span><span></span><span></span>
            </div>
            <span class="mockup-title">Nova Salud - Panel de Control</span>
          </div>
          <div class="mockup-body">
            <div class="mockup-stats">
              <div class="ms-card green" v-for="(card, i) in mockCards" :key="i" :style="{ animationDelay: `${i * 0.15}s` }">
                <div class="ms-icon" :class="card.color">
                  <component :is="card.icon" :size="18" />
                </div>
                <div>
                  <div class="ms-val">{{ card.value }}</div>
                  <div class="ms-lbl">{{ card.label }}</div>
                </div>
                <div class="ms-badge up">{{ card.badge }}</div>
              </div>
            </div>
            
            <div class="mockup-chart" data-aos="zoom-in" data-aos-delay="500">
              <div class="chart-header">
                <span class="chart-title">Ventas ultimos 7 dias</span>
                <span class="chart-total">S/ 18,420</span>
              </div>
              <div class="chart-bars">
                <div 
                  class="bar" 
                  v-for="(h, i) in bars" 
                  :key="i" 
                  :class="{ active: i === 5 }"
                  :style="{ height: h + '%', animationDelay: `${i * 0.05}s` }"
                ></div>
              </div>
              <div class="chart-days">
                <span v-for="d in days" :key="d">{{ d }}</span>
              </div>
            </div>

            <div class="mockup-alerts">
              <div class="alert-row" v-for="(alert, i) in alerts" :key="i" :style="{ animationDelay: `${i * 0.2}s` }">
                <span class="alert-dot" :class="alert.color"></span>
                <span class="alert-text">{{ alert.text }}</span>
              </div>
            </div>
          </div>
        </div>

        <Transition name="float">
          <div class="floating-card fc1" v-if="showFloating1">
            <div class="fc-icon-wrap green">
              <CheckCircle :size="20" />
            </div>
            <div>
              <div class="fc-title">Venta registrada</div>
              <div class="fc-sub">S/ 45.00 - hace 2 min</div>
            </div>
          </div>
        </Transition>
        
        <Transition name="float">
          <div class="floating-card fc2" v-if="showFloating2">
            <div class="fc-icon-wrap blue">
              <BarChart3 :size="20" />
            </div>
            <div>
              <div class="fc-title">Reporte listo</div>
              <div class="fc-sub">Mes de Abril 2026</div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <div class="scroll-indicator" @click="scrollToFeatures">
      <Mouse :size="20" />
      <span>Desliza para explorar</span>
      <ChevronDown :size="20" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  ArrowRight, Play, DollarSign, Package, ShoppingCart, 
  CheckCircle, BarChart3, Activity, Clock, Zap, 
  Mouse, ChevronDown 
} from 'lucide-vue-next'

const showFloating1 = ref(false)
const showFloating2 = ref(false)

onMounted(() => {
  setTimeout(() => showFloating1.value = true, 1500)
  setTimeout(() => showFloating2.value = true, 2500)
})

const stats = [
  { icon: Activity, value: '99.9%', label: 'Uptime' },
  { icon: Clock, value: '24/7', label: 'Soporte' },
  { icon: Zap, value: '2 min', label: 'Setup' },
]

const mockCards = [
  { icon: DollarSign, color: 'green', value: 'S/ 3,840', label: 'Ventas hoy', badge: '+12%' },
  { icon: Package, color: 'blue', value: '1,247', label: 'Productos', badge: '+5' },
  { icon: ShoppingCart, color: 'purple', value: '48', label: 'Ventas', badge: '+8%' },
]

const bars = [38, 55, 45, 72, 58, 90, 65]
const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

const alerts = [
  { color: 'red', text: 'Paracetamol 500mg - Stock bajo (3 unid.)' },
  { color: 'yellow', text: 'Amoxicilina - Vence en 15 dias' },
]

function scrollToFeatures() {
  document.getElementById('caracteristicas')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #fafbff 0%, #f0f4ff 60%, #fafbff 100%);
  padding: 120px 24px 80px;
}
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  animation: blobFloat 20s ease-in-out infinite;
}
.blob-1 {
  width: 700px; height: 700px;
  background: radial-gradient(circle, #c7d2fe 0%, #a5b4fc 100%);
  top: -250px; right: -150px;
  opacity: 0.45;
  animation-delay: 0s;
}
.blob-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, #bae6fd 0%, #7dd3fc 100%);
  bottom: -150px; left: -100px;
  opacity: 0.35;
  animation-delay: -5s;
}
.blob-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, #ddd6fe 0%, #c4b5fd 100%);
  top: 40%; left: 40%;
  opacity: 0.25;
  animation-delay: -10s;
}
@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, #6366f118 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 20s linear infinite;
}
@keyframes gridMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(40px); }
}
.floating-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: shapeFloat 15s ease-in-out infinite;
}
.s1 { width: 100px; height: 100px; background: #6366f1; top: 20%; left: 10%; animation-delay: 0s; }
.s2 { width: 60px; height: 60px; background: #06b6d4; top: 60%; right: 15%; animation-delay: -5s; }
.s3 { width: 80px; height: 80px; background: #8b5cf6; bottom: 20%; left: 20%; animation-delay: -10s; }
@keyframes shapeFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(20px, -20px) rotate(180deg); }
}

.hero-inner {
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 64px;
  position: relative;
  z-index: 1;
}
.hero-content { flex: 1; max-width: 560px; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e0e7ff;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 99px;
  margin-bottom: 28px;
  box-shadow: 0 2px 12px rgba(99,102,241,0.12);
  animation: fadeInDown 0.6s ease;
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.badge-dot {
  width: 8px; height: 8px;
  background: #6366f1;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}
.hero-title {
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -2px;
  color: #0f172a;
  margin-bottom: 20px;
  animation: fadeInUp 0.6s ease 0.1s backwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: 17px;
  color: #475569;
  line-height: 1.75;
  margin-bottom: 36px;
  animation: fadeInUp 0.6s ease 0.2s backwards;
}
.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 36px;
  animation: fadeInUp 0.6s ease 0.3s backwards;
}
.btn-primary-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-weight: 700;
  font-size: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(99,102,241,0.38);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}
.btn-primary-hero:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 14px 36px rgba(99,102,241,0.48);
}
.btn-secondary-hero {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: white;
  color: #475569;
  font-weight: 600;
  font-size: 15px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.2s;
  text-decoration: none;
}
.btn-secondary-hero:hover {
  border-color: #6366f1;
  color: #6366f1;
  transform: translateY(-2px);
}
.hero-trust {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  animation: fadeInUp 0.6s ease 0.4s backwards;
}
.trust-avatars { display: flex; }
.avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  margin-left: -10px;
  animation: avatarPop 0.4s ease backwards;
}
.avatar:first-child { margin-left: 0; }
@keyframes avatarPop {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
.av1 { background: linear-gradient(135deg, #6366f1, #4f46e5); }
.av2 { background: linear-gradient(135deg, #10b981, #059669); }
.av3 { background: linear-gradient(135deg, #f59e0b, #d97706); }
.av4 { background: linear-gradient(135deg, #06b6d4, #0891b2); }
.trust-text { font-size: 13px; color: #64748b; }
.trust-num { font-weight: 700; color: #0f172a; }

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  width: fit-content;
  animation: fadeInUp 0.6s ease 0.5s backwards;
}
.stat-item { 
  display: flex; 
  align-items: center; 
  gap: 10px;
  animation: statSlide 0.5s ease backwards;
}
@keyframes statSlide {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.stat-icon { color: #6366f1; }
.stat-val { font-size: 18px; font-weight: 800; color: #0f172a; }
.stat-lbl { font-size: 11px; color: #94a3b8; font-weight: 500; text-transform: uppercase; }

.hero-visual {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
}
.dashboard-mockup {
  background: white;
  border-radius: 20px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  transform: perspective(1200px) rotateY(-6deg) rotateX(2deg);
  transition: transform 0.6s ease;
  animation: mockupFloat 6s ease-in-out infinite;
}
@keyframes mockupFloat {
  0%, 100% { transform: perspective(1200px) rotateY(-6deg) rotateX(2deg); }
  50% { transform: perspective(1200px) rotateY(-3deg) rotateX(1deg); }
}
.dashboard-mockup:hover {
  transform: perspective(1200px) rotateY(0deg) rotateX(0deg);
}

.mockup-bar {
  background: #f8fafc;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e2e8f0;
}
.dots { display: flex; gap: 6px; }
.dots span { width: 10px; height: 10px; border-radius: 50%; }
.dots span:nth-child(1) { background: #ef4444; }
.dots span:nth-child(2) { background: #f59e0b; }
.dots span:nth-child(3) { background: #10b981; }
.mockup-title { font-size: 12px; font-weight: 600; color: #94a3b8; }

.mockup-body { padding: 18px; display: flex; flex-direction: column; gap: 16px; }
.mockup-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.ms-card {
  padding: 14px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  animation: cardPop 0.4s ease backwards;
}
@keyframes cardPop {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.ms-card.green { background: linear-gradient(135deg, #ecfdf5, #d1fae5); }
.ms-card.blue { background: linear-gradient(135deg, #eff6ff, #dbeafe); }
.ms-card.purple { background: linear-gradient(135deg, #faf5ff, #ede9fe); }
.ms-icon { 
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ms-icon.green { background: #d1fae5; color: #059669; }
.ms-icon.blue { background: #dbeafe; color: #2563eb; }
.ms-icon.purple { background: #ede9fe; color: #7c3aed; }
.ms-val { font-size: 16px; font-weight: 800; color: #0f172a; }
.ms-lbl { font-size: 11px; color: #64748b; font-weight: 500; }
.ms-badge {
  position: absolute;
  top: 10px; right: 10px;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 99px;
}
.ms-badge.up { background: #d1fae5; color: #059669; }

.mockup-chart { 
  background: #f8fafc; 
  border-radius: 14px; 
  padding: 16px;
  animation: zoomIn 0.5s ease 0.3s backwards;
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.chart-title { font-size: 12px; font-weight: 600; color: #64748b; }
.chart-total { font-size: 14px; font-weight: 800; color: #0f172a; }
.chart-bars { display: flex; align-items: flex-end; gap: 8px; height: 80px; margin-bottom: 10px; }
.bar {
  flex: 1;
  background: #e0e7ff;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s;
  animation: barGrow 0.6s ease backwards;
}
@keyframes barGrow {
  from { height: 0 !important; }
}
.bar.active { background: linear-gradient(to top, #6366f1, #818cf8); }
.chart-days { display: flex; justify-content: space-between; }
.chart-days span { font-size: 10px; color: #94a3b8; font-weight: 500; flex: 1; text-align: center; }

.mockup-alerts { display: flex; flex-direction: column; gap: 10px; }
.alert-row { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  padding: 10px 12px; 
  background: #fff; 
  border-radius: 10px; 
  border: 1px solid #f1f5f9;
  animation: slideIn 0.4s ease backwards;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.alert-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.alert-dot.red { background: #ef4444; animation: blink 2s infinite; }
.alert-dot.yellow { background: #f59e0b; animation: blink 2s infinite 1s; }
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.alert-text { font-size: 12px; color: #475569; font-weight: 500; }

.floating-card {
  position: absolute;
  background: white;
  border-radius: 16px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border: 1px solid #f1f5f9;
}
.fc1 { bottom: 80px; left: -40px; }
.fc2 { top: 60px; right: -30px; }
.fc-icon-wrap {
  width: 40px; height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fc-icon-wrap.green { background: #d1fae5; color: #059669; }
.fc-icon-wrap.blue { background: #dbeafe; color: #2563eb; }
.fc-title { font-size: 13px; font-weight: 700; color: #0f172a; }
.fc-sub { font-size: 12px; color: #94a3b8; }

.float-enter-active { animation: floatIn 0.5s ease; }
.float-leave-active { animation: floatOut 0.3s ease; }
@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes floatOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  animation: bounce 2s infinite;
  transition: color 0.2s;
}
.scroll-indicator:hover { color: #6366f1; }
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

@media (max-width: 1024px) {
  .hero-inner { gap: 40px; }
}
@media (max-width: 900px) {
  .hero { padding: 110px 24px 60px; }
  .hero-inner { flex-direction: column; text-align: center; }
  .hero-content { max-width: 100%; }
  .hero-subtitle { margin: 0 auto 36px; }
  .hero-actions { justify-content: center; }
  .hero-trust { justify-content: center; }
  .hero-stats { margin: 0 auto; flex-wrap: wrap; justify-content: center; }
  .hero-visual { width: 100%; }
  .dashboard-mockup { transform: none; max-width: 400px; }
  .fc1, .fc2 { display: none; }
  .scroll-indicator { display: none; }
}
</style>