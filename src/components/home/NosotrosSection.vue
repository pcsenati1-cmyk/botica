<template>
  <section class="nosotros" id="nosotros">
    <div class="container">
      <div class="nosotros-inner">
        <div class="nosotros-visual" data-aos="fade-right">
          <div class="visual-card main-card">
            <div class="card-icon-big">
              <Building2 :size="40" />
            </div>
            <h3>Nova Salud</h3>
            <p>Fundada en 2022, somos el sistema de gestion farmaceutica mas confiable del Peru.</p>
            <div class="card-stats">
              <div class="cs-item" v-for="(stat, i) in stats" :key="stat.label" :style="{ animationDelay: `${i * 0.2}s` }">
                <div class="cs-icon" :class="stat.color">
                  <component :is="stat.icon" :size="20" />
                </div>
                <span class="cs-num">{{ stat.value }}</span>
                <span class="cs-lbl">{{ stat.label }}</span>
              </div>
            </div>
          </div>
          
          <Transition name="float">
            <div class="visual-card side-card sc1" v-if="showAwards">
              <div class="sc-icon-wrap gold">
                <Trophy :size="22" />
              </div>
              <div>
                <div class="sc-title">Premio Innovacion</div>
                <div class="sc-sub">Salud Digital 2025</div>
              </div>
            </div>
          </Transition>
          
          <Transition name="float">
            <div class="visual-card side-card sc2" v-if="showAwards">
              <div class="sc-icon-wrap purple">
                <Star :size="22" />
              </div>
              <div>
                <div class="sc-title">4.9 / 5.0</div>
                <div class="sc-sub">Satisfaccion clientes</div>
              </div>
            </div>
          </Transition>
        </div>

        <div class="nosotros-content">
          <div class="section-tag" data-aos="fade-down">
            <Users :size="14" />
            Nosotros
          </div>
          
          <h2 data-aos="fade-up" data-aos-delay="100">
            Tecnologia al servicio<br/>
            <span class="gradient-text">de la salud</span>
          </h2>
          
          <p class="lead" data-aos="fade-up" data-aos-delay="200">
            Somos un equipo apasionado por simplificar la gestion de farmacias y boticas en todo el Peru.
            Creemos que la tecnologia debe ser accesible para todos los negocios, sin importar su tamano.
          </p>
          
          <p class="body-text" data-aos="fade-up" data-aos-delay="300">
            Desde Lima hasta las regiones mas remotas, Nova Salud ayuda a farmaceuticos y boticarios
            a controlar su inventario, registrar ventas y tomar mejores decisiones con datos en tiempo real.
          </p>

          <div class="values-grid">
            <div 
              class="value-item" 
              v-for="(v, i) in values" 
              :key="v.title"
              data-aos="fade-up"
              :data-aos-delay="400 + i * 100"
              @mouseenter="hoveredValue = i"
              @mouseleave="hoveredValue = null"
              :class="{ active: hoveredValue === i }"
            >
              <div class="value-icon" :class="v.iconClass">
                <component :is="v.icon" :size="20" />
              </div>
              <div>
                <div class="value-title">{{ v.title }}</div>
                <div class="value-desc">{{ v.desc }}</div>
              </div>
            </div>
          </div>

          <router-link to="/register" class="btn-nosotros" data-aos="fade-up" data-aos-delay="700">
            <Rocket :size="18" />
            Unete a nuestra comunidad
            <ArrowRight :size="16" />
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  Building2, Trophy, Star, Target, Shield, Zap, Heart, 
  ArrowRight, Users, Rocket, Calendar, MapPin
} from 'lucide-vue-next'

const showAwards = ref(false)
const hoveredValue = ref(null)

onMounted(() => {
  setTimeout(() => showAwards.value = true, 800)
})

const stats = [
  { icon: Building2, color: 'blue', value: '500+', label: 'Farmacias' },
  { icon: Calendar, color: 'green', value: '3+', label: 'Anos' },
  { icon: MapPin, color: 'purple', value: '15+', label: 'Ciudades' },
]

const values = [
  { icon: Target, iconClass: 'icon-blue', title: 'Simplicidad', desc: 'Interfaces intuitivas que cualquiera puede usar.' },
  { icon: Shield, iconClass: 'icon-green', title: 'Seguridad', desc: 'Tus datos protegidos con cifrado de nivel bancario.' },
  { icon: Zap, iconClass: 'icon-yellow', title: 'Velocidad', desc: 'Respuestas en milisegundos, sin interrupciones.' },
  { icon: Heart, iconClass: 'icon-purple', title: 'Soporte', desc: 'Equipo humano disponible cuando lo necesites.' },
]
</script>

<style scoped>
.nosotros {
  background: white;
  padding: 100px 24px;
  position: relative;
  overflow: hidden;
}
.nosotros::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}
.container {
  max-width: 1280px;
  margin: 0 auto;
}
.nosotros-inner {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  align-items: center;
}
.nosotros-visual {
  position: relative;
  height: 450px;
}
.visual-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 12px 50px rgba(0,0,0,0.1);
  border: 1px solid #f1f5f9;
  transition: all 0.4s;
}
.main-card {
  position: absolute;
  top: 0; left: 0;
  width: 78%;
  padding: 36px;
  animation: cardFloat 6s ease-in-out infinite;
}
@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.main-card:hover {
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.card-icon-big {
  width: 72px; height: 72px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 16px;
  transition: transform 0.3s;
}
.main-card:hover .card-icon-big { transform: scale(1.1) rotate(5deg); }
.main-card h3 { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 10px; }
.main-card p { font-size: 15px; color: #64748b; line-height: 1.6; margin-bottom: 28px; }
.card-stats { display: flex; gap: 24px; }
.cs-item { 
  display: flex; 
  flex-direction: column; 
  align-items: center;
  text-align: center;
  animation: statPop 0.5s ease backwards;
}
@keyframes statPop {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
.cs-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.cs-icon.blue { background: #dbeafe; color: #2563eb; }
.cs-icon.green { background: #d1fae5; color: #059669; }
.cs-icon.purple { background: #ede9fe; color: #7c3aed; }
.cs-num { display: block; font-size: 24px; font-weight: 800; color: #6366f1; letter-spacing: -1px; }
.cs-lbl { font-size: 12px; color: #94a3b8; font-weight: 500; text-transform: uppercase; }

.side-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  width: 240px;
}
.sc1 { bottom: 100px; right: 0; }
.sc2 { bottom: 0; right: 40px; }
.sc-icon-wrap {
  width: 52px; height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sc-icon-wrap.gold { background: linear-gradient(135deg, #fef3c7, #fcd34d); color: #d97706; }
.sc-icon-wrap.purple { background: linear-gradient(135deg, #f3e8ff, #d8b4fe); color: #9333ea; }
.sc-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.sc-sub { font-size: 13px; color: #94a3b8; }

.nosotros-content {}
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
.nosotros-content h2 {
  font-size: clamp(32px, 3.5vw, 48px);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -1.5px;
  line-height: 1.15;
  margin-bottom: 24px;
}
.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.lead {
  font-size: 17px;
  color: #475569;
  line-height: 1.8;
  margin-bottom: 16px;
  font-weight: 500;
}
.body-text {
  font-size: 15px;
  color: #64748b;
  line-height: 1.8;
  margin-bottom: 36px;
}
.values-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;
}
.value-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s;
  cursor: pointer;
}
.value-item:hover, .value-item.active {
  border-color: #e0e7ff;
  box-shadow: 0 8px 30px rgba(99,102,241,0.12);
  transform: translateX(8px);
}
.value-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.3s;
}
.value-item:hover .value-icon, .value-item.active .value-icon { transform: scale(1.1) rotate(5deg); }
.icon-blue { background: linear-gradient(135deg,#eef2ff,#e0e7ff); color: #6366f1; }
.icon-green { background: linear-gradient(135deg,#ecfdf5,#d1fae5); color: #059669; }
.icon-yellow { background: linear-gradient(135deg,#fffbeb,#fef3c7); color: #d97706; }
.icon-purple { background: linear-gradient(135deg,#fdf4ff,#fae8ff); color: #c026d3; }
.value-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
.value-desc { font-size: 13px; color: #64748b; line-height: 1.5; }
.btn-nosotros {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-weight: 700;
  font-size: 15px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(99,102,241,0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}
.btn-nosotros:hover { 
  transform: translateY(-3px) scale(1.02); 
  box-shadow: 0 14px 36px rgba(99,102,241,0.45);
}

.float-enter-active { animation: floatIn 0.6s ease; }
.float-leave-active { animation: floatOut 0.3s ease; }
@keyframes floatIn {
  from { opacity: 0; transform: translateY(20px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes floatOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-20px) scale(0.9); }
}

@media (max-width: 1024px) {
  .nosotros-inner { grid-template-columns: 1fr; gap: 60px; }
  .nosotros-visual { height: 350px; }
}
@media (max-width: 640px) {
  .values-grid { grid-template-columns: 1fr; }
  .nosotros-visual { height: 280px; }
  .card-stats { flex-wrap: wrap; justify-content: center; }
}
</style>