<script setup lang="ts">
import { SquarePen } from '@lucide/vue'
import { computed } from 'vue'
import { Button } from '@/components/shadcn/ui/button'
import { useSidebar } from '@/components/shadcn/ui/sidebar'

const { state, isMobile } = useSidebar()

const showFab = computed(() => state.value === 'collapsed' && !isMobile.value)
</script>

<template>
  <Button
    v-show="showFab"
    variant="default"
    size="icon"
    class="fixed bottom-6 right-6 z-50 size-12 rounded-full shadow-lg transition-opacity"
    aria-label="New note"
  >
    <SquarePen class="size-5" />
  </Button>
</template>
