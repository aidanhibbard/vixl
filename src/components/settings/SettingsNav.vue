<script setup lang="ts">
import { Button } from '@/components/shadcn/ui/button'
import { cn } from '@/lib/utils'
import {
  settingsSections,
  type SettingsSectionId,
} from '@/lib/settings/settings-sections'

defineProps<{
  modelValue: SettingsSectionId
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SettingsSectionId]
}>()
</script>

<template>
  <nav
    class="flex flex-col gap-0.5"
    aria-label="Settings sections"
  >
    <Button
      v-for="section in settingsSections"
      :key="section.id"
      type="button"
      variant="ghost"
      :class="cn(
        'w-full justify-start gap-2 px-3',
        modelValue === section.id && 'bg-accent font-medium',
      )"
      @click="emit('update:modelValue', section.id)"
    >
      <component :is="section.icon" />
      {{ section.label }}
    </Button>
  </nav>
</template>
