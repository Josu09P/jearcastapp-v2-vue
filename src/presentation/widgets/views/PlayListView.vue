<template>
  <div class="container-fluid px-4 pt-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4 class="text-white mb-0">Tus playlists</h4>
      <button class="btn btn-outline-light btn-sm" @click="loadPlaylists">
        <i class="bi bi-arrow-clockwise me-1"></i> Recargar
      </button>
    </div>

    <!-- Listado de playlists -->
    <div class="d-flex flex-wrap gap-2 mb-4">
      <div v-for="playlist in playlists" :key="playlist.id" class="btn-group">
        <button class="btn btn-outline-light btn-sm" @click="loadSongs(playlist.id!)">
          {{ playlist.name }}
        </button>
        <button class="btn btn-outline-light btn-sm" @click="confirmDeletePlaylist(playlist.id!)">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Reproductor -->
    <div id="player-playlist-container" class="text-white rounded shadow mt-4 container-player-jear"></div>
    <br>

    <!-- Canciones -->
    <div v-if="songs.length > 0" class="scroll-container mt-3 p-3 rounded">
      <div class="row">
        <div v-for="(song, index) in songs" :key="song.video_id" class="col-12 col-md-6 col-lg-4 col-xl-3 mb-3">
          <div class="card h-100 flex-row shadow-sm p-2 align-items-center video-card-custom">
            <img
              :src="song.video_thumbnail"
              :alt="song.video_title"
              class="rounded-start me-3"
              style="width: 120px; height: 80px; object-fit: cover"
            />
            <div class="flex-grow-1 d-flex flex-column justify-content-between" style="min-width: 0;">
              <h6
                class="card-title text-truncate mb-1"
                :title="song.video_title"
                style="font-size: 0.85rem;"
              >
                {{ song.video_title }}
              </h6>
              <div class="d-flex justify-content-start gap-2" style="margin: 10px 0 0 20px">
                <button class="btn btn-sm btn-outline-light" @click="playSong(index)">
                  <i class="bi bi-play-circle"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-light"
                  @click="deleteSong(song.video_id)"
                  :disabled="deletingMap[song.video_id]"
                >
                  <span v-if="deletingMap[song.video_id]" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <i v-else class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sin canciones -->
    <div v-else class="text-white p-4">Selecciona una playlist para ver sus canciones.</div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import Toastify from 'toastify-js'
import type { PlaylistSongModel } from '@/domain/models/PlaylistSongModel'
import { useUserStore } from '@/stores/user'
import { getPlaylistsByUser } from '@/domain/usecases/playlists/GetPlaylistsByUser'
import { getSongsFromPlaylist } from '@/domain/usecases/playlists/GetSongsFromPlaylist'
import { deleteSongFromPlaylist } from '@/domain/usecases/playlists/DeleteSongFromPlaylist'
import { initPlayListPlayer } from '@/utils/player-playlist'
import type { PlaylistModel } from '@/domain/models/PlayListModel'
import { deletePlaylist } from '@/domain/usecases/playlists/DeletePlayList'

const userStore = useUserStore()
const playlists = ref<PlaylistModel[]>([])
const songs = ref<PlaylistSongModel[]>([])
const currentPlaylistId = ref<string>('')
const deletingMap = ref<Record<string, boolean>>({})


const loadPlaylists = async () => {
  if (!userStore.id) return
  playlists.value = await getPlaylistsByUser(userStore.id)
}

const loadSongs = async (playlistId: string) => {
  currentPlaylistId.value = playlistId
  songs.value = await getSongsFromPlaylist(playlistId)
}

const playSong = (index: number) => {
  initPlayListPlayer({
    videos: songs.value.map(song => ({
      videoId: song.video_id,
      title: song.video_title,
      thumbnail: song.video_thumbnail
    })),
    startIndex: index,
    containerId: 'player-playlist-container'
  })
}

const deleteSong = async (videoId: string) => {
  deletingMap.value[videoId] = true

  const toast = Toastify({
  text: 'Borrando canción...',
  duration: 1000,
  gravity: 'top',
  position: 'right',
  className: "toast-glass", // <- importante
  stopOnFocus: false
  })
  toast.showToast()

  try {
    await deleteSongFromPlaylist(currentPlaylistId.value, videoId)
    songs.value = songs.value.filter(song => song.video_id !== videoId)

    Toastify({
     text: 'Canción eliminada',
     duration: 3000,
     gravity: 'top',
     position: 'right',
     className: "toast-glass", // <- importante
     stopOnFocus: false
    }).showToast()
  } catch (err: any) {
    Toastify({
      text: err.message || 'Error al eliminar',
      duration: 3000,
      gravity: 'top',
      position: 'right',
      className: "toast-glass", // <- importante
      stopOnFocus: false
    }).showToast()
  } finally {
    deletingMap.value[videoId] = false
  }
}

const confirmDeletePlaylist = async (playlistId: string) => {
  const result = await Swal.fire({
    title: '¿Eliminar playlist?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
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
    await deletePlaylist(playlistId)
    playlists.value = playlists.value.filter(p => p.id !== playlistId)
    Toastify({
      text: 'Playlist eliminada',
      duration: 3000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#dc3545'
    }).showToast()
  }
}


onMounted(() => {
  loadPlaylists()
})
</script>
