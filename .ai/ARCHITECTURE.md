# Architecture — AI-First Dashboard

## Design Philosophy

This project follows **AI-first conventions**: every structural decision is made to
minimize the context an AI coding agent needs to load before making a correct change.

Core principle: **explicit over implicit**. Nuxt's conventions are powerful but silent.
We make them loud — contracts at component boundaries, co-located feature context,
and a layout shell that wires pieces together rather than containing logic.

---

## Target Directory Structure

```
app/
  features/                        ← domain-first, not type-first
    dashboard/
      page.vue                     ← route entry point (was pages/index.vue)
      types.ts                     ← ALL types for this feature live here
      README.md                    ← AI context: what this feature does, data flow, constraints
      components/
        StatCards.vue              ← presentational only, props-in/events-out
        RevenueChart.vue           ← presentational only, props-in/events-out
      composables/
        useDashboardData.ts        ← all data fetching for this feature
    settings/
      page.vue                     ← was pages/settings/index.vue
      types.ts
      README.md
      components/
        ProfileForm.vue            ← was pages/settings/profile.vue logic
        MembersTable.vue           ← was pages/settings/members.vue logic
        NotificationPrefs.vue      ← was pages/settings/notifications.vue logic
      composables/
        useSettingsForm.ts
    navigation/
      types.ts
      README.md
      composables/
        useNavigation.ts           ← nav item config extracted from default.vue
        useSidebar.ts              ← sidebar open/close state extracted from default.vue

  shell/                           ← layout infrastructure only, no business logic
    layouts/
      default.vue                  ← wiring only, target <80 lines
    components/
      AppSidebar.vue
      AppHeader.vue
      AppCommandPalette.vue

  shared/                          ← only things used by 2+ features
    components/                    ← truly reusable UI primitives
    composables/                   ← truly shared composables
    types/
      api.ts                       ← shared API response envelope shapes

server/
  features/                        ← mirrors app/features structure
    dashboard/
      stats.get.ts
      revenue.get.ts
    settings/
      profile.put.ts
      members.get.ts
    notifications/
      index.get.ts
  shared/
    schemas/                       ← Zod schemas, imported by both route handlers and client
      user.schema.ts
      notification.schema.ts

.ai/                               ← agent context layer (not compiled, not deployed)
  ARCHITECTURE.md                  ← this file
  PATTERNS.md                      ← scaffolds for adding new features
```

---

## Rules

### Feature boundaries
- A feature owns its components, composables, and types
- Features do NOT import from each other — use `shared/` if something is needed by 2+
- If you're unsure whether something belongs in a feature or shared, put it in the feature first

### Data flow (non-negotiable)
- **Page-level components** (`page.vue`) do ALL data fetching via `useAsyncData` or `useFetch`
- **Presentational components** (everything in `components/`) receive data via props, emit events — they NEVER fetch
- Loading and error states are handled in `page.vue`, not in child components

### Component contracts
Every component's `<script setup>` block must start with a contract comment:

```ts
// CONTRACT: Presentational only. Receives data via props, emits nothing.
// Parent: features/dashboard/page.vue
// Data shape: see ../types.ts → DashboardStat[]
```

### Types
- Feature-specific types live in `features/[name]/types.ts`
- Shared API envelope types live in `shared/types/api.ts`
- No inline type definitions in `.vue` files — define in `types.ts`, import
- Zod schemas for server validation live in `server/shared/schemas/`

### Shell layout
- `shell/layouts/default.vue` contains ONLY wiring (imports + template composition)
- No business logic, nav config, or state in the layout file
- All sidebar/nav behavior extracted to `features/navigation/composables/`

### README.md per feature
Every feature directory requires a `README.md`. See PATTERNS.md for the template.
This is the first file an AI agent reads before touching a feature.

---

## Migration Map (original → target)

| Original | Target |
|---|---|
| `app/pages/index.vue` | `app/features/dashboard/page.vue` |
| `app/pages/settings/index.vue` | `app/features/settings/page.vue` |
| `app/pages/settings/profile.vue` | `app/features/settings/components/ProfileForm.vue` |
| `app/pages/settings/members.vue` | `app/features/settings/components/MembersTable.vue` |
| `app/pages/settings/notifications.vue` | `app/features/settings/components/NotificationPrefs.vue` |
| `app/layouts/default.vue` (nav config) | `app/features/navigation/composables/useNavigation.ts` |
| `app/layouts/default.vue` (sidebar state) | `app/features/navigation/composables/useSidebar.ts` |
| `app/layouts/default.vue` (shell) | `app/shell/layouts/default.vue` |
| `server/api/notifications.get.ts` | `server/features/notifications/index.get.ts` |
| `server/api/users.get.ts` | `server/features/settings/members.get.ts` |

---

## Nuxt Router Note

Because we're moving pages out of `app/pages/`, we declare routes explicitly in
`nuxt.config.ts` using `pages: false` + `router.pages` or by using Nuxt layers.
The simpler approach: keep stub files in `app/pages/` that just import and re-export
from `features/`:

```vue
<!-- app/pages/index.vue — stub only -->
<script setup lang="ts">
// Route stub. All logic in features/dashboard/page.vue
</script>
<template>
  <DashboardPage />
</template>
```

This preserves Nuxt's file-based routing while keeping feature logic co-located.
