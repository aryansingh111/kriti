import { Text } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import { Fragment, type ReactNode } from 'react'
import {
  customSection,
  dateRange,
  displayUrl,
  hasContent,
  safeHref,
  sectionTitle,
  splitLines,
  splitTags,
} from '@/lib/resume'
import { isCustomKey, type BuiltInSection, type CustomSection, type ResumeData, type SectionKey, type Settings } from '@/types'
import { BulletLine, DATE_COLUMN, makeEntry, type EntryItem } from './entries'
import { SectionHeading } from './headings'
import { Mark, View, recolor, type Palette } from './kit'
import { LanguagesBody, SkillsBody } from './skills'
import type { BulletKind, EntryKind, HeadingKind, LangKind, SkillKind } from './styles'
import type { PdfTheme } from './theme'

export interface RenderCtx {
  data: ResumeData
  settings: Settings
  t: PdfTheme
}

export interface SectionOpts {
  heading: HeadingKind
  entry: EntryKind
  skills: SkillKind
  langs: LangKind
  bullet: BulletKind
  p: Palette
  /** vertical gap after a section, pt (before spacing scale) */
  gap?: number
  /** how the summary paragraph is drawn */
  summary?: 'plain' | 'box' | 'quote'
  /** hide the "Profile" heading */
  noSummaryHeading?: boolean
  /** timeline entries for these sections (when entry === 'timeline') */
  timelineOn?: SectionKey[]
  /** put headings in a left-hand column of this width instead of above the content */
  aside?: number
  /** a narrow column: key/value rows stack, multi-column skill grids collapse */
  narrow?: boolean
}

/* ────────────────────────────── section frame ────────────────────────────── */

function Section({
  id,
  title,
  o,
  t,
  index,
  body,
  items,
}: {
  /** block id, e.g. `sec:experience` */
  id: string
  title: string
  o: SectionOpts
  t: PdfTheme
  index: number
  body?: ReactNode
  items?: EntryItem[]
}) {
  const off = t.off(id)
  const heading = <SectionHeading title={title} kind={o.heading} t={t} p={o.p} index={index} />
  const outer: Style = { marginBottom: t.sp(o.gap ?? 12), position: 'relative', ...(off ? { marginTop: off } : {}) }
  const aside = o.aside
  const label: Style = { width: aside, paddingRight: 12, paddingTop: 1.5 }
  const mark = <Mark t={t} id={id} />

  if (items && items.length > 0) {
    const [first, ...others] = items
    const tail = (
      <>
        {first.rest}
        {others.map((it, i) => (
          <Fragment key={i}>
            {it.top}
            {it.rest}
          </Fragment>
        ))}
      </>
    )
    if (aside) {
      return (
        <View style={outer}>
          <View wrap={false} style={{ flexDirection: 'row' }}>
            {mark}
            <View style={label}>{heading}</View>
            <View style={{ flex: 1 }}>{first.top}</View>
          </View>
          <View style={{ marginLeft: aside }}>{tail}</View>
        </View>
      )
    }
    return (
      <View style={outer}>
        <View wrap={false}>
          {mark}
          {heading}
          {first.top}
        </View>
        {tail}
      </View>
    )
  }

  if (aside) {
    return (
      <View wrap={false} style={{ ...outer, flexDirection: 'row' }}>
        {mark}
        <View style={label}>{heading}</View>
        <View style={{ flex: 1 }}>{body}</View>
      </View>
    )
  }
  return (
    <View wrap={false} style={outer}>
      {mark}
      {heading}
      {body}
    </View>
  )
}

/* ────────────────────────────── helpers ────────────────────────────── */

function Paragraph({ text, t, p, italic }: { text: string; t: PdfTheme; p: Palette; italic?: boolean }) {
  return (
    <Text
      style={{
        fontFamily: t.fontBody,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: t.fs.base * (italic ? 1.04 : 1.02),
        lineHeight: t.lh + 0.04,
        color: p.body,
      }}
    >
      {text}
    </Text>
  )
}

function DetailsBody({ rows, t, p, narrow }: { rows: { label: string; value: string }[]; t: PdfTheme; p: Palette; narrow?: boolean }) {
  return (
    <View>
      {rows.map((r, i) => (
        <View
          key={i}
          wrap={false}
          style={{ flexDirection: narrow ? 'column' : 'row', marginBottom: t.sp(narrow ? 3.4 : 2.8) }}
        >
          <Text
            style={{
              width: narrow ? undefined : 108,
              paddingRight: 8,
              fontFamily: t.fontBody,
              fontWeight: 600,
              fontSize: narrow ? t.fs.xs : t.fs.base,
              letterSpacing: narrow ? 0.6 : 0,
              textTransform: narrow ? 'uppercase' : 'none',
              lineHeight: 1.35,
              color: narrow ? p.muted : p.ink,
            }}
          >
            {r.label}
          </Text>
          <Text style={{ flex: 1, fontFamily: t.fontBody, fontSize: t.fs.base, lineHeight: 1.35, color: p.body }}>{r.value}</Text>
        </View>
      ))}
    </View>
  )
}

function Bullets({ lines, o, t }: { lines: string[]; o: SectionOpts; t: PdfTheme }) {
  return (
    <View>
      {lines.map((l, i) => (
        <BulletLine key={i} text={l} kind={o.bullet} t={t} p={o.p} />
      ))}
    </View>
  )
}

/* ────────────────────────────── sections ────────────────────────────── */

export function renderSection(key: SectionKey, ctx: RenderCtx, o0: SectionOpts, index: number): ReactNode {
  const { data, settings, t } = ctx
  // a colour picked for the whole section (or for a single entry) in the preview wins over everything else
  const sectionColor = t.blockColors[`sec:${key}`]
  const o: SectionOpts = sectionColor ? { ...o0, p: recolor(o0.p, sectionColor) } : o0
  const { p } = o
  const pItem = (id: string): Palette => {
    const c = t.blockColors[id]
    return c ? recolor(p, c) : p
  }
  const title = sectionTitle(key, data, settings)
  const entryKind = (k: string): EntryKind =>
    o.entry === 'timeline' && !(o.timelineOn ?? ['experience', 'education']).includes(k as SectionKey) ? 'split' : o.entry
  const plainKind: EntryKind = o.entry === 'timeline' ? 'split' : o.entry
  const sec = (body?: ReactNode, items?: EntryItem[]) => (
    <Section key={key} id={`sec:${key}`} title={title} o={o} t={t} index={index} body={body} items={items} />
  )

  if (isCustomKey(key)) {
    const c = customSection(data, key)
    if (!c || !hasContent(data, key)) return null
    return renderCustom(c, key, o, t, entryKind, sec, pItem)
  }

  switch (key as BuiltInSection) {
    case 'summary': {
      const text = data.basics.summary.trim()
      if (!text) return null
      let body: ReactNode = <Paragraph text={text} t={t} p={p} />
      if (o.summary === 'box')
        body = (
          <View
            style={{
              backgroundColor: t.accentSoft,
              borderRadius: 4,
              paddingVertical: t.sp(7),
              paddingHorizontal: 10,
              borderLeftWidth: 2.6,
              borderLeftColor: t.accent,
            }}
          >
            <Paragraph text={text} t={t} p={p} />
          </View>
        )
      if (o.summary === 'quote')
        body = (
          <View style={{ borderLeftWidth: 2, borderLeftColor: p.accent, paddingLeft: 9 }}>
            <Paragraph text={text} t={t} p={p} italic />
          </View>
        )
      if (o.noSummaryHeading) {
        const off = t.off('sec:summary')
        return (
          <View key={key} wrap={false} style={{ marginBottom: t.sp(o.gap ?? 12), position: 'relative', ...(off ? { marginTop: off } : {}) }}>
            <Mark t={t} id="sec:summary" />
            {body}
          </View>
        )
      }
      return sec(body)
    }

    case 'experience': {
      const list = data.experience.filter((e) => e.role.trim() || e.company.trim())
      if (!list.length) return null
      const kind = entryKind('experience')
      return sec(
        undefined,
        list.map((e, i) => {
          const href = safeHref(e.link)
          const hasRole = !!e.role.trim()
          return makeEntry({
            id: `item:experience:${e.id}`,
            kind,
            t,
            p: pItem(`item:experience:${e.id}`),
            bullet: o.bullet,
            last: i === list.length - 1,
            head: {
              primary: e.role.trim() || e.company.trim(),
              secondary: hasRole ? e.company.trim() : '',
              date: dateRange(e.start, e.end, e.current),
              place: e.location.trim(),
              primaryHref: hasRole ? undefined : href,
              secondaryHref: hasRole ? href : undefined,
            },
            bullets: splitLines(e.highlights),
          })
        }),
      )
    }

    case 'education': {
      const list = data.education.filter((e) => e.school.trim() || e.degree.trim())
      if (!list.length) return null
      const kind = entryKind('education')
      return sec(
        undefined,
        list.map((e, i) => {
          const degree = [e.degree.trim(), e.field.trim()].filter(Boolean).join(e.degree.trim() && e.field.trim() ? ' in ' : '')
          const href = safeHref(e.link)
          return makeEntry({
            id: `item:education:${e.id}`,
            kind,
            t,
            p: pItem(`item:education:${e.id}`),
            bullet: o.bullet,
            last: i === list.length - 1,
            head: {
              primary: degree || e.school.trim(),
              secondary: degree ? e.school.trim() : '',
              date: dateRange(e.start, e.end, false),
              place: e.location.trim(),
              primaryHref: degree ? undefined : href,
              secondaryHref: degree ? href : undefined,
            },
            notes: splitLines(e.details),
          })
        }),
      )
    }

    case 'projects': {
      const list = data.projects.filter((x) => x.name.trim())
      if (!list.length) return null
      const kind = entryKind('projects')
      return sec(
        undefined,
        list.map((x, i) => {
          const href = safeHref(x.link)
          return makeEntry({
            id: `item:projects:${x.id}`,
            kind,
            t,
            p: pItem(`item:projects:${x.id}`),
            bullet: o.bullet,
            last: i === list.length - 1,
            head: {
              primary: x.name.trim(),
              secondary: x.tech.trim(),
              place: href || x.linkLabel.trim() ? x.linkLabel.trim() || displayUrl(x.link) : '',
              placeHref: href,
              primaryHref: href,
            },
            bullets: splitLines(x.description),
          })
        }),
      )
    }

    case 'certifications': {
      const list = data.certifications.filter((c) => c.name.trim())
      if (!list.length) return null
      return sec(
        undefined,
        list.map((c, i) =>
          makeEntry({
            id: `item:certifications:${c.id}`,
            kind: plainKind,
            t,
            p: pItem(`item:certifications:${c.id}`),
            bullet: o.bullet,
            last: i === list.length - 1,
            head: { primary: c.name.trim(), secondary: c.issuer.trim(), date: c.date.trim(), primaryHref: safeHref(c.link) },
          }),
        ),
      )
    }

    case 'awards': {
      const list = data.awards.filter((a) => a.title.trim())
      if (!list.length) return null
      return sec(
        undefined,
        list.map((a, i) =>
          makeEntry({
            id: `item:awards:${a.id}`,
            kind: plainKind,
            t,
            p: pItem(`item:awards:${a.id}`),
            bullet: o.bullet,
            last: i === list.length - 1,
            head: { primary: a.title.trim(), secondary: a.issuer.trim(), date: a.date.trim(), primaryHref: safeHref(a.link) },
            paragraph: plainKind === 'mini' ? undefined : a.description.trim() || undefined,
            notes: plainKind === 'mini' && a.description.trim() ? [a.description.trim()] : [],
          }),
        ),
      )
    }

    case 'skills': {
      const list = data.skills.filter((s) => s.name.trim())
      if (!list.length) return null
      return sec(<SkillsBody skills={list} kind={o.skills} t={t} p={p} narrow={o.narrow} />)
    }

    case 'languages': {
      const list = data.languages.filter((l) => l.name.trim())
      if (!list.length) return null
      return sec(<LanguagesBody items={list} kind={o.langs} t={t} p={p} />)
    }
  }
}

function renderCustom(
  c: CustomSection,
  key: SectionKey,
  o: SectionOpts,
  t: PdfTheme,
  entryKind: (k: string) => EntryKind,
  sec: (body?: ReactNode, items?: EntryItem[]) => ReactNode,
  pItem: (id: string) => Palette,
): ReactNode {
  const { p } = o
  switch (c.kind) {
    case 'text':
      return sec(<Paragraph text={c.text.trim()} t={t} p={p} />)
    case 'bullets':
      return sec(<Bullets lines={splitLines(c.text)} o={o} t={t} />)
    case 'tags': {
      const kind: SkillKind = o.skills === 'bars' || o.skills === 'dots' ? 'tags' : o.skills
      return sec(<SkillsBody skills={splitTags(c.text).map((name) => ({ name, level: 4 }))} kind={kind} t={t} p={p} narrow={o.narrow} />)
    }
    case 'details':
      return sec(<DetailsBody rows={c.rows.filter((r) => r.label.trim() || r.value.trim())} t={t} p={p} narrow={o.narrow} />)
    case 'entries': {
      const list = c.items.filter((i) => i.title.trim() || i.subtitle.trim())
      const kind = entryKind('custom')
      return sec(
        undefined,
        list.map((it, i) => {
          const href = safeHref(it.link)
          return makeEntry({
            id: `item:${key}:${it.id}`,
            kind,
            t,
            p: pItem(`item:${key}:${it.id}`),
            bullet: o.bullet,
            last: i === list.length - 1,
            head: {
              primary: it.title.trim() || it.subtitle.trim(),
              secondary: it.title.trim() ? it.subtitle.trim() : '',
              date: it.date.trim(),
              place: it.location.trim(),
              primaryHref: href,
            },
            bullets: splitLines(it.description),
          })
        }),
      )
    }
  }
}

export function renderSections(keys: SectionKey[], ctx: RenderCtx, o: SectionOpts, startIndex = 0): ReactNode[] {
  return keys.map((k, i) => renderSection(k, ctx, o, startIndex + i))
}

export { DATE_COLUMN }
