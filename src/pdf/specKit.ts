import type { SectionKey } from '@/types'
import { FONT_OPTIONS } from './fontMeta'
import type { StyleSet, Tag, TemplateSpec } from './specTypes'
import type { BulletKind, EntryKind, HeadingKind, SkillKind } from './styles'

/* ───────────────────────── helpers ───────────────────────── */

export const sf = (heading: HeadingKind, entry: EntryKind, skills: SkillKind, bullet: BulletKind, extra: Partial<StyleSet> = {}): StyleSet => ({
  heading,
  entry,
  skills,
  bullet,
  langs: 'list',
  gap: 12,
  ...extra,
})

type Input = Omit<TemplateSpec, 'tags' | 'photo' | 'levels' | 'ats' | 'popular'> &
  Partial<Pick<TemplateSpec, 'photo' | 'levels' | 'ats' | 'popular'>> & { tags?: Tag[] }

const SERIF = new Set(FONT_OPTIONS.filter((f) => f.kind === 'Serif').map((f) => f.id as string))

export function make(i: Input): TemplateSpec {
  const tags = new Set<Tag>(i.tags ?? [])
  const k = i.layout.kind
  tags.add(k === 'single' ? 'one-column' : 'two-column')
  if (k === 'sidebar') tags.add('sidebar')
  if (i.photo) tags.add('photo')
  if (i.levels) tags.add('skill-levels')
  if ((i.ats ?? 5) >= 4) tags.add('ats')
  if (SERIF.has(i.fonts.heading) || SERIF.has(i.fonts.body)) tags.add('serif')
  if (i.main.entry === 'timeline') tags.add('timeline')
  if (i.order && i.order[1] === 'education') tags.add('education-first')
  if (i.icons && i.icons !== 'line' && i.icons !== 'none') tags.add('icons')
  return { photo: false, levels: false, ats: 5, popular: 50, ...i, tags: [...tags] }
}

export const FRESHER_ORDER: SectionKey[] = ['summary', 'education', 'projects', 'experience', 'skills', 'certifications', 'languages', 'awards']
export const EDU_FIRST: SectionKey[] = ['summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'languages', 'awards']

