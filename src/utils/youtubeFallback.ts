// src/utils/youtubeFallback.ts
import { isElectron } from './isElectron'

declare global {
  interface Window {
    electronAPI?: {
      openExternal: (url: string) => void
    }
  }
}

export function checkIframeLoadedOrOpenExternally(videoId: string, iframeId: string) {
  if (isElectron()) {
    setTimeout(() => {
      const iframe = document.getElementById(iframeId) as HTMLIFrameElement
      if (!iframe || iframe.contentWindow?.location?.href.includes('about:blank')) {
        console.warn('[Electron] Video bloqueado por YouTube, abriendo en navegador externo...')
        window.electronAPI?.openExternal(`https://www.youtube.com/watch?v=${videoId}`)
      }
    }, 3000)
  }
}
