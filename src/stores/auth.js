import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, auth } from '@/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.user_metadata?.role === 'administrador')
  const isEmpleado = computed(() => user.value?.user_metadata?.role === 'empleado')

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
      error.value = e.message
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
      return data
    } catch (e) {
      error.value = e.message
      throw e
    }
  }

  async function signOut() {
    try {
      error.value = null
      const { error: signOutError } = await auth.signOut()
      if (signOutError) throw signOutError
      user.value = null
    } catch (e) {
      error.value = e.message
      throw e
    }
  }

  auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isEmpleado,
    initialize,
    signUp,
    signIn,
    signOut
  }
})