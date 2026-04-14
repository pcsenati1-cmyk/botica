<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="show" class="backdrop" @click.self="$emit('close')">
        <div class="modal animate-scale">
          <div class="check-circle">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="22" fill="#d1fae5"/>
              <path d="M13 22l7 7 11-13" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3>¡Venta Registrada!</h3>
          <p>Venta <strong>#{{ ventaId }}</strong> completada exitosamente</p>
          <div class="detail-box">
            <div class="d-row"><span>Total cobrado</span><strong>S/ {{ total }}</strong></div>
            <div class="d-row"><span>Método de pago</span><strong>{{ metodo }}</strong></div>
            <div class="d-row"><span>Fecha y hora</span><strong>{{ fecha }}</strong></div>
          </div>
          <button class="btn-ok" @click="$emit('close')">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7l4 4 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Aceptar
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({ show: Boolean, ventaId: [Number, String], total: String, metodo: String, fecha: String })
defineEmits(['close'])
</script>

<style scoped>
.backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
.modal { background: var(--card-bg); border-radius: 22px; padding: 36px; max-width: 360px; width: 90%; text-align: center; box-shadow: var(--shadow-xl); }
.check-circle { margin-bottom: 16px; }
.modal h3 { font-size: 20px; font-weight: 800; color: var(--text); margin: 0 0 6px; }
.modal p { font-size: 13px; color: var(--text-muted); margin: 0 0 18px; }
.detail-box { background: var(--bg); border-radius: 11px; padding: 14px; margin-bottom: 20px; }
.d-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); padding: 4px 0; }
.d-row strong { color: var(--text); font-weight: 700; }
.btn-ok {
  width: 100%; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 7px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white; border: none; border-radius: 11px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.btn-ok:hover { transform: translateY(-1px); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
