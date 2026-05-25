<script setup lang="ts">
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/shadcn/ui/tabs'
import SettingsPanel from '@/components/settings/SettingsPanel.vue'
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
  <Tabs
    class="flex flex-col gap-4 md:hidden"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event as SettingsSectionId)"
  >
    <TabsList class="w-full justify-start overflow-x-auto">
      <TabsTrigger
        v-for="section in settingsSections"
        :key="section.id"
        :value="section.id"
        class="shrink-0"
      >
        {{ section.label }}
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="section in settingsSections"
      :key="section.id"
      :value="section.id"
    >
      <SettingsPanel :section-id="section.id" />
    </TabsContent>
  </Tabs>
</template>
