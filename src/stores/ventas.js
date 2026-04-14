import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabase'
import { useAuthStore } from './auth'
import { useInventarioStore } from './inventario'

const handleSupabaseError = (error, context = '') => {
  if (!error) return 'Error desconocido'
  if (error.code) return `Error ${error.code}: ${error.message}`
  if (error.details) return `${context}: ${error.details}`
  return error.message || context || 'Error desconocido'
}

export const useVentasStore = defineStore('ventas', () => {
  const ventas = ref([])
  const loading = ref(false)
  const error = ref(null)
  const lastUpdated = ref(null)

  const ventasDelDia = computed(() => {
    const hoy = new Date().toISOString().split('T')[0]
    return ventas.value.filter(v => v.fecha?.startsWith(hoy))
  })

  const totalVendidoDia = computed(() => {
    return ventasDelDia.value.reduce((sum, v) => sum + (v.total || 0), 0)
  })

  const ventasUltimoMes = computed(() => {
    const treintaDias = new Date()
    treintaDias.setDate(treintaDias.getDate() - 30)
    return ventas.value.filter(v => new Date(v.fecha) >= treintaDias)
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

  async function fetchVentas(includeDetails = true) {
    try {
      loading.value = true
      error.value = null
      
      if (includeDetails) {
        const { data: ventasData, error: ventasError } = await supabase
          .from('ventas')
          .select(`
            *,
            detalles:detalle_ventas(*),
            usuario:usuarios(*)
          `)
          .order('fecha', { ascending: false })
        
        if (ventasError) throw ventasError
        ventas.value = ventasData || []
      } else {
        const { data: ventasData, error: ventasError } = await supabase
          .from('ventas')
          .select('*')
          .order('fecha', { ascending: false })
        
        if (ventasError) throw ventasError
        ventas.value = ventasData || []
      }
      
      lastUpdated.value = new Date().toISOString()
    } catch (e) {
      error.value = handleSupabaseError(e, 'Error al cargar ventas')
    } finally {
      loading.value = false
    }
  }

  async function crearVenta(carrito, usuarioId, metodoPago = 'efectivo') {
    const inventarioStore = useInventarioStore()
    
    try {
      loading.value = true
      error.value = null

      if (!carrito || carrito.length === 0) {
        throw new Error('El carrito está vacío')
      }

      for (const item of carrito) {
        const producto = inventarioStore.productos.find(p => p.id === item.id)
        if (!producto) {
          throw new Error(`Producto con ID ${item.id} no encontrado`)
        }
        if (producto.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`)
        }
      }

      const total = carousel.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
      
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

      const detallesVenta = carousel.map(item => ({
        venta_id: ventaId,
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        subtotal: item.precio * item.cantidad
      }))

      const { error: detallesError } = await supabase
        .from('detalle_ventas')
        .insert(detallesVenta)
      
      if (detallesError) throw detallesError

      const updates = carousel.map(item => {
        const producto = inventarioStore.productos.find(p => p.id === item.id)
        return {
          id: item.id,
          stock: producto.stock - item.cantidad
        }
      })

      for (const update of updates) {
        const { error: stockError } = await supabase
          .from('productos')
          .update({ stock: update.stock })
          .eq('id', update.id)
        
        if (stockError) {
          console.error(`Error actualizando stock del producto ${update.id}:`, stockError)
        }
      }

      await inventarioStore.fetchProductos()
      await fetchVentas(false)
      
      return { ...ventaData[0], detalles: detallesVenta }
    } catch (e) {
      error.value = handleSupabaseError(e, 'Error al crear venta')
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