<script setup lang="ts">
import { computed } from "vue";
import { useColorMode } from "@vueuse/core";
import { Toaster } from "@/components/shadcn/ui/sonner";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const colorMode = useColorMode();

const toasterTheme = computed(() => {
  if (colorMode.value === "auto") {
    return "system";
  }
  return colorMode.value;
});
</script>

<template>
  <DefaultLayout>
    <RouterView v-slot="{ Component, route }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="route.fullPath" class="flex min-h-0 flex-1 flex-col" />
      </Transition>
    </RouterView>
  </DefaultLayout>
  <Toaster
    position="bottom-right"
    :theme="toasterTheme"
    :toast-options="{ duration: 4000 }"
    class="pointer-events-auto"
  />
</template>
