<template>
  <div
    class="d-flex flex-column align-items-start px-3 pt-2 text-dark border-end position-relative"
    id="navbar-left-color"
    style="height: 155vh"
  >
    <a
      href="#"
      class="pb-3 mb-3 text-white text-decoration-none text-center"
      style="width: 100%; margin-top: 6px"
    >
      <span class="fs-5 fw-bold" style="margin-left: -20px">Steel Music</span>
    </a>

    <ul class="nav nav-pills flex-column w-100 mb-5" style="margin-top: -15px;">
      <li class="nav-item" v-for="item in menuItems" :key="item.id">
        <a
          href="#"
          class="nav-link nav-section"
          :class="{ active: activeSection === item.id }"
          @click.prevent="changeSection(item.id)"
        >
          <i :class="item.icon + ' me-2'"></i> {{ item.label }}
        </a>
      </li>

      <li style="display: none">
        <a href="/dashboard/demo">demo</a>
      </li>
    </ul>

    <footer class="mt-auto text-center text-light w-100 py-2">
      © 2025 JearCastApp
    </footer>
  </div>
</template>

<script setup lang="ts">
import { inject, type Ref } from 'vue'

const activeSection = inject('activeSection') as Ref<string>
const changeSection = inject('changeSection') as (section: string) => void

const menuItems = [
  { id: 'home', label: 'Inicio', icon: 'bi bi-house-door' },
  { id: 'favorites', label: 'Favoritos', icon: 'bi bi-heart' },
  { id: 'play-list', label: 'Play List', icon: 'bi bi-music-note-list' },
  { id: 'recommended', label: 'Recomendados', icon: 'bi bi-stars' },
  { id: 'themes', label: 'Colores', icon: 'bi bi-palette' }
]
</script>

<style scoped>
.nav-link.active {
  background-color: #ffffff33;
  border-left: 3px solid #ffffff;
  color: #fff !important;
}
#navbar-left-color {
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
#navbar-left-color a {
  color: rgb(229, 229, 229) !important;
  font-size: 14px;
}
li {
  background-color: #b6b6b650;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.351);
  border-radius: 6px;
  margin-bottom: 10px;
}
li:hover {
  background-color: #c9c9c9ca;
  border-radius: 6px;
}
footer {
  background-color: #8a8a8a50;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.351);
  border-radius: 1.8rem;
  font-size: 13px;
  margin-bottom: 20px;
}
</style>
