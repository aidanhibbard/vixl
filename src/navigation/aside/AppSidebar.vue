<script setup lang="ts">
import type { SidebarProps } from '@/components/shadcn/ui/sidebar'
import AsideToolbar from '@/navigation/aside/AsideToolbar.vue'
import NavSettings from '@/navigation/aside/NavSettings.vue'
import RecentNotes from '@/navigation/aside/RecentNotes.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/shadcn/ui/sidebar'
import { useNotesStore } from '@/stores/notes-store'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const notesStore = useNotesStore()
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <AsideToolbar />
    </SidebarHeader>
    <SidebarContent>
      <RecentNotes :notes="notesStore.sidebarRecentNotes" />
      <NavSettings />
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
</template>
