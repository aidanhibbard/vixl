<script setup lang="ts">
import { FolderInput } from '@lucide/vue'
import IndexHero from '@/components/index/IndexHero.vue'
import RecentOpenList from '@/components/index/RecentOpenList.vue'
import WorkspaceActions from '@/components/index/WorkspaceActions.vue'
import { useWorkspace } from '@/composables/use-workspace'

const { isDragging } = useWorkspace({ watchDragDrop: true })
</script>

<template>
  <div class="relative flex min-h-[calc(100dvh-5rem)] flex-1 flex-col">
    <div
      v-if="isDragging"
      class="border-primary bg-primary/5 pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-xl border-2 border-dashed"
    >
      <div class="flex flex-col items-center gap-2 px-6 text-center">
        <FolderInput class="text-primary size-10" />
        <p class="text-sm font-medium">
          Drop a .md file or notes directory
        </p>
      </div>
    </div>

    <div class="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-10 py-8">
      <IndexHero />
      <WorkspaceActions />
      <RecentOpenList />
    </div>
  </div>
</template>
