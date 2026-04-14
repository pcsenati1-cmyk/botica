import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTitle } from '@vueuse/core'

const routes = [
  // ── Pública ──
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/public/HomeView.vue'),
    meta: { requiresAuth: false, title: 'Nova Salud — Botica' }
  },

  // ── Auth ──
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false, title: 'Iniciar Sesión' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { requiresAuth: false, title: 'Crear Cuenta' }
  },

  // ── Admin ──
  {
    path: '/admin',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: { title: 'Panel de Inicio' }
      },
      {
        path: 'ventas',
        name: 'Ventas',
        component: () => import('@/views/admin/VentasView.vue'),
        meta: { title: 'Punto de Venta' }
      },
      {
        path: 'inventario',
        name: 'Inventario',
        component: () => import('@/views/admin/InventarioView.vue'),
        meta: { title: 'Inventario' }
      },
      {
        path: 'alertas',
        name: 'Alertas',
        component: () => import('@/views/admin/AlertasView.vue'),
        meta: { title: 'Alertas de Stock' }
      },
      {
        path: 'reportes',
        name: 'Reportes',
        component: () => import('@/views/admin/ReportesView.vue'),
        meta: { title: 'Reportes' }
      },
      {
        path: 'usuarios',
        name: 'Usuarios',
        component: () => import('@/views/admin/UsuariosView.vue'),
        meta: { requiresAdmin: true, title: 'Usuarios' }
      },
      {
        path: 'productos/nuevo',
        name: 'NuevoProducto',
        component: () => import('@/views/admin/ProductoFormView.vue'),
        meta: { requiresAdmin: true, title: 'Nuevo Producto' }
      },
      {
        path: 'productos/:id/editar',
        name: 'EditarProducto',
        component: () => import('@/views/admin/ProductoFormView.vue'),
        meta: { requiresAdmin: true, title: 'Editar Producto' }
      },
      {
        path: 'crear-admin',
        name: 'CrearAdmin',
        component: () => import('@/views/admin/CrearAdmin.vue'),
        meta: { requiresAuth: false, title: 'Crear Admin' }
      },
    ]
  },

  // ── Catch-all ──
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (authStore.loading) {
    await authStore.initialize()
  }
  
  const isAdmin = authStore.userProfile?.rol === 'administrador' || 
                 authStore.user?.user_metadata?.rol === 'administrador'
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next({ name: 'Dashboard' })
  } else if (['Login', 'Register', 'Home'].includes(to.name) && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    const title = useTitle()
    title.value = to.meta.title ? `${to.meta.title} — Nova Salud` : 'Nova Salud'
    next()
  }
})

export default router
