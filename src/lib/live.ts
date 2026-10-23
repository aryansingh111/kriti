/**
 * "People online now". While the site is open and in use, this pings /api/live once a minute with a random anonymous id
 * (kept in sessionStorage for the visit) and keeps the latest count for the page to show.
 *
 * The free Upstash plan allows 50,000 Redis commands a month and each ping costs one, so pinging is kept thrifty:
 * it pauses while the tab is hidden, stops after 2 minutes without any activity, and stops for good 15 minutes into a
 * visit (a long editing session then simply drops out of the count). The most one visit can ever cost is about 16 commands.
 */
const PING_MS = 60_000
const IDLE_MS = 2 * 60_000
const MAX_VISIT_MS = 15 * 60_000
/** coming back to a tab does not ping again if one went out less than this long ago */
const MIN_GAP_MS = 20_000

let count: number | null = null
const listeners = new Set<() => void>()

export const getLive = () => count
export const subscribeLive = (onChange: () => void) => {
  listeners.add(onChange)
  return () => void listeners.delete(onChange)
}

function visitorId(): string {
  try {
    let id = sessionStorage.getItem('kriti:vid')
    if (!id) {
      id = Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => (b % 36).toString(36)).join('')
      sessionStorage.setItem('kriti:vid', id)
    }
    return id
  } catch {
    return ''
  }
}

/** Starts counting this visitor and returns the function that stops it. */
export function startLive(): () => void {
  const id = visitorId()
  if (!id) return () => {}
  let lastActive = Date.now()
  let lastPing = 0
  let dead = false
  let begun = Date.now()
  try {
    // a visit's clock survives moving between pages and reloads, so a reload cannot be used to start the 15 minutes again
    begun = Number(sessionStorage.getItem('kriti:vstart')) || begun
    sessionStorage.setItem('kriti:vstart', String(begun))
  } catch {
    /* without session storage the clock just starts at zero on every page */
  }

  const ping = async () => {
    const now = Date.now()
    if (now - begun > MAX_VISIT_MS) {
      // this visit has had its share: leave the count and hide the pill, rather than showing a number that goes stale
      if (count !== null) {
        count = null
        listeners.forEach((l) => l())
      }
      return
    }
    if (document.visibilityState !== 'visible' || now - lastActive > IDLE_MS || now - lastPing < MIN_GAP_MS) return
    lastPing = now
    try {
      const res = await fetch(`/api/live?id=${id}`, { method: 'POST' })
      const data = await res.json()
      if (dead || typeof data?.count !== 'number') return
      if (data.count !== count) {
        count = data.count
        listeners.forEach((l) => l())
      }
    } catch {
      /* no counter here (for example in development): the page just does not show one */
    }
  }

  const touch = () => {
    const wasIdle = Date.now() - lastActive > IDLE_MS
    lastActive = Date.now()
    if (wasIdle) void ping()
  }
  const onVisible = () => document.visibilityState === 'visible' && void ping()
  const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const
  events.forEach((e) => window.addEventListener(e, touch, { passive: true }))
  document.addEventListener('visibilitychange', onVisible)
  void ping()
  const timer = window.setInterval(() => void ping(), PING_MS)

  return () => {
    dead = true
    window.clearInterval(timer)
    events.forEach((e) => window.removeEventListener(e, touch))
    document.removeEventListener('visibilitychange', onVisible)
  }
}
