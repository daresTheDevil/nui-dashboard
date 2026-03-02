<script setup lang="ts">
// CONTRACT: Has side effects — manages delete confirmation modal with async submit.
// This is an exception to the presentational pattern because: it manages its own
// modal open state and simulates an async delete operation.
// Parent: features/customers/page.vue
// Props in: count: number — number of customers to delete (shown in title)
// Emits out: none (self-contained modal)
//
// Renders a confirmation modal for bulk customer deletion. Uses a slot for the trigger button.
withDefaults(defineProps<{
  count?: number
}>(), {
  count: 0
})

const open = ref(false)

async function onSubmit() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`Delete ${count} customer${count > 1 ? 's' : ''}`"
    :description="`Are you sure, this action cannot be undone.`"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
