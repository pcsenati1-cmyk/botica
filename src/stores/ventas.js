import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from './auth'
import { useInventarioStore } from './inventario'

export const useVentasStore = defineStore('ventas', () => {
  const ventas = ref([])
  const loading = ref(false)
  const error = ref(null)

  const ventasDelDia = computed(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return ventas.value.filter(v => v.fecha?.startsWith(hoy))
  })

  const totalVendidoDia = computed(() => {
    return ventasDelDia.value.reduce((sum, v) => sum + (v.total || 0), 0)
  })

  const productosMasVendidos = computed(() => {
    const counts = {}
    ventas.value.forEach(v => {
      if (v.detalles) {
        v.detalles.forEach(d => {
          counts[d.producto_id] = (counts[d.producto_id] || 0) + d.cantidad
        })
      }
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  })

  async function fetchVentas() {
    try {
      loading.value = true
      error.value = null
      
      const { data: ventasData, error: ventasError } = await supabase
        .from('ventas')
        .select('*')
        .order('fecha', { ascending: false })
      
      if (ventasError) throw ventasError
      
      for (let venta of ventasData) {
        const { data: detallesData } = await supabase
          .from('detalle_ventas')
          .select('*')
          .eq('venta_id', venta.id)
        
        venta.detalles = detallesData || []
      }
      
      ventas.value = ventasData || []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function crearVenta(carrito, usuarioId, metodoPago = 'efectivo') {
    try {
      loading.value = true
      error.value = null

      const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
      
      const { data: ventaData, error: ventaError } = await supabase
        .from('ventas')
        .insert([{
          usuario_id: usuarioId,
          total,
          metodo_pago: metodoPago.toUpperCase(),
          fecha: new Date().toISOString()
        }])
        .select()
      
      if (ventaError) throw ventaError
      const ventaId = ventaData[0].id

      const inventarioStore = useInventarioStore()
      
      for (const item of carrito) {
        const { error: detalleError } = await supabase
          .from('detalle_ventas')
          .insert([{
            venta_id: ventaId,
            producto_id: item.id,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
            subtotal: item.precio * item.cantidad
          }])
        
        if (detalleError) throw detalleError

        const producto = inventarioStore.productos.find(p => p.id === item.id)
        if (producto) {
          const nuevoStock = producto.stock - item.cantidad
          await supabase
            .from('productos')
            .update({ stock: nuevoStock })
            .eq('id', item.id)
        }
      }

      await inventarioStore.fetchProductos()
      await fetchVentas()
      
      return ventaData[0]
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    ventas,
    loading,
    error,
    ventasDelDia,
    totalVendidoDia,
    productosMasVendidos,
    fetchVentas,
    crearVenta
  }
})