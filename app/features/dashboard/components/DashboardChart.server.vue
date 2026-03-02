<!--
  Server-side placeholder for the DashboardChart component.
  Rendered during SSR while DashboardChart.client.vue loads on the client.
  Shows a static card with "Revenue" header and empty chart area.
-->
<template>
  <UCard class="shrink-0" :ui="{ body: '!px-0 !pt-0 !pb-3' }">
    <template #header>
      <div>
        <p class="text-xs text-muted uppercase mb-1.5">
          Revenue
        </p>
        <p class="text-3xl text-highlighted font-semibold">
          ---
        </p>
      </div>
    </template>

    <div class="h-96" />
  </UCard>
</template>
