import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { RecentNote } from '@/types/recent-note'

const RECENT_LIMIT = 50

export const useNotesStore = defineStore('notes', () => {
  const workspaceDirectory = useLocalStorage<string | null>('vixl:workspace-directory', null)
  const recentNotes = useLocalStorage<RecentNote[]>('vixl:recent-notes', [])

  const sidebarRecentNotes = computed(() =>
    [...recentNotes.value]
      .sort((a, b) => Date.parse(b.openedAt) - Date.parse(a.openedAt))
      .slice(0, 5)
      .map(({ id, title }) => ({ id, title })),
  )

  const sortedRecentNotes = computed(() =>
    [...recentNotes.value].sort((a, b) => Date.parse(b.openedAt) - Date.parse(a.openedAt)),
  )

  const setWorkspaceDirectory = (path: string): void => {
    workspaceDirectory.value = path
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

  return {
    workspaceDirectory,
    recentNotes,
    sidebarRecentNotes,
    sortedRecentNotes,
    setWorkspaceDirectory,
    touchRecentNote,
    removeRecentNoteById,
    findRecentNoteById,
  }
})
