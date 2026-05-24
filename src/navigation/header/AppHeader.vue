<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shadcn/ui/breadcrumb'
import { Separator } from '@/components/shadcn/ui/separator'
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
      <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb class="min-w-0">
        <BreadcrumbList class="min-w-0">
          <BreadcrumbItem class="hidden md:block">
            <BreadcrumbLink href="#"> Building Your Application </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage class="truncate">Data Fetching</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <div class="flex shrink-0 items-center gap-1 px-4">
      <GithubLink />
      <ThemeToggle />
    </div>
  </header>
</template>
