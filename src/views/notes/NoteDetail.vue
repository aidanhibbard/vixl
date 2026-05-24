<script setup lang="ts">
import { FileText } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/components/shadcn/ui/button'
import { useNotesStore } from '@/stores/notes-store'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const noteId = computed(() => String(route.params.id ?? ''))

const note = computed(() => notesStore.findRecentNoteById(noteId.value))
</script>

<template>
  <div class="flex flex-1 flex-col gap-4 p-2">
    <div v-if="note" class="space-y-2">
      <div class="flex items-center gap-2">
        <FileText class="text-muted-foreground size-5" />
        <h1 class="text-xl font-semibold">
          {{ note.title }}
        </h1>
      </div>
      <p class="text-muted-foreground text-sm">
        {{ note.filePath }}
      </p>
      <p class="text-muted-foreground text-sm">
        Editor coming soon. The note file was created on disk.
      </p>
    </div>

    <div v-else class="space-y-3">
      <p class="text-muted-foreground text-sm">
        Note "{{ noteId }}" was not found in recents.
      </p>
      <Button variant="outline" @click="router.push({ name: 'index' })">
        Back to home
      </Button>
    </div>
  </div>
</template>
