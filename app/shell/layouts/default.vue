<!--
  LAYOUT: default

  Wiring only — no business logic lives here.

  Navigation config → features/navigation/composables/useNavigation.ts
  Sidebar state     → features/navigation/composables/useSidebar.ts
  Keyboard nav      → features/navigation/composables/useKeyboardNav.ts (g-h, g-i, g-c, g-s)
  Cookie consent    → shell/composables/useCookieConsent.ts
  Command palette   → shell/components/AppCommandPalette.vue

  To change navigation items: edit useNavigation.ts
  To change sidebar behavior: edit useSidebar.ts
  To change keyboard shortcuts: edit useKeyboardNav.ts
  To change the shell structure: edit this file
-->
<script setup lang="ts">
import { useNavigation } from '~/features/navigation/composables/useNavigation'
import { useSidebar } from '~/features/navigation/composables/useSidebar'
import { useKeyboardNav } from '~/features/navigation/composables/useKeyboardNav'
import { useCookieConsent } from '~/shell/composables/useCookieConsent'

const { links, primaryNav, footerNav } = useNavigation()
const { isOpen } = useSidebar()

useKeyboardNav()
useCookieConsent()
</script>

<template>
  <UDashboardGroup unit="rem">
    <AppSidebar
      v-model:open="isOpen"
      :primary-nav="primaryNav"
      :footer-nav="footerNav"
    />

    <AppCommandPalette :links="links" />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
