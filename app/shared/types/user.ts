// shared/types/user.ts
// Shared user types used by 3+ features: customers, inbox (via Mail.from),
// notifications (via Notification.sender), and server API endpoints.
// Move feature-specific user extensions to the feature's own types.ts.

import type { AvatarProps } from '@nuxt/ui'

/** Subscription/bounce status for a customer user */
export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

/** A user as returned by GET /api/customers and embedded in Mail and Notification */
export interface User {
  id: number             // unique identifier
  name: string           // display name shown in tables, avatars, mail headers
  email: string          // email address, used as primary identifier in UI
  avatar?: AvatarProps   // optional avatar config for UAvatar component
  status: UserStatus     // subscription status shown as colored badge
  location: string       // geographic location shown in customers table
}
