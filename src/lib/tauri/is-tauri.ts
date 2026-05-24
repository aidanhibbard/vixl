export const isTauri = (): boolean => {
  if (import.meta.env.TAURI_ENV_PLATFORM) {
    return true
  }
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window
}
