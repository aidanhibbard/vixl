import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { open } from '@tauri-apps/plugin-dialog'
import { toast } from 'vue-sonner'
import {
  buildRecentNoteFromPath,
  createNoteInDirectory,
  pathKind,
} from '@/lib/notes/note-files'
import { formatPathForDisplay, resolveDefaultNotesDirectory } from '@/lib/notes/paths'
import { isTauri } from '@/lib/tauri/is-tauri'
import { useNotesStore } from '@/stores/notes-store'

export const useWorkspace = (options?: { watchDragDrop?: boolean }) => {
  const router = useRouter()
  const notesStore = useNotesStore()
  const isDragging = ref(false)
  const isBusy = ref(false)

  let unlistenDragDrop: (() => void) | null = null

  const requireTauri = (): boolean => {
    if (isTauri()) {
      return true
    }
    toast.error('Filesystem actions require the Vixl desktop app.')
    return false
  }

  const openNote = async (note: { id: string }): Promise<void> => {
    await router.push({ name: 'note', params: { id: note.id } })
  }

  const setWorkspaceFromDirectory = async (directoryPath: string): Promise<void> => {
    notesStore.setWorkspaceDirectory(directoryPath)
    const label = await formatPathForDisplay(directoryPath)
    toast.success(`Opened ${label}`)
  }

  const handleDroppedPaths = async (paths: string[]): Promise<void> => {
    if (!paths.length) {
      return
    }

    isBusy.value = true
    try {
      for (const path of paths) {
        const kind = await pathKind(path)
        if (kind === 'directory') {
          await setWorkspaceFromDirectory(path)
          return
        }
        if (kind === 'file') {
          const note = await buildRecentNoteFromPath(path)
          notesStore.touchRecentNote(note)
          await openNote(note)
          return
        }
      }
      toast.error('Drop a .md file or notes directory.')
    } catch {
      toast.error('Could not open the dropped item.')
    } finally {
      isBusy.value = false
    }
  }

  const handlePathSelection = async (path: string): Promise<void> => {
    const kind = await pathKind(path)
    if (kind === 'directory') {
      await setWorkspaceFromDirectory(path)
      return
    }
    if (kind === 'file') {
      const note = await buildRecentNoteFromPath(path)
      notesStore.touchRecentNote(note)
      await openNote(note)
      return
    }
    toast.error('Choose a .md file or notes directory.')
  }

  const openFileOrDirectory = async (): Promise<void> => {
    if (!requireTauri()) {
      return
    }

    isBusy.value = true
    try {
      const file = await open({
        title: 'Open markdown note',
        multiple: false,
        filters: [{ name: 'Markdown', extensions: ['md'] }],
      })

      if (typeof file === 'string') {
        await handlePathSelection(file)
        return
      }

      const directory = await open({
        title: 'Open notes directory',
        directory: true,
        multiple: false,
        recursive: true,
      })

      if (typeof directory === 'string') {
        await handlePathSelection(directory)
      }
    } catch {
      toast.error('Could not open the file or directory.')
    } finally {
      isBusy.value = false
    }
  }

  const resolveNotesDirectoryForCreate = async (): Promise<string> => {
    if (notesStore.workspaceDirectory) {
      return notesStore.workspaceDirectory
    }
    const defaultPath = await resolveDefaultNotesDirectory()
    notesStore.setWorkspaceDirectory(defaultPath)
    return defaultPath
  }

  const createNewNote = async (): Promise<void> => {
    if (!requireTauri()) {
      return
    }

    isBusy.value = true
    try {
      const directoryPath = await resolveNotesDirectoryForCreate()
      const note = await createNoteInDirectory(directoryPath)
      notesStore.touchRecentNote(note)
      await openNote(note)
      toast.success('Note created')
    } catch {
      toast.error('Could not create a new note.')
    } finally {
      isBusy.value = false
    }
  }

  onMounted(async () => {
    if (!options?.watchDragDrop || !isTauri()) {
      return
    }

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
  })

  onUnmounted(() => {
    unlistenDragDrop?.()
  })

  return {
    isDragging,
    isBusy,
    openFileOrDirectory,
    createNewNote,
    handleDroppedPaths,
    openNote,
  }
}
