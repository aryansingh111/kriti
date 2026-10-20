import type { TemplateSpec } from '@/pdf/specTypes'
import { isCustomKey, type ResumeData, type SectionKey, type Settings } from '@/types'
import { customSection } from './resume'

/** Sections a template puts in its narrow column / sidebar by default (null for single-column designs). */
export function sideKeysOf(spec: TemplateSpec): SectionKey[] | null {
  const l = spec.layout
  if (l.kind === 'split') return l.side
  if (l.kind === 'sidebar') return l.sections
  return null
}

/** Which column a section lives in, honouring the user's overrides. */
export function regionOf(key: SectionKey, side: SectionKey[] | null, data: ResumeData, settings: Pick<Settings, 'sectionColumn'>): 'main' | 'side' {
  if (!side) return 'main'
  const forced = settings.sectionColumn[key]
  if (forced) return forced
  if (isCustomKey(key)) {
    const c = customSection(data, key)
    if (c && c.column !== 'auto') return c.column
    return c && (c.kind === 'tags' || c.kind === 'details') ? 'side' : 'main'
  }
  return side.includes(key) ? 'side' : 'main'
}
