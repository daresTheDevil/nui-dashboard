// features/navigation/types.ts
// All types for the navigation feature.
// Import from here within the feature. Move to shared/types/ only if used by 2+ features.

import type { NavigationMenuItem } from '@nuxt/ui'

/** A single group of navigation items rendered by one UNavigationMenu instance */
export type NavigationGroup = NavigationMenuItem[]

/** The full nav config: two groups (primary + footer) passed as NavigationMenuItem[][] */
export type NavigationConfig = NavigationGroup[]
