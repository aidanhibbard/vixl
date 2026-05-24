<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Toaster } from '@/components/shadcn/ui/sonner'
import DefaultLayout from '@/layouts/default.vue'

useColorMode()
</script>

<template>
  <DefaultLayout>
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component
          :is="Component"
          :key="route.fullPath"
          class="flex min-h-0 flex-1 flex-col"
        />
      </Transition>
    </RouterView>
  </DefaultLayout>
  <Toaster rich-colors close-button class="z-[200]" />
</template>
