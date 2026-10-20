import { Circle, Document, Page, Polygon, Svg, Text } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { ReactNode } from 'react'
import { mix, readableOn } from '@/lib/color'
import { regionOf as regionIn } from '@/lib/regions'
import { contactItems, hasContent, normalizedOrder } from '@/lib/resume'
import type { ResumeData, SectionKey, Settings } from '@/types'
import { Contact } from './contact'
import { Avatar, Header } from './header'
import { View, lightPalette, paletteOn, withTextColors, type Palette } from './kit'
import { renderSections, type RenderCtx, type SectionOpts } from './sections'
import type { Deco, StyleSet } from './specTypes'
import type { PdfTheme } from './theme'

export interface TemplateProps {
  data: ResumeData
  settings: Settings
  t: PdfTheme
}

/* ────────────────────────────── document shell ────────────────────────────── */

function Shell({ data, children }: { data: ResumeData; children: ReactNode }) {
  const name = data.basics.fullName.trim() || 'Your Name'
  const title = data.basics.title.trim()
  return (
    <Document
      title={`${name} – ${title || 'Resume'}`}
      author={name}
      subject="Resume"
      creator="Kriti"
      producer="Kriti"
      language="en-US"
      keywords={[title, ...data.skills.slice(0, 8).map((s) => s.name)].filter(Boolean).join(', ')}
    >
      {children}
    </Document>
  )
}

const pageStyle = (t: PdfTheme): Style => ({
  fontFamily: t.fontBody,
  fontSize: t.fs.base,
  color: t.body,
  backgroundColor: '#ffffff',
  lineHeight: t.lh,
})

/* ────────────────────────────── regions & options ────────────────────────────── */

function palette(t: PdfTheme, s: StyleSet, bg?: string): Palette {
  const base = bg ? paletteOn(t, bg) : lightPalette(t, s.chips === 'white' ? { chipBg: '#ffffff' } : {})
  const over: Partial<Palette> = {}
  if (!bg || readableOn(bg) !== '#ffffff') {
    if (s.headingColor === 'accent') over.heading = t.accentInk
    if (s.headingColor === 'tone') over.heading = readableOn(t.tone) === '#ffffff' ? t.tone : t.ink
    if (s.entryAccent === 'ink') over.accent = t.ink
    if (s.entryAccent === 'muted') over.accent = t.muted
  }
  return withTextColors({ ...base, ...over }, t, bg)
}

function mainOpts(t: PdfTheme, aside?: number): SectionOpts {
  const s = t.spec.main
  return {
    heading: t.headingOverride ?? s.heading,
    entry: t.entryOverride ?? s.entry,
    skills: t.skillOverride ?? s.skills,
    langs: s.langs ?? 'list',
    bullet: t.bulletOverride ?? s.bullet,
    p: palette(t, s),
    gap: s.gap ?? 12,
    summary: s.summary,
    noSummaryHeading: s.noSummaryHeading,
    timelineOn: s.timelineOn,
    aside,
  }
}

function sideOpts(t: PdfTheme, bg?: string): SectionOpts {
  const spec = t.spec
  const s: StyleSet = spec.aside ?? { ...spec.main, entry: 'mini', skills: spec.main.skills === 'inline' ? 'list' : spec.main.skills }
  return {
    heading: t.headingOverride ?? s.heading,
    entry: 'mini',
    skills: t.skillOverride && !['grid', 'columns'].includes(t.skillOverride) ? t.skillOverride : s.skills,
    langs: s.langs ?? 'list',
    bullet: t.bulletOverride ?? s.bullet,
    p: palette(t, s, bg),
    gap: s.gap ?? 13,
    summary: s.summary,
    narrow: true,
  }
}

function visibleKeys(ctx: RenderCtx): SectionKey[] {
  return normalizedOrder(ctx.data, ctx.settings).filter(
    (k) => !ctx.settings.hiddenSections.includes(k) && hasContent(ctx.data, k),
  )
}

/* ────────────────────────────── decoration ────────────────────────────── */

function Decorations({ list, t }: { list: Deco[]; t: PdfTheme }) {
  return (
    <>
      {list.map((d) => {
        switch (d) {
          case 'top-strip':
            return <View key={d} fixed style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: t.accent }} />
          case 'bottom-strip':
            return <View key={d} fixed style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 7, backgroundColor: t.accent }} />
          case 'right-strip':
            return <View key={d} fixed style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 9, backgroundColor: t.accent }} />
          case 'double-strip':
            return (
              <View key={d} fixed style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <View style={{ height: 9, backgroundColor: t.accent }} />
                <View style={{ height: 2.2, marginTop: 2.6, backgroundColor: t.accentTint }} />
              </View>
            )
          case 'corner-triangle':
            return (
              <Svg key={d} width={118} height={118} style={{ position: 'absolute', top: 0, left: 0 }}>
                <Polygon points="0,0 118,0 0,118" fill={t.accent} />
                <Polygon points="0,0 74,0 0,74" fill={t.accentDark} fillOpacity={0.35} />
              </Svg>
            )
          case 'dot-grid':
            return <DotGrid key={d} t={t} />
          case 'ring':
            return (
              <Svg key={d} width={190} height={190} style={{ position: 'absolute', top: -70, right: -70 }}>
                <Circle cx={95} cy={95} r={76} fill="none" stroke={t.accentTint} strokeWidth={16} />
                <Circle cx={95} cy={95} r={44} fill="none" stroke={t.accentSoft} strokeWidth={10} />
              </Svg>
            )
          case 'left-strip':
            return <View key={d} fixed style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 9, backgroundColor: t.accent }} />
          case 'frame':
            return (
              <View
                key={d}
                fixed
                style={{ position: 'absolute', top: 16, bottom: 16, left: 16, right: 16, borderWidth: 1, borderColor: t.accentTint }}
              />
            )
          case 'corner-circles':
            return <CornerCircles key={d} t={t} />
        }
      })}
    </>
  )
}

function DotGrid({ t }: { t: PdfTheme }) {
  const dots: ReactNode[] = []
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) dots.push(<Circle key={`${r}-${c}`} cx={6 + c * 14} cy={6 + r * 14} r={2.2} fill={t.accentTint} />)
  return (
    <Svg width={100} height={74} style={{ position: 'absolute', top: 20, right: 22 }}>
      {dots}
    </Svg>
  )
}

function CornerCircles({ t }: { t: PdfTheme }) {
  return (
    <Svg width={210} height={210} style={{ position: 'absolute', top: -92, right: -78 }}>
      <Circle cx={105} cy={105} r={105} fill={t.accentSoft} />
      <Circle cx={105} cy={105} r={66} fill={t.accentTint} />
    </Svg>
  )
}

/* ────────────────────────────── layouts ────────────────────────────── */

function Single({ ctx }: { ctx: RenderCtx }) {
  const { t } = ctx
  const spec = t.spec
  const layout = spec.layout
  if (layout.kind !== 'single') return null
  const m = t.margin * (spec.padX ?? 1)
  const vm = t.margin * 0.85 * (spec.padY ?? 1)
  const keys = visibleKeys(ctx)
  const body = renderSections(keys, ctx, mainOpts(t, layout.aside))
  return (
    <Page size={t.size} style={{ ...pageStyle(t), paddingTop: vm, paddingBottom: vm }}>
      <Decorations list={spec.deco ?? []} t={t} />
      <Header ctx={ctx} />
      <View style={{ paddingHorizontal: m }}>{body}</View>
    </Page>
  )
}

function Split({ ctx }: { ctx: RenderCtx }) {
  const { t } = ctx
  const spec = t.spec
  const layout = spec.layout
  if (layout.kind !== 'split') return null
  const m = t.margin * (spec.padX ?? 1)
  const vm = t.margin * 0.85 * (spec.padY ?? 1)
  const keys = visibleKeys(ctx)
  const mainKeys = keys.filter((k) => regionIn(k, layout.side, ctx.data, ctx.settings) === 'main')
  const sideKeys = keys.filter((k) => regionIn(k, layout.side, ctx.data, ctx.settings) === 'side')
  const panel = layout.panel ?? 'none'
  const sideW = layout.sideW ?? 168
  const gap = layout.gap ?? 20
  const sideBody = renderSections(sideKeys, ctx, sideOpts(t))
  const sideLeft = layout.at === 'left'
  const mainCol = <View style={{ flex: 1, ...(sideLeft ? { paddingLeft: gap } : { paddingRight: gap }) }}>{renderSections(mainKeys, ctx, mainOpts(t))}</View>
  const sideRule = panel === 'rule' ? (sideLeft ? { borderRightWidth: 0.8, borderRightColor: t.rule, paddingRight: 16 } : { borderLeftWidth: 0.8, borderLeftColor: t.rule, paddingLeft: 16 }) : {}
  const sideCol =
    panel === 'card' ? (
      <View style={{ width: sideW }}>
        {sideKeys.length > 0 && (
          <View style={{ backgroundColor: t.accentSoft, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 14 }}>
            {renderSections(sideKeys, ctx, { ...sideOpts(t), p: { ...sideOpts(t).p, chipBg: '#ffffff', track: '#ffffff' } })}
          </View>
        )}
      </View>
    ) : (
      <View style={{ width: sideW, ...sideRule }}>{sideBody}</View>
    )
  return (
    <Page size={t.size} style={{ ...pageStyle(t), paddingTop: vm, paddingBottom: vm }}>
      <Decorations list={spec.deco ?? []} t={t} />
      <Header ctx={ctx} />
      <View style={{ flexDirection: 'row', paddingHorizontal: m }}>
        {sideLeft ? sideCol : mainCol}
        {sideLeft ? mainCol : sideCol}
      </View>
    </Page>
  )
}

function Sidebar({ ctx }: { ctx: RenderCtx }) {
  const { t, data } = ctx
  const spec = t.spec
  const layout = spec.layout
  if (layout.kind !== 'sidebar') return null
  const m = t.margin * (spec.padX ?? 1)
  const vm = t.margin * 0.9 * (spec.padY ?? 1)
  const W = Math.round(t.page.w * layout.w)
  const left = layout.at === 'left'
  const bg =
    layout.bg === 'tone'
      ? t.tone
      : layout.bg === 'accent'
        ? t.accent
        : layout.bg === 'tint'
          ? t.accentSoft
          : layout.bg === 'gray'
            ? '#f1f2f4'
            : layout.bg === 'ink'
              ? '#111827'
              : '#ffffff'
  const onBg = layout.bg === 'white' ? undefined : bg
  const sp = withTextColors(paletteOn(t, bg), t, bg)
  const keys = visibleKeys(ctx)
  const sideKeys = keys.filter((k) => regionIn(k, layout.sections, ctx.data, ctx.settings) === 'side')
  const mainKeys = keys.filter((k) => regionIn(k, layout.sections, ctx.data, ctx.settings) === 'main')
  const items = contactItems(data.basics)
  const sideP = onBg ? sp : withTextColors(lightPalette(t), t)
  const name = data.basics.fullName.trim() || 'Your Name'
  const showPhoto = layout.photo && t.showPhoto && spec.photo
  const padSide = 22

  const sideColumn = (
    <View style={{ width: W, paddingHorizontal: padSide }}>
      {showPhoto && (
        <View style={{ marginBottom: t.sp(18), alignItems: 'flex-start' }}>
          <Avatar photo={data.basics.photo} name={name} t={t} size={86} bg={t.accent} />
        </View>
      )}
      {layout.contact && items.length > 0 && (
        <View style={{ marginBottom: t.sp(15) }}>
          <ContactTitle t={t} p={sideP} />
          <Contact
            items={items}
            t={t}
            layout="column"
            color={onBg ? sideP.body : t.body}
            iconColor={onBg ? sideP.accent : t.accentInk}
            badgeBg={onBg ? mix(bg, '#ffffff', 0.16) : t.accentSoft}
            captionColor={sideP.muted}
            size={t.fs.sm}
          />
        </View>
      )}
      {renderSections(sideKeys, ctx, sideOpts(t, onBg))}
    </View>
  )

  const mainColumn = (
    <View style={{ flex: 1, paddingLeft: left ? 26 : m, paddingRight: left ? m : 24 }}>
      <Header ctx={ctx} inMain />
      {renderSections(mainKeys, ctx, mainOpts(t))}
    </View>
  )

  return (
    <Page size={t.size} style={{ ...pageStyle(t), paddingTop: vm, paddingBottom: vm }}>
      <Decorations list={spec.deco ?? []} t={t} />
      {layout.bg !== 'white' ? (
        <View
          fixed
          style={{ position: 'absolute', top: 0, bottom: 0, ...(left ? { left: 0 } : { right: 0 }), width: W, backgroundColor: bg }}
        />
      ) : (
        <View
          fixed
          style={{ position: 'absolute', top: 0, bottom: 0, ...(left ? { left: W } : { right: W }), width: 0.8, backgroundColor: t.rule }}
        />
      )}
      <View style={{ flexDirection: 'row' }}>
        {left ? sideColumn : mainColumn}
        {left ? mainColumn : sideColumn}
      </View>
    </Page>
  )
}

/** Small "Contact" label above the sidebar contact list – uses the heading style of the sidebar. */
function ContactTitle({ t, p }: { t: PdfTheme; p: Palette }) {
  const spec = t.spec
  const kind = t.headingOverride ?? spec.aside?.heading ?? spec.main.heading
  return (
    <View style={{ marginBottom: t.sp(7) }}>
      <Text
        style={{
          fontFamily: t.fontHeading,
          fontWeight: 700,
          fontSize: t.fs.sm,
          letterSpacing: kind === 'plain' ? 0.2 : 1.8,
          textTransform: kind === 'plain' ? 'none' : 'uppercase',
          color: kind === 'plain' ? p.accent : p.heading,
        }}
      >
        Contact
      </Text>
      <View style={{ width: 22, height: 1.6, backgroundColor: p.fill, marginTop: 3.5 }} />
    </View>
  )
}

/* ────────────────────────────── entry point ────────────────────────────── */

export default function Template({ data, settings, t }: TemplateProps) {
  const ctx: RenderCtx = { data, settings, t }
  const kind = t.spec.layout.kind
  return (
    <Shell data={data}>{kind === 'single' ? <Single ctx={ctx} /> : kind === 'split' ? <Split ctx={ctx} /> : <Sidebar ctx={ctx} />}</Shell>
  )
}

