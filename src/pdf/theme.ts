import { inkSafe, mix, readableOn, shiftHue, tint } from '@/lib/color'
import type { FontId } from './fontMeta'
import type { BulletKind, EntryKind, HeadingKind, IconSet, LinkStyle, SkillKind } from './styles'
import type { FallbackId } from './fontMeta'
import { FALLBACK_FAMILY, FONT_FAMILY } from './fonts'
import { PAGE_DIMENSIONS, type TemplateSpec } from './specs'
import type { PageSize, Settings, TextRole } from '@/types'

export interface PdfTheme {
  spec: TemplateSpec
  accent: string
  /** accent darkened for dark surfaces / strong text */
  accentDark: string
  /** very light accent wash for backgrounds */
  accentSoft: string
  /** light accent for borders / tracks */
  accentTint: string
  /** second hue used by gradients */
  accent2: string
  /** accent that is guaranteed readable as text on white */
  accentInk: string
  onAccent: string
  /** band / sidebar colour */
  tone: string
  /** text colour that reads on `tone` */
  onTone: string

  ink: string
  body: string
  muted: string
  faint: string
  rule: string

  /** families: primary first, then per-glyph fallbacks (₹, Indic scripts …) */
  fontBody: string[]
  fontHeading: string[]
  fontMono: string[]
  fontBodyName: string

  fs: { xs: number; sm: number; base: number; md: number; lg: number; xl: number; xxl: number; name: number }
  lh: number
  sp: (n: number) => number
  /** page margin in pt */
  margin: number

  size: PageSize
  page: { w: number; h: number }
  showPhoto: boolean
  showLevels: boolean
  photoShape: 'circle' | 'rounded' | 'square'
  iconSet: IconSet
  linkStyle: LinkStyle

  /** user overrides of the template's styles (null = keep the template's own) */
  headingOverride: HeadingKind | null
  entryOverride: EntryKind | null
  skillOverride: SkillKind | null
  bulletOverride: BulletKind | null
  nameUpper: boolean | null

  /** per kind of text, set in the Design panel */
  textColors: Partial<Record<TextRole, string>>
  /** per block, set from the preview toolbar */
  blockColors: Record<string, string>

  /** extra space (pt) the user dragged in above a block */
  off: (id: string) => number
  /** emit invisible position markers (live preview only) */
  markers: boolean
}

export interface ThemeOptions {
  markers?: boolean
  fallbacks?: FallbackId[]
}

export function makeTheme(spec: TemplateSpec, s: Settings, opts: ThemeOptions = {}): PdfTheme {
  const accent = s.accent ?? spec.accent
  const base = spec.base * s.textScale
  const spacing = s.spacingScale
  const bodyId: FontId = s.fontBody ?? spec.fonts.body
  const headId: FontId = s.fontHeading ?? spec.fonts.heading
  const fb = (opts.fallbacks ?? []).map((id) => FALLBACK_FAMILY[id])
  const tone = s.tone ?? spec.tone ?? mix(accent, '#0b0d1a', 0.74)

  return {
    spec,
    accent,
    accentDark: mix(accent, '#0b0d1a', 0.74),
    accentSoft: tint(accent, 0.92),
    accentTint: tint(accent, 0.78),
    accent2: spec.accent2 && !s.accent ? spec.accent2 : shiftHue(accent, 48),
    accentInk: inkSafe(accent),
    onAccent: readableOn(accent),
    tone,
    onTone: readableOn(tone),

    ink: '#111827',
    body: '#2b3340',
    muted: '#5b6472',
    faint: '#8b93a1',
    rule: '#dde1e7',

    fontBody: [FONT_FAMILY[bodyId], ...fb],
    fontHeading: [FONT_FAMILY[headId], ...fb],
    fontMono: [FONT_FAMILY['code-pro'], ...fb],
    fontBodyName: FONT_FAMILY[bodyId],

    fs: {
      xs: base * 0.8,
      sm: base * 0.9,
      base,
      md: base * 1.1,
      lg: base * 1.35,
      xl: base * 1.9,
      xxl: base * 2.5,
      name: base * 2.9,
    },
    lh: 1.3 + 0.12 * spacing,
    sp: (n: number) => n * spacing,
    margin: 38 * s.marginScale,

    size: s.pageSize,
    page: PAGE_DIMENSIONS[s.pageSize],
    showPhoto: s.showPhoto,
    showLevels: s.showSkillLevels,
    photoShape: s.photoShape === 'auto' ? spec.header.photoShape ?? 'circle' : s.photoShape,
    iconSet: s.iconSet ?? spec.icons ?? 'line',
    linkStyle: s.linkStyle,

    headingOverride: s.headingStyle,
    entryOverride: s.entryStyle,
    skillOverride: s.skillStyle,
    bulletOverride: s.bulletStyle,
    nameUpper: s.nameCase === 'auto' ? null : s.nameCase === 'upper',

    textColors: s.textColors ?? {},
    blockColors: s.blockColors ?? {},
    off: (id: string) => s.spacing[id] ?? 0,
    markers: !!opts.markers,
  }
}
