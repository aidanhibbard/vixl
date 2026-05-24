<script setup lang="ts">
import { List } from '@lucide/vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
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

defineProps<{
  notes: {
    id: string
    title: string
  }[]
}>()

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const handleEdit = async (noteId: string): Promise<void> => {
  await router.push({ name: 'note', params: { id: noteId } })
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
      <SidebarMenuItem v-for="note in notes" :key="note.id">
        <SidebarMenuButton as-child :is-active="route.name === 'note' && route.params.id === note.id">
          <RouterLink :to="{ name: 'note', params: { id: note.id } }">
            <span class="truncate">{{ note.title }}</span>
          </RouterLink>
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
