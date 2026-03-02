# Patterns — How to Work in This Codebase

This file is the source of truth for how to add, modify, or extend features.
Follow these scaffolds exactly. Do not invent new patterns — extend these.

---

## How to add a new feature page

### Step 1: Create the feature directory

```
app/features/[feature-name]/
  page.vue
  types.ts
  README.md
```

Add `components/` and `composables/` subdirectories only if needed.

### Step 2: Scaffold `types.ts`

```ts
// features/[feature-name]/types.ts
// All types for this feature. Import from here within the feature.
// If a type is needed by 2+ features, move it to shared/types/

export interface [FeatureName]Item {
  id: string
  // ...
}

export interface [FeatureName]PageData {
  items: [FeatureName]Item[]
  // ...
}
```

### Step 3: Scaffold `page.vue`

```vue
<!-- features/[feature-name]/page.vue -->
<!-- SCOPE: Route entry point for /[route-path] -->
<!-- DATA: Fetches all data for this feature. Child components receive props only. -->
<!-- CHILDREN: lists child components used here -->
<script setup lang="ts">
import type { [FeatureName]PageData } from './types'

definePageMeta({
  // add any route meta here
})

const { data, status, error } = await useAsyncData<[FeatureName]PageData>(
  '[feature-name]',
  () => $fetch('/api/[feature-name]')
)
</script>

<template>
  <UDashboardPage>
    <UDashboardPageHeader title="[Feature Name]" />

    <UDashboardPageBody>
      <div v-if="status === 'pending'">Loading...</div>
      <div v-else-if="error">Error loading data</div>
      <template v-else>
        <!-- child components go here, data passed as props -->
      </template>
    </UDashboardPageBody>
  </UDashboardPage>
</template>
```

### Step 4: Scaffold a presentational component

```vue
<!-- features/[feature-name]/components/[ComponentName].vue -->
<script setup lang="ts">
// CONTRACT: Presentational only. Receives data via props, emits events.
// Parent: features/[feature-name]/page.vue
// Data shape: see ../types.ts → [FeatureName]Item
import type { [FeatureName]Item } from '../types'

const props = defineProps<{
  items: [FeatureName]Item[]
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [item: [FeatureName]Item]
}>()
</script>

<template>
  <div>
    <!-- render props.items here -->
  </div>
</template>
```

### Step 5: Scaffold a data composable (if needed)

Only create this if the data logic is complex enough to warrant extraction from `page.vue`.

```ts
// features/[feature-name]/composables/use[FeatureName]Data.ts
// Encapsulates data fetching and derived state for the [feature-name] feature.
// Used by: features/[feature-name]/page.vue only

import type { [FeatureName]PageData } from '../types'

export function use[FeatureName]Data() {
  const { data, status, error, refresh } = useAsyncData<[FeatureName]PageData>(
    '[feature-name]',
    () => $fetch('/api/[feature-name]')
  )

  // derived state goes here
  const itemCount = computed(() => data.value?.items.length ?? 0)

  return {
    data,
    status,
    error,
    refresh,
    itemCount
  }
}
```

### Step 6: Create the route stub in `app/pages/`

```vue
<!-- app/pages/[route-path].vue -->
<script setup lang="ts">
// Route stub — logic lives in features/[feature-name]/page.vue
import [FeatureName]Page from '~/features/[feature-name]/page.vue'
</script>
<template>
  <[FeatureName]Page />
</template>
```

### Step 7: Add to navigation

Edit `app/features/navigation/composables/useNavigation.ts` and add to the
appropriate nav group. Follow the existing entry pattern exactly.

### Step 8: Write the feature README.md

See the README template below.

### Step 9: Add the server endpoint

See the server endpoint scaffold below.

---

## Feature README.md template

Every feature directory must have this file. Fill in all sections.

```markdown
# Feature: [Feature Name]

## What this does
[One paragraph. What does this feature display or allow the user to do?]

## Route
`/[route-path]` — defined in `app/pages/[route-path].vue` (stub only)

## Components in this feature
- `page.vue` — route entry, fetches all data, composes child components
- `components/[ComponentName].vue` — [one line description, what props it takes]

## Data flow
page.vue → useAsyncData → /api/[endpoint]
→ passes [TypeName] as props to child components
→ child components emit [event names] back up

## API endpoints consumed
- `GET /api/[endpoint]` — returns [TypeName][] — see server/features/[name]/

## Types
All types in `./types.ts`. Do not import types from other feature directories.

## State
[Describe any local reactive state. If none, write "No local state — all data from API."]

## Patterns used
- [list patterns from this file that apply]

## DO NOT
- [list things that would be easy mistakes to make in this feature]
- Fetch data inside child components
- Import from other feature directories directly
```

---

## How to add a server endpoint

```ts
// server/features/[feature-name]/[action].get.ts
// Endpoint: GET /api/[feature-name]/[action]
// Returns: [TypeName][]
// Auth: [required/not required]
import { z } from 'zod'

// Request validation (query params)
const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  // add params as needed
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)

  // fetch/transform data here

  return {
    data: [] as [TypeName][],
    meta: {
      total: 0,
      limit: query.limit
    }
  }
})
```

---

## How to extract logic from `shell/layouts/default.vue`

The layout file should only contain wiring. If you find logic in it, extract it:

**Navigation config** → `features/navigation/composables/useNavigation.ts`
```ts
export function useNavigation() {
  const route = useRoute()
  
  const primaryNav = computed(() => [
    // nav items here
  ] satisfies NavigationMenuItem[][])

  return { primaryNav }
}
```

**Sidebar state** → `features/navigation/composables/useSidebar.ts`
```ts
export function useSidebar() {
  const isOpen = ref(false)
  const toggle = () => { isOpen.value = !isOpen.value }
  const close = () => { isOpen.value = false }

  return { isOpen, toggle, close }
}
```

**The layout after extraction:**
```vue
<!-- shell/layouts/default.vue — wiring only, target <80 lines -->
<script setup lang="ts">
import { useNavigation } from '~/features/navigation/composables/useNavigation'
import { useSidebar } from '~/features/navigation/composables/useSidebar'

const { primaryNav, footerNav } = useNavigation()
const { isOpen, toggle } = useSidebar()
</script>

<template>
  <UDashboardLayout>
    <AppSidebar :nav="primaryNav" :footer-nav="footerNav" :open="isOpen" @toggle="toggle" />
    <UDashboardMain>
      <AppHeader @sidebar-toggle="toggle" />
      <slot />
    </UDashboardMain>
    <AppCommandPalette />
  </UDashboardLayout>
</template>
```

---

## Component contract comment format

Every `<script setup>` in a feature component must start with this block:

```ts
// CONTRACT: [Presentational only | Has side effects | Fetches own data — explain why]
// Parent: [which file uses this component]
// Props in: [prop names and types, or "none"]
// Emits out: [event names, or "none"]
// Data shape: [where to find the types]
```

---

## What goes where — quick reference

| Thing | Location |
|---|---|
| New page/route | `features/[name]/page.vue` + stub in `pages/` |
| Feature-specific types | `features/[name]/types.ts` |
| Shared types (2+ features) | `shared/types/[name].ts` |
| Data fetching | `features/[name]/composables/use[Name]Data.ts` |
| Presentational component | `features/[name]/components/[Name].vue` |
| Truly reusable UI primitive | `shared/components/[Name].vue` |
| Server endpoint | `server/features/[name]/[action].get.ts` |
| Zod schema (server-side) | `server/shared/schemas/[name].schema.ts` |
| Navigation items | `features/navigation/composables/useNavigation.ts` |
| Sidebar behavior | `features/navigation/composables/useSidebar.ts` |
| Layout shell changes | `shell/layouts/default.vue` (wiring only) |
| AI context | `.ai/ARCHITECTURE.md` or feature `README.md` |

---

## Migration checklist (for restructuring existing code)

When moving an existing file to the new structure:

- [ ] Create target directory and move file
- [ ] Update all imports that referenced the old path
- [ ] Add contract comment to component `<script setup>`
- [ ] Create/update `types.ts` — extract any inline types from the component
- [ ] Create feature `README.md` if it doesn't exist
- [ ] Verify `pnpm dev` still runs and the route still resolves
- [ ] Verify TypeScript: `pnpm typecheck` passes
