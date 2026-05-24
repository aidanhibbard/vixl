import { homeDir, join } from '@tauri-apps/api/path'

export const DEFAULT_NOTES_SEGMENTS = ['Documents', 'vixl', 'notes'] as const

export const resolveDefaultNotesDirectory = async (): Promise<string> => {
  const home = await homeDir()
  return join(home, ...DEFAULT_NOTES_SEGMENTS)
}

export const formatPathForDisplay = async (fullPath: string): Promise<string> => {
  const home = await homeDir()
  if (fullPath.startsWith(home)) {
    return `~${fullPath.slice(home.length)}`
  }
  return fullPath
}
