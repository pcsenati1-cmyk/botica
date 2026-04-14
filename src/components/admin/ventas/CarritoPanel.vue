<template>
  <div class="carrito">
    <div class="car-header">
      <div>
        <h3>Carrito de Compra</h3>
        <p>{{ items.length }} {{ items.length === 1 ? 'producto' : 'productos' }}</p>
      </div>
      <button v-if="items.length > 0" class="btn-clear-all" @click="$emit('clear')" title="Vaciar carrito">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M2 4h10M5 4V3h4v1M11 4l-.8 8H3.8L3 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Vaciar
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="items.length === 0" class="car-empty">
      <div class="car-empty-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="var(--bg)"/>
          <path d="M12 14h3l4 14h12l3-8H18" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="20" cy="32" r="2" fill="var(--text-muted)"/>
          <circle cx="30" cy="32" r="2" fill="var(--text-muted)"/>
        </svg>
      </div>
      <p>Carrito vacío</p>
      <span>Haz clic en un producto del catálogo para agregarlo</span>
    </div>

    <!-- Items -->
    <div v-else class="car-items">
      <transition-group name="item" tag="div">
        <div v-for="(item, i) in items" :key="item.id" class="car-row">
          <div class="car-av" :style="{ background: color(item.nombre) }">
            {{ item.nombre.charAt(0).toUpperCase() }}
          </div>
          <div class="car-info">
            <span class="car-name">{{ item.nombre }}</span>
            <span class="car-unit">S/ {{ item.precio?.toFixed(2) }} c/u</span>
          </div>
          <div class="car-qty">
            <button class="q-btn" @click="$emit('decrement', i)">−</button>
            <span class="q-num">{{ item.cantidad }}</span>
            <button class="q-btn" @click="$emit('increment', i)">+</button>
          </div>
          <span class="car-sub">S/ {{ (item.precio * item.cantidad).toFixed(2) }}</span>
          <button class="car-del" @click="$emit('remove', i)">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </transition-group>
    </div>

    <!-- Footer con totales y pago -->
    <div v-if="items.length > 0" class="car-footer">
      <div class="totales">
        <div class="tot-row"><span>Subtotal</span><span>S/ {{ subtotal.toFixed(2) }}</span></div>
        <div v-if="descuento > 0" class="tot-row tot-desc">
          <span>Descuento ({{ descuento }}%)</span><span>-S/ {{ montoDescuento.toFixed(2) }}</span>
        </div>
        <div class="tot-row"><span>IGV (18%)</span><span>S/ {{ igv.toFixed(2) }}</span></div>
        <div class="tot-row tot-grand">
          <span>Total a pagar</span>
          <span class="tot-val">S/ {{ total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Método de pago -->
      <div class="metodo-wrap">
        <span class="metodo-label">Método de pago</span>
        <div class="metodo-grid">
          <button
            v-for="m in metodos"
            :key="m.key"
            class="metodo-btn"
            :class="{ active: modelValue === m.key }"
            @click="$emit('update:modelValue', m.key)"
          >
            <span class="m-icon">{{ m.icon }}</span>
            <span class="m-label">{{ m.label }}</span>
          </button>
        </div>
      </div>

      <!-- Confirmar -->
      <button class="btn-confirmar" @click="$emit('confirm')" :disabled="loading">
        <span v-if="loading" class="spinner"></span>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8l4 4 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ loading ? 'Procesando...' : 'Confirmar Venta' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'

const props = defineProps({
  items: Array,
  modelValue: String,
  loading: Boolean,
})
const emit = defineEmits(['add', 'remove', 'increment', 'decrement', 'clear', 'confirm', 'update:modelValue'])

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#3b82f6']
const color = (n) => COLORS[n.charCodeAt(0) % COLORS.length]

const metodos = [
  { key: 'EFECTIVO', icon: '💵', label: 'Efectivo' },
  { key: 'TARJETA', icon: '💳', label: 'Tarjeta' },
  { key: 'TRANSFERENCIA', icon: '📱', label: 'Transferencia' },
]

const descuento = ref(0)
const aplicarDescuento = (porcentaje) => {
  descuento.value = Number(porcentaje) || 0
}

const subtotal = computed(() => props.items.reduce((s, i) => s + i.precio * i.cantidad, 0))
const montoDescuento = computed(() =>subtotal.value * (descuento.value / 100))
const subtotalConDescuento = computed(() => subtotal.value - montoDescuento.value)
const igv = computed(() => subtotalConDescuento.value * 0.18)
const total = computed(() => subtotalConDescuento.value + igv.value)
</script>

<style scoped>
.carrito { display: flex; flex-direction: column; height: 100%; }

.car-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 16px 0; margin-bottom: 4px;
}
.car-header h3 { font-size: 14px; font-weight: 700; color: var(--text); margin: 0 0 2px; }
.car-header p { font-size: 11px; color: var(--text-muted); margin: 0; }
.btn-clear-all {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; font-weight: 600; color: var(--danger);
  background: var(--danger-light); border: none; border-radius: 6px;
  padding: 4px 8px; cursor: pointer; transition: all 0.15s;
}
.btn-clear-all:hover { background: var(--danger-bg); }

/* Empty */
.car-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px; padding: 32px 16px; text-align: center;
}
.car-empty-icon { margin-bottom: 4px; }
.car-empty p { font-size: 14px; font-weight: 700; color: var(--text-secondary); margin: 0; }
.car-empty span { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

/* Items */
.car-items { flex: 1; overflow-y: auto; padding: 8px 12px; }
.car-row {
  display: flex; align-items: center; gap: 8px;
  padding: 9px 4px; border-bottom: 1px solid var(--border);
}
.car-row:last-child { border-bottom: none; }
.car-av {
  width: 28px; height: 28px; border-radius: 7px;
  color: white; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 11px; flex-shrink: 0;
}
.car-info { flex: 1; min-width: 0; }
.car-name { display: block; font-size: 12px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.car-unit { font-size: 10px; color: var(--text-muted); }
.car-qty { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.q-btn {
  width: 22px; height: 22px; border-radius: 6px;
  border: 1px solid var(--border); background: var(--bg);
  cursor: pointer; font-size: 14px; font-weight: 700;
  color: var(--text); display: flex; align-items: center; justify-content: center;
  transition: all 0.15s; line-height: 1;
}
.q-btn:hover { background: var(--primary-bg); border-color: var(--primary); color: var(--primary); }
.q-num { font-size: 12px; font-weight: 700; color: var(--text); min-width: 20px; text-align: center; }
.car-sub { font-size: 12px; font-weight: 700; color: var(--text); min-width: 58px; text-align: right; flex-shrink: 0; }
.car-del {
  width: 22px; height: 22px; border-radius: 6px;
  border: none; background: none; cursor: pointer;
  color: var(--text-muted); display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.car-del:hover { background: var(--danger-light); color: var(--danger); }

/* Footer */
.car-footer { padding: 12px 14px; border-top: 2px solid var(--border); }
.totales { margin-bottom: 14px; }
.tot-row {
  display: flex; justify-content: space-between;
  font-size: 12px; color: var(--text-secondary); padding: 3px 0;
}
.tot-desc { color: var(--success); }
.tot-grand {
  font-size: 15px; font-weight: 800; color: var(--text);
  padding-top: 10px; border-top: 1px solid var(--border); margin-top: 6px;
}
.tot-val { color: var(--primary); font-size: 18px; }

.metodo-wrap { margin-bottom: 14px; }
.metodo-label { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 7px; }
.metodo-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
.metodo-btn {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 7px 4px; border-radius: 8px;
  border: 1.5px solid var(--border); background: var(--bg);
  cursor: pointer; transition: all 0.15s;
}
.m-icon { font-size: 16px; }
.m-label { font-size: 9px; font-weight: 600; color: var(--text-secondary); }
.metodo-btn:hover { border-color: var(--primary); }
.metodo-btn.active { border-color: var(--primary); background: var(--primary-bg); }
.metodo-btn.active .m-label { color: var(--primary); }

.btn-confirmar {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white; border: none; border-radius: 11px;
  font-size: 14px; font-weight: 700; cursor: pointer;
  transition: all 0.2s; box-shadow: var(--shadow-colored);
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-confirmar:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-colored-lg); }
.btn-confirmar:disabled { opacity: 0.7; cursor: not-allowed; }
.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}

/* Transitions */
.item-enter-active { animation: slideInRight 0.2s ease-out; }
.item-leave-active { animation: slideInRight 0.15s ease-in reverse; }
.item-move { transition: transform 0.2s; }
</style>
