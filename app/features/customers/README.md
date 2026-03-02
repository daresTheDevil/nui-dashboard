# Feature: Customers

## What this does
Displays a paginated, filterable, sortable table of customers with row selection,
status badges, and actions (copy ID, delete). Includes modals for adding and deleting customers.

## Route
`/customers` — defined in `app/pages/customers.vue` (stub only)

## Components in this feature
- `page.vue` — route entry, fetches customers, manages table state (330 lines due to TanStack Table column defs)
- `components/CustomersAddModal.vue` — modal form to add a new customer (Zod validation)
- `components/CustomersDeleteModal.vue` — confirmation modal for bulk customer deletion

## Data flow
page.vue → useFetch → /api/customers → User[]
→ rendered in UTable with TanStack Table
→ CustomersAddModal and CustomersDeleteModal are self-contained (own modal state)

## API endpoints consumed
- `GET /api/customers` — returns User[] — see server/api/customers.ts

## Types
All types in `./types.ts`. Re-exports User, UserStatus from shared/types/user.ts.

## State
- `data: Ref<User[]>` — fetched customer data
- `columnFilters: Ref` — TanStack Table email filter state
- `columnVisibility: Ref` — TanStack Table column visibility
- `rowSelection: Ref` — TanStack Table row selection
- `statusFilter: Ref<string>` — status dropdown filter
- `pagination: Ref` — TanStack Table pagination state

## Patterns used
- Page fetches data, composes table inline with render functions
- Modal components manage their own open/close state
- Types re-exported from shared (User is used by 3+ features)

## DO NOT
- Extract the table column definitions into a separate file — they use closures over page state
- Import from other feature directories directly
- Add `any` types — the TanStack Table column filter uses `any` from the original code, keep it minimal
