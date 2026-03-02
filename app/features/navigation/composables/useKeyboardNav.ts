// features/navigation/composables/useKeyboardNav.ts

/**
 * useKeyboardNav
 *
 * Encapsulates: global keyboard shortcuts for page navigation (g-h, g-i, g-c, g-s)
 * Used by: app/shell/layouts/default.vue (called at app-wide level)
 * NOT for: component-level shortcuts (those live in the component that uses them)
 *
 * Returns: void (side-effect only — registers shortcuts)
 */
export function useKeyboardNav() {
  const router = useRouter()

  defineShortcuts({
    'g-h': () => router.push('/'),       // Go to Home
    'g-i': () => router.push('/inbox'),   // Go to Inbox
    'g-c': () => router.push('/customers'), // Go to Customers
    'g-s': () => router.push('/settings')   // Go to Settings
  })
}
