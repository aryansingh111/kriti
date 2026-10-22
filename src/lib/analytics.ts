import type { BeforeSend } from '@vercel/analytics/react'

/**
 * Runs on every page view before it is sent to Vercel Web Analytics. It keeps the stats to "which pages are visited":
 * the search words and anything after # are dropped, and the address of a person's own resume
 * (/resumes/<id>/edit/design) is counted as one page (/resumes/:id/edit/design) rather than a page per resume.
 */
export const scrubAnalytics: BeforeSend = (event) => {
  try {
    const url = new URL(event.url)
    url.search = ''
    url.hash = ''
    url.pathname = url.pathname.replace(/^\/resumes\/[^/]+/, '/resumes/:id')
    return { ...event, url: url.toString() }
  } catch {
    return event
  }
}
