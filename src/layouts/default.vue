<script setup lang="ts">
import AppSidebar from '@/navigation/aside/AppSidebar.vue'
import AppHeader from '@/navigation/header/AppHeader.vue'
import { SidebarInset, SidebarProvider } from '@/components/shadcn/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <AppHeader />
      <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
