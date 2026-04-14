<template>
  <section class="planes" id="planes">
    <div class="planes-bg">
      <div class="grid-pattern"></div>
    </div>
    
    <div class="container">
      <div class="section-header" data-aos="fade-up">
        <span class="section-tag">
          <Tag :size="14" />
          Planes
        </span>
        <h2>Precios simples y transparentes</h2>
        <p>Sin costos ocultos. Sin contratos. Cancela cuando quieras.</p>

        <div class="billing-toggle">
          <span :class="{ active: !anual }" @click="anual = false">Mensual</span>
          <button class="toggle-btn" @click="anual = !anual" :class="{ on: anual }">
            <span class="toggle-thumb"></span>
          </button>
          <span :class="{ active: anual }" @click="anual = true">
            Anual
            <span class="save-badge">
              <TrendingDown :size="12" />
              Ahorra 20%
            </span>
          </span>
        </div>
      </div>

      <div class="plans-grid">
        <TransitionGroup name="plan">
          <div
            class="plan-card"
            v-for="(plan, i) in plans"
            :key="plan.name"
            :class="{ featured: plan.featured }"
            :style="{ animationDelay: `${i * 0.15}s` }"
            @mouseenter="hoveredPlan = i"
            @mouseleave="hoveredPlan = null"
          >
            <div class="plan-glow" v-if="plan.featured"></div>
            <Transition name="pop">
              <div class="plan-badge" v-if="plan.featured">
                <Star :size="12" />
                Mas popular
              </div>
            </Transition>
            
            <div class="plan-header">
              <div class="plan-icon" :class="plan.iconClass">
                <component :is="plan.icon" :size="28" />
              </div>
              <div class="plan-name">{{ plan.name }}</div>
              <div class="plan-price">
                <span class="currency">S/</span>
                <Transition name="price" mode="out-in">
                  <span class="amount" :key="anual ? plan.priceAnual : plan.price">
                    {{ anual ? plan.priceAnual : plan.price }}
                  </span>
                </Transition>
                <span class="period">/mes</span>
              </div>
              <p class="plan-desc">{{ plan.desc }}</p>
            </div>

            <ul class="plan-features">
              <li 
                v-for="(feat, j) in plan.features" 
                :key="feat.text" 
                :class="{ disabled: !feat.included }"
                :style="{ animationDelay: `${j * 0.05}s` }"
              >
                <Transition name="check" mode="out-in">
                  <CheckCircle2 v-if="feat.included" :size="16" :class="plan.featured ? 'icon-white' : 'icon-green'" />
                  <X v-else :size="16" class="icon-gray" />
                </Transition>
                {{ feat.text }}
              </li>
            </ul>

            <router-link 
              to="/register" 
              :class="plan.featured ? 'btn-plan-featured' : 'btn-plan'"
              @mouseenter="btnHover = i"
              @mouseleave="btnHover = null"
            >
              <component :is="btnHover === i ? ArrowRight : (plan.featured ? Check : User)" :size="16" />
              {{ plan.cta }}
            </router-link>
          </div>
        </TransitionGroup>
      </div>

      <div class="plans-footer" data-aos="fade-up" data-aos-delay="300">
        <div class="pf-item" v-for="(g, i) in guarantees" :key="g.text" :style="{ animationDelay: `${i * 0.1}s` }">
          <div class="pf-icon" :class="`pf-${i}`">
            <component :is="g.icon" :size="18" />
          </div>
          <span>{{ g.text }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Star, CheckCircle2, X, Shield, RotateCcw, XCircle, Headphones, 
  Leaf, Rocket, Building2, Tag, TrendingDown, ArrowRight, User, Check
} from 'lucide-vue-next'

const anual = ref(false)
const hoveredPlan = ref(null)
const btnHover = ref(null)

const plans = [
  {
    icon: Leaf,
    iconClass: 'icon-leaf',
    name: 'Basico',
    price: '0',
    priceAnual: '0',
    desc: 'Perfecto para empezar sin costo',
    features: [
      { text: 'Hasta 100 productos', included: true },
      { text: '1 usuario', included: true },
      { text: 'Ventas ilimitadas', included: true },
      { text: 'Reportes basicos', included: true },
      { text: 'Alertas de stock', included: false },
      { text: 'Soporte prioritario', included: false },
    ],
    cta: 'Empezar gratis',
    featured: false
  },
  {
    icon: Rocket,
    iconClass: 'icon-rocket',
    name: 'Profesional',
    price: '89',
    priceAnual: '71',
    desc: 'Para farmacias en crecimiento',
    features: [
      { text: 'Productos ilimitados', included: true },
      { text: 'Hasta 5 usuarios', included: true },
      { text: 'Ventas ilimitadas', included: true },
      { text: 'Analytics avanzados', included: true },
      { text: 'Alertas de stock y vencimiento', included: true },
      { text: 'Soporte prioritario', included: true },
    ],
    cta: 'Comenzar ahora',
    featured: true
  },
  {
    icon: Building2,
    iconClass: 'icon-building',
    name: 'Empresarial',
    price: '199',
    priceAnual: '159',
    desc: 'Para cadenas de farmacias',
    features: [
      { text: 'Todo en Profesional', included: true },
      { text: 'Usuarios ilimitados', included: true },
      { text: 'Multi-sucursal', included: true },
      { text: 'API access', included: true },
      { text: 'Reportes personalizados', included: true },
      { text: 'Soporte 24/7 dedicado', included: true },
    ],
    cta: 'Contactar ventas',
    featured: false
  },
]

const guarantees = [
  { icon: Shield, text: 'Pago 100% seguro' },
  { icon: RotateCcw, text: '30 dias de garantia' },
  { icon: XCircle, text: 'Sin contratos' },
  { icon: Headphones, text: 'Soporte en espanol' },
]
</script>

<style scoped>
.planes {
  background: #ffffff;
  padding: 100px 24px;
  position: relative;
  overflow: hidden;
}
.planes-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}
.container {
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
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
  margin-bottom: 12px;
}
.section-header p {
  font-size: 18px;
  color: #64748b;
  margin-bottom: 28px;
}
.billing-toggle {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
}
.billing-toggle span {
  transition: color 0.2s;
}
.billing-toggle span.active { 
  color: #0f172a; 
}
.toggle-btn {
  width: 52px; height: 28px;
  background: #e2e8f0;
  border-radius: 99px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background 0.3s;
}
.toggle-btn.on { 
  background: linear-gradient(135deg, #6366f1, #4f46e5); 
}
.toggle-thumb {
  position: absolute;
  top: 3px; left: 3px;
  width: 22px; height: 22px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.toggle-btn.on .toggle-thumb { transform: translateX(24px); }
.save-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #059669;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
  margin-left: 8px;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;
  margin-bottom: 48px;
}
.plan-card {
  background: white;
  border-radius: 28px;
  border: 1px solid #e2e8f0;
  padding: 36px 32px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: planFadeIn 0.6s ease backwards;
}
@keyframes planFadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.plan-card:hover {
  border-color: #e0e7ff;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
  transform: translateY(-8px);
}
.plan-card.featured {
  background: linear-gradient(160deg, #6366f1 0%, #4f46e5 100%);
  border-color: transparent;
  color: white;
  transform: scale(1.04);
  box-shadow: 0 30px 80px rgba(99,102,241,0.35);
  z-index: 1;
}
.plan-card.featured:hover { 
  transform: scale(1.04) translateY(-8px); 
}
.plan-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 200%;
  height: 100%;
  background: radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%);
  pointer-events: none;
}
.plan-badge {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 18px;
  border-radius: 99px;
  white-space: nowrap;
  box-shadow: 0 6px 20px rgba(245,158,11,0.4);
  display: flex;
  align-items: center;
  gap: 4px;
}

.plan-header { margin-bottom: 28px; }
.plan-icon {
  width: 60px; height: 60px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.3s;
}
.plan-card:hover .plan-icon { transform: scale(1.1) rotate(5deg); }
.icon-leaf { background: linear-gradient(135deg, #ecfdf5, #d1fae5); color: #059669; }
.icon-rocket { background: linear-gradient(135deg, #eff6ff, #dbeafe); color: #2563eb; }
.icon-building { background: linear-gradient(135deg, #fdf4ff, #fae8ff); color: #c026d3; }
.plan-name {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #6366f1;
  margin-bottom: 12px;
}
.plan-card.featured .plan-name { color: rgba(255,255,255,0.8); }
.plan-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}
.currency { font-size: 22px; font-weight: 700; color: #0f172a; }
.amount { font-size: 60px; font-weight: 800; color: #0f172a; letter-spacing: -3px; line-height: 1; }
.period { font-size: 15px; color: #94a3b8; }
.plan-card.featured .currency,
.plan-card.featured .amount { color: white; }
.plan-card.featured .period { color: rgba(255,255,255,0.6); }
.plan-desc { font-size: 15px; color: #64748b; }
.plan-card.featured .plan-desc { color: rgba(255,255,255,0.8); }

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 32px;
}
.plan-features li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #475569;
  transition: all 0.2s;
  animation: featureFade 0.4s ease backwards;
}
@keyframes featureFade {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.plan-features li:hover { 
  color: #0f172a; 
  transform: translateX(4px);
}
.plan-features li.disabled { color: #94a3b8; }
.plan-card.featured .plan-features li { color: rgba(255,255,255,0.9); }
.plan-card.featured .plan-features li.disabled { color: rgba(255,255,255,0.4); }
.icon-green { color: #10b981; }
.icon-white { color: white; }
.icon-gray { color: #94a3b8; }

.btn-plan, .btn-plan-featured {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}
.btn-plan { 
  background: #f1f5f9; 
  color: #475569; 
}
.btn-plan:hover { 
  background: #e0e7ff; 
  color: #6366f1; 
  transform: translateY(-2px);
}
.btn-plan-featured { 
  background: white; 
  color: #6366f1; 
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}
.btn-plan-featured:hover { 
  background: #f0f4ff; 
  transform: translateY(-2px) scale(1.02);
}

.plans-footer {
  display: flex;
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
  padding: 32px;
  background: linear-gradient(135deg, #fafbff, #f8fafc);
  border-radius: 20px;
  border: 1px solid #f1f5f9;
}
.pf-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  animation: pfFadeIn 0.5s ease backwards;
}
@keyframes pfFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.pf-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pf-0 { background: #d1fae5; color: #059669; }
.pf-1 { background: #dbeafe; color: #2563eb; }
.pf-2 { background: #fee2e2; color: #dc2626; }
.pf-3 { background: #fef3c7; color: #d97706; }

/* Transitions */
.pop-enter-active, .pop-leave-active { transition: all 0.3s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateX(-50%) scale(0.8); }
.price-enter-active, .price-leave-active { transition: all 0.2s ease; }
.price-enter-from, .price-leave-to { opacity: 0; transform: translateY(-10px); }
.check-enter-active, .check-leave-active { transition: all 0.2s ease; }
.check-enter-from, .check-leave-to { opacity: 0; transform: scale(0); }

@media (max-width: 1024px) {
  .plans-grid { 
    grid-template-columns: 1fr; 
    max-width: 420px; 
    margin: 0 auto 48px; 
  }
  .plan-card.featured { transform: none; }
  .plan-card.featured:hover { transform: translateY(-8px); }
}
</style>