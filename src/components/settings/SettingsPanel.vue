<script setup lang="ts">
import type { SettingsSectionId } from '@/lib/settings/settings-sections'

defineProps<{
  sectionId: SettingsSectionId
}>()
</script>

<template>
  <section class="min-w-0 flex-1">
    <div
      class="border-border/60 min-h-[40vh] rounded-lg border border-dashed"
      aria-hidden="true"
    />
  </section>
</template>
