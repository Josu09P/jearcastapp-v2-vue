// routes.ts
import { useUserStore } from '@/stores/user'
import { createWebHistory, createRouter } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    component: () => import('@/presentation/pages/home/WelcomePage.vue')
  },
  {
    path: '/auth',
    children: [
      {
        path: 'register',
        component: () => import('@/presentation/pages/auth/RegisterPage.vue')
      },
      {
        path: 'login',
        component: () => import('@/presentation/pages/auth/LoginPage.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('@/presentation/pages/dashboard/DashboardPage.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

/* 
 - Protección de rutas privadas
 - Bloquear acceso a /auth/login si el usuario ya está logueado
*/
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

