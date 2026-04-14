<script setup>
import { ref } from 'vue'
import { supabase, auth } from '@/supabase'

const loading = ref(false)
const mensaje = ref('')
const esError = ref(false)
const email = ref('admin@novasalud.com')
const password = ref('admin123')

async function crearAdmin() {
  loading.value = true
  mensaje.value = ''
  esError.value = false
  
  try {
    // Verificar si el usuario ya existe en auth
    const { data: existingAuth } = await supabase.auth.getUser()
    if (existingAuth.user) {
      // Ya hay sesión activa, primero cerrar
      await supabase.auth.signOut()
    }
    
    // Intentar signUp
    const { data: authData, error: authError } = await auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          nombres: 'Administrador',
          rol: 'administrador'
        }
      }
    })
    
    if (authError) {
      // Si el usuario ya existe, intentar iniciar sesión
      if (authError.message.includes('already been registered')) {
        const { error: signInError } = await auth.signInWithPassword({
          email: email.value,
          password: password.value
        })
        
        if (signInError) throw signInError
        
        mensaje.value = 'El usuario ya existe. Intenta iniciar sesión con esas credenciales.'
        esError.value = false
      } else {
        throw authError
      }
      return
    }
    
    if (!authData.user) {
      throw new Error('No se pudo crear el usuario')
    }
    
    console.log('Auth user created:', authData.user.id)
    
    // Verificar si ya existe en la tabla usuarios
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_id', authData.user.id)
      .single()
    
    if (!existingUser) {
      const { error: dbError } = await supabase.from('usuarios').insert([{
        auth_id: authData.user.id,
        nombres: 'Administrador',
        apellidos: 'Sistema',
        email: email.value,
        rol: 'administrador',
        estado: true
      }])
      
      if (dbError) throw dbError
    }
    
    mensaje.value = 'Usuario admin creado exitosamente!\n\nEmail: ' + email.value + '\nPassword: ' + password.value
    esError.value = false
    
  } catch (e) {
    console.error('Error:', e)
    mensaje.value = 'Error: ' + e.message
    esError.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div style="padding: 40px; max-width: 500px; margin: 50px auto; text-align: center;">
    <h1 style="color: #1e293b;">Crear Usuario Administrador</h1>
    <p style="color: #64748b;">Ejecuta esta página una sola vez para crear el usuario admin.</p>
    
    <div style="margin: 20px 0; padding: 15px; background: #f1f5f9; border-radius: 8px; text-align: left;">
      <p><strong>Email:</strong> {{ email }}</p>
      <p><strong>Password:</strong> {{ password }}</p>
      <p><strong>Rol:</strong> Administrador</p>
    </div>
    
    <button 
      @click="crearAdmin" 
      :disabled="loading"
      style="padding: 14px 28px; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;"
    >
      {{ loading ? 'Creando...' : 'Crear Administrador' }}
    </button>
    
    <div v-if="mensaje" :style="{ 
      marginTop: '20px', 
      padding: '12px', 
      borderRadius: '8px',
      background: esError ? '#fee2e2' : '#d1fae5',
      color: esError ? '#991b1b' : '#065f46'
    }">
      {{ mensaje }}
    </div>
  </div>
</template>