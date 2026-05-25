<script setup lang="ts">
import { ref } from 'vue'
import SettingsShell from '@/components/settings/SettingsShell.vue'
import type { SettingsSectionId } from '@/lib/settings/settings-sections'

const activeSection = ref<SettingsSectionId>('appearance')
</script>

<template>
  <SettingsShell v-model="activeSection" />
</template>
