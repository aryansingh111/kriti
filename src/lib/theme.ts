import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark' | 'system'
const KEY = 'kriti:theme'
const listeners = new Set<() => void>()

function read(): Theme {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? localStorage.getItem('vitae:theme') ?? '"system"')
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

let current: Theme = typeof window === 'undefined' ? 'system' : read()

function isDark(t: Theme) {
  return t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
}

function apply(t: Theme) {
  const dark = isDark(t)
  document.documentElement.classList.toggle('dark', dark)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#08120d' : '#ffffff')
}

let animTimer: number | undefined

/** Fade colours for a moment so switching theme glides instead of snapping. */
function animateSwitch() {
  const root = document.documentElement
  root.classList.add('theme-anim')
  window.clearTimeout(animTimer)
  animTimer = window.setTimeout(() => root.classList.remove('theme-anim'), 700)
}

function set(t: Theme) {
  animateSwitch()
  current = t
  try {
    localStorage.setItem(KEY, JSON.stringify(t))
  } catch {
    /* private mode – the choice just won't persist */
  }
  apply(t)
  listeners.forEach((l) => l())
}

export function useTheme() {
  const theme = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => current,
    () => 'system' as Theme,
  )

  useEffect(() => {
    apply(theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => apply('system')
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [theme])

  const dark = typeof window !== 'undefined' && isDark(theme)
  const toggle = useCallback(() => set(isDark(current) ? 'light' : 'dark'), [])
  const setDark = useCallback((on: boolean) => set(on ? 'dark' : 'light'), [])
  return { theme, dark, toggle, setDark }
}
