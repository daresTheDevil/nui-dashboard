// features/dashboard/types.ts
// All types for the dashboard feature.
// Import from here within the feature. Move to shared/types/ only if used by 2+ features.

/** Payment status for a sale transaction */
export type SaleStatus = 'paid' | 'failed' | 'refunded'

/** A dashboard stat card as rendered by DashboardStats */
export interface Stat {
  title: string               // card heading (e.g. "Total Revenue")
  icon: string                // iconify icon name
  value: number | string      // display value
  variation: number           // percentage change (positive = up, negative = down)
  formatter?: (value: number) => string  // optional custom value formatter
}

/** A sale row as rendered by DashboardSales table */
export interface Sale {
  id: string                  // transaction ID
  date: string                // ISO date string
  status: SaleStatus          // payment status shown as colored badge
  email: string               // customer email
  amount: number              // transaction amount in cents
}

/** Time grouping period for dashboard charts and stats */
export type Period = 'daily' | 'weekly' | 'monthly'

/** Date range for filtering dashboard data */
export interface Range {
  start: Date
  end: Date
}
