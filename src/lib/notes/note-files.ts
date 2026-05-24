import { basename, dirname, join } from '@tauri-apps/api/path'
import { exists, mkdir, stat, writeTextFile } from '@tauri-apps/plugin-fs'
import { noteIdFromPath, noteTitleFromPath } from '@/lib/notes/note-id'
import type { RecentNote } from '@/types/recent-note'

const NOTE_EXTENSION = '.md'

export const fileNameForNewNote = (): string => {
  const now = new Date()
  const pad = (value: number): string => String(value).padStart(2, '0')

  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('-') + NOTE_EXTENSION
}

export const ensureDirectory = async (directoryPath: string): Promise<void> => {
  let present = false
  try {
    present = await exists(directoryPath)
  } catch {
    present = false
  }

  if (!present) {
    await mkdir(directoryPath, { recursive: true })
  }
}

export const buildRecentNoteFromPath = async (
  filePath: string,
  directoryPath?: string,
): Promise<RecentNote> => {
  const dir = directoryPath ?? (await dirname(filePath))
  const id = await noteIdFromPath(filePath)
  const title = await noteTitleFromPath(filePath)

  return {
    id,
    title,
    filePath,
    directoryPath: dir,
    openedAt: new Date().toISOString(),
  }
}

export const createNoteFile = async (directoryPath: string): Promise<RecentNote> => {
  await ensureDirectory(directoryPath)
  const fileName = fileNameForNewNote()
  const filePath = await join(directoryPath, fileName)
  await writeTextFile(filePath, '# Untitled\n\n')
  return buildRecentNoteFromPath(filePath, directoryPath)
}

export const pathKind = async (
  path: string,
): Promise<'directory' | 'file' | 'unsupported'> => {
  const info = await stat(path)
  if (info.isDirectory) {
    return 'directory'
  }
  if (info.isFile) {
    const name = await basename(path)
    if (name.endsWith(NOTE_EXTENSION)) {
      return 'file'
    }
    return 'unsupported'
  }
  return 'unsupported'
}
