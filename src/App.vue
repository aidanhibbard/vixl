<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Toaster } from '@/components/shadcn/ui/sonner'
import DefaultLayout from '@/layouts/default.vue'

useColorMode()
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
  <Toaster rich-colors close-button />
</template>
