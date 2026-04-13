import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabase'

export const useInventarioStore = defineStore('inventario', () => {
  const productos = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  const filteredProductos = computed(() => {
    if (!searchQuery.value) return productos.value
    const query = searchQuery.value.toLowerCase()
    return productos.value.filter(p => 
      p.nombre?.toLowerCase().includes(query) ||
      p.descripcion?.toLowerCase().includes(query)
    )
  })

  const productosBajoStock = computed(() => 
    productos.value.filter(p => p.stock < 5)
  )

  async function fetchProductos() {
    try {
      loading.value = true
      error.value = null
      const { data, error: fetchError } = await supabase
        .from('productos')
        .select('*')
        .order('nombre', { ascending: true })
      
      if (fetchError) throw fetchError
      productos.value = data || []
    } catch (e) {
      error.value = e.message
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
    filteredProductos,
    productosBajoStock,
    fetchProductos,
    createProducto,
    updateProducto,
    deleteProducto
  }
})