import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getRouter } from '@/lib/router-instance'
import { useLocalStorage } from '@vueuse/core'
import { open } from '@tauri-apps/plugin-dialog'
import { toast } from 'vue-sonner'
import {
  buildRecentNoteFromPath,
  createNoteFile,
  pathKind,
} from '@/lib/notes/note-files'
import { formatPathForDisplay, resolveDefaultNotesDirectory } from '@/lib/notes/paths'
import { formatWorkspaceError } from '@/lib/workspace/format-workspace-error'
import { runStoreAction } from '@/lib/workspace/run-store-action'
import { isTauri } from '@/lib/tauri/is-tauri'
import type { RecentNote } from '@/types/recent-note'

const RECENT_LIMIT = 50

export const useNotesStore = defineStore('notes', () => {
  const cwd = useLocalStorage<string | null>('vixl:workspace-directory', null)
  const recentNotes = useLocalStorage<RecentNote[]>('vixl:recent-notes', [])

  const isDragging = ref(false)
  const isBusy = ref(false)

  let unlistenDragDrop: (() => void) | null = null

  const setLoading = (value: boolean): void => {
    isBusy.value = value
  }

  const sidebarRecentNotes = computed(() =>
    [...recentNotes.value]
      .sort((a, b) => Date.parse(b.openedAt) - Date.parse(a.openedAt))
      .slice(0, 5)
      .map(({ id, title }) => ({ id, title })),
  )

  const sortedRecentNotes = computed(() =>
    [...recentNotes.value].sort((a, b) => Date.parse(b.openedAt) - Date.parse(a.openedAt)),
  )

  const indexRecentNotes = computed(() => sortedRecentNotes.value.slice(0, 5))

  const recentNotesCount = computed(() => recentNotes.value.length)

  const requireTauri = (): boolean => {
    if (isTauri()) {
      return true
    }
    toast.error('Filesystem actions require the Vixl desktop app.')
    return false
  }

  const setCwd = (path: string): void => {
    cwd.value = path
  }

  const touchRecentNote = (note: RecentNote): void => {
    const openedAt = new Date().toISOString()
    const next = recentNotes.value.filter((item) => item.filePath !== note.filePath)
    next.unshift({ ...note, openedAt })
    recentNotes.value = next.slice(0, RECENT_LIMIT)
  }

  const removeRecentNoteById = (id: string): void => {
    recentNotes.value = recentNotes.value.filter((note) => note.id !== id)
  }

  const findRecentNoteById = (id: string): RecentNote | undefined => {
    return recentNotes.value.find((note) => note.id === id)
  }

  const openNote = async (note: { id: string }): Promise<void> => {
    await getRouter().push({
      name: 'note',
      params: { id: note.id },
    })
  }

  const resolveNotesDirectory = async (): Promise<string> => {
    if (cwd.value) {
      return cwd.value
    }
    const defaultPath = await resolveDefaultNotesDirectory()
    setCwd(defaultPath)
    return defaultPath
  }

  const setCwdFromDirectory = async (directoryPath: string): Promise<void> => {
    setCwd(directoryPath)
    const label = await formatPathForDisplay(directoryPath)
    toast.success(`Notes directory: ${label}`)
  }

  const openPath = async (path: string): Promise<void> => {
    const kind = await pathKind(path)
    if (kind === 'directory') {
      await setCwdFromDirectory(path)
      return
    }
    if (kind === 'file') {
      const note = await buildRecentNoteFromPath(path)
      setCwd(note.directoryPath)
      touchRecentNote(note)
      toast.success(`Opened ${note.title}`)
      await openNote(note)
      return
    }
    toast.error('Choose a .md file or notes directory.')
  }

  const handleDroppedPaths = async (paths: string[]): Promise<void> => {
    if (!paths.length || !requireTauri()) {
      return
    }

    await runStoreAction(setLoading, async () => {
      for (const path of paths) {
        const kind = await pathKind(path)
        if (kind === 'unsupported') {
          continue
        }
        await openPath(path)
        return
      }
      toast.error('Drop a .md file or notes directory.')
    })
  }

  const openDirectory = async (): Promise<void> => {
    if (!requireTauri()) {
      return
    }

    await runStoreAction(setLoading, async () => {
      const selected = await open({
        title: 'Open notes directory',
        directory: true,
        multiple: false,
        recursive: true,
      })

      if (selected === null || selected === undefined) {
        return
      }

      if (typeof selected === 'string') {
        await openPath(selected)
      }
    })
  }

  const createNote = async (): Promise<void> => {
    if (!requireTauri()) {
      return
    }

    await runStoreAction(setLoading, async () => {
      const directoryPath = await resolveNotesDirectory()
      const note = await createNoteFile(directoryPath)
      setCwd(directoryPath)
      touchRecentNote(note)
      toast.success('Note created')
      await openNote(note)
    })
  }

  const openRecentNote = async (noteId: string): Promise<void> => {
    const note = findRecentNoteById(noteId)
    if (!note) {
      toast.error('Note not found.')
      return
    }

    await runStoreAction(setLoading, async () => {
      setCwd(note.directoryPath)
      touchRecentNote(note)
      toast.success(`Opened ${note.title}`)
      await openNote(note)
    })
  }

  const initDragDrop = async (): Promise<void> => {
    if (!isTauri() || unlistenDragDrop) {
      return
    }

    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      unlistenDragDrop = await getCurrentWindow().onDragDropEvent((event) => {
        if (event.payload.type === 'enter' || event.payload.type === 'over') {
          isDragging.value = true
        } else if (event.payload.type === 'leave') {
          isDragging.value = false
        } else if (event.payload.type === 'drop') {
          isDragging.value = false
          void handleDroppedPaths(event.payload.paths)
        }
      })
    } catch (error) {
      toast.error(formatWorkspaceError(error))
    }
  }

  const destroyDragDrop = (): void => {
    unlistenDragDrop?.()
    unlistenDragDrop = null
  }

  return {
    cwd,
    recentNotes,
    sidebarRecentNotes,
    sortedRecentNotes,
    indexRecentNotes,
    recentNotesCount,
    isDragging,
    isBusy,
    setCwd,
    touchRecentNote,
    removeRecentNoteById,
    findRecentNoteById,
    openDirectory,
    createNote,
    openNote,
    openRecentNote,
    openPath,
    handleDroppedPaths,
    initDragDrop,
    destroyDragDrop,
  }
})
