<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="text-white mb-0">Tus favoritos</h4>
      <button @click="reloadFavorites" :disabled="loading" class="btn btn-outline-light" style="font-size: 13px;">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        <i v-else class="bi bi-arrow-clockwise me-1"></i>
        Actualizar favoritos
      </button>
    </div>

    <div id="player-favorites-container" class="text-white rounded shadow mt-4 container-player-jear"></div>
    <br>
    <!-- Mensajes -->
    <div v-if="favorites.length === 0 && !loading" class="text-white p-4">No tienes favoritos aún.</div>
    <div v-if="error" class="text-danger">{{ error }}</div>

    <!-- Lista de favoritos -->
    <div v-if="favorites.length > 0" class="favorites-scroll-container mt-3 p-3 rounded">
      <div class="row">
        <div v-for="(fav, index) in favorites" :key="fav.id" class="col-12 col-md-6 col-lg-6 col-xl-3 mb-3">
          <div class="card h-100 flex-row shadow-sm p-2 align-items-center video-card-custom">
            <img :src="fav.video_thumbnail" :alt="fav.video_title" class="rounded-start me-3"
              style="width: 120px; height: 80px; object-fit: cover" />
            <div class="flex-grow-1 d-flex flex-column justify-content-between" style="min-width: 0;">
              <h6 class="card-title text-truncate mb-1" :title="fav.video_title" style="font-size: 0.85rem;">
                {{ fav.video_title }}
              </h6>
              <div class="d-flex justify-content-start gap-2" style="margin: 10px 0 0 20px">
                <button @click="playFavorite(index)" class="btn btn-sm">
                  <i class="bi bi-play-circle"></i>
                </button>
                <button @click="removeFavorite(fav.video_id)" class="btn btn-sm text-danger"
                  :disabled="deletingMap[fav.video_id]">
                  <span v-if="deletingMap[fav.video_id]" class="spinner-border spinner-border-sm" role="status"
                    aria-hidden="true"></span>
                  <i v-else class="bi bi-trash-fill"></i>
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FavoriteMusicModel } from '@/domain/models/FavoriteMusicModel'
import { getFavoritesByUser } from '@/domain/usecases/favorites/GetFavoritesByUser'
import { removeFavoriteMusic } from '@/domain/usecases/favorites/RemoveFavoriteMusic'
import { initFavoritesPlayer } from '@/utils/player-favorites'
import Toastify from 'toastify-js'

const favorites = ref<FavoriteMusicModel[]>([])
const currentVideo = ref<{ videoId: string; title: string } | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const getUserId = (): string | null => {
  const raw = localStorage.getItem('userJearCastInfo')
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed.id || null
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

    const videoList = favorites.value.map((f) => ({
      videoId: f.video_id,
      title: f.video_title,
      thumbnail: f.video_thumbnail,
    }))

    initFavoritesPlayer({
      containerId: 'player-favorites-container',
      videos: videoList,
      startIndex: index,
    })
  }
}
const deletingMap = ref<Record<string, boolean>>({})

async function removeFavorite(videoId: string) {
  const userId = getUserId()
  if (!userId) return

  deletingMap.value[videoId] = true

  Toastify({
    text: 'Eliminando...',
    duration: 1500,
    gravity: 'top',
    position: 'right',
    backgroundColor: '#ffc107',
  }).showToast()

  try {
    await removeFavoriteMusic({ user_id: userId, video_id: videoId })

    setTimeout(() => {
      Toastify({
        text: 'Eliminado de favoritos',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#198754',
      }).showToast()
    }, 1500)

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
  } finally {
    deletingMap.value[videoId] = false
  }
}


onMounted(() => {
  // Asegurar que la API de YouTube esté cargada
  if (!window.YT) {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.body.appendChild(tag)
  }

  reloadFavorites()
})
</script>

<style>
.favorites-scroll-container {
  max-height: 500px;
  min-height: 200px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
