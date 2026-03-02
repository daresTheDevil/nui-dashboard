// shared/types/notification.ts
// Notification type used by the shell NotificationsSlideover component
// and the notifications API endpoint. Lives in shared/ because it's
// consumed by the shell layer, not owned by any single feature.

import type { User } from './user'

/** A notification as returned by GET /api/notifications */
export interface Notification {
  id: number             // unique identifier
  unread?: boolean       // whether to show the unread indicator chip
  sender: User           // the user who triggered the notification
  body: string           // notification message text
  date: string           // ISO date string, displayed as relative time
}
