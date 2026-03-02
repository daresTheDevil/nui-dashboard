// shared/composables/useNotifications.ts

import { createSharedComposable } from '@vueuse/core'

/**
 * useNotifications
 *
 * Encapsulates: notifications slideover open/close state + 'n' keyboard shortcut
 * Used by: app/shell/components/NotificationsSlideover.vue (reads state),
 *          app/features/dashboard/page.vue (toggles state via notification bell button)
 * NOT for: notification data fetching (that's in NotificationsSlideover itself)
 *
 * Returns:
 *   isNotificationsSlideoverOpen: Ref<boolean> — whether the slideover is visible
 */
const _useNotifications = () => {
  const route = useRoute()
  const isNotificationsSlideoverOpen = ref(false)

  // Toggle notifications slideover with 'n' key
  defineShortcuts({
    'n': () => isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value
  })

  // Close slideover on route change
  watch(() => route.fullPath, () => {
    isNotificationsSlideoverOpen.value = false
  })

  return {
    isNotificationsSlideoverOpen
  }
}

export const useNotifications = createSharedComposable(_useNotifications)
