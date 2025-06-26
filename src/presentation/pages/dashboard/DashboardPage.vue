<template>
  <DashboardLayout>
    <section id="home" v-show="activeSection === 'home'">
      <HomeView />
    </section>
    <section id="favorites" v-show="activeSection === 'favorites'">
      <FavoritesView />
    </section>
    <section id="play-list" v-show="activeSection === 'play-list'">
      <PlayListView />
    </section>
    <section id="recommended" v-show="activeSection === 'recommended'">
      <RecommendedView />
    </section>
    <section id="themes" v-show="activeSection === 'themes'">
      <ThemesView />
    </section>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import ThemesView from '@/presentation/widgets/views/ThemesView.vue'
import FavoritesView from '@/presentation/widgets/views/FavoritesView.vue'
import RecommendedView from '@/presentation/widgets/views/RecommendedView.vue'
import HomeView from '@/presentation/widgets/views/HomeView.vue'
import PlayListView from '@/presentation/widgets/views/PlayListView.vue'

const activeSection = ref('home')

const validSections = ['home', 'favorites', 'play-list', 'recommended', 'themes']

const handleHashChange = () => {
  const hash = window.location.hash.replace('#', '')
  if (validSections.includes(hash)) {
    activeSection.value = hash
  }
}

onMounted(() => {
  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
})
</script>
