import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'

export const readNoteContent = async (filePath: string): Promise<string> => {
  return readTextFile(filePath)
}

export const writeNoteContent = async (filePath: string, content: string): Promise<void> => {
  await writeTextFile(filePath, content)
}
