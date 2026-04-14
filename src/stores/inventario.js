import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabase'

export const useInventarioStore = defineStore('inventario', () => {
  const productos = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')
  const categoriaFilter = ref('')

  const filteredProductos = computed(() => {
    let result = productos.value
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(p => 
        p.nombre?.toLowerCase().includes(query) ||
        p.codigo_barras?.toLowerCase().includes(query) ||
        p.descripcion?.toLowerCase().includes(query) ||
        p.categoria?.toLowerCase().includes(query)
      )
    }
    
    if (categoriaFilter.value) {
      result = result.filter(p => p.categoria === categoriaFilter.value)
    }
    
    return result
  })

  const productosBajoStock = computed(() => 
    productos.value.filter(p => p.stock < (p.stock_minimo || 5))
  )

  const productosSinStock = computed(() =>
    productos.value.filter(p => p.stock === 0)
  )

  const productosPorVencer = computed(() => {
    const treintaDias = new Date()
    treintaDias.setDate(treintaDias.getDate() + 30)
    return productos.value.filter(p => {
      if (!p.fecha_vencimiento) return false
      return new Date(p.fecha_vencimiento) <= treintaDias
    })
  })

  const categorias = computed(() => {
    const cats = new Set(productos.value.map(p => p.categoria).filter(Boolean))
    return Array.from(cats).sort()
  })

  const totalProductos = computed(() => productos.value.length)

  const valorInventario = computed(() => 
    productos.value.reduce((sum, p) => sum + (p.precio * p.stock), 0)
  )

  async function fetchProductos() {
    try {
      loading.value = true
      error.value = null
      const { data, error: fetchError } = await supabase
        .from('productos')
        .select('*')
        .eq('estado', true)
        .order('nombre', { ascending: true })
      
      if (fetchError) throw fetchError
      productos.value = data || []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function getProductoByCodigo(codigo) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('codigo_barras', codigo)
      .single()
    
    if (error) return null
    return data
  }

  async function updateStock(id, cantidad, tipo = 'entrada') {
    try {
      loading.value = true
      const producto = productos.value.find(p => p.id === id)
      if (!producto) throw new Error('Producto no encontrado')

      const nuevoStock = tipo === 'entrada' 
        ? producto.stock + cantidad 
        : producto.stock - cantidad

      const { data, error } = await supabase
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id', id)
        .select()

      if (error) throw error
      
      const index = productos.value.findIndex(p => p.id === id)
      if (index !== -1) {
        productos.value[index] = data[0]
      }
      
      return data[0]
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createProducto(producto) {
    try {
      loading.value = true
      error.value = null
      const { data, error: createError } = await supabase
        .from('productos')
        .insert([producto])
        .select()
      
      if (createError) throw createError
      productos.value.push(data[0])
      return data[0]
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateProducto(id, producto) {
    try {
      loading.value = true
      error.value = null
      const { data, error: updateError } = await supabase
        .from('productos')
        .update(producto)
        .eq('id', id)
        .select()
      
      if (updateError) throw updateError
      const index = productos.value.findIndex(p => p.id === id)
      if (index !== -1) {
        productos.value[index] = data[0]
      }
      return data[0]
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteProducto(id) {
    try {
      loading.value = true
      error.value = null
      const { error: deleteError } = await supabase
        .from('productos')
        .delete()
        .eq('id', id)
      
      if (deleteError) throw deleteError
      productos.value = productos.value.filter(p => p.id !== id)
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    productos,
    loading,
    error,
    searchQuery,
    categoriaFilter,
    filteredProductos,
    productosBajoStock,
    productosSinStock,
    productosPorVencer,
    categorias,
    totalProductos,
    valorInventario,
    fetchProductos,
    createProducto,
    updateProducto,
    deleteProducto
  }
})