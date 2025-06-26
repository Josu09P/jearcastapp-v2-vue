// src/utils/player-recommended.ts
import Lottie from 'lottie-web'
import animationData from '@/assets/anim/animation-sound2.json'

// Tipos auxiliares
interface VideoItem {
  videoId: string
  title: string
  thumbnail?: string
}

interface InitRecommendedPlayerParams {
  containerId: string
  videos: VideoItem[]
  startIndex?: number
}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady?: (() => void) | undefined
    lottieEqualizerRecommended?: any
  }
}

let ytPlayer: any = null
let currentVideoIndex = 0
let currentVideos: VideoItem[] = []

export function initRecommendedPlayer({ containerId, videos = [], startIndex = 0 }: InitRecommendedPlayerParams): void {
  currentVideos = videos
  renderPlayer(currentVideos[startIndex], startIndex, containerId)
}

function renderPlayer(video: VideoItem, index: number, containerId: string) {
  currentVideoIndex = index
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = `
    <div class="d-flex player-layout-wrapper">
      <div class="video-wrapper-half">
        <iframe
          id="youtube-player-recommended"
          src="https://www.youtube.com/embed/${video.videoId}?autoplay=0&enablejsapi=1&controls=0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
        <div class="overlay-blocker" id="overlay-blocker-recommended"></div>
      </div>

      <div class="player-controls-half d-flex flex-column align-items-center justify-content-between text-center">
        <h6 class="mb-2 player-title">${video.title}</h6>

        <div id="music-equalizer-recommended" style="width: 200px; max-width: 100%;"></div>

        <input
          id="progress-bar-recommended"
          type="range"
          min="0"
          max="100"
          value="0"
          step="1"
          class="form-range w-100"
        />

        <div class="d-flex justify-content-center align-items-center gap-4 custom-controls-horizontal mb-2 mt-3">
          <div class="d-flex gap-3 align-items-center">
            <button id="btn-prev-recommended" class="btn btn-outline-light btn-sm">
              <i class="bi bi-skip-start-fill fs-4"></i>
            </button>
            <button id="btn-play-recommended" class="btn btn-outline-light btn-sm">
              <i class="bi bi-play-fill fs-4"></i>
            </button>
            <button id="btn-pause-recommended" class="btn btn-outline-light btn-sm">
              <i class="bi bi-pause-fill fs-4"></i>
            </button>
            <button id="btn-next-recommended" class="btn btn-outline-light btn-sm">
              <i class="bi bi-skip-end-fill fs-4"></i>
            </button>
          </div>

          <div class="volume-wrapper">
            <i class="bi bi-volume-up volume-icon"></i>
            <input
              type="range"
              id="volume-control-recommended"
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
  `

  setTimeout(waitForYT, 100)
}

function waitForYT() {
  if (window.YT && window.YT.Player) {
    const playerIframe = document.getElementById('youtube-player-recommended') as HTMLIFrameElement
    if (!playerIframe) return

    ytPlayer = new window.YT.Player(playerIframe, {
      events: {
        onReady: () => {
          setupCustomControls()
          ytPlayer.playVideo()
          setTimeout(() => {
            document.getElementById('overlay-blocker-recommended')?.classList.add('transparent')
          }, 7000) // o 10000 si quieres más lento

          const equalizer = document.getElementById('music-equalizer-recommended')
          if (equalizer && !equalizer.querySelector('svg')) {
            const animation = Lottie.loadAnimation({
                container: equalizer,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData:animationData,
              })
            window.lottieEqualizerRecommended = animation
          }
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            const nextIndex = currentVideoIndex + 1
            if (nextIndex < currentVideos.length) {
              renderPlayer(currentVideos[nextIndex], nextIndex, 'player-recommended-container')
            } else {
              window.lottieEqualizerRecommended?.stop()
            }
          }
        },
      },
    })
  } else {
    setTimeout(waitForYT, 300)
  }
}

function setupCustomControls() {
  const playBtn = document.getElementById('btn-play-recommended')
  const pauseBtn = document.getElementById('btn-pause-recommended')
  const nextBtn = document.getElementById('btn-next-recommended')
  const prevBtn = document.getElementById('btn-prev-recommended')
  const progressBar = document.getElementById('progress-bar-recommended') as HTMLInputElement
  const volumeControl = document.getElementById('volume-control-recommended') as HTMLInputElement
  const overlay = document.getElementById('overlay-blocker-recommended')

  let hasAppliedFinalOverlay = false

  playBtn?.addEventListener('click', () => {
    ytPlayer?.playVideo()
    window.lottieEqualizerRecommended?.play()
    overlay?.classList.add('transparent')
  })

  pauseBtn?.addEventListener('click', () => {
    ytPlayer?.pauseVideo()
    window.lottieEqualizerRecommended?.stop()
    overlay?.classList.remove('transparent')
  })

  nextBtn?.addEventListener('click', () => {
    const next = currentVideoIndex + 1
    if (next < currentVideos.length) {
      renderPlayer(currentVideos[next], next, 'player-recommended-container')
    }
  })

  prevBtn?.addEventListener('click', () => {
    const prev = currentVideoIndex - 1
    if (prev >= 0) {
      renderPlayer(currentVideos[prev], prev, 'player-recommended-container')
    }
  })

  setInterval(() => {
    if (ytPlayer?.getCurrentTime && ytPlayer?.getDuration) {
      const time = ytPlayer.getCurrentTime()
      const duration = ytPlayer.getDuration()

      // Actualizar progreso
      if (progressBar) {
        progressBar.value = ((time / duration) * 100).toFixed(0)
      }

      const remaining = duration - time

      // Aplicar filtro final si quedan 20 segundos
      if (remaining <= 20 && !hasAppliedFinalOverlay) {
        hasAppliedFinalOverlay = true
        overlay?.classList.remove('transparent') // Activar el overlay de fin
      }

      // Si retrocede, quitar el filtro de fin
      if (remaining > 20 && hasAppliedFinalOverlay) {
        hasAppliedFinalOverlay = false
        overlay?.classList.add('transparent') // Volver a ocultar
      }
    }
  }, 1000)

  progressBar?.addEventListener('input', () => {
    const seekTime = (parseFloat(progressBar.value) / 100) * ytPlayer.getDuration()
    ytPlayer.seekTo(seekTime, true)
  })

  volumeControl?.addEventListener('input', () => {
    const volume = parseInt(volumeControl.value, 10)
    ytPlayer.setVolume(volume)
  })
}
