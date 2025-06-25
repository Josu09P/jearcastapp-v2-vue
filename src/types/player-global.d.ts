// src/types/player-global.d.ts (recomendado)
declare module '@/utils/player-favorites' {
  export function initFavoritesPlayer(options: {
    containerId: string
    videos: { videoId: string; title: string; thumbnail: string }[]
    startIndex?: number
  }): void
}

declare module'@/utils/player-home' {
  export function initHomePlayer(options: {
    containerId: string
    videos: { videoId:string; title:string; thumbnail:string}[]
    startIndex?: number
  }
  ):void
}