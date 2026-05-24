import { documentDir, homeDir, join } from '@tauri-apps/api/path'

export const DEFAULT_NOTES_RELATIVE = ['vixl', 'notes'] as const

export const resolveDefaultNotesDirectory = async (): Promise<string> => {
  const documents = await documentDir()
  return join(documents, ...DEFAULT_NOTES_RELATIVE)
}

export const formatPathForDisplay = async (fullPath: string): Promise<string> => {
  const home = await homeDir()
  if (fullPath.startsWith(home)) {
    return `~${fullPath.slice(home.length)}`
  }
  return fullPath
}
