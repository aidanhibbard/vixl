import { basename, dirname, join } from '@tauri-apps/api/path'
import { exists, mkdir, stat, writeTextFile } from '@tauri-apps/plugin-fs'
import { noteIdFromPath, noteTitleFromPath } from '@/lib/notes/note-id'
import type { RecentNote } from '@/types/recent-note'

const NOTE_EXTENSION = '.md'

const timestampForFileName = (): string => {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

export const ensureDirectory = async (directoryPath: string): Promise<void> => {
  if (!(await exists(directoryPath))) {
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

export const createNoteInDirectory = async (directoryPath: string): Promise<RecentNote> => {
  await ensureDirectory(directoryPath)
  const fileName = `note-${timestampForFileName()}${NOTE_EXTENSION}`
  const filePath = await join(directoryPath, fileName)
  await writeTextFile(filePath, '# Untitled\n\n')
  return buildRecentNoteFromPath(filePath, directoryPath)
}

export const createNotesDirectory = async (
  parentPath: string,
  folderName: string,
): Promise<string> => {
  const trimmed = folderName.trim() || 'notes'
  const directoryPath = await join(parentPath, trimmed)
  await ensureDirectory(directoryPath)
  return directoryPath
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
