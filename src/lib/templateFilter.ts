import { hexToHsl } from './color'
import { PERSONAS } from '@/personas'
import { SPECS, type Category, type Tag, type TemplateSpec } from '@/pdf/specs'

export type ColourFamily = 'Blue' | 'Teal' | 'Green' | 'Orange' | 'Red' | 'Pink' | 'Purple' | 'Neutral'

export const COLOUR_FAMILIES: { id: ColourFamily; hex: string }[] = [
  { id: 'Blue', hex: '#2563eb' },
  { id: 'Teal', hex: '#0d9488' },
  { id: 'Green', hex: '#16a34a' },
  { id: 'Orange', hex: '#ea580c' },
  { id: 'Red', hex: '#dc2626' },
  { id: 'Pink', hex: '#db2777' },
  { id: 'Purple', hex: '#7c3aed' },
  { id: 'Neutral', hex: '#334155' },
]

export function colourFamily(hex: string): ColourFamily {
  const [h, s, l] = hexToHsl(hex)
  if (s < 0.18 || l < 0.1) return 'Neutral'
  if (h < 14 || h >= 346) return 'Red'
  if (h < 48) return 'Orange'
  if (h < 75) return 'Orange'
  if (h < 160) return 'Green'
  if (h < 195) return 'Teal'
  if (h < 252) return 'Blue'
  if (h < 300) return 'Purple'
  return 'Pink'
}

export type Layout = 'One column' | 'Two column' | 'Sidebar'
export const LAYOUTS: Layout[] = ['One column', 'Two column', 'Sidebar']

export interface FeatureFilter {
  id: string
  label: string
  test: (s: TemplateSpec) => boolean
}

export const FEATURES: FeatureFilter[] = [
  { id: 'ats', label: 'ATS-friendly', test: (s) => s.tags.includes('ats') },
  { id: 'photo', label: 'With photo', test: (s) => s.photo },
  { id: 'levels', label: 'Skill levels', test: (s) => s.levels },
  { id: 'edu', label: 'Education first', test: (s) => s.tags.includes('education-first') },
  { id: 'dark', label: 'Dark accents', test: (s) => s.tags.includes('dark') },
  { id: 'serif', label: 'Serif fonts', test: (s) => s.tags.includes('serif') },
  { id: 'compact', label: 'Dense / compact', test: (s) => s.tags.includes('compact') || s.base <= 9.2 },
]

export interface Filters {
  category: Category | 'All'
  q: string
  layouts: Layout[]
  features: string[]
  colours: ColourFamily[]
}

export const NO_FILTERS: Filters = { category: 'All', q: '', layouts: [], features: [], colours: [] }

const layoutOf = (s: TemplateSpec): Layout => (s.layout.kind === 'single' ? 'One column' : s.layout.kind === 'split' ? 'Two column' : 'Sidebar')

const haystack = new Map<string, string>()
function hayOf(s: TemplateSpec): string {
  let h = haystack.get(s.id)
  if (!h) {
    const p = PERSONAS[s.persona ?? s.id]
    h = [s.name, s.tagline, s.category, ...s.tags, p?.basics.fullName, p?.basics.title, p?.basics.location, ...(p?.skills.slice(0, 6).map((k) => k.name) ?? [])]
      .join(' ')
      .toLowerCase()
    haystack.set(s.id, h)
  }
  return h
}

export function matches(s: TemplateSpec, f: Filters): boolean {
  if (f.category !== 'All' && s.category !== f.category) return false
  if (f.layouts.length && !f.layouts.includes(layoutOf(s))) return false
  if (f.colours.length && !f.colours.includes(colourFamily(s.accent))) return false
  for (const id of f.features) {
    const feat = FEATURES.find((x) => x.id === id)
    if (feat && !feat.test(s)) return false
  }
  const q = f.q.trim().toLowerCase()
  if (q) {
    const hay = hayOf(s)
    for (const word of q.split(/\s+/)) if (!hay.includes(word)) return false
  }
  return true
}

export type Sort = 'popular' | 'az' | 'ats'

export function filterTemplates(f: Filters, sort: Sort = 'popular'): TemplateSpec[] {
  const list = SPECS.filter((s) => matches(s, f))
  if (sort === 'az') return list.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === 'ats') return list.sort((a, b) => b.ats - a.ats || b.popular - a.popular)
  return list.sort((a, b) => b.popular - a.popular)
}

export function countBy<T extends string>(pick: (s: TemplateSpec) => T): Record<string, number> {
  const out: Record<string, number> = {}
  for (const s of SPECS) out[pick(s)] = (out[pick(s)] ?? 0) + 1
  return out
}

export { layoutOf }
export type { Tag }
