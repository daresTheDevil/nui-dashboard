# Handoff: AI-First Dashboard Restructure

> Written after completing Phases 0–9. The app compiles, typechecks, and serves
> every route + API endpoint cleanly. All transition scaffolding has been removed.

---

## What was done

The nuxt-ui-templates/dashboard project was restructured from Nuxt's default
convention-implicit layout into an **AI-first architecture** where every file is
self-documenting and every feature is co-located with its types, components,
composables, and a README.

### Before (convention-implicit)
```
app/
  layouts/default.vue        ← 163 lines of mixed nav config, sidebar state, cookie logic
  pages/*.vue                ← page logic inline
  components/home/*.vue      ← components grouped by convention, no explicit contracts
  components/inbox/*.vue
  components/customers/*.vue
  components/settings/*.vue
  types/index.d.ts           ← single barrel of every type in the project
  composables/useDashboard.ts ← mixed keyboard nav + notification state
server/
  api/*.ts                   ← flat list of handlers
```

### After (AI-first)
```
app/
  features/
    dashboard/               ← page.vue, types.ts, README.md, components/
    inbox/                   ← page.vue, types.ts, README.md, components/
    customers/               ← page.vue, types.ts, README.md, components/
    settings/                ← page.vue, types.ts, README.md, components/
    navigation/              ← composables-only feature (useNavigation, useSidebar, useKeyboardNav)
  shell/
    layouts/default.vue      ← ~40 lines, wiring only (keyboard nav, sidebar, cookie consent)
    components/              ← AppSidebar, AppCommandPalette, NotificationsSlideover, TeamsMenu, UserMenu
    composables/             ← useCookieConsent.ts
  shared/
    types/                   ← user.ts, notification.ts (used by 2+ features)
    composables/             ← useNotifications.ts (shared slideover state)
  pages/                     ← thin route stubs that import from features/
server/
  features/                  ← canonical handler logic (customers, inbox, settings, notifications)
  api/                       ← thin re-export stubs (Nitro only auto-routes from here)
```

---

## Directory tree (final)

```
app/
  features/
    customers/
      components/
        CustomersAddModal.vue
        CustomersDeleteModal.vue
      page.vue
      README.md
      types.ts
    dashboard/
      components/
        DashboardChart.client.vue
        DashboardChart.server.vue
        DashboardDateRangePicker.vue
        DashboardPeriodSelect.vue
        DashboardSales.vue
        DashboardStats.vue
      page.vue
      README.md
      types.ts
    inbox/
      components/
        InboxList.vue
        InboxMail.vue
      page.vue
      README.md
      types.ts
    navigation/
      composables/
        useKeyboardNav.ts
        useNavigation.ts
        useSidebar.ts
      README.md
      types.ts
    settings/
      components/
        SettingsGeneral.vue
        SettingsMembers.vue
        SettingsMembersList.vue
        SettingsNotifications.vue
        SettingsSecurity.vue
      page.vue
      README.md
      types.ts
  shell/
    layouts/
      default.vue
    components/
      AppSidebar.vue
      AppCommandPalette.vue
      NotificationsSlideover.vue
      TeamsMenu.vue
      UserMenu.vue
    composables/
      useCookieConsent.ts
  shared/
    types/
      user.ts
      notification.ts
    composables/
      useNotifications.ts
  pages/                         ← all route stubs
    index.vue
    inbox.vue
    customers.vue
    settings.vue
    settings/index.vue
    settings/members.vue
    settings/notifications.vue
    settings/security.vue
  utils/
    index.ts                     ← randomInt, randomFrom (used by dashboard mock data)
server/
  features/
    customers/index.ts
    inbox/index.ts
    settings/members.ts
    notifications/index.ts
  api/                           ← re-export stubs
    customers.ts
    mails.ts
    members.ts
    notifications.ts
```

---

## Key decisions and rationale

### Feature component auto-import via nuxt.config.ts
Feature component directories are registered explicitly in `nuxt.config.ts`
with `pathPrefix: false`. This was required because `DashboardChart.client.vue` /
`DashboardChart.server.vue` use Nuxt's client/server component pattern, which only
works with Nuxt's component auto-resolution. Without this, the SSR placeholder
would not render.

### Server API stubs
Nitro only auto-routes handlers from `server/api/`. The canonical handler logic
lives in `server/features/`, and `server/api/*.ts` files are 3-line re-export
stubs (`export { default } from '../features/...'`). This mirrors the
client-side route stub pattern.

### useDashboard split and removal
`app/composables/useDashboard.ts` was split into:
- `features/navigation/composables/useKeyboardNav.ts` — page navigation shortcuts
- `shared/composables/useNotifications.ts` — notification slideover state

The barrel was kept through Phases 1–8 for backward compatibility, then removed
in Phase 9. `useKeyboardNav()` is now called in the shell layout. Consumers
import `useNotifications` directly from its canonical location.

### UDashboardSidebar autoClose
The original layout had `onSelect` callbacks on every nav item to close the
mobile sidebar. These were removed because `UDashboardSidebar` has
`autoClose: true` by default — the sidebar closes automatically on route
change.

### Shared types
`User` and `UserStatus` live in `shared/types/user.ts` because they're used by
3+ features (customers, inbox via `Mail.from`, notifications via
`Notification.sender`). `Notification` is in `shared/types/notification.ts`
because it's consumed by the shell layer's `NotificationsSlideover`.

Feature-specific types (Stat, Sale, Period, Range, Mail, Member) live in their
respective `features/*/types.ts`.

### Shell components
All app-chrome components (`AppSidebar`, `AppCommandPalette`,
`NotificationsSlideover`, `TeamsMenu`, `UserMenu`) live in
`app/shell/components/` with `pathPrefix: false` auto-import. These are used
only by the shell layout and sidebar — they are not feature-specific.

---

## How to verify

```bash
pnpm typecheck          # TypeScript compiles cleanly
pnpm dev                # All routes serve 200:
                        #   /  /inbox  /customers  /settings
                        #   /settings/members  /settings/notifications  /settings/security
                        #   /api/customers  /api/mails  /api/members  /api/notifications
                        # Keyboard shortcuts: g-h, g-i, g-c, g-s, n (notifications)
```

---

## How to add a new feature

Follow `.ai/PATTERNS.md` exactly. The short version:

1. Create `app/features/[name]/` with `page.vue`, `types.ts`, `README.md`
2. Add components in `app/features/[name]/components/`
3. Register the component dir in `nuxt.config.ts` components array
4. Create a route stub in `app/pages/[name].vue`
5. Add the nav item in `features/navigation/composables/useNavigation.ts`
6. Run `pnpm typecheck` and `pnpm dev`
