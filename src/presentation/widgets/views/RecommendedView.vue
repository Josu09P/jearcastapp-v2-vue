<template>
  <div class="container-fluid px-4 pt-3">
    <h4 class="text-white mb-2">Playlists Recomendadas</h4>
    <p class="text-light mb-3">JearCastApp te recomienda estas playlists.</p>

    <div class="d-flex overflow-auto gap-2 mb-4">
      <button v-for="playlist in playlists" :key="playlist.id" class="btn btn-outline-light flex-shrink-0"
        style="min-width: 200px" @click="loadSongs(playlist.id)">
        {{ playlist.name.replace(/_/g, ' ') }}
      </button>
    </div>

    <div id="player-recommended-container"></div>
    <br>
    <div v-if="songs.length > 0" class="scroll-container mt-3 p-3 rounded">
      <div class="row" id="recommendedSongsContainer">
        <div v-for="(song, index) in songs" :key="song.video_id" class="col-12 col-md-6 col-lg-4 col-xl-3 mb-3">
          <div class="card h-100 flex-row shadow-sm p-2 align-items-center video-card-custom">
            <img :src="song.video_thumbnail" alt="song.video_title" class="rounded-start me-3"
              style="width: 120px; height: 80px; object-fit: cover" />
            <div class="flex-grow-1 d-flex flex-column justify-content-between" style="min-width: 0;">
              <h6 class="card-title text-truncate mb-1" :title="song.video_title" style="font-size: 0.85rem;">
                {{ song.video_title }}
              </h6>
              <div class="d-flex justify-content-center align-items-center mt-2">
                <button class="btn btn-sm btn-outline-danger" @click="playRecommended(index)">
                  <i class="bi bi-play-circle"></i>
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
import { getRecommendedPlaylists } from '@/domain/usecases/recommended/GetRecommendedPlaylists'
import { getSongsFromRecommendedPlaylist } from '@/domain/usecases/recommended/GetSongsFromRecommendedPlaylist'
import type { RecommendedPlaylistModel } from '@/domain/models/RecommendedPlaylistModel'
import type { RecommendedSongModel } from '@/domain/models/RecommendedSongModel'
import { initRecommendedPlayer } from '@/utils/player-recommended'

const currentVideo = ref<{ videoId: string; title: string } | null>(null)
const playlists = ref<RecommendedPlaylistModel[]>([])
const songs = ref<RecommendedSongModel[]>([])

// Cargar playlists al montar
onMounted(async () => {
  playlists.value = await getRecommendedPlaylists()
})

// Cargar canciones al hacer clic
const loadSongs = async (playlistId: string) => {
  songs.value = await getSongsFromRecommendedPlaylist(playlistId)
}

function playRecommended(index: number) {
  const song = songs.value[index]
  if (song) {
    currentVideo.value = {
      videoId: song.video_id,
      title: song.video_title,
    }

    const videoList = songs.value.map((s: any) => ({
      videoId: s.video_id,
      title: s.video_title,
      thumbnail: s.video_thumbnail,
    }))

    initRecommendedPlayer({
      containerId: 'player-recommended-container',
      videos: videoList,
      startIndex: index,
    })
  }
}

</script>