<script setup lang="ts">
import { PanelsTopLeft } from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/shadcn/ui/sidebar'

const route = useRoute()
</script>

<template>
  <SidebarGroup>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          as-child
          :is-active="route.name === 'index'"
          tooltip="Home"
        >
          <RouterLink :to="{ name: 'index' }">
            <PanelsTopLeft />
            <span>Home</span>
          </RouterLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroup>
</template>
