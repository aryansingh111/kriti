import { Circle, Link, Path, Rect, Svg, View as PdfView } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { ComponentProps, ReactNode } from 'react'
import { contrast, mix, readableOn, tint } from '@/lib/color'
import { ICON_DATA } from './iconData'
import { MARK_PREFIX } from './markers'
import type { PdfTheme } from './theme'

/* ────────────────────────────── never-shrink View ────────────────────────────── */

/**
 * react-pdf coerces `flexShrink: 0` to 1, so at a page boundary Yoga squashes rows into each other.
 * A vanishing positive value is the practical way to say "never shrink".
 */
export const NO_SHRINK = 0.0001

/** Drop-in `View` that never shrinks unless the caller sets `flex`/`flexShrink` explicitly. */
export function View({ style, ...rest }: ComponentProps<typeof PdfView>) {
  const s = (style ?? {}) as Style
  const explicit = s.flexShrink !== undefined || s.flex !== undefined
  return <PdfView {...rest} style={explicit ? s : { ...s, flexShrink: NO_SHRINK }} />
}

/* ────────────────────────────── text separators ────────────────────────────── */

/**
 * react-pdf's line breaker treats any run of 2+ spaces as a hyphenation point (it only recognises a single
 * ' ' as a word gap), which prints stray hyphens at line ends. Separators therefore pad with non-breaking
 * spaces and keep exactly one regular space – the only place a line may wrap.
 */
const SEP_NBSP = {
  dot: '  ·  ',
  pipe: '  |  ',
  dash: '  —  ',
}
const SEP_PLAIN = { dot: ' · ', pipe: ' | ', dash: ' — ' }

/** Source Code Pro's WOFF has no usable NBSP glyph (fontkit throws), so monospace falls back to plain spaces. */
export function sepOf(fontFamily: string) {
  return fontFamily === 'Source Code Pro' ? SEP_PLAIN : SEP_NBSP
}

/* ────────────────────────────── palette ────────────────────────────── */

export interface Palette {
  ink: string
  body: string
  muted: string
  /** accent used for text & markers (readable on this surface) */
  accent: string
  rule: string
  heading: string
  chipBg: string
  chipText: string
  chipBorder: string
  track: string
  fill: string
  onAccent: string
}

export function lightPalette(t: PdfTheme, over: Partial<Palette> = {}): Palette {
  return {
    ink: t.ink,
    body: t.body,
    muted: t.muted,
    accent: t.accentInk,
    rule: t.rule,
    heading: t.ink,
    chipBg: t.accentSoft,
    chipText: t.accentInk,
    chipBorder: t.accentTint,
    track: t.accentTint,
    fill: t.accent,
    onAccent: t.onAccent,
    ...over,
  }
}

/** Every kind of text in a block set to one colour; dates and small print stay a softer shade of it. */
export function recolor(p: Palette, c: string): Palette {
  const dark = readableOn(c) === '#ffffff'
  return { ...p, ink: c, body: c, heading: c, accent: c, muted: dark ? mix(c, '#ffffff', 0.42) : mix(c, '#000000', 0.32) }
}

/** The colours chosen per kind of text in the Design panel. Text on a dark surface keeps its own light colours. */
export function withTextColors(p: Palette, t: PdfTheme, bg?: string): Palette {
  if (bg && readableOn(bg) === '#ffffff') return p
  const c = t.textColors
  return {
    ...p,
    ...(c.heading && { heading: c.heading }),
    ...(c.role && { ink: c.role }),
    ...(c.body && { body: c.body }),
    ...(c.details && { muted: c.details }),
    ...(c.org && { accent: c.org }),
  }
}

/** Palette for text that sits on a dark surface `bg`. */
export function darkPalette(t: PdfTheme, bg: string, over: Partial<Palette> = {}): Palette {
  const light = tint(t.accent, 0.4)
  return {
    ink: '#ffffff',
    body: mix('#ffffff', bg, 0.12),
    muted: mix('#ffffff', bg, 0.42),
    accent: light,
    rule: mix(bg, '#ffffff', 0.22),
    heading: '#ffffff',
    chipBg: mix(bg, '#ffffff', 0.12),
    chipText: '#ffffff',
    chipBorder: mix(bg, '#ffffff', 0.2),
    track: mix(bg, '#ffffff', 0.2),
    fill: light,
    onAccent: readableOn(light),
    ...over,
  }
}

/** Light or dark palette – whichever reads on `bg`. */
export function paletteOn(t: PdfTheme, bg: string, over: Partial<Palette> = {}): Palette {
  const dark = readableOn(bg) === '#ffffff'
  if (dark) return darkPalette(t, bg, over)
  // a light surface that may itself be the accent colour: keep markers readable on it
  const clash = contrast(bg, t.accentInk) < 3
  return lightPalette(
    t,
    clash
      ? { chipBg: '#ffffff', accent: t.ink, fill: t.ink, onAccent: '#ffffff', chipText: t.ink, ...over }
      : { chipBg: '#ffffff', ...over },
  )
}

/* ────────────────────────────── icons ────────────────────────────── */

export function Icon({
  name,
  size = 9,
  color,
  stroke = 2,
}: {
  name: string
  size?: number
  color: string
  stroke?: number
}) {
  const nodes = ICON_DATA[name] ?? ICON_DATA.link
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {nodes.map(([tag, a], i) => {
        const paint =
          a.fill === true
            ? { fill: color }
            : {
                fill: 'none',
                stroke: color,
                strokeWidth: stroke,
                strokeLinecap: 'round' as const,
                strokeLinejoin: 'round' as const,
              }
        if (tag === 'path') return <Path key={i} d={String(a.d)} {...paint} />
        if (tag === 'rect')
          return (
            <Rect
              key={i}
              x={Number(a.x)}
              y={Number(a.y)}
              width={Number(a.width)}
              height={Number(a.height)}
              rx={Number(a.rx ?? 0)}
              {...paint}
            />
          )
        return <Circle key={i} cx={Number(a.cx)} cy={Number(a.cy)} r={Number(a.r)} {...paint} />
      })}
    </Svg>
  )
}

/** Contact icon in the user's chosen icon set. `label` draws no glyph – the caller prints a caption instead. */
export function SetIcon({
  name,
  set,
  size,
  color,
  badgeBg,
}: {
  name: string
  set: PdfTheme['iconSet']
  size: number
  color: string
  badgeBg?: string
}) {
  const solid = !!ICON_DATA[name]?.[0]?.[1]?.fill
  if (set === 'none' || set === 'label') return null
  if (set === 'dot')
    return <View style={{ width: size * 0.42, height: size * 0.42, borderRadius: size * 0.21, backgroundColor: color }} />
  if (set === 'badge' || set === 'square') {
    const d = size * 1.85
    const bg = badgeBg ?? color
    return (
      <View
        style={{
          width: d,
          height: d,
          borderRadius: set === 'badge' ? d / 2 : d * 0.24,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name={name} size={size * 0.98} color={readableOn(bg)} stroke={solid ? 0 : 2.3} />
      </View>
    )
  }
  return <Icon name={name} size={size} color={color} stroke={set === 'bold' ? 2.9 : 2} />
}

/* ────────────────────────────── links ────────────────────────────── */

/** Style a clickable run according to the user's link style. */
export function linkStyle(t: PdfTheme, color: string): Style {
  return {
    color: t.linkStyle === 'accent' ? t.accentInk : color,
    textDecoration: t.linkStyle === 'underline' ? 'underline' : 'none',
  }
}

/** Wraps `children` in a PDF hyperlink when `href` is set; otherwise renders them as-is. */
export function Linked({
  href,
  t,
  color,
  children,
}: {
  href?: string
  t: PdfTheme
  color: string
  children: ReactNode
}) {
  if (!href) return <>{children}</>
  return (
    <Link src={href} style={linkStyle(t, color)}>
      {children}
    </Link>
  )
}

/* ────────────────────────────── position markers ────────────────────────────── */

/**
 * An invisible link annotation that exactly fills its parent. pdfkit positions annotation rectangles through the
 * current transform, so reading them back (see `readBlocks`) tells the live preview where every block landed on the
 * page – which is how the drag-to-adjust-spacing handles are placed. Only emitted for the preview render.
 */
export function Mark({ t, id }: { t: PdfTheme; id: string }) {
  if (!t.markers) return null
  return <Link src={`${MARK_PREFIX}${encodeURIComponent(id)}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
}
