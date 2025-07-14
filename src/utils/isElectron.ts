// src/utils/isElectron.ts
export function isElectron(): boolean {
  return typeof window !== 'undefined' && !!(window as any).electronAPI
}
