// features/customers/types.ts
// All types for the customers feature.
// Import from here within the feature. Move to shared/types/ only if used by 2+ features.
// Note: User and UserStatus are re-exported from shared/types/user.ts because
// they're also used by inbox (Mail.from) and notifications (Notification.sender).

export type { User, UserStatus } from '~/shared/types/user'
