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
import { ref, provide } from 'vue'

import DashboardLayout from '@/presentation/layouts/DashboardLayout.vue'
import ThemesView from '@/presentation/widgets/views/ThemesView.vue'
import FavoritesView from '@/presentation/widgets/views/FavoritesView.vue'
import RecommendedView from '@/presentation/widgets/views/RecommendedView.vue'
import HomeView from '@/presentation/widgets/views/HomeView.vue'
import PlayListView from '@/presentation/widgets/views/PlayListView.vue'

const activeSection = ref('home')

const changeSection = (section: string) => {
  activeSection.value = section
}

provide('activeSection', activeSection)
provide('changeSection', changeSection)
</script>
