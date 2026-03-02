# Claude Code Instructions — Dashboard AI-First Restructure

## Project goal
Restructure the nuxt-ui-templates/dashboard project from convention-implicit
to AI-first architecture. See .ai/ARCHITECTURE.md for the target structure.

## Current state
Fully restructured into AI-first architecture (Phases 0–9 complete).
All features live in `app/features/`, shell components in `app/shell/`,
shared types and composables in `app/shared/`. No transition barrels remain.
See `.ai/handoff.md` for the full directory tree and rationale.

## Your job
When asked to work on this project, follow the patterns in .ai/PATTERNS.md exactly.
Before touching any file, read the relevant feature README.md if one exists.

## Constraints
- Do not break the running app at any intermediate step
- Preserve all existing functionality while restructuring
- Pages must still resolve and API routes must still work after every change
- TypeScript must stay clean — no `any` escapes
- Run `pnpm typecheck` after each phase to verify

## Key files to read before starting work
1. .ai/ARCHITECTURE.md — target structure and rationale
2. .ai/PATTERNS.md — how to add/move features
3. nuxt.config.ts — understand module config before touching it

---

## Documentation Standards (required on every file you create or modify)

This is not optional. Every file must be self-documenting so that any developer
or AI agent landing on it cold understands what it does, who owns it, and where
to look next — without reading the entire file.

### Page components (`features/*/page.vue`)

Every page must open with this header block:

```vue
<!--
  PAGE: [Feature Name]
  ROUTE: /[route-path]
  
  Responsibility: Route entry point. Fetches all data for this feature.
  Child components receive data via props — they do not fetch.

  Data flow:
    useAsyncData → /api/[endpoint] → [TypeName]
    → passed as props to: [list child components]

  Emits from children:
    [ComponentName] emits [eventName] → handled by [handlerName] here

  See also:
    - ./types.ts for data shapes
    - ./composables/use[Name]Data.ts if data logic was extracted
    - server/features/[name]/ for API endpoints
-->
```

### Presentational components (`features/*/components/*.vue`)

Every component must open its `<script setup>` with this contract block:

```ts
// CONTRACT: Presentational only — no data fetching, no side effects.
// Parent: features/[feature-name]/page.vue
// Props in: [prop name]: [TypeName] — see ../types.ts
// Emits out: [event name]: [payload type] | none
//
// [One sentence describing what this component renders or does.]
```

If the component has side effects or fetches its own data (rare, must be justified):

```ts
// CONTRACT: [Describe the side effect or why it fetches its own data.]
// This is an exception to the presentational pattern because: [reason]
```

### Composables (`features/*/composables/*.ts`)

```ts
/**
 * [composableName]
 *
 * Encapsulates: [what logic lives here — state, derived values, API calls]
 * Used by: [which files use this — be specific]
 * NOT for: [what this composable should not be asked to do]
 *
 * Returns:
 *   [returnValue]: [type] — [what it represents]
 *   [returnValue]: [type] — [what it represents]
 */
```

### Types files (`features/*/types.ts`)

Every type must have an inline comment explaining what it represents in the domain:

```ts
// features/[name]/types.ts
// All types for the [feature-name] feature.
// Import from here within the feature. Move to shared/types/ only if used by 2+ features.

/** Represents a single [entity] as returned by GET /api/[endpoint] */
export interface [TypeName] {
  id: string          // unique identifier
  name: string        // display name shown in [ComponentName]
  // ...
}

/** Aggregated data shape for the [feature-name] page */
export interface [FeatureName]PageData {
  items: [TypeName][]
  // ...
}
```

### Server endpoints (`server/features/**/*.ts`)

```ts
/**
 * [HTTP METHOD] /api/[path]
 *
 * [One sentence: what does this endpoint return or do]
 *
 * Auth: [required / not required / role required]
 * Query params: [param]: [type] — [description] | none
 * Body: [shape] | none
 * Returns: [TypeName] | [TypeName][]
 * Errors: [list notable error conditions]
 */
```

### Navigation composable (`features/navigation/composables/useNavigation.ts`)

Each nav group and item should have a comment explaining what it links to and
any conditions under which it appears or is hidden.

### Shell layout (`shell/layouts/default.vue`)

```vue
<!--
  LAYOUT: default
  
  Wiring only — no business logic lives here.
  
  Navigation config → features/navigation/composables/useNavigation.ts
  Sidebar state     → features/navigation/composables/useSidebar.ts
  Command palette   → shell/components/AppCommandPalette.vue
  
  To change navigation items: edit useNavigation.ts
  To change sidebar behavior: edit useSidebar.ts
  To change the shell structure: edit this file
-->
```

### Route stubs (`app/pages/*.vue`)

```vue
<!--
  ROUTE STUB: /[path]
  
  This file exists only to satisfy Nuxt's file-based routing.
  All logic lives in features/[feature-name]/page.vue.
  
  Do not add logic here.
-->
```

### `nuxt.config.ts`

Each non-obvious config block should have a comment explaining why it exists,
not just what it does. Example:

```ts
// Route stubs in app/pages/ delegate to features/ — see .ai/ARCHITECTURE.md
// for why we use this pattern instead of disabling file-based routing entirely
```

---

## What "done" looks like for each file

Before considering any file complete, verify:
- [ ] Header/contract comment block is present and filled in (not left as scaffold placeholder)
- [ ] All types are imported from `types.ts`, not defined inline
- [ ] No data fetching inside presentational components
- [ ] TypeScript compiles cleanly
- [ ] If it's a new feature: `README.md` exists in the feature directory
