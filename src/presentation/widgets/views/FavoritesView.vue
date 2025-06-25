<template>
  <div class="container">
    <h4 class="text-white mb-3">🎧 Tus favoritos</h4>

    <button @click="reloadFavorites" :disabled="loading" class="btn btn-outline-light mb-4">
      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      <i v-else class="bi bi-arrow-clockwise me-1"></i>
      Actualizar favoritos
    </button>

    <div v-if="favorites.length === 0 && !loading" class="text-white p-4">No tienes favoritos aún.</div>
    <div v-if="error" class="text-danger">{{ error }}</div>

    <div v-if="favorites.length > 0" class="row">
      <div v-for="(fav, index) in favorites" :key="fav.id" class="col-12 col-md-6 col-lg-6 col-xl-3 mb-3">
        <div class="card h-100 flex-row shadow-sm p-2 align-items-center video-card-custom">
          <img
            :src="fav.video_thumbnail"
            :alt="fav.video_title"
            class="rounded-start me-3"
            style="width: 120px; height: 80px; object-fit: cover"
          />
          <div class="flex-grow-1 d-flex flex-column justify-content-between" style="min-width: 0;">
            <h6 class="card-title text-truncate mb-1" :title="fav.video_title" style="font-size: 0.85rem;">
              {{ fav.video_title }}
            </h6>
            <div class="d-flex justify-content-start gap-2" style="margin: 10px 0 0 20px">
              <button @click="playFavorite(index)" class="btn btn-sm">
                <i class="bi bi-play-circle"></i>
              </button>
              <button @click="removeFavorite(fav.video_id)" class="btn btn-sm text-danger">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
<!-- Player -->
   <div id="player-favorites-container" class="mt-4"></div>

    <!-- Player -->
    <div v-if="currentVideo" class="mt-4" id="player-favorites-container">
      <iframe
        id="youtube-player-favorites"
        :src="`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&enablejsapi=1&controls=1`"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
        style="width: 100%; height: 360px"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FavoriteMusicModel } from '@/domain/models/FavoriteMusicModel'
import Toastify from 'toastify-js'
import { getFavoritesByUser } from '@/domain/usecases/favorites/GetFavoritesByUser'
import { removeFavoriteMusic } from '@/domain/usecases/favorites/RemoveFavoriteMusic'

const favorites = ref<FavoriteMusicModel[]>([])
const currentVideo = ref<{ videoId: string; title: string } | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const getUserId = (): string | null => {
  const raw = localStorage.getItem('userJearCastInfo')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed.id || null // ✅ no uses [0]
  } catch {
    return null
  }
}

async function reloadFavorites() {
  const userId = getUserId()
  if (!userId) {
    error.value = 'Usuario no autenticado'
    return
  }

  loading.value = true
  error.value = null

  try {
    favorites.value = await getFavoritesByUser(userId)
  } catch (e) {
    error.value = 'Error cargando favoritos'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function playFavorite(index: number) {
  const fav = favorites.value[index]
  if (fav) {
    currentVideo.value = {
      videoId: fav.video_id,
      title: fav.video_title,
    }
  }
}

async function removeFavorite(videoId: string) {
  const userId = getUserId()
  if (!userId) return

  try {
    await removeFavoriteMusic({ user_id: userId, video_id: videoId })
    Toastify({
      text: 'Eliminado de favoritos',
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#198754',
    }).showToast()
    await reloadFavorites()
  } catch (e) {
    Toastify({
      text: 'Error al eliminar favorito',
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#dc3545',
    }).showToast()
    console.error('Error al eliminar favorito:', e)
  }
}

onMounted(() => {
  reloadFavorites()
})
</script>

<style scoped>
.video-card-custom {
  background-color: #1a1a1a;
  color: white;
  border: 1px solid #444;
  border-radius: 10px;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
