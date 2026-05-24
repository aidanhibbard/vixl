import { basename, extname } from '@tauri-apps/api/path'

const NOTE_EXTENSION = '.md'

export const noteIdFromPath = async (filePath: string): Promise<string> => {
  const name = await basename(filePath)
  const ext = await extname(filePath)
  if (ext === NOTE_EXTENSION) {
    return name.slice(0, -NOTE_EXTENSION.length)
  }
  return name
}

export const noteTitleFromPath = async (filePath: string): Promise<string> => {
  const id = await noteIdFromPath(filePath)
  return id.replace(/-/g, ' ')
}
