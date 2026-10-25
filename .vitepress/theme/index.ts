// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'
import '@fontsource-variable/noto-sans/wght.css'
import '@fontsource-variable/noto-sans-sc/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import './vendor/material-you-css/material-you.css'
import './style.css'
import './md3.css'
import NoteIndex from './NoteIndex.vue'

const rippleSelector = [
  '.VPButton',
  '.VPNavBarMenuLink',
  '.VPNavMenuLink',
  '.VPNavBar .VPFlyout .button',
  '.VPNavBar .VPMenu .VPMenuLink .link',
  '.VPNavScreenMenuGroup .button',
  '.VPNavScreen .VPMenuLink .link',
  '.VPSidebar .VPSidebarItem .link',
  '.VPFeature',
  '.note-index-card',
  '.VPDocFooter .pager-link',
  '.VPSwitch',
  'button.copy'
].join(',')

function installRipple() {
  if (typeof window === 'undefined') return
  if (document.documentElement.dataset.mdRipple === 'on') return
  document.documentElement.dataset.mdRipple = 'on'

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (event.button !== 0) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const target = event.target as Element | null
      const host = target?.closest<HTMLElement>(rippleSelector)
      if (!host) return
      if (host.hasAttribute('disabled')) return
      if (host.getAttribute('aria-disabled') === 'true') return

      const rect = host.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const diameter = Math.max(rect.width, rect.height) * 2
      const wave = document.createElement('span')
      wave.className = 'md-ripple-wave'
      wave.style.width = `${diameter}px`
      wave.style.height = `${diameter}px`
      wave.style.left = `${event.clientX - rect.left - diameter / 2}px`
      wave.style.top = `${event.clientY - rect.top - diameter / 2}px`

      host.appendChild(wave)
      wave.addEventListener('animationend', () => wave.remove(), { once: true })
      window.setTimeout(() => wave.remove(), 700)
    },
    { passive: true }
  )
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('NoteIndex', NoteIndex)
    installRipple()
  }
} satisfies Theme
