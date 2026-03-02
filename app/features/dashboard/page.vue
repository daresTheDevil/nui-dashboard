<!--
  PAGE: Dashboard (Home)
  ROUTE: /

  Responsibility: Route entry point. Manages period and date range state.
  Child components receive period/range as props and fetch their own mock data.

  Data flow:
    Local state: period (Ref<Period>), range (ShallowRef<Range>)
    → passed as props to: DashboardStats, DashboardChart, DashboardSales, DashboardDateRangePicker, DashboardPeriodSelect

  Emits from children:
    DashboardDateRangePicker emits update:modelValue → updates range ref
    DashboardPeriodSelect emits update:modelValue → updates period ref

  See also:
    - ./types.ts for Period, Range, Stat, Sale
    - ./components/ for all child components
-->
<script setup lang="ts">
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Period, Range } from './types'
import { useNotifications } from '~/shared/composables/useNotifications'

const { isNotificationsSlideoverOpen } = useNotifications()

const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/inbox'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}]] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
          <DashboardDateRangePicker v-model="range" class="-ms-1" />

          <DashboardPeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <DashboardStats :period="period" :range="range" />
      <DashboardChart :period="period" :range="range" />
      <DashboardSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
