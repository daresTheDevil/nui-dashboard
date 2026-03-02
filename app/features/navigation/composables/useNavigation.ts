// features/navigation/composables/useNavigation.ts
// All types for the navigation feature.
// Import from here within the feature. Move to shared/types/ only if used by 2+ features.

import type { NavigationMenuItem } from '@nuxt/ui'

/**
 * useNavigation
 *
 * Encapsulates: static sidebar navigation item configuration (two groups)
 * Used by: app/shell/components/AppSidebar.vue, app/shell/components/AppCommandPalette.vue
 * NOT for: dynamic nav items, route-dependent visibility, or sidebar open/close state (see useSidebar)
 *
 * Returns:
 *   links: NavigationMenuItem[][] — full config, both groups (used by command palette)
 *   primaryNav: NavigationMenuItem[] — main nav items (Home, Inbox, Customers, Settings)
 *   footerNav: NavigationMenuItem[] — bottom nav items (Feedback, Help & Support)
 */
export function useNavigation() {
  // Group 0: Primary navigation — main dashboard pages
  // Settings has nested children shown via popover when sidebar is collapsed
  const links: NavigationMenuItem[][] = [[{
    label: 'Home',
    icon: 'i-lucide-house',
    to: '/'
  }, {
    label: 'Inbox',
    icon: 'i-lucide-inbox',
    to: '/inbox',
    badge: '4'
  }, {
    label: 'Customers',
    icon: 'i-lucide-users',
    to: '/customers'
  }, {
    label: 'Settings',
    to: '/settings',
    icon: 'i-lucide-settings',
    defaultOpen: true,
    type: 'trigger',
    children: [{
      label: 'General',
      to: '/settings',
      exact: true
    }, {
      label: 'Members',
      to: '/settings/members'
    }, {
      label: 'Notifications',
      to: '/settings/notifications'
    }, {
      label: 'Security',
      to: '/settings/security'
    }]
  }],
  // Group 1: Footer navigation — external links pinned to sidebar bottom
  [{
    label: 'Feedback',
    icon: 'i-lucide-message-circle',
    to: 'https://github.com/nuxt-ui-templates/dashboard',
    target: '_blank'
  }, {
    label: 'Help & Support',
    icon: 'i-lucide-info',
    to: 'https://github.com/nuxt-ui-templates/dashboard',
    target: '_blank'
  }]]

  const primaryNav = links[0]!
  const footerNav = links[1]!

  return {
    links,
    primaryNav,
    footerNav
  }
}
