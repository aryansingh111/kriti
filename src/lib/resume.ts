import { LINK_BY_KIND, looksLikeUrl } from './links'
import {
  SECTION_LABEL,
  customId,
  isCustomKey,
  type BuiltInSection,
  type CustomSection,
  type ListKey,
  type ResumeData,
  type SectionKey,
  type Settings,
} from '@/types'
import { uid } from './utils'

/** Split a multi-line field into clean bullet strings. */
export function splitLines(s: string): string[] {
  return s
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*([-•*–·▪●]|\d+[.)])\s+/, '').trim())
    .filter(Boolean)
}

/** Split tags typed as commas and/or one per line. */
export function splitTags(s: string): string[] {
  return s
    .split(/[\n,;]+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

export function dateRange(start: string, end: string, current: boolean): string {
  const s = start.trim()
  const e = current ? 'Present' : end.trim()
  if (s && e) return `${s} – ${e}`
  return s || e
}

export function ensureUrl(raw: string): string {
  const v = raw.trim()
  if (!v) return ''
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v
  return `https://${v}`
}

/** Pretty display form of a URL: no protocol, no www, no trailing slash. */
export function displayUrl(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/+$/, '')
}

/** An optional URL field: only a real-looking URL becomes a link. */
export function safeHref(raw: string): string | undefined {
  const v = raw.trim()
  if (!v) return undefined
  if (/^(https?:|mailto:|tel:)/i.test(v) || looksLikeUrl(v)) return ensureUrl(v)
  return undefined
}

export interface ContactItem {
  key: string
  /** 'email' | 'phone' | 'location' or the link platform */
  kind: string
  /** text drawn on the resume */
  label: string
  /** short name for the text-label icon set, e.g. "Email" */
  caption: string
  href?: string
  /** key into ICON_DATA */
  icon: string
}

export function contactItems(b: ResumeData['basics']): ContactItem[] {
  const out: ContactItem[] = []
  if (b.email.trim())
    out.push({ key: 'email', kind: 'email', label: b.email.trim(), caption: 'Email', href: `mailto:${b.email.trim()}`, icon: 'mail' })
  if (b.phone.trim())
    out.push({
      key: 'phone',
      kind: 'phone',
      label: b.phone.trim(),
      caption: 'Phone',
      href: `tel:${b.phone.replace(/[^\d+]/g, '')}`,
      icon: 'phone',
    })
  if (b.location.trim())
    out.push({ key: 'location', kind: 'location', label: b.location.trim(), caption: 'Location', icon: 'map-pin' })
  for (const l of b.links ?? []) {
    const url = l.url.trim()
    const label = l.label.trim()
    if (!url && !label) continue
    const meta = LINK_BY_KIND[l.kind] ?? LINK_BY_KIND.other
    const href = safeHref(url) ?? (url ? undefined : safeHref(label))
    out.push({
      key: l.id,
      kind: l.kind,
      label: label || displayUrl(url),
      caption: meta.label,
      href,
      icon: meta.icon,
    })
  }
  return out
}

const HONORIFIC = /^(dr|prof|mr|mrs|ms|miss|mx|shri|smt|sri|ca|cs|er|adv|capt|col|maj)\.?$/i

export function initials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((w) => w && !HONORIFIC.test(w))
  if (!parts.length) return '•'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function splitName(name: string): { first: string; last: string } {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length <= 1) return { first: parts[0] ?? '', last: '' }
  return { first: parts.slice(0, -1).join(' '), last: parts[parts.length - 1] }
}

export function customSection(data: ResumeData, key: SectionKey): CustomSection | undefined {
  if (!isCustomKey(key)) return undefined
  const id = customId(key)
  return data.customSections.find((c) => c.id === id)
}

export function customHasContent(c: CustomSection): boolean {
  switch (c.kind) {
    case 'entries':
      return c.items.some((i) => i.title.trim() || i.subtitle.trim())
    case 'details':
      return c.rows.some((r) => r.label.trim() || r.value.trim())
    default:
      return c.text.trim().length > 0
  }
}

export function hasContent(data: ResumeData, key: SectionKey): boolean {
  if (isCustomKey(key)) {
    const c = customSection(data, key)
    return !!c && customHasContent(c)
  }
  switch (key as BuiltInSection) {
    case 'summary':
      return data.basics.summary.trim().length > 0
    case 'experience':
      return data.experience.some((e) => e.role.trim() || e.company.trim())
    case 'education':
      return data.education.some((e) => e.school.trim() || e.degree.trim())
    case 'skills':
      return data.skills.some((s) => s.name.trim())
    case 'projects':
      return data.projects.some((p) => p.name.trim())
    case 'certifications':
      return data.certifications.some((c) => c.name.trim())
    case 'languages':
      return data.languages.some((l) => l.name.trim())
    case 'awards':
      return data.awards.some((a) => a.title.trim())
  }
}

/** Heading text for a section: the user's rename, a custom section's own title, or the default. */
export function sectionTitle(key: SectionKey, data: ResumeData, settings: Pick<Settings, 'sectionTitles'>): string {
  const renamed = settings.sectionTitles[key]?.trim()
  if (renamed) return renamed
  if (isCustomKey(key)) return customSection(data, key)?.title.trim() || 'Custom section'
  return SECTION_LABEL[key as BuiltInSection]
}

/** Every section the resume can show, in the user's order (new / custom sections are appended). */
export function normalizedOrder(data: ResumeData, settings: Pick<Settings, 'sectionOrder'>): SectionKey[] {
  const live = new Set<SectionKey>([
    ...(Object.keys(SECTION_LABEL) as BuiltInSection[]),
    ...data.customSections.map((c) => `custom:${c.id}` as SectionKey),
  ])
  const out = settings.sectionOrder.filter((k) => live.has(k))
  const seen = new Set(out)
  for (const k of live) if (!seen.has(k)) out.push(k)
  return out
}

export function isDataEmpty(data: ResumeData): boolean {
  return (
    !data.basics.fullName.trim() &&
    !data.basics.summary.trim() &&
    (['experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'awards'] as const).every(
      (k) => data[k].length === 0,
    ) &&
    data.customSections.length === 0
  )
}

/** Plain-text dump of everything that appears on the resume (job-match, plain-text export, scoring…). */
export function resumeText(data: ResumeData, settings?: Pick<Settings, 'sectionTitles'>): string {
  const s = settings ?? { sectionTitles: {} }
  const lines: string[] = []
  const b = data.basics
  lines.push(b.fullName, b.title, [b.email, b.phone, b.location].filter(Boolean).join(' | '))
  for (const l of b.links) lines.push([l.label, l.url].filter(Boolean).join(' – '))
  if (b.summary.trim()) lines.push('', sectionTitle('summary', data, s).toUpperCase(), b.summary.trim())
  const sec = (key: ListKey, body: string[]) => {
    if (body.length) lines.push('', sectionTitle(key, data, s).toUpperCase(), ...body)
  }
  sec(
    'experience',
    data.experience.flatMap((e) => [
      `${e.role}${e.company ? ` – ${e.company}` : ''}${e.location ? `, ${e.location}` : ''} (${dateRange(e.start, e.end, e.current)})`,
      ...splitLines(e.highlights).map((h) => `• ${h}`),
    ]),
  )
  sec(
    'projects',
    data.projects.flatMap((p) => [
      `${p.name}${p.tech ? ` – ${p.tech}` : ''}${p.link ? ` (${p.link})` : ''}`,
      ...splitLines(p.description).map((h) => `• ${h}`),
    ]),
  )
  sec(
    'education',
    data.education.flatMap((e) => [
      `${[e.degree, e.field].filter(Boolean).join(' in ')} – ${e.school}${e.location ? `, ${e.location}` : ''} (${dateRange(e.start, e.end, false)})`,
      ...splitLines(e.details),
    ]),
  )
  sec('skills', [data.skills.map((x) => x.name).join(', ')].filter((x) => x.trim()))
  sec(
    'certifications',
    data.certifications.map((c) => `${c.name}${c.issuer ? ` – ${c.issuer}` : ''}${c.date ? ` (${c.date})` : ''}`),
  )
  sec('languages', data.languages.map((l) => `${l.name} (${l.level})`))
  sec(
    'awards',
    data.awards.flatMap((a) => [`${a.title}${a.issuer ? ` – ${a.issuer}` : ''}${a.date ? ` (${a.date})` : ''}`, a.description]),
  )
  for (const c of data.customSections) {
    const body: string[] = []
    if (c.kind === 'entries')
      for (const i of c.items)
        body.push(
          `${i.title}${i.subtitle ? ` – ${i.subtitle}` : ''}${i.date ? ` (${i.date})` : ''}`,
          ...splitLines(i.description).map((h) => `• ${h}`),
        )
    else if (c.kind === 'details') for (const r of c.rows) body.push(`${r.label}: ${r.value}`)
    else if (c.kind === 'bullets') body.push(...splitLines(c.text).map((h) => `• ${h}`))
    else if (c.kind === 'tags') body.push(splitTags(c.text).join(', '))
    else body.push(c.text.trim())
    if (body.some(Boolean)) lines.push('', (s.sectionTitles[`custom:${c.id}`] || c.title).toUpperCase(), ...body)
  }
  return lines.filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n').trim()
}

/** Bring older / partial saved data up to the current shape. */
export function migrateData(raw: unknown): ResumeData {
  const r = (raw ?? {}) as Record<string, any>
  const rb = (r.basics ?? {}) as Record<string, any>
  const links = Array.isArray(rb.links)
    ? rb.links
    : [
        rb.website && { id: uid(), kind: 'portfolio', label: '', url: String(rb.website) },
        rb.linkedin && { id: uid(), kind: 'linkedin', label: '', url: String(rb.linkedin) },
        rb.github && { id: uid(), kind: 'github', label: '', url: String(rb.github) },
      ].filter(Boolean)
  const list = <T extends Record<string, unknown>>(arr: unknown, defaults: T): any[] =>
    Array.isArray(arr) ? arr.map((x) => ({ ...defaults, ...(x as object), id: (x as { id?: string })?.id ?? uid() })) : []
  return {
    basics: {
      fullName: rb.fullName ?? '',
      title: rb.title ?? '',
      email: rb.email ?? '',
      phone: rb.phone ?? '',
      location: rb.location ?? '',
      links: links.map((l: any) => ({ id: l.id ?? uid(), kind: l.kind ?? 'other', label: l.label ?? '', url: l.url ?? '' })),
      photo: rb.photo ?? '',
      summary: rb.summary ?? '',
    },
    experience: list(r.experience, { role: '', company: '', location: '', start: '', end: '', current: false, link: '', highlights: '' }),
    education: list(r.education, { school: '', degree: '', field: '', location: '', start: '', end: '', link: '', details: '' }),
    skills: list(r.skills, { name: '', level: 4, group: '' }),
    projects: list(r.projects, { name: '', link: '', linkLabel: '', tech: '', description: '' }),
    certifications: list(r.certifications, { name: '', issuer: '', date: '', link: '' }),
    languages: list(r.languages, { name: '', level: 'Fluent' }),
    awards: list(r.awards, { title: '', issuer: '', date: '', description: '', link: '' }),
    customSections: Array.isArray(r.customSections)
      ? r.customSections.map((c: any) => ({
          id: c.id ?? uid(),
          title: c.title ?? '',
          kind: c.kind ?? 'bullets',
          text: c.text ?? '',
          items: list(c.items, { title: '', subtitle: '', date: '', location: '', link: '', description: '' }),
          rows: list(c.rows, { label: '', value: '' }),
          column: c.column ?? 'auto',
        }))
      : [],
  }
}
