<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NoteEditor from '@/components/notes/NoteEditor.vue'
import { Button } from '@/components/shadcn/ui/button'
import { useNotesStore } from '@/stores/notes-store'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const noteId = computed(() => String(route.params.id ?? ''))

const note = computed(() => notesStore.findRecentNoteById(noteId.value))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div v-if="note" class="flex min-h-0 flex-1 flex-col">
      <NoteEditor :key="note.filePath" :file-path="note.filePath" />
    </div>

    <div v-else class="space-y-3 p-2">
      <p class="text-muted-foreground text-sm">
        Note "{{ noteId }}" was not found in recents.
      </p>
      <Button variant="outline" @click="router.push({ name: 'index' })">
        Back to home
      </Button>
    </div>
  </div>
</template>
