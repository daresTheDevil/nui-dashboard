# Nuxt Dashboard — AI-First Architecture

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

A Nuxt dashboard restructured from convention-implicit layout into an **AI-first architecture** — where every file is self-documenting, every feature is co-located, and any developer or AI agent can land on a file cold and understand what it does, who owns it, and where to look next.

Forked from the [Nuxt UI Dashboard Template](https://github.com/nuxt-ui-templates/dashboard).

## Why AI-First?

Nuxt's conventions are powerful but silent. A new contributor (human or AI) reading `components/home/HomeChart.client.vue` has no idea what data it expects, who calls it, or what it emits — without reading multiple files across the tree.

The AI-first restructure makes every decision **explicit**:

- **Contract comments** at every component boundary declare props, emits, and parent
- **Co-located types** so you never chase imports across the tree
- **Feature READMEs** give full context before touching a single line
- **A shell layer** that wires things together without containing business logic

## Project Structure

```
app/
  features/               # domain-first, not type-first
    dashboard/             # page.vue, types.ts, README.md, components/
    inbox/                 # page.vue, types.ts, README.md, components/
    customers/             # page.vue, types.ts, README.md, components/
    settings/              # page.vue, types.ts, README.md, components/
    navigation/            # composables-only (useNavigation, useSidebar, useKeyboardNav)
  shell/                   # layout infrastructure — no business logic
    layouts/default.vue    # ~40 lines, wiring only
    components/            # AppSidebar, AppCommandPalette, NotificationsSlideover, etc.
  shared/                  # only things used by 2+ features
    types/                 # User, Notification
    composables/           # useNotifications
  pages/                   # thin route stubs that delegate to features/
server/
  features/                # canonical handler logic
  api/                     # thin re-export stubs (Nitro only auto-routes from here)
.ai/                       # agent context layer (not compiled, not deployed)
  ARCHITECTURE.md          # target structure and design philosophy
  PATTERNS.md              # scaffolds for adding/modifying features
  HANDOFF.md               # migration log and key decisions
```

## Key Patterns

### Route stubs delegate to features

Nuxt's file-based routing is preserved, but pages are thin stubs. All logic lives in the feature:

```vue
<!-- app/pages/index.vue -->
<!--
  ROUTE STUB: /
  This file exists only to satisfy Nuxt's file-based routing.
  All logic lives in features/dashboard/page.vue.
  Do not add logic here.
-->
<script setup lang="ts">
import DashboardPage from '~/features/dashboard/page.vue'
</script>
<template>
  <DashboardPage />
</template>
```

### Component contracts

Every component's `<script setup>` opens with a contract block — no guessing what it does:

```ts
// CONTRACT: Presentational only — no data fetching, no side effects.
// Parent: features/dashboard/page.vue
// Props in: range: Range — see ../types.ts
// Emits out: update:modelValue: Period (via v-model)
//
// Renders a select dropdown for period (daily/weekly/monthly).
```

Components with side effects declare why:

```ts
// CONTRACT: Has side effects — generates mock chart data from period/range props.
// This is an exception to the presentational pattern because: generates random
// mock data locally (no API call) and uses watch to re-generate on prop changes.
```

### Co-located types

Each feature owns its types. No barrel files, no chasing imports:

```ts
// features/dashboard/types.ts
// All types for the dashboard feature.
// Import from here within the feature. Move to shared/types/ only if used by 2+ features.

/** A dashboard stat card as rendered by DashboardStats */
export interface Stat {
  title: string          // card heading (e.g. "Total Revenue")
  icon: string           // iconify icon name
  value: number | string // display value
  variation: number      // percentage change
}
```

### Server API stubs

Nitro only auto-routes from `server/api/`. Canonical logic lives in `server/features/`, with thin stubs that re-export:

```ts
// server/api/customers.ts — re-export stub
export { default } from '../features/customers/index'
```

### Shell layout — wiring only

The shell layout imports composables and composes components. No business logic, no nav config:

```vue
<!--
  LAYOUT: default
  Wiring only — no business logic lives here.
  Navigation config → features/navigation/composables/useNavigation.ts
  Sidebar state     → features/navigation/composables/useSidebar.ts
-->
```

## Data Flow Rules

1. **Page components** (`page.vue`) own all data fetching
2. **Child components** receive data via props, emit events — they never fetch
3. **Types** are imported from `types.ts`, never defined inline
4. **Features do not import from each other** — shared needs go in `shared/`

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Typecheck

```bash
pnpm typecheck
```

## Production

```bash
pnpm build
pnpm preview
```

## Working in This Codebase

Before making changes, read these files in order:

1. `.ai/ARCHITECTURE.md` — design philosophy and rules
2. `.ai/PATTERNS.md` — scaffolds for adding/modifying features
3. The feature's `README.md` — context for the specific feature you're touching
4. `CLAUDE.md` — documentation standards for every file type
