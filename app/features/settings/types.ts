// features/settings/types.ts
// All types for the settings feature.
// Import from here within the feature. Move to shared/types/ only if used by 2+ features.

import type { AvatarProps } from '@nuxt/ui'

/** A team member as returned by GET /api/members */
export interface Member {
  name: string           // display name
  username: string       // GitHub username
  role: 'member' | 'owner'  // team role shown as badge
  avatar: AvatarProps    // avatar config for UAvatar component
}
