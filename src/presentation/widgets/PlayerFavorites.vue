<template>
  <div v-show="visible" id="player-favorites-container" class="mt-4">
    <div class="d-flex player-layout-wrapper">
      <div class="video-wrapper-half">
        <div id="youtube-player-favorites-wrapper">
          <iframe
            id="youtube-player-favorites"
            :src="videoSrc"
            allow="autoplay; encrypted-media"
            allowfullscreen
          ></iframe>
        </div>
        <div class="overlay-blocker" id="overlay-blocker-favorites"></div>
      </div>

      <div class="player-controls-half d-flex flex-column align-items-center justify-content-between text-center">
        <h6 class="mb-2 player-title">{{ currentVideo?.title }}</h6>

        <div id="music-equalizer-favorites" style="width: 200px; max-width: 100%"></div>

        <input
          id="progress-bar-favorites"
          type="range"
          min="0"
          max="100"
          value="0"
          step="1"
          class="form-range w-100"
        />

        <div class="d-flex justify-content-center align-items-center gap-4 custom-controls-horizontal mb-2 mt-3">
          <div class="d-flex gap-3 align-items-center">
            <button id="btn-prev-favorites" class="btn btn-outline-light btn-sm">
              <i class="bi bi-skip-start-fill fs-4"></i>
            </button>
            <button id="btn-play-favorites" class="btn btn-outline-light btn-sm">
              <i class="bi bi-play-fill fs-4"></i>
            </button>
            <button id="btn-pause-favorites" class="btn btn-outline-light btn-sm">
              <i class="bi bi-pause-fill fs-4"></i>
            </button>
            <button id="btn-next-favorites" class="btn btn-outline-light btn-sm">
              <i class="bi bi-skip-end-fill fs-4"></i>
            </button>
          </div>

          <div class="volume-wrapper">
            <i class="bi bi-volume-up volume-icon"></i>
            <input
              type="range"
              id="volume-control-favorites"
              min="0"
              max="100"
              value="100"
              step="1"
              class="volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Lottie from 'lottie-web'
import { getFavoritesByUser } from '@/domain/usecases/favorites/GetFavoritesByUser'
import type { FavoriteMusicModel } from '@/domain/models/FavoriteMusicModel'

const favorites = ref<FavoriteMusicModel[]>([])
function getUserId(): string | null {
  try {
    const raw = localStorage.getItem('userJearCastaInfo')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed[0]?.id ?? null
  } catch {
    return null
  }
}

onMounted(async () => {
  const userId = getUserId()
  if (!userId) return

  favorites.value = await getFavoritesByUser(userId)
})

export interface VideoItem {
  videoId: string
  title: string
  thumbnail?: string
}

const props = defineProps<{
  videos: VideoItem[]
  startIndex: number
}>()

const currentIndex = ref(props.startIndex)
const ytPlayer = ref<any>(null)
const visible = ref(true)

const currentVideo = ref<VideoItem | null>(null)
const videoSrc = ref('')

function renderPlayer(index: number) {
  currentIndex.value = index
  const video = props.videos[index]
  currentVideo.value = video
  videoSrc.value = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&enablejsapi=1&controls=0`

  setTimeout(() => initYTPlayer(), 300)
}

function initYTPlayer() {
  const iframe = document.getElementById('youtube-player-favorites') as HTMLIFrameElement
  if (!iframe || !window.YT?.Player) {
    setTimeout(initYTPlayer, 300)
    return
  }

  ytPlayer.value = new window.YT.Player(iframe, {
    events: {
      onReady: () => {
        setupControls()
        ytPlayer.value.playVideo()

        const eq = document.getElementById('music-equalizer-favorites')
        if (eq && !eq.querySelector('svg')) {
          const animation = Lottie.loadAnimation({
            container: eq,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '@/assets/anim/animation-sound2.json',
          })

          window.lottieEqualizer = animation
        }
      },
      onStateChange: (event: any) => {
        if (event.data === window.YT.PlayerState.ENDED) {
          const next = currentIndex.value + 1
          if (next < props.videos.length) renderPlayer(next)
          else window.lottieEqualizer?.stop()
        }
      },
    },
  })
}

function setupControls() {
  const playBtn = document.getElementById('btn-play-favorites')
  const pauseBtn = document.getElementById('btn-pause-favorites')
  const nextBtn = document.getElementById('btn-next-favorites')
  const prevBtn = document.getElementById('btn-prev-favorites')
  const progressBar = document.getElementById('progress-bar-favorites') as HTMLInputElement
  const volumeControl = document.getElementById('volume-control-favorites') as HTMLInputElement

  playBtn?.addEventListener('click', () => {
    ytPlayer.value?.playVideo()
    window.lottieEqualizer?.play()
  })

  pauseBtn?.addEventListener('click', () => {
    ytPlayer.value?.pauseVideo()
    window.lottieEqualizer?.stop()
  })

  nextBtn?.addEventListener('click', () => {
    const next = currentIndex.value + 1
    if (next < props.videos.length) renderPlayer(next)
  })

  prevBtn?.addEventListener('click', () => {
    const prev = currentIndex.value - 1
    if (prev >= 0) renderPlayer(prev)
  })

  setInterval(() => {
    if (!ytPlayer.value?.getDuration) return
    const duration = ytPlayer.value.getDuration()
    const time = ytPlayer.value.getCurrentTime()
    if (progressBar) progressBar.value = ((time / duration) * 100).toFixed(0)
  }, 1000)

  progressBar?.addEventListener('input', () => {
    const seek = (+progressBar.value / 100) * ytPlayer.value.getDuration()
    ytPlayer.value.seekTo(seek, true)
  })

  volumeControl?.addEventListener('input', () => {
    ytPlayer.value.setVolume(+volumeControl.value)
  })
}

watch(() => props.startIndex, () => renderPlayer(props.startIndex))

onMounted(() => renderPlayer(props.startIndex))
</script>

<style scoped>
.player-layout-wrapper {
  gap: 1rem;
}
.video-wrapper-half {
  flex: 1;
  position: relative;
}
.player-controls-half {
  flex: 1;
  background: #111;
  padding: 1rem;
  border-radius: 10px;
}
.overlay-blocker {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}
.player-title {
  color: white;
  font-size: 1rem;
}
.volume-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.volume-slider {
  width: 100px;
}
</style>
