<script setup lang="ts">
import { Settings2 } from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/shadcn/ui/sidebar'

const route = useRoute()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Settings</SidebarGroupLabel>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          as-child
          :is-active="route.name === 'settings'"
          tooltip="Settings"
        >
          <RouterLink :to="{ name: 'settings' }">
            <Settings2 />
            <span>Settings</span>
          </RouterLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
