<!-- shell/components/AppCommandPalette.vue -->
<script setup lang="ts">
// CONTRACT: Has side effects — reads current route to build dynamic "View page source" link.
// This is an exception to the presentational pattern because: it derives search groups
// from both static nav links (props) and the current route (runtime).
// Parent: shell/layouts/default.vue
// Props in: links: NavigationMenuItem[][] — see features/navigation/types.ts
// Emits out: none
//
// Wraps UDashboardSearch with two groups: "Go to" (all nav links) and "Code" (GitHub source link).
import type { NavigationMenuItem } from '@nuxt/ui'

const props = defineProps<{
  links: NavigationMenuItem[][]
}>()

const route = useRoute()

const groups = computed(() => [{
  id: 'links',
  label: 'Go to',
  items: props.links.flat()
}, {
  id: 'code',
  label: 'Code',
  items: [{
    id: 'source',
    label: 'View page source',
    icon: 'i-simple-icons-github',
    to: `https://github.com/nuxt-ui-templates/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
    target: '_blank'
  }]
}])
</script>

<template>
  <UDashboardSearch :groups="groups" />
</template>
