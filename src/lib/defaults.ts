import { DEFAULT_SECTION_ORDER, type ResumeData, type Settings } from '@/types'

export const EMPTY_DATA: ResumeData = {
  basics: { fullName: '', title: '', email: '', phone: '', location: '', links: [], photo: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  customSections: [],
}

export const DEFAULT_SETTINGS: Settings = {
  template: 'aurora',
  accent: null,
  tone: null,
  fontBody: null,
  fontHeading: null,
  textScale: 1,
  spacingScale: 1,
  marginScale: 1,
  pageSize: 'A4',
  showPhoto: true,
  photoShape: 'auto',
  showSkillLevels: true,
  iconSet: null,
  linkStyle: 'plain',
  headingStyle: null,
  entryStyle: null,
  skillStyle: null,
  bulletStyle: null,
  nameCase: 'auto',
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
  sectionTitles: {},
  sectionColumn: {},
  spacing: {},
  textColors: {},
  blockColors: {},
}

/** Merge saved / imported settings over the defaults (also upgrades the old single `font` field). */
export function normalizeSettings(raw: unknown): Settings {
  const r = (raw ?? {}) as Partial<Settings> & { font?: string | null }
  const merged: Settings = { ...DEFAULT_SETTINGS, ...r }
  if (r.font && !r.fontBody) {
    merged.fontBody = r.font as Settings['fontBody']
    merged.fontHeading = r.font as Settings['fontHeading']
  }
  merged.sectionOrder = Array.isArray(merged.sectionOrder) && merged.sectionOrder.length ? merged.sectionOrder : DEFAULT_SECTION_ORDER
  merged.hiddenSections = merged.hiddenSections ?? []
  merged.sectionTitles = merged.sectionTitles ?? {}
  merged.sectionColumn = merged.sectionColumn ?? {}
  merged.spacing = merged.spacing ?? {}
  merged.textColors = merged.textColors ?? {}
  merged.blockColors = merged.blockColors ?? {}
  return merged
}
