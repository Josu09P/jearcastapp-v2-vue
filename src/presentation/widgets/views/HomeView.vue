<template>
    <div class="container-fluid px-4 pt-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-white m-0">Buscador de música JearCastApp</h4>

            <button class="button-55" @click="showSearchModal = true">
                <i class="bi bi-search"></i>
            </button>
        </div>


        <h6 v-if="searchPerformed" id="search-title" class="text-light mb-3">
            Resultados para: "{{ query }}"
        </h6>

        <div id="player-home-container" class="text-white rounded shadow mt-4 container-player-jear"></div>

        <div id="youtube-results" class="row gx-3 gy-4 mt-3">
            <div v-for="(video, index) in results" :key="video.videoId" class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="card h-100 flex-row shadow-sm p-2 align-items-center video-card-custom">
                    <img :src="video.thumbnail" :alt="video.title" class="rounded-start me-3"
                        style="width: 120px; height: 80px; object-fit: cover" />
                    <div class="flex-grow-1 d-flex flex-column justify-content-between" style="min-width: 0;">
                        <div>
                            <h6 class="card-title text-truncate mb-1" :title="video.title" style="font-size: 0.85rem">
                                {{ video.title }}
                            </h6>
                            <p class="text-light small mb-2">
                                <i class="bi bi-eye"></i>
                                {{ video.viewCount.toLocaleString() }} vistas
                            </p>
                        </div>
                        <div class="d-flex justify-content-start gap-2">
                            <button @click="playVideo(index)" class="btn btn-sm">
                                <i class="bi bi-play-circle"></i>
                            </button>
                            <button @click="addToFavorites(video)" class="btn btn-sm">
                                <i class="bi bi-heart"></i>
                            </button>
                            <button @click="openPlaylistModal(video)" class="btn btn-sm">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--MODAL DE BUSQUEDA-->
        <div v-if="showSearchModal" class="modal-backdrop" @click.self="showSearchModal = false">
            <div class="search-modal-content">
                <form @submit.prevent="onSearch">
                    <input v-model="query" type="text" class="form-control mb-3" placeholder="Buscar música..."
                        autofocus style="background-color: #8f8f8f52; color: white;"/>
                    <div class="d-flex justify-content-center gap-3">
                        <button type="submit" class="button-74" role="button">
                            Buscar
                        </button>

                        <button type="button" class="button-74" @click="showSearchModal = false">
                            X
                        </button>
                    </div>

                </form>
            </div>
        </div>

        <PlaylistModal :selectedVideo="selectedVideo" v-model:show="showPlaylistModal" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Toastify from 'toastify-js'
//import PlaylistModal from '@/presentation/components/PlaylistModal.vue'
import { searchYoutube } from '@/data/services/youtube/SearchYoutube'
import { getVideoStats } from '@/data/services/youtube/GetVideoStats'
import { addFavoriteMusic } from '@/domain/usecases/favorites/AddFavoriteMusic'
import { useUserStore } from '@/stores/user'
import { initHomePlayer } from '@/utils/player-home'

const userStore = useUserStore()
const apiKey = computed(() => userStore.apikeyYoutube)
const query = ref('')
const results = ref<any[]>([])
const selectedVideo = ref<any>(null)
const showPlaylistModal = ref(false)
const searchPerformed = ref(false)
const showSearchModal = ref(false)

const onSearch = async () => {
    if (!query.value || !apiKey.value) return

    searchPerformed.value = true
    results.value = []

    const videos = await searchYoutube(query.value, apiKey.value)
    const stats = await getVideoStats(videos.map((v: any) => v.videoId).join(','), apiKey.value)

    results.value = videos.map((v: any) => {
        const stat = stats.find((s: any) => s.videoId === v.videoId)
        return {
            ...v,
            viewCount: stat?.viewCount || 0
        }
    })
}

const playVideo = (index: number) => {
    initHomePlayer({ videos: results.value, startIndex: index, containerId: 'player-home-container' })
}

const addToFavorites = async (video: any) => {
    if (!userStore.id) return

    try {
        await addFavoriteMusic({
            user_id: userStore.id,
            video_id: video.videoId,
            video_title: video.title,
            video_thumbnail: video.thumbnail
        })

        Toastify({
            text: 'Agregado a favoritos',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#198754'
        }).showToast()
    } catch (err: any) {
        Toastify({
            text: err?.message || 'Error al agregar a favoritos',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#dc3545'
        }).showToast()
    }
}

const openPlaylistModal = (video: any) => {
    selectedVideo.value = video
    showPlaylistModal.value = true
}
</script>

<style scoped>
.video-card-custom {
    background-color: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.floating-search-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1050;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1040;
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-modal-content {
    background-color: #8f8f8f52;
    padding: 20px;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.button-74 {
    background-color: #d9d9d98d;
    border: 2px solid #422800;
    border-radius: 20px;
    box-shadow: #422800 2px 2px 0 0;
    color: white;
    cursor: pointer;
    display: inline-block;
    font-weight: 600;
    font-size: 14px;
    padding: 0 14px;
    line-height: 36px;
    text-align: center;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    transition: all 0.1s ease-in-out;
}

.button-74:hover {
    background-color: #836a6ad4;
}

.button-74:active {
    box-shadow: #422800 1px 1px 0 0;
    transform: translate(1px, 1px);
}

@media (min-width: 768px) {
    .button-74 {
        min-width: 90px;
        padding: 0 18px;
    }
}
.button-55 {
  align-self: center;
  background-color: #fff;
  background-image: none;
  background-position: 0 90%;
  background-repeat: repeat no-repeat;
  background-size: 4px 3px;
  border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
  border-style: solid;
  border-width: 2px;
  box-shadow: rgba(0, 0, 0, .2) 15px 28px 25px -18px;
  box-sizing: border-box;
  color: #41403e;
  cursor: pointer;
  display: inline-block;
  font-family: Neucha, sans-serif;
  font-size: 1rem;
  line-height: 23px;
  outline: none;
  padding: .75rem;
  text-decoration: none;
  transition: all 235ms ease-in-out;
  border-radius: 30%;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-55:hover {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.button-55:focus {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 4px -6px;
}
</style>
