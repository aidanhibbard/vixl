<script setup lang="ts">
import { FilePlus, FolderOpen } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/shadcn/ui/button'
import { useNotesStore } from '@/stores/notes-store'

const notesStore = useNotesStore()
const { isBusy } = storeToRefs(notesStore)
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
    <Button
      type="button"
      variant="outline"
      class="h-auto cursor-pointer justify-start gap-3 px-4 py-4"
      :disabled="isBusy"
      @click="notesStore.openDirectory()"
    >
      <FolderOpen class="text-muted-foreground size-5 shrink-0" />
      <span class="text-sm font-medium">Open directory</span>
    </Button>

    <Button
      type="button"
      variant="outline"
      class="h-auto cursor-pointer justify-start gap-3 px-4 py-4"
      :disabled="isBusy"
      @click="notesStore.createNote()"
    >
      <FilePlus class="text-muted-foreground size-5 shrink-0" />
      <span class="text-sm font-medium">Create new note</span>
    </Button>
  </div>
</template>
