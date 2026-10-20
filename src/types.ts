import type { FontId } from './pdf/fontMeta'
import type {
  BulletKind,
  EntryKind,
  HeadingKind,
  IconSet,
  LinkStyle,
  NameCase,
  PhotoShape,
  SkillKind,
} from './pdf/styles'

export type { FontId }

/* ───────────────────────── sections ───────────────────────── */

export type BuiltInSection =
  | 'summary'
  | 'experience'
  | 'projects'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'languages'
  | 'awards'

export type CustomKey = `custom:${string}`
export type SectionKey = BuiltInSection | CustomKey
export type ListKey = Exclude<BuiltInSection, 'summary'>

export const isCustomKey = (k: string): k is CustomKey => k.startsWith('custom:')
export const customKey = (id: string): CustomKey => `custom:${id}`
export const customId = (k: CustomKey) => k.slice('custom:'.length)

export const SECTION_LABEL: Record<BuiltInSection, string> = {
  summary: 'Profile',
  experience: 'Experience',
  projects: 'Projects',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  languages: 'Languages',
  awards: 'Awards',
}

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'summary',
  'experience',
  'projects',
  'education',
  'skills',
  'certifications',
  'languages',
  'awards',
]

/* ───────────────────────── content ───────────────────────── */

export type LinkKind =
  | 'linkedin'
  | 'github'
  | 'portfolio'
  | 'website'
  | 'behance'
  | 'dribbble'
  | 'x'
  | 'instagram'
  | 'youtube'
  | 'medium'
  | 'kaggle'
  | 'stackoverflow'
  | 'leetcode'
  | 'codeforces'
  | 'codechef'
  | 'hackerrank'
  | 'geeksforgeeks'
  | 'googlescholar'
  | 'orcid'
  | 'researchgate'
  | 'figma'
  | 'gitlab'
  | 'notion'
  | 'telegram'
  | 'whatsapp'
  | 'facebook'
  | 'substack'
  | 'other'

export interface ProfileLink {
  id: string
  kind: LinkKind
  /** text shown on the resume – optional, defaults to the URL without its protocol */
  label: string
  /** where it points – optional too (a label that looks like a URL is linked automatically) */
  url: string
}

export interface Basics {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  links: ProfileLink[]
  /** data URL (square-cropped JPEG) or empty */
  photo: string
  summary: string
}

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  start: string
  end: string
  current: boolean
  /** company / project URL – optional; makes the company name clickable */
  link: string
  /** one bullet per line */
  highlights: string
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  location: string
  start: string
  end: string
  link: string
  /** free text – CGPA, honours, coursework… one line per item */
  details: string
}

export interface Skill {
  id: string
  name: string
  /** 1 – 5 */
  level: number
  /** optional heading, e.g. "Languages" or "Frameworks" – skills sharing it are listed together */
  group: string
}

export interface Project {
  id: string
  name: string
  /** makes the project name (and the link text) clickable */
  link: string
  /** optional text for the link, defaults to the URL */
  linkLabel: string
  tech: string
  /** one bullet per line */
  description: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  /** credential URL – makes the name clickable */
  link: string
}

export interface Language {
  id: string
  name: string
  level: string
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  link: string
}

export type CustomKind = 'text' | 'bullets' | 'tags' | 'entries' | 'details'

export interface CustomEntry {
  id: string
  title: string
  subtitle: string
  date: string
  location: string
  link: string
  /** one bullet per line */
  description: string
}

export interface DetailRow {
  id: string
  label: string
  value: string
}

export interface CustomSection {
  id: string
  title: string
  kind: CustomKind
  /** text / bullets (one per line) / tags (comma or line separated) */
  text: string
  items: CustomEntry[]
  rows: DetailRow[]
  /** where it goes in two-column templates */
  column: 'auto' | 'main' | 'side'
}

export interface ResumeData {
  basics: Basics
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  awards: Award[]
  customSections: CustomSection[]
}

export type ListItemMap = {
  experience: Experience
  education: Education
  skills: Skill
  projects: Project
  certifications: Certification
  languages: Language
  awards: Award
}

/* ───────────────────────── design ───────────────────────── */

export type PageSize = 'A4' | 'LETTER'

export type TemplateId = string

/** The kinds of text whose colour can be set for the whole resume. */
export const TEXT_ROLES = ['name', 'title', 'heading', 'role', 'body', 'details', 'org'] as const
export type TextRole = (typeof TEXT_ROLES)[number]

export const TEXT_ROLE_INFO: Record<TextRole, { label: string; hint: string }> = {
  name: { label: 'Your name', hint: 'The big name at the top' },
  title: { label: 'Job title', hint: 'The line under your name' },
  heading: { label: 'Section headings', hint: 'Experience, Education, Skills...' },
  role: { label: 'Roles and degrees', hint: 'Job titles, degrees, project names' },
  body: { label: 'Body text', hint: 'Paragraphs and bullet points' },
  details: { label: 'Dates and details', hint: 'Dates, places and small print' },
  org: { label: 'Companies and schools', hint: 'Employer and institution names, bullet markers' },
}

export interface Settings {
  template: TemplateId
  /** null = the template's own accent */
  accent: string | null
  /** band / sidebar colour – null = the template's own */
  tone: string | null
  /** null = the template's own typefaces */
  fontBody: FontId | null
  fontHeading: FontId | null
  textScale: number
  spacingScale: number
  marginScale: number
  pageSize: PageSize
  showPhoto: boolean
  photoShape: PhotoShape
  showSkillLevels: boolean
  iconSet: IconSet | null
  linkStyle: LinkStyle
  headingStyle: HeadingKind | null
  entryStyle: EntryKind | null
  skillStyle: SkillKind | null
  bulletStyle: BulletKind | null
  nameCase: NameCase
  sectionOrder: SectionKey[]
  hiddenSections: SectionKey[]
  /** renamed headings, e.g. { summary: 'Career objective' } */
  sectionTitles: Partial<Record<SectionKey, string>>
  /** move a section to the other column in two-column templates */
  sectionColumn: Partial<Record<SectionKey, 'main' | 'side'>>
  /** extra space above a block in points, set by dragging inside the preview (key = block id) */
  spacing: Record<string, number>
  /** text colour per kind of text, for the whole resume (key = TextRole). Text on dark panels is left alone. */
  textColors: Partial<Record<TextRole, string>>
  /** text colour of one block, picked in the preview (key = block id, e.g. `hdr`, `sec:experience`, `item:experience:abc`) */
  blockColors: Record<string, string>
}

export const LANGUAGE_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'] as const

/* ───────────────────────── documents ───────────────────────── */

export interface Doc {
  id: string
  name: string
  data: ResumeData
  settings: Settings
  /** untouched persona content shown while the user is still designing */
  isSample: boolean
  /** pasted job description for the match checker */
  jobDescription?: string
  createdAt: number
  updatedAt: number
}
