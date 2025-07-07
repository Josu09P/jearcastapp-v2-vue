// routes.ts
import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/presentation/pages/home/WelcomePage.vue')
  },
  {
    path: '/auth',
    // ✅ Si quieres un layout base para auth (opcional)
    // component: () => import('@/presentation/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/presentation/pages/auth/RegisterPage.vue')
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/presentation/pages/auth/LoginPage.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/presentation/pages/dashboard/DashboardPage.vue')
  }
]

export const router = createRouter({
  history: createWebHashHistory(), // 🔁 hash-based routing para Electron
  routes
})

// 🔐 Protección de rutas privadas
router.beforeEach((to, _from, next) => {
  const store = useUserStore()
  const isLoggedIn = !!store.id

  if (to.path.startsWith('/dashboard') && !isLoggedIn) {
    return next('/auth/login')
  }

  if (to.path.startsWith('/auth') && isLoggedIn) {
    return next('/dashboard')
  }

  next()
})
