<script setup lang="ts">
import { Search, SquarePen } from '@lucide/vue'
import { computed, ref } from 'vue'
import { Button } from '@/components/shadcn/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/shadcn/ui/input-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn/ui/tooltip'
import { useSidebar } from '@/components/shadcn/ui/sidebar'
import { useNotesStore } from '@/stores/notes-store'

const searchQuery = ref('')
const notesStore = useNotesStore()

const { state, isMobile, setOpen } = useSidebar()

const isIconCollapsed = computed(
  () => state.value === 'collapsed' && !isMobile.value,
)

const handleSearchIconClick = (): void => {
  if (isIconCollapsed.value) {
    setOpen(true)
  }
}
</script>

<template>
  <div class="flex w-full min-w-0 items-center gap-2">
    <div
      class="flex min-w-0 flex-1 items-center gap-2 group-data-[collapsible=icon]:hidden"
    >
      <InputGroup class="min-w-0 flex-1">
        <InputGroupAddon>
          <Search class="size-4 shrink-0 opacity-50" />
        </InputGroupAddon>
        <InputGroupInput
          v-model="searchQuery"
          type="search"
          placeholder="Search notes..."
          aria-label="Search notes"
        />
      </InputGroup>
      <Button
        variant="ghost"
        size="icon"
        class="shrink-0"
        aria-label="New note"
        @click="notesStore.createNote()"
      >
        <SquarePen class="size-4" />
      </Button>
    </div>

    <div
      class="hidden w-full justify-center group-data-[collapsible=icon]:flex"
    >
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search notes"
            @click="handleSearchIconClick"
          >
            <Search class="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          Search notes
        </TooltipContent>
      </Tooltip>
    </div>
  </div>
</template>
