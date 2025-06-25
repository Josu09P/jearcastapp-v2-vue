// src/global.d.ts

export {}

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady?: () => void
    lottieEqualizer?: any
  }
}
