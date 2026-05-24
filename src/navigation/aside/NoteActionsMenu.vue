<script setup lang="ts">
import { Copy, Ellipsis, Pencil, Trash2 } from '@lucide/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/ui/dropdown-menu'
import { SidebarMenuAction } from '@/components/shadcn/ui/sidebar'

const props = defineProps<{
  noteId: string
}>()

const emit = defineEmits<{
  edit: [noteId: string]
  duplicate: [noteId: string]
  delete: [noteId: string]
}>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <SidebarMenuAction
        aria-label="Note actions"
        @click.stop
      >
        <Ellipsis />
      </SidebarMenuAction>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      side="right"
      align="start"
      class="w-40"
    >
      <DropdownMenuItem @click="emit('edit', props.noteId)">
        <Pencil />
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('duplicate', props.noteId)">
        <Copy />
        <span>Duplicate</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        variant="destructive"
        @click="emit('delete', props.noteId)"
      >
        <Trash2 />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
