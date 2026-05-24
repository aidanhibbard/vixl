<script setup lang="ts">
import { SidebarTrigger } from '@/components/shadcn/ui/sidebar'
import GithubLink from '@/navigation/header/GithubLink.vue'
import ThemeToggle from '@/navigation/header/ThemeToggle.vue'
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
  >
    <div class="flex min-w-0 flex-1 items-center gap-2 px-4">
      <SidebarTrigger class="-ml-1" />
    </div>
    <div class="flex shrink-0 items-center gap-1 px-4">
      <GithubLink />
      <ThemeToggle />
    </div>
  </header>
</template>
