<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AppSidebar from '@/navigation/aside/AppSidebar.vue'
import AppHeader from '@/navigation/header/AppHeader.vue'
import NoteCreateFab from '@/navigation/aside/NoteCreateFab.vue'
import { SidebarInset, SidebarProvider } from '@/components/shadcn/ui/sidebar'
import { useNotesStore } from '@/stores/notes-store'

const notesStore = useNotesStore()

onMounted(() => {
  void notesStore.initDragDrop()
})

onUnmounted(() => {
  notesStore.destroyDragDrop()
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <NoteCreateFab />
    <SidebarInset>
      <AppHeader />
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
