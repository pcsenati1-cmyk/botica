<template>
  <footer class="footer">
    <div class="footer-cta">
      <div class="cta-blob"></div>
      <div class="cta-particles">
        <div class="particle" v-for="n in 20" :key="n" :style="particleStyle(n)"></div>
      </div>
      <div class="cta-inner">
        <div class="cta-icon" data-aos="zoom-in">
          <Rocket :size="32" />
        </div>
        <h2 data-aos="fade-up" data-aos-delay="100">Listo para transformar tu farmacia?</h2>
        <p data-aos="fade-up" data-aos-delay="200">Unete a mas de 500 farmacias que ya confian en Nova Salud</p>
        <div class="cta-actions" data-aos="fade-up" data-aos-delay="300">
          <router-link to="/register" class="btn-cta-primary">
            <UserPlus :size="18" />
            Crear cuenta gratuita
          </router-link>
          <router-link to="/login" class="btn-cta-secondary">
            <LogIn :size="18" />
            Iniciar sesion
          </router-link>
        </div>
      </div>
    </div>

    <div class="footer-main">
      <div class="footer-container">
        <div class="footer-brand" data-aos="fade-right">
          <div class="brand">
            <div class="brand-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="10" fill="url(#fg1)"/>
                <path d="M16 7v18M7 16h18" stroke="white" stroke-width="3" stroke-linecap="round"/>
                <defs>
                  <linearGradient id="fg1" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stop-color="#6366f1"/>
                    <stop offset="100%" stop-color="#06b6d4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="brand-name">Nova<span>Salud</span></span>
          </div>
          <p>Sistema de gestion farmaceutica para farmacias y boticas modernas del Peru.</p>
          <div class="footer-badges">
            <span class="badge">
              <Lock :size="12" />
              SSL Seguro
            </span>
            <span class="badge">
              <Cloud :size="12" />
              Cloud
            </span>
            <span class="badge">
              <MapPin :size="12" />
              Hecho en Peru
            </span>
          </div>
        </div>

        <div class="footer-links">
          <div 
            class="footer-col" 
            v-for="(col, i) in footerCols" 
            :key="col.title"
            :data-aos="'fade-up'"
            :data-aos-delay="i * 100"
          >
            <h4>
              <component :is="col.icon" :size="14" />
              {{ col.title }}
            </h4>
            <a v-for="link in col.links" :key="link.text" :href="link.href">
              {{ link.text }}
              <ArrowRight :size="12" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-container">
        <p>2026 Nova Salud. Todos los derechos reservados.</p>
        <div class="footer-bottom-links">
          <a href="#">
            <Shield :size="14" />
            Privacidad
          </a>
          <a href="#">
            <FileText :size="14" />
            Terminos
          </a>
          <a href="#">
            <Cookie :size="14" />
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { 
  ArrowRight, Lock, Cloud, MapPin, Rocket, 
  UserPlus, LogIn, Shield, FileText, Cookie,
  Package, Users, Headphones 
} from 'lucide-vue-next'

const footerCols = [
  {
    title: 'Producto',
    icon: Package,
    links: [
      { text: 'Caracteristicas', href: '#caracteristicas' },
      { text: 'Planes', href: '#planes' },
      { text: 'Novedades', href: '#' },
      { text: 'Roadmap', href: '#' },
    ]
  },
  {
    title: 'Empresa',
    icon: Users,
    links: [
      { text: 'Nosotros', href: '#nosotros' },
      { text: 'Blog', href: '#' },
      { text: 'Prensa', href: '#' },
      { text: 'Contacto', href: '#contacto' },
    ]
  },
  {
    title: 'Soporte',
    icon: Headphones,
    links: [
      { text: 'Centro de ayuda', href: '#' },
      { text: 'Documentacion', href: '#' },
      { text: 'Estado del sistema', href: '#' },
      { text: 'Comunidad', href: '#' },
    ]
  },
]

function particleStyle(n) {
  const angle = (n / 20) * 360
  const distance = 100 + Math.random() * 100
  return {
    '--x': `${Math.cos(angle * Math.PI / 180) * distance}px`,
    '--y': `${Math.sin(angle * Math.PI / 180) * distance}px`,
    '--delay': `${n * 0.1}s`,
    '--duration': `${2 + Math.random() * 2}s`,
  }
}
</script>

<style scoped>
.footer { overflow: hidden; }
.footer-cta {
  background: linear-gradient(160deg, #0f172a 0%, #1e1b4b 100%);
  padding: 100px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.cta-blob {
  position: absolute;
  width: 800px; height: 800px;
  background: radial-gradient(circle, rgba(99,102,241,0.3), transparent);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  animation: blobPulse 8s ease-in-out infinite;
}
@keyframes blobPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
}
.cta-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: rgba(99,102,241,0.6);
  border-radius: 50%;
  animation: particleFly var(--duration) ease-out infinite;
  animation-delay: var(--delay);
}
@keyframes particleFly {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  20% { transform: translate(calc(-50% + var(--x) * 0.2), calc(-50% + var(--y) * 0.2)) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0); opacity: 0; }
}
.cta-inner {
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
}
.cta-icon {
  width: 72px; height: 72px;
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 24px;
  box-shadow: 0 12px 40px rgba(99,102,241,0.4);
  animation: iconBounce 2s ease-in-out infinite;
}
@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.cta-inner h2 {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 800;
  color: white;
  letter-spacing: -1.5px;
  margin-bottom: 16px;
}
.cta-inner p {
  font-size: 18px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 36px;
}
.cta-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn-cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #6366f1, #06b6d4);
  color: white;
  font-weight: 700;
  font-size: 16px;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(99,102,241,0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}
.btn-cta-primary:hover { 
  transform: translateY(-4px) scale(1.02); 
  box-shadow: 0 20px 50px rgba(99,102,241,0.5);
}
.btn-cta-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 28px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-weight: 600;
  font-size: 16px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s;
  text-decoration: none;
}
.btn-cta-secondary:hover { 
  background: rgba(255,255,255,0.15); 
  transform: translateY(-2px);
}

.footer-main {
  background: #020617;
  padding: 80px 24px 0;
}
.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  gap: 80px;
}
.footer-brand { flex: 1.2; }
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.brand-icon {
  transition: transform 0.3s;
}
.brand:hover .brand-icon { transform: rotate(10deg) scale(1.05); }
.brand-name {
  font-size: 22px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
}
.brand-name span { color: #818cf8; }
.footer-brand p {
  font-size: 15px;
  color: #475569;
  line-height: 1.7;
  max-width: 280px;
  margin-bottom: 24px;
}
.footer-badges { display: flex; gap: 10px; flex-wrap: wrap; }
.badge {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  background: #0f172a;
  border: 1px solid #1e293b;
  color: #64748b;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.footer-links {
  flex: 2;
  display: flex;
  gap: 60px;
}
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}
.footer-col h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}
.footer-col a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #475569;
  transition: all 0.2s;
  text-decoration: none;
}
.footer-col a:hover { 
  color: #818cf8; 
  transform: translateX(4px);
}

.footer-bottom {
  background: #020617;
  border-top: 1px solid #0f172a;
  padding: 24px 24px;
}
.footer-bottom .footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
}
.footer-bottom p { font-size: 13px; color: #334155; }
.footer-bottom-links { display: flex; gap: 24px; }
.footer-bottom-links a {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #334155;
  transition: color 0.2s;
  text-decoration: none;
}
.footer-bottom-links a:hover { color: #818cf8; }

@media (max-width: 1024px) {
  .footer-container { flex-direction: column; gap: 48px; }
  .footer-links { flex-wrap: wrap; gap: 40px; }
}
@media (max-width: 640px) {
  .footer-main { padding: 48px 24px 0; }
  .cta-actions { flex-direction: column; align-items: center; }
  .btn-cta-primary, .btn-cta-secondary { width: 100%; max-width: 280px; justify-content: center; }
  .footer-bottom .footer-container { flex-direction: column; gap: 16px; text-align: center; }
  .footer-bottom-links { flex-wrap: wrap; justify-content: center; gap: 16px; }
}
</style>