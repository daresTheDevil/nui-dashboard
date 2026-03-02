# Feature: Settings

## What this does
Provides the settings panel with tabbed sub-navigation (General, Members,
Notifications, Security) and a Documentation external link. Each tab is a
separate nested route rendered via NuxtPage.

## Route
`/settings` — defined in `app/pages/settings.vue` (stub only)
Sub-routes: `/settings/members`, `/settings/notifications`, `/settings/security`

## Components in this feature
- `page.vue` — settings wrapper with sub-navigation tabs and NuxtPage slot
- `components/SettingsGeneral.vue` — profile form (name, email, username, avatar, bio)
- `components/SettingsMembers.vue` — members management page (fetches from /api/members)
- `components/SettingsMembersList.vue` — presentational member list with role selectors
- `components/SettingsNotifications.vue` — notification preference toggles
- `components/SettingsSecurity.vue` — password change form and account deletion

## Data flow
page.vue → static nav config, renders NuxtPage
SettingsGeneral → local reactive state (profile form), Zod validation
SettingsMembers → useFetch → /api/members → Member[]
  → filtered by search → passed as props to SettingsMembersList
SettingsNotifications → local reactive state (toggle switches)
SettingsSecurity → local reactive state (password form), Zod validation

## API endpoints consumed
- `GET /api/members` — returns Member[] — see server/api/members.ts

## Types
All types in `./types.ts`: Member.

## State
- Profile form state (SettingsGeneral) — reactive Partial<ProfileSchema>
- Members search filter (SettingsMembers) — Ref<string>
- Notification toggles (SettingsNotifications) — reactive { [key]: boolean }
- Password form state (SettingsSecurity) — reactive Partial<PasswordSchema>

## Patterns used
- Nested route pattern with NuxtPage in page.vue
- Sub-page components imported by route stubs in app/pages/settings/
- Zod schemas defined inline (settings forms are self-contained)

## DO NOT
- Add data fetching to SettingsMembersList — it's presentational, receives members via props
- Merge all settings sub-pages into a single component — they're separate routes
- Import from other feature directories directly
