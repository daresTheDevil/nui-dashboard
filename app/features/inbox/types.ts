// features/inbox/types.ts
// All types for the inbox feature.
// Import from here within the feature. Move to shared/types/ only if used by 2+ features.

import type { User } from '~/shared/types/user'

/** A mail message as returned by GET /api/mails */
export interface Mail {
  id: number             // unique identifier
  unread?: boolean       // whether to show unread indicator
  from: User             // sender (shared User type)
  subject: string        // email subject line
  body: string           // email body HTML content
  date: string           // ISO date string
}
