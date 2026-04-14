import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, auth } from '@/supabase'

const handleSupabaseError = (error, context = '') => {
  if (!error) return 'Error desconocido'
  if (error.code) return `Error ${error.code}: ${error.message}`
  return error.message || context || 'Error desconocido'
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userProfile = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
const isAdmin = computed(() => 
  userProfile.value?.rol === 'administrador' || 
  user.value?.user_metadata?.rol === 'administrador'
)
const isVendedor = computed(() => 
  userProfile.value?.rol === 'vendedor' || 
  user.value?.user_metadata?.rol === 'vendedor'
)

  async function initialize() {
    try {
      loading.value = true
      const { data: { session } } = await auth.getSession()
      if (session) {
        user.value = session.user
      }
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
    
    if (user.value) {
      await fetchUserProfile(user.value.id)
    }
  }

  async function fetchUserProfile(authId) {
    try {
      const { data, error: fetchError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', authId)
        .single()
      
      if (fetchError) throw fetchError
      userProfile.value = data
    } catch (e) {
      console.error('Error fetching user profile:', e)
    }
  }

  async function signUp(email, password, nombre, rol) {
    try {
      error.value = null
      const { data, error: signUpError } = await auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre,
            rol
          }
        }
      })
      if (signUpError) throw signUpError
      return data
    } catch (e) {
      error.value = handleSupabaseError(e, 'Error al registrar')
      throw e
    }
  }

  async function signIn(email, password) {
    try {
      error.value = null
      const { data, error: signInError } = await auth.signInWithPassword({
        email,
        password
      })
      if (signInError) throw signInError
      user.value = data.user
      await fetchUserProfile(data.user.id)
      return data
    } catch (e) {
      error.value = handleSupabaseError(e, 'Error al iniciar sesión')
      throw e
    }
  }

  async function signOut() {
    try {
      error.value = null
      const { error: signOutError } = await auth.signOut()
      if (signOutError) throw signOutError
      user.value = null
      userProfile.value = null
    } catch (e) {
      error.value = handleSupabaseError(e, 'Error al cerrar sesión')
      throw e
    }
  }

  auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      user.value = session.user
      fetchUserProfile(session.user.id)
    } else {
      user.value = null
      userProfile.value = null
    }
  })

  return {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isVendedor,
    initialize,
    fetchUserProfile,
    signUp,
    signIn,
    signOut
  }
})