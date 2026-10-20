export type FeedbackKind = 'bug' | 'feature'

/**
 * Where bug reports and feature requests are sent. Kriti has no server, so the form builds the message and opens
 * the visitor's email app addressed to this address. Leave it empty and the form still works, but the visitor is
 * only offered a "copy report" button.
 */
export const FEEDBACK_EMAIL = ''

export interface FeedbackReport {
  kind: FeedbackKind
  title: string
  details: string
  /** bugs: what you did; features: why it would help */
  extra: string
  where: string
  email: string
}

export const WHERE_OPTIONS = ['Home', 'Templates gallery', 'Editor', 'Review and download', 'My resumes', 'Made for India', 'Somewhere else'] as const

/** A few facts about the browser that help to reproduce a bug. Nothing from the resume is included. */
export function environmentInfo(): string {
  const dark = document.documentElement.classList.contains('dark')
  return [
    `Browser: ${navigator.userAgent}`,
    `Screen: ${window.innerWidth} x ${window.innerHeight} (pixel ratio ${window.devicePixelRatio})`,
    `Theme: ${dark ? 'dark' : 'light'}`,
    `Page: ${window.location.origin}`,
  ].join('\n')
}

export function reportSubject(r: FeedbackReport): string {
  return `[Kriti ${r.kind === 'bug' ? 'bug' : 'feature request'}] ${r.title.trim()}`
}

export function reportBody(r: FeedbackReport, withEnvironment: boolean): string {
  const lines = [
    r.kind === 'bug' ? 'BUG REPORT' : 'FEATURE REQUEST',
    '',
    `Title: ${r.title.trim()}`,
    r.where ? `Where: ${r.where}` : '',
    '',
    r.kind === 'bug' ? 'What happened:' : 'What I would like:',
    r.details.trim(),
  ]
  if (r.extra.trim()) lines.push('', r.kind === 'bug' ? 'What I did before it happened:' : 'Why it would help:', r.extra.trim())
  if (r.email.trim()) lines.push('', `Reply to: ${r.email.trim()}`)
  if (withEnvironment) lines.push('', '--- About my browser ---', environmentInfo())
  return lines.filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n')
}

export function mailtoHref(r: FeedbackReport, withEnvironment: boolean): string {
  return `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(reportSubject(r))}&body=${encodeURIComponent(reportBody(r, withEnvironment))}`
}
