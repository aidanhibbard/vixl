<script setup lang="ts">
import SettingsNav from '@/components/settings/SettingsNav.vue'
import SettingsPanel from '@/components/settings/SettingsPanel.vue'
import SettingsTabs from '@/components/settings/SettingsTabs.vue'
import { useSidebar } from '@/components/shadcn/ui/sidebar'
import type { SettingsSectionId } from '@/lib/settings/settings-sections'

defineProps<{
  modelValue: SettingsSectionId
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SettingsSectionId]
}>()

const { isMobile } = useSidebar()
</script>

<template>
  <div class="-ml-4 flex w-full flex-1 flex-col pl-4">
    <template v-if="isMobile">
      <SettingsTabs
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </template>

    <div v-else class="flex w-full gap-8">
      <SettingsNav
        class="w-48 shrink-0"
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <SettingsPanel :section-id="modelValue" />
    </div>
  </div>
</template>
