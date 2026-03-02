// features/navigation/composables/useSidebar.ts

/**
 * useSidebar
 *
 * Encapsulates: mobile sidebar open/close state
 * Used by: app/shell/layouts/default.vue (v-model:open on AppSidebar)
 * NOT for: collapsed state (managed by UDashboardSidebar internally),
 *   or auto-close on route change (UDashboardSidebar autoClose=true handles that)
 *
 * Returns:
 *   isOpen: Ref<boolean> — whether the mobile sidebar is open
 *   toggle: () => void — toggles the sidebar
 *   close: () => void — closes the sidebar
 */
export function useSidebar() {
  const isOpen = ref(false)
  const toggle = () => { isOpen.value = !isOpen.value }
  const close = () => { isOpen.value = false }

  return { isOpen, toggle, close }
}
