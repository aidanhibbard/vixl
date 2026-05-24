<script setup lang="ts">
import { FileText, List } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/shadcn/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/shadcn/ui/empty'
import { formatPathForDisplay } from '@/lib/notes/paths'
import { isTauri } from '@/lib/tauri/is-tauri'
import { useNotesStore } from '@/stores/notes-store'

const notesStore = useNotesStore()

const pathLabels = ref<Record<string, string>>({})

const recentNotes = computed(() => notesStore.indexRecentNotes)

watch(
  recentNotes,
  async (notes) => {
    const labels: Record<string, string> = {}
    for (const note of notes) {
      labels[note.id] = isTauri()
        ? await formatPathForDisplay(note.directoryPath)
        : note.directoryPath
    }
    pathLabels.value = labels
  },
  { immediate: true },
)

const handleOpenNote = async (id: string): Promise<void> => {
  await notesStore.openRecentNote(id)
}
</script>

<template>
  <section class="w-full space-y-3">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-muted-foreground text-sm font-medium">
        Recent notes
      </h2>
      <Button
        v-if="notesStore.recentNotesCount > 0"
        variant="link"
        class="text-muted-foreground h-auto gap-1.5 p-0 text-sm"
        as-child
      >
        <RouterLink :to="{ name: 'notes' }">
          <List class="size-3.5" />
          View all ({{ notesStore.recentNotesCount }})
        </RouterLink>
      </Button>
    </div>

    <Empty
      v-if="!recentNotes.length"
      class="border py-10"
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileText />
        </EmptyMedia>
        <EmptyTitle>No recently opened notes</EmptyTitle>
        <EmptyDescription>
          Open a notes directory or create a new note to get started.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>

    <ul v-else class="divide-border divide-y rounded-lg border">
      <li v-for="note in recentNotes" :key="note.filePath">
        <button
          type="button"
          class="hover:bg-accent/40 flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3 text-left transition-colors disabled:pointer-events-none disabled:opacity-50"
          :disabled="notesStore.isBusy"
          @click="handleOpenNote(note.id)"
        >
          <span class="flex min-w-0 items-center gap-2">
            <FileText class="text-muted-foreground size-4 shrink-0" />
            <span class="truncate text-sm font-medium">{{ note.title }}</span>
          </span>
          <span class="text-muted-foreground shrink-0 truncate text-xs">
            {{ pathLabels[note.id] ?? note.directoryPath }}
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>
