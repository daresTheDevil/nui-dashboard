<!-- shell/components/AppSidebar.vue -->
<script setup lang="ts">
// CONTRACT: Presentational only — no data fetching, no side effects.
// Parent: shell/layouts/default.vue
// Props in: primaryNav: NavigationMenuItem[] — see features/navigation/types.ts
//           footerNav: NavigationMenuItem[] — see features/navigation/types.ts
// Emits out: update:open: boolean (via v-model)
//
// Renders the dashboard sidebar with TeamsMenu header, search button,
// two navigation menu groups, and UserMenu footer.
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  primaryNav: NavigationMenuItem[]
  footerNav: NavigationMenuItem[]
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <UDashboardSidebar
    id="default"
    v-model:open="open"
    collapsible
    resizable
    class="bg-elevated/25"
    :ui="{ footer: 'lg:border-t lg:border-default' }"
  >
    <template #header="{ collapsed }">
      <TeamsMenu :collapsed="collapsed" />
    </template>

    <template #default="{ collapsed }">
      <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="primaryNav"
        orientation="vertical"
        tooltip
        popover
      />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="footerNav"
        orientation="vertical"
        tooltip
        class="mt-auto"
      />
    </template>

    <template #footer="{ collapsed }">
      <UserMenu :collapsed="collapsed" />
    </template>
  </UDashboardSidebar>
</template>
