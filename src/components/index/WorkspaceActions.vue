<script setup lang="ts">
import { FilePlus, FolderOpen } from '@lucide/vue'
import { Button } from '@/components/shadcn/ui/button'
import { useWorkspace } from '@/composables/use-workspace'

const { isBusy, openFileOrDirectory, createNewNote } = useWorkspace()
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
    <Button
      variant="outline"
      class="h-auto cursor-pointer justify-start gap-3 px-4 py-4"
      :disabled="isBusy"
      @click="openFileOrDirectory"
    >
      <FolderOpen class="text-muted-foreground size-5 shrink-0" />
      <span class="text-sm font-medium">Open file or directory</span>
    </Button>

    <Button
      variant="outline"
      class="h-auto cursor-pointer justify-start gap-3 px-4 py-4"
      :disabled="isBusy"
      @click="createNewNote"
    >
      <FilePlus class="text-muted-foreground size-5 shrink-0" />
      <span class="text-sm font-medium">Create new note</span>
    </Button>
  </div>
</template>
