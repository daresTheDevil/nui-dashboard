# Feature: Navigation

## What this does
Provides the sidebar navigation configuration and state for the dashboard shell.
Defines which links appear in the primary and footer sections of the sidebar,
and manages the mobile sidebar open/close state.

## Route
N/A — this is a non-page feature consumed by the shell layout.

## Components in this feature
None — this feature is composables-only.

## Composables
- `composables/useNavigation.ts` — returns `{ links, primaryNav, footerNav }` navigation item arrays
- `composables/useSidebar.ts` — returns `{ isOpen, toggle, close }` for mobile sidebar state

## Data flow
useNavigation() → static NavigationMenuItem[][] config
→ consumed by AppSidebar.vue (renders UNavigationMenu)
→ consumed by AppCommandPalette.vue (flattened into search groups)

useSidebar() → reactive ref for mobile sidebar open state
→ bound to UDashboardSidebar via v-model:open

## Types
All types in `./types.ts`. Re-exports `NavigationMenuItem` from `@nuxt/ui`.

## State
- `isOpen: Ref<boolean>` — mobile sidebar visibility (useSidebar)
- Navigation items are static (not reactive) — no API dependency

## Patterns used
- Composable extraction from layout (PATTERNS.md § "How to extract logic from shell/layouts/default.vue")
- Types co-located in feature directory

## DO NOT
- Add route-specific logic to useNavigation — it returns static config only
- Add onSelect callbacks to close the sidebar — UDashboardSidebar autoClose handles this
- Import from other feature directories directly
