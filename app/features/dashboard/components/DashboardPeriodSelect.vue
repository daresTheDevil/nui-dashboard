<script setup lang="ts">
// CONTRACT: Presentational only — no data fetching, no side effects.
// Parent: features/dashboard/page.vue
// Props in: range: Range — see ../types.ts
// Emits out: update:modelValue: Period (via v-model)
//
// Renders a select dropdown for period (daily/weekly/monthly), auto-adjusting
// available options based on the date range length.
import { eachDayOfInterval } from 'date-fns'
import type { Period, Range } from '../types'

const model = defineModel<Period>({ required: true })

const props = defineProps<{
  range: Range
}>()

const days = computed(() => eachDayOfInterval(props.range))

const periods = computed<Period[]>(() => {
  if (days.value.length <= 8) {
    return [
      'daily'
    ]
  }

  if (days.value.length <= 31) {
    return [
      'daily',
      'weekly'
    ]
  }

  return [
    'weekly',
    'monthly'
  ]
})

// Ensure the model value is always a valid period
watch(periods, () => {
  if (!periods.value.includes(model.value)) {
    model.value = periods.value[0]!
  }
})
</script>

<template>
  <USelect
    v-model="model"
    :items="periods"
    variant="ghost"
    class="data-[state=open]:bg-elevated"
    :ui="{ value: 'capitalize', itemLabel: 'capitalize', trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
  />
</template>
