import type { PageSize, SectionKey } from '@/types'
import type { FontId } from './fontMeta'
import type { BulletKind, EntryKind, HeadingKind, IconSet, LangKind, SkillKind } from './styles'

/** Page sizes in PDF points. */
export const PAGE_DIMENSIONS: Record<PageSize, { w: number; h: number }> = {
  A4: { w: 595.28, h: 841.89 },
  LETTER: { w: 612, h: 792 },
}

export type Category =
  | 'Professional'
  | 'Modern'
  | 'Creative'
  | 'Minimal'
  | 'Classic'
  | 'Tech'
  | 'Fresher'
  | 'Executive'
  | 'Academic'
  | 'Healthcare'

export type Tag =
  | 'ats'
  | 'photo'
  | 'one-column'
  | 'two-column'
  | 'sidebar'
  | 'skill-levels'
  | 'timeline'
  | 'dark'
  | 'colourful'
  | 'serif'
  | 'compact'
  | 'education-first'
  | 'icons'

/** How one region (main column / sidebar) draws its sections. */
export interface StyleSet {
  heading: HeadingKind
  entry: EntryKind
  skills: SkillKind
  langs?: LangKind
  bullet: BulletKind
  /** gap between sections, pt */
  gap?: number
  summary?: 'plain' | 'box' | 'quote'
  noSummaryHeading?: boolean
  /** colour of heading text: ink (default) | accent | tone */
  headingColor?: 'ink' | 'accent' | 'tone'
  /** colour of company names / bullet markers: accent (default) | ink | muted */
  entryAccent?: 'accent' | 'ink' | 'muted'
  /** skill chips on white (for tinted panels) */
  chips?: 'soft' | 'white'
  timelineOn?: SectionKey[]
}

export type Layout =
  | {
      kind: 'single'
      /** Swiss style: headings in a left-hand column of this width (pt) */
      aside?: number
    }
  | {
      kind: 'split'
      /** sections that go in the narrow column */
      side: SectionKey[]
      /** width of the narrow column, pt (default 168) */
      sideW?: number
      panel?: 'none' | 'card' | 'rule'
      gap?: number
      /** which side the narrow column sits on (default right) */
      at?: 'left' | 'right'
    }
  | {
      kind: 'sidebar'
      at: 'left' | 'right'
      /** fraction of the page width (0.28 – 0.36) */
      w: number
      bg: 'tone' | 'tint' | 'accent' | 'white' | 'gray' | 'ink'
      sections: SectionKey[]
      /** photo / monogram at the top of the sidebar */
      photo?: boolean
      /** contact details live in the sidebar (otherwise in the header) */
      contact?: boolean
    }

export type Deco =
  | 'top-strip'
  | 'left-strip'
  | 'bottom-strip'
  | 'right-strip'
  | 'double-strip'
  | 'corner-circles'
  | 'corner-triangle'
  | 'dot-grid'
  | 'ring'
  | 'frame'

export interface HeaderSpec {
  kind?: 'plain' | 'band' | 'gradient' | 'terminal' | 'boxed'
  align?: 'left' | 'center'
  nameSize?: 'md' | 'lg' | 'xl' | 'xxl' | 'huge'
  nameWeight?: 400 | 600 | 700 | 800
  nameUpper?: boolean
  nameSpacing?: number
  nameColor?: 'ink' | 'accent' | 'tone'
  /** first names in ink, last name in the accent colour */
  twoTone?: boolean
  /** first / last name on separate lines */
  stack?: boolean
  nameFont?: 'heading' | 'body'
  titleStyle?: 'plain' | 'pill' | 'italic' | 'caps' | 'accent-caps'
  titleColor?: 'accent' | 'muted' | 'ink' | 'gold'
  contact?: 'row' | 'right' | 'grid' | 'inline-pipe' | 'inline-dot' | 'none'
  photo?: 'left' | 'right' | false
  photoShape?: 'circle' | 'rounded' | 'square'
  photoSize?: number
  rule?: 'none' | 'thin' | 'thick' | 'double' | 'short' | 'dotted'
  /** band colour: tone | accent | tint | ink | white */
  bandBg?: 'tone' | 'accent' | 'tint' | 'ink' | 'white'
  bandPad?: [top: number, bottom: number]
  /** fixed height for gradient bands */
  bandH?: number
  /** space below the header, pt */
  mb?: number
  /** a short accent bar under the name */
  accentBar?: boolean
}

export interface TemplateSpec {
  id: string
  name: string
  tagline: string
  category: Category
  tags: Tag[]
  /** persona (sample resume) id – defaults to the template id */
  persona?: string
  accent: string
  accent2?: string
  /** default band / sidebar colour */
  tone?: string
  fonts: { body: FontId; heading: FontId }
  /** base font size in pt */
  base: number
  photo: boolean
  /** draws skill levels (bars / dots) so the "show levels" toggle has an effect */
  levels: boolean
  /** 3–5: how safely applicant-tracking systems parse the layout */
  ats: 3 | 4 | 5
  /** rough popularity used for the default sort (0–100) */
  popular: number
  /** default icon set */
  icons?: IconSet
  /** default section order (freshers lead with education) */
  order?: SectionKey[]
  deco?: Deco[]
  /** page margin multipliers */
  padX?: number
  padY?: number
  layout: Layout
  header: HeaderSpec
  main: StyleSet
  aside?: StyleSet
}
