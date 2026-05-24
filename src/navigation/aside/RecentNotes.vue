<script setup lang="ts">
import { List } from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import NoteActionsMenu from '@/navigation/aside/NoteActionsMenu.vue'
import { useNotesStore } from '@/stores/notes-store'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/shadcn/ui/sidebar'

const props = defineProps<{
  notes: {
    id: string
    title: string
  }[]
}>()

const route = useRoute()
const notesStore = useNotesStore()

const handleOpenNote = async (noteId: string): Promise<void> => {
  await notesStore.openRecentNote(noteId)
}

const handleEdit = async (noteId: string): Promise<void> => {
  await handleOpenNote(noteId)
}

const handleDuplicate = (_noteId: string): void => {
  toast.message('Duplicate will be available when note files are fully wired.')
}

const handleDelete = (noteId: string): void => {
  notesStore.removeRecentNoteById(noteId)
  toast.success('Removed from recent notes')
}
</script>

<template>
  <SidebarGroup class="group-data-[collapsible=icon]:hidden">
    <SidebarGroupLabel>Recent notes</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem v-for="note in props.notes" :key="note.id">
        <SidebarMenuButton
          :is-active="route.name === 'note' && route.params.id === note.id"
          :disabled="notesStore.isBusy"
          @click="handleOpenNote(note.id)"
        >
          <span class="truncate">{{ note.title }}</span>
        </SidebarMenuButton>
        <NoteActionsMenu
          :note-id="note.id"
          @edit="handleEdit"
          @duplicate="handleDuplicate"
          @delete="handleDelete"
        />
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton as-child>
          <RouterLink
            :to="{ name: 'notes' }"
            class="text-sidebar-foreground/70"
          >
            <List />
            <span>View all</span>
          </RouterLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
