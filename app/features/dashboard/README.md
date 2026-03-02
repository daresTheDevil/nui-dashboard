# Feature: Dashboard (Home)

## What this does
Displays the main dashboard view with stat cards, a revenue chart, and a recent sales table.
All data is mock-generated client-side with random values that regenerate when the
period or date range changes.

## Route
`/` — defined in `app/pages/index.vue` (stub only)

## Components in this feature
- `page.vue` — route entry, manages period/range state, composes child components
- `components/DashboardStats.vue` — 4 stat cards (Customers, Conversions, Revenue, Orders) with variation badges
- `components/DashboardChart.client.vue` — Unovis line/area chart for revenue (client-only)
- `components/DashboardChart.server.vue` — SSR placeholder for the chart
- `components/DashboardSales.vue` — table of recent sale transactions
- `components/DashboardPeriodSelect.vue` — dropdown to select daily/weekly/monthly period
- `components/DashboardDateRangePicker.vue` — popover with calendar and preset date ranges

## Data flow
page.vue → local state (period, range)
→ passed as props to: DashboardStats, DashboardChart, DashboardSales, DashboardPeriodSelect, DashboardDateRangePicker
→ DashboardStats, DashboardSales use useAsyncData to generate mock data (re-fetches on prop change)
→ DashboardChart uses watch to regenerate chart data locally

## API endpoints consumed
None — all data is mock-generated client-side using randomInt/randomFrom utils.

## Types
All types in `./types.ts`: Period, Range, Stat, Sale, SaleStatus.

## State
- `period: Ref<Period>` — current time grouping (daily/weekly/monthly)
- `range: ShallowRef<Range>` — current date range filter
- `isNotificationsSlideoverOpen` — from shared useDashboard composable (notification bell button)

## Patterns used
- Child components generate their own mock data (exception to presentational pattern)
- Client/server component pair for DashboardChart (Nuxt .client.vue/.server.vue convention)
- Types co-located in feature directory

## DO NOT
- Fetch data from API endpoints — this feature uses mock data only
- Import components from other feature directories
- Move DashboardChart to a single file — the .client.vue/.server.vue pair is required for SSR
