<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import DefaultLayout from '@/layouts/default.vue'

useColorMode()
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>
