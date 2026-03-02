# Feature: Inbox

## What this does
Displays a two-panel email inbox with a mail list on the left and mail detail on the right.
Supports filtering by all/unread, keyboard navigation (arrow keys), and a mobile slideover
for the detail view on small screens.

## Route
`/inbox` — defined in `app/pages/inbox.vue` (stub only)

## Components in this feature
- `page.vue` — route entry, fetches mails, manages tab/selection state
- `components/InboxList.vue` — scrollable list of mails with unread indicators and keyboard nav
- `components/InboxMail.vue` — full mail detail view with reply form

## Data flow
page.vue → useFetch → /api/mails → Mail[]
→ filtered by selectedTab → passed as props to InboxList
→ InboxList emits update:modelValue → updates selectedMail
→ selectedMail passed as props to InboxMail
→ InboxMail emits close → clears selectedMail

## API endpoints consumed
- `GET /api/mails` — returns Mail[] — see server/api/mails.ts

## Types
All types in `./types.ts`: Mail. Also depends on shared User type.

## State
- `selectedTab: Ref<string>` — current tab (all/unread)
- `mails: Ref<Mail[]>` — fetched mail data
- `selectedMail: Ref<Mail | null>` — currently selected mail
- `isMailPanelOpen: ComputedRef<boolean>` — derived from selectedMail for mobile slideover

## Patterns used
- Page fetches all data, passes to children as props
- Types co-located in feature directory
- Keyboard shortcuts defined in child component (InboxList)

## DO NOT
- Fetch data inside InboxList or InboxMail
- Import from other feature directories directly
- Remove the .client.vue USlideover wrapping — it prevents hydration mismatch on mobile
