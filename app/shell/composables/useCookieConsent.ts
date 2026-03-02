// shell/composables/useCookieConsent.ts

/**
 * useCookieConsent
 *
 * Encapsulates: cookie consent toast shown on first visit, persists acceptance in a cookie
 * Used by: shell/layouts/default.vue (called once at layout mount)
 * NOT for: tracking consent state elsewhere — check the 'cookie-consent' cookie directly
 *
 * Returns: void (side-effect only composable)
 */
export function useCookieConsent() {
  const toast = useToast()

  onMounted(async () => {
    const cookie = useCookie('cookie-consent')
    if (cookie.value === 'accepted') {
      return
    }

    toast.add({
      title: 'We use first-party cookies to enhance your experience on our website.',
      duration: 0,
      close: false,
      actions: [{
        label: 'Accept',
        color: 'neutral' as const,
        variant: 'outline' as const,
        onClick: () => {
          cookie.value = 'accepted'
        }
      }, {
        label: 'Opt out',
        color: 'neutral' as const,
        variant: 'ghost' as const
      }]
    })
  })
}
