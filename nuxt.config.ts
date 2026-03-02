// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  // Shell layout lives in app/shell/layouts/ instead of the default app/layouts/
  // — see .ai/ARCHITECTURE.md for why layout is separated into the shell layer
  dir: {
    layouts: 'shell/layouts'
  },

  // Register shell and feature components for auto-import alongside ~/components.
  // Each feature's components/ dir is listed explicitly because Nuxt doesn't support
  // glob patterns in component paths. Feature components need auto-import because
  // some use Nuxt's .client.vue/.server.vue pattern (e.g. DashboardChart) which only
  // works with Nuxt's component resolution.
  // pathPrefix: false keeps names simple (DashboardChart, not FeaturesDashboardDashboardChart).
  components: [
    { path: '~/shell/components', pathPrefix: false },
    { path: '~/features/dashboard/components', pathPrefix: false },
    { path: '~/features/inbox/components', pathPrefix: false },
    { path: '~/features/customers/components', pathPrefix: false },
    { path: '~/features/settings/components', pathPrefix: false }
  ],

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
