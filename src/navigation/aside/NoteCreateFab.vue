<script setup lang="ts">
import { SquarePen } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/shadcn/ui/button'
import { useSidebar } from '@/components/shadcn/ui/sidebar'
import { useNotesStore } from '@/stores/notes-store'

const route = useRoute()
const { state, isMobile } = useSidebar()
const notesStore = useNotesStore()

const showFab = computed(() => {
  if (route.name === 'index') {
    return false
  }
  if (isMobile.value) {
    return true
  }
  return state.value === 'collapsed'
})
</script>

<template>
  <Button
    v-show="showFab"
    type="button"
    variant="default"
    size="icon"
    class="fixed bottom-6 right-6 z-[60] size-12 rounded-full shadow-lg transition-opacity"
    aria-label="New note"
    :disabled="notesStore.isBusy"
    @click="notesStore.createNote()"
  >
    <SquarePen class="size-5" />
  </Button>
</template>
