/**
 * Google Analytics 4. Nothing from Google is loaded, and nothing is sent, until the visitor has said yes (see
 * ConsentBanner and the Cookies page). It only runs on the real site, so local testing never counts as a visit.
 * Addresses are cleaned before they are sent: no search words, and /resumes/<id>/... is counted as one page.
 */
const GA_ID = 'G-9DX945XHJ5'
const PROD_HOST = 'www.kriti-studio.com'
const KEY = 'kriti:analytics'
const CHANGED = 'kriti:analytics-choice'

export type Choice = 'granted' | 'denied' | null

export function getChoice(): Choice {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    return null
  }
}

/** For useSyncExternalStore: lets a component re-render when the choice changes (from the banner or the Cookies page). */
export function subscribeChoice(onChange: () => void) {
  window.addEventListener(CHANGED, onChange)
  return () => window.removeEventListener(CHANGED, onChange)
}

let loaded = false

/** Adds Google's script and starts the tag. Called once, the first time a page view is sent. */
function load() {
  if (loaded) return
  loaded = true
  window.dataLayer = window.dataLayer || []
  // gtag.js reads an `arguments` object from the data layer, so this cannot be written with rest parameters
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { send_page_view: false })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
}

const disableFlag = `ga-disable-${GA_ID}`
const flags = window as unknown as Record<string, unknown>

/** Removes the Google Analytics cookies this site could have set. */
function clearCookies() {
  const host = location.hostname
  const domains = [host, '.' + host.replace(/^www\./, '')]
  for (const name of ['_ga', '_ga_' + GA_ID.slice(2)]) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    for (const d of domains) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`
  }
}

/** Sends one page_view for the page the visitor is now on, if they have said yes. */
export function trackPageView(pathname: string) {
  if (location.hostname !== PROD_HOST || getChoice() !== 'granted') return
  load()
  flags[disableFlag] = false
  const path = pathname.replace(/^\/resumes\/[^/]+/, '/resumes/:id')
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_path: path,
    page_location: location.origin + path,
  })
}

/** Saves the visitor's answer. Yes starts counting from this page; no stops it and removes the cookies. */
export function setChoice(choice: 'granted' | 'denied') {
  try {
    localStorage.setItem(KEY, choice)
  } catch {
    /* the answer just applies until the page is closed */
  }
  if (choice === 'denied') {
    flags[disableFlag] = true
    clearCookies()
  }
  window.dispatchEvent(new Event(CHANGED))
  if (choice === 'granted') trackPageView(location.pathname)
}
