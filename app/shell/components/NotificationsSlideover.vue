<script setup lang="ts">
// CONTRACT: Shell-level component — fetches its own notification data.
// Parent: shell/layouts/default.vue (rendered in layout)
// Props in: none
// Emits out: none
//
// This is an exception to the presentational pattern because:
// it owns its own data fetch (notifications list) and slideover open/close state
// via the shared useNotifications composable.
//
// Renders a slideover panel listing recent notifications with sender avatar,
// message body, and relative timestamp.

import { formatTimeAgo } from '@vueuse/core'
import type { Notification } from '~/shared/types/notification'
import { useNotifications } from '~/shared/composables/useNotifications'

const { isNotificationsSlideoverOpen } = useNotifications()

const { data: notifications } = await useFetch<Notification[]>('/api/notifications')
</script>

<template>
  <USlideover
    v-model:open="isNotificationsSlideoverOpen"
    title="Notifications"
  >
    <template #body>
      <NuxtLink
        v-for="notification in notifications"
        :key="notification.id"
        :to="`/inbox?id=${notification.id}`"
        class="px-3 py-2.5 rounded-md hover:bg-elevated/50 flex items-center gap-3 relative -mx-3 first:-mt-3 last:-mb-3"
      >
        <UChip
          color="error"
          :show="!!notification.unread"
          inset
        >
          <UAvatar
            v-bind="notification.sender.avatar"
            :alt="notification.sender.name"
            size="md"
          />
        </UChip>

        <div class="text-sm flex-1">
          <p class="flex items-center justify-between">
            <span class="text-highlighted font-medium">{{ notification.sender.name }}</span>

            <time
              :datetime="notification.date"
              class="text-muted text-xs"
              v-text="formatTimeAgo(new Date(notification.date))"
            />
          </p>

          <p class="text-dimmed">
            {{ notification.body }}
          </p>
        </div>
      </NuxtLink>
    </template>
  </USlideover>
</template>
