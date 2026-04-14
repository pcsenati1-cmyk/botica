<template>
  <section class="caracteristicas" id="caracteristicas">
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <span class="section-tag">
          <Sparkles :size="14" />
          Caracteristicas
        </span>
        <h2>Todo lo que necesita tu farmacia</h2>
        <p>Una plataforma completa que simplifica cada aspecto de la gestion diaria de tu negocio.</p>
      </div>

      <!-- Features Carousel for Mobile -->
      <div class="carousel-container">
        <div class="carousel-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div class="carousel-slide" v-for="(feature, i) in features" :key="i">
            <div class="feature-card" :class="{ featured: feature.featured }">
              <div class="feature-icon" :class="feature.iconClass">
                <component :is="feature.icon" :size="28" />
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.desc }}</p>
              <div v-if="feature.tags" class="feature-tags">
                <span v-for="t in feature.tags" :key="t" class="tag">{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="carousel-dots">
          <button 
            v-for="(_, i) in features" 
            :key="i"
            class="dot" 
            :class="{ active: currentSlide === i }"
            @click="currentSlide = i"
          ></button>
        </div>
      </div>

      <!-- Desktop Grid -->
      <div class="features-grid desktop-only">
        <TransitionGroup name="feature">
          <div 
            class="feature-card" 
            v-for="(f, i) in features" 
            :key="f.title"
            :class="{ featured: f.featured }"
            :style="{ animationDelay: `${i * 0.1}s` }"
            @mouseenter="hoveredCard = i"
            @mouseleave="hoveredCard = null"
          >
            <div class="card-shine" v-if="hoveredCard === i"></div>
            <div class="feature-icon" :class="f.iconClass">
              <component :is="f.icon" :size="24" />
            </div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
            <div v-if="f.tags" class="feature-tags">
              <span v-for="t in f.tags" :key="t" class="tag">{{ t }}</span>
            </div>
            <div class="card-arrow" v-if="f.featured">
              <ArrowRight :size="16" />
            </div>
          </div>
        </TransitionGroup>
      </div>

      <div class="features-cta" data-aos="fade-up" data-aos-delay="300">
        <p>Quieres ver todo en accion?</p>
        <router-link to="/register" class="btn-features">
          Probar gratis por 30 dias
          <ArrowRight :size="16" />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Package, ShoppingCart, BarChart3, Users, AlertCircle, Cloud,
  Sparkles, ArrowRight
} from 'lucide-vue-next'

const currentSlide = ref(0)
const hoveredCard = ref(null)
let autoplayInterval = null

const features = [
  {
    icon: Package,
    iconClass: 'icon-blue',
    title: 'Control de Inventario',
    desc: 'Gestiona tu stock en tiempo real. Alertas automaticas cuando los productos estan por agotarse o vencer.',
    tags: ['Stock en tiempo real', 'Alertas automaticas'],
    featured: false
  },
  {
    icon: ShoppingCart,
    iconClass: 'icon-green',
    title: 'Punto de Venta (POS)',
    desc: 'Registra ventas en segundos con busqueda inteligente, carrito de compras y multiples metodos de pago.',
    tags: ['Rapido', 'Multi-pago'],
    featured: true
  },
  {
    icon: BarChart3,
    iconClass: 'icon-sky',
    title: 'Reportes y Analytics',
    desc: 'Visualiza el rendimiento de tu negocio con graficas interactivas y estadisticas en tiempo real.',
    tags: ['Graficas', 'Exportar PDF'],
    featured: false
  },
  {
    icon: Users,
    iconClass: 'icon-purple',
    title: 'Gestion de Usuarios',
    desc: 'Administra roles y permisos. Controla exactamente que puede hacer cada empleado en el sistema.',
    tags: ['Roles', 'Permisos'],
    featured: false
  },
  {
    icon: AlertCircle,
    iconClass: 'icon-yellow',
    title: 'Alertas Inteligentes',
    desc: 'Recibe notificaciones antes de que los productos venzan o el stock llegue al minimo configurado.',
    tags: ['Vencimiento', 'Stock minimo'],
    featured: false
  },
  {
    icon: Cloud,
    iconClass: 'icon-cyan',
    title: '100% en la Nube',
    desc: 'Accede desde cualquier dispositivo, en cualquier lugar. Tus datos siempre seguros y respaldados.',
    tags: ['Multi-dispositivo', 'Backup automatico'],
    featured: false
  },
]

onMounted(() => {
  autoplayInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % features.length
  }, 5000)
})

onUnmounted(() => {
  if (autoplayInterval) clearInterval(autoplayInterval)
})
</script>

<style scoped>
.caracteristicas {
  background: linear-gradient(180deg, #fafbff 0%, #f1f5f9 100%);
  padding: 100px 24px;
  position: relative;
  overflow: hidden;
}
.caracteristicas::before {
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
.section-header {
  text-align: center;
  margin-bottom: 64px;
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
.section-header h2 {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -1.5px;
  margin-bottom: 14px;
}
.section-header p {
  font-size: 18px;
  color: #64748b;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Carousel */
.carousel-container {
  display: none;
  position: relative;
  margin-bottom: 40px;
}
.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.carousel-slide {
  min-width: 100%;
  padding: 0 16px;
}
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e2e8f0;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}
.dot.active {
  background: #6366f1;
  width: 24px;
  border-radius: 4px;
}

/* Desktop Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 56px;
}
.desktop-only { display: grid; }
.feature-card {
  background: white;
  padding: 32px;
  border-radius: 24px;
  border: 1px solid #f1f5f9;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: featureFadeIn 0.6s ease backwards;
}
@keyframes featureFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.feature-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #06b6d4);
  opacity: 0;
  transition: opacity 0.3s;
}
.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shine 0.6s ease;
}
@keyframes shine {
  to { left: 100%; }
}
.feature-card:hover {
  border-color: #e0e7ff;
  box-shadow: 0 20px 60px rgba(99,102,241,0.15);
  transform: translateY(-8px);
}
.feature-card:hover::before { opacity: 1; }
.feature-card.featured {
  background: linear-gradient(160deg, #6366f1 0%, #4f46e5 100%);
  border-color: transparent;
  color: white;
}
.feature-card.featured::before { opacity: 1; background: rgba(255,255,255,0.3); }
.feature-icon {
  width: 60px; height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.3s;
}
.feature-card:hover .feature-icon { transform: scale(1.1) rotate(5deg); }
.icon-blue { background: linear-gradient(135deg, #eef2ff, #e0e7ff); color: #6366f1; }
.icon-green { background: linear-gradient(135deg, #ecfdf5, #d1fae5); color: #059669; }
.icon-sky { background: linear-gradient(135deg, #eff6ff, #dbeafe); color: #0284c7; }
.icon-purple { background: linear-gradient(135deg, #fdf4ff, #fae8ff); color: #c026d3; }
.icon-yellow { background: linear-gradient(135deg, #fffbeb, #fef3c7); color: #d97706; }
.icon-cyan { background: linear-gradient(135deg, #ecfeff, #cffafe); color: #0891b2; }

.feature-card.featured .feature-icon { background: rgba(255,255,255,0.2) !important; color: white !important; }
.feature-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}
.feature-card.featured h3 { color: white; }
.feature-card p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 16px;
}
.feature-card.featured p { color: rgba(255,255,255,0.8); }
.feature-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 99px;
  background: #eef2ff;
  color: #6366f1;
  transition: all 0.2s;
}
.feature-card:hover .tag { transform: scale(1.05); }
.feature-card.featured .tag { background: rgba(255,255,255,0.2); color: white; }
.card-arrow {
  position: absolute;
  bottom: 32px;
  right: 32px;
  width: 32px;
  height: 32px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s;
}
.feature-card.featured:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.features-cta {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
.features-cta p { font-size: 16px; color: #64748b; font-weight: 500; }
.btn-features {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  font-weight: 700;
  font-size: 15px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(99,102,241,0.35);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}
.btn-features:hover { 
  transform: translateY(-3px) scale(1.02); 
  box-shadow: 0 14px 36px rgba(99,102,241,0.45);
}

@media (max-width: 1024px) {
  .desktop-only { display: none; }
  .carousel-container { display: block; }
  .features-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .feature-card { padding: 24px; }
  .section-header h2 { font-size: 28px; }
  .section-header p { font-size: 16px; }
}
</style>