<template>
  <nav class="navbar navbar-expand-lg sticky-top border-bottom" id="navbar-top-color" style="padding: 0 20px;">
    <div class="container-fluid d-flex flex-wrap justify-content-between align-items-center">
      <!-- Logo -->
      <div class="d-flex align-items-center me-3">
        <img :src="logo" width="90" alt="Logo" style="filter: brightness(0) invert(1); margin: 10px 60px 10px 10px;" class="me-4" />
        <button class="btn d-flex align-items-center justify-content-center" id="toggle-sidebar-btn"
          title="Ocultar menú" style="background-color: aliceblue; width: 30px; height: 30px;" @click="toggleSidebar">
          <i class="bi bi-speaker fs-4" style="color: black;"></i>
        </button>
      </div>



      <!-- Usuario y logout -->
      <div class="d-flex align-items-center order-2 order-lg-3 mt-2 mt-lg-0">
        <span class="me-3" style="color: rgb(229, 229, 229); font-size: 14px;">
          {{ userName }}
        </span>
        <button class="btn btn-sm" title="Cerrar sesión" style="color: rgb(229, 229, 229);" @click="logout">
          <i class="bi bi-door-closed-fill"></i>
        </button>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import Swal from 'sweetalert2'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user' // ✅ Importar store
const router = useRouter()
const logo = new URL('@/assets/img/logo-v3.png', import.meta.url).href
const userStore = useUserStore()

onMounted(() => {
  userStore.loadUserFromLocalStorage() // ✅ carga desde localStorage al store

  // Restaurar estado del sidebar
  const sidebar = document.getElementById('navbar-left-color')
  const mainContent = document.getElementById('main-content')
  const sidebarState = localStorage.getItem('sidebarState') || 'shown'

  if (sidebar && mainContent && sidebarState === 'hidden') {
    sidebar.classList.add('d-none')
    mainContent.classList.remove('col-md-9', 'col-lg-10')
    mainContent.classList.add('col-12')
  }
})

const userName = computed(() => userStore.name) // ✅ reactivo

const toggleSidebar = () => {
  const sidebar = document.getElementById('navbar-left-color')
  const mainContent = document.getElementById('main-content')

  if (!sidebar || !mainContent) return

  const isHidden = sidebar.classList.toggle('d-none')

  if (isHidden) {
    mainContent.classList.remove('col-md-9', 'col-lg-10')
    mainContent.classList.add('col-12')
    localStorage.setItem('sidebarState', 'hidden')
  } else {
    mainContent.classList.remove('col-12')
    mainContent.classList.add('col-md-9', 'col-lg-10')
    localStorage.setItem('sidebarState', 'shown')
  }
}

const logout = async () => {
  const result = await Swal.fire({
    title: '¿Cerrar sesión?',
    text: 'Tu sesión se cerrará y volverás al login.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    customClass: {
      popup: 'glass-modal',
      title: 'text-white',
      htmlContainer: 'text-white',
      confirmButton: 'btn btn-danger me-2',
      cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
  })

  if (result.isConfirmed) {
    userStore.logout() // ✅ logout desde el store
    router.push('/auth/login').then(() => {
      window.location.reload()
    })
  }
}
</script>

<style scoped>
nav.navbar {
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
</style>
