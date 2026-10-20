import { Link, Path, Svg, Text } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { ReactNode } from 'react'
import { Linked, Mark, NO_SHRINK, View, linkStyle, sepOf, type Palette } from './kit'
import type { BulletKind, EntryKind } from './styles'
import type { PdfTheme } from './theme'

/* ────────────────────────────── bullets ────────────────────────────── */

function BulletMark({ kind, t, p }: { kind: BulletKind; t: PdfTheme; p: Palette }) {
  const lineH = t.fs.base * t.lh
  if (kind === 'none') return null
  if (kind === 'dot')
    return (
      <View
        style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: p.accent, marginTop: lineH / 2 - 1.5, marginRight: 6.5, marginLeft: 1 }}
      />
    )
  if (kind === 'square')
    return (
      <View
        style={{ width: 3.2, height: 3.2, backgroundColor: p.accent, marginTop: lineH / 2 - 1.6, marginRight: 6.5, marginLeft: 1 }}
      />
    )
  if (kind === 'diamond')
    return (
      <View
        style={{
          width: 3.4,
          height: 3.4,
          backgroundColor: p.accent,
          marginTop: lineH / 2 - 1.7,
          marginRight: 6.8,
          marginLeft: 1,
          transform: 'rotate(45deg)',
        }}
      />
    )
  if (kind === 'check') {
    const s = t.fs.base * 0.8
    return (
      <View style={{ marginTop: (lineH - s) / 2, marginRight: 5.5 }}>
        <Svg width={s} height={s} viewBox="0 0 24 24">
          <Path d="M4 12.5l5 5L20 6.5" fill="none" stroke={p.accent} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
    )
  }
  const ch = kind === 'dash' ? '–' : '›'
  return (
    <Text
      style={{
        width: 9,
        fontFamily: kind === 'arrow' ? t.fontMono : t.fontBody,
        fontWeight: 700,
        fontSize: t.fs.base,
        lineHeight: t.lh,
        color: p.accent,
      }}
    >
      {ch}
    </Text>
  )
}

export function BulletLine({
  text,
  kind,
  t,
  p,
  size,
  markId,
}: {
  text: string
  kind: BulletKind
  t: PdfTheme
  p: Palette
  size?: number
  /** block id for the preview's position markers */
  markId?: string
}) {
  return (
    <View wrap={false} style={{ flexDirection: 'row', marginBottom: t.sp(1.9), position: 'relative' }}>
      {markId ? <Mark t={t} id={markId} /> : null}
      <BulletMark kind={kind} t={t} p={p} />
      <Text style={{ flex: 1, fontFamily: t.fontBody, fontSize: size ?? t.fs.base, lineHeight: t.lh, color: p.body }}>{text}</Text>
    </View>
  )
}

/* ────────────────────────────── entry heads ────────────────────────────── */

export interface EntryHeadData {
  primary: string
  secondary?: string
  date?: string
  place?: string
  placeHref?: string
  primaryHref?: string
  secondaryHref?: string
}

const DATE_COL = 70

function EntryHead({ h, kind, t, p }: { h: EntryHeadData; kind: EntryKind; t: PdfTheme; p: Palette }) {
  const fb = t.fontBody
  const fh = t.fontHeading
  const sep = sepOf(t.fontBodyName)
  const small: Style = { fontFamily: fb, fontSize: t.fs.sm, color: p.muted, lineHeight: 1.3 }
  const placeNode = h.place ? (
    h.placeHref ? (
      <Link src={h.placeHref} style={{ ...small, ...linkStyle(t, p.muted) }}>
        {h.place}
      </Link>
    ) : (
      <Text style={small}>{h.place}</Text>
    )
  ) : null
  const left = (extra: Style): Style => ({ flex: 1, paddingRight: 10, ...extra })
  const right: Style = { flexShrink: NO_SHRINK, textAlign: 'right' }
  const row: Style = { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }
  const prim = (color: string, extra: React.ReactNode = null) => (
    <>
      <Linked href={h.primaryHref} t={t} color={color}>
        {h.primary}
      </Linked>
      {extra}
    </>
  )
  const sec = (color: string) => (
    <Linked href={h.secondaryHref} t={t} color={color}>
      {h.secondary ?? ''}
    </Linked>
  )

  switch (kind) {
    case 'org': {
      // institution first, role second (academic / classic)
      const top = h.secondary || h.primary
      const topHref = h.secondary ? h.secondaryHref : h.primaryHref
      const sub = h.secondary ? h.primary : ''
      return (
        <View>
          <View style={row}>
            <Text style={left({ fontFamily: fh, fontWeight: 700, fontSize: t.fs.md, color: p.ink, lineHeight: 1.3 })}>
              <Linked href={topHref} t={t} color={p.ink}>
                {top}
              </Linked>
            </Text>
            {h.place ? <View style={right}>{placeNode}</View> : null}
          </View>
          {(sub || h.date) && (
            <View style={row}>
              <Text style={left({ fontFamily: fb, fontStyle: 'italic', fontSize: t.fs.base, color: p.body, lineHeight: 1.3 })}>
                {h.secondary ? (
                  <Linked href={h.primaryHref} t={t} color={p.body}>
                    {sub}
                  </Linked>
                ) : (
                  sub
                )}
              </Text>
              {h.date ? <Text style={{ ...small, ...right }}>{h.date}</Text> : null}
            </View>
          )}
        </View>
      )
    }

    case 'stack':
      return (
        <View>
          {h.date ? (
            <Text
              style={{
                fontFamily: fb,
                fontWeight: 600,
                fontSize: t.fs.xs,
                letterSpacing: 0.9,
                textTransform: 'uppercase',
                color: p.accent,
                marginBottom: 1.5,
              }}
            >
              {h.date}
            </Text>
          ) : null}
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.md, color: p.ink, lineHeight: 1.3 }}>
            {prim(
              p.ink,
              h.secondary ? (
                <Text style={{ fontFamily: fb, fontWeight: 400, color: p.muted }}>
                  {`${sep.dot}`}
                  {sec(p.muted)}
                </Text>
              ) : null,
            )}
          </Text>
          {h.place ? <View style={{ marginTop: 0.5 }}>{placeNode}</View> : null}
        </View>
      )

    case 'inline':
      return (
        <View style={row}>
          <Text style={left({ fontFamily: fh, fontWeight: 700, fontSize: t.fs.base * 1.04, color: p.ink, lineHeight: 1.3 })}>
            {prim(
              p.ink,
              <>
                {h.secondary ? (
                  <Text style={{ fontFamily: fb, fontWeight: 600, color: p.accent }}>
                    {sep.dot}
                    {sec(p.accent)}
                  </Text>
                ) : null}
                {h.place ? (
                  <Text style={{ fontFamily: fb, fontWeight: 400, color: p.muted, fontSize: t.fs.sm }}>{`${sep.dash}${h.place}`}</Text>
                ) : null}
              </>,
            )}
          </Text>
          {h.date ? <Text style={{ ...small, ...right }}>{h.date}</Text> : null}
        </View>
      )

    case 'compact':
      return (
        <View style={row}>
          <Text style={left({ fontFamily: fh, fontWeight: 700, fontSize: t.fs.base * 1.02, color: p.ink, lineHeight: 1.3 })}>
            {prim(
              p.ink,
              <>
                {h.secondary ? (
                  <Text style={{ fontFamily: fb, fontWeight: 600, color: p.accent }}>
                    {sepOf(t.fontBodyName).pipe}
                    {sec(p.accent)}
                  </Text>
                ) : null}
                {h.place ? (
                  <Text style={{ fontFamily: fb, fontWeight: 400, color: p.muted, fontSize: t.fs.sm }}>{`${sepOf(t.fontBodyName).pipe}${h.place}`}</Text>
                ) : null}
              </>,
            )}
          </Text>
          {h.date ? <Text style={{ ...small, ...right }}>{h.date}</Text> : null}
        </View>
      )

    case 'mini':
      return (
        <View>
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.base, color: p.ink, lineHeight: 1.3 }}>{prim(p.ink)}</Text>
          {h.secondary ? (
            <Text style={{ fontFamily: fb, fontSize: t.fs.sm, color: p.body, lineHeight: 1.3 }}>{sec(p.body)}</Text>
          ) : null}
          {h.date || h.place ? (
            <Text style={{ fontFamily: fb, fontSize: t.fs.xs, color: p.muted, lineHeight: 1.35, marginTop: 0.5 }}>
              {[h.date, h.place].filter(Boolean).join(sep.dot)}
            </Text>
          ) : null}
        </View>
      )

    case 'dateleft':
      // the date lives in its own column (see makeEntry) – the head is title / organisation · place
      return (
        <View>
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.md, color: p.ink, lineHeight: 1.3 }}>{prim(p.ink)}</Text>
          {(h.secondary || h.place) && (
            <Text style={{ fontFamily: fb, fontSize: t.fs.base, lineHeight: 1.3, color: p.muted }}>
              {h.secondary ? (
                <Text style={{ fontWeight: 600, color: p.accent }}>{sec(p.accent)}</Text>
              ) : null}
              {h.secondary && h.place ? sep.dot : ''}
              {h.place}
            </Text>
          )}
        </View>
      )

    case 'split':
    case 'timeline':
    default:
      return (
        <View>
          <View style={row}>
            <Text style={left({ fontFamily: fh, fontWeight: 700, fontSize: t.fs.md, color: p.ink, lineHeight: 1.3 })}>{prim(p.ink)}</Text>
            {h.date ? <Text style={{ ...small, ...right }}>{h.date}</Text> : null}
          </View>
          {(h.secondary || h.place) && (
            <View style={row}>
              <Text style={left({ fontFamily: fb, fontWeight: 600, fontSize: t.fs.base, color: p.accent, lineHeight: 1.3 })}>
                {h.secondary ? sec(p.accent) : ''}
              </Text>
              {h.place ? <View style={right}>{placeNode}</View> : null}
            </View>
          )}
        </View>
      )
  }
}

/* ────────────────────────────── whole entries ────────────────────────────── */

export interface EntryItem {
  /** header + first bullets – never split across pages */
  top: ReactNode
  /** remaining bullets – may flow onto the next page */
  rest: ReactNode | null
}

/**
 * Builds one entry as two pieces. react-pdf keeps the *first child* of a container on the current
 * page even when it doesn't fit, so entries are exposed as { top, rest } and Section glues the
 * heading to the first `top` in an unbreakable group.
 */
export function makeEntry({
  id,
  head,
  kind,
  bullets = [],
  notes = [],
  paragraph,
  t,
  p,
  bullet,
  last,
}: {
  /** marker / spacing id, e.g. `item:experience:abc` */
  id: string
  head: EntryHeadData
  kind: EntryKind
  bullets?: string[]
  notes?: string[]
  paragraph?: string
  t: PdfTheme
  p: Palette
  bullet: BulletKind
  last: boolean
}): EntryItem {
  const timeline = kind === 'timeline'
  const dateLeft = kind === 'dateleft'
  const gap = last ? 0 : t.sp(timeline ? 9 : kind === 'compact' ? 6 : 8)
  const first = bullets.slice(0, 2)
  const rest = bullets.slice(2)
  const off = t.off(id)
  // The vertical rail belongs to each entry so it stays continuous across page breaks.
  const rail: Style = timeline ? { marginLeft: 4, paddingLeft: 12.5, borderLeftWidth: 1.1, borderLeftColor: p.rule } : {}
  // The gap lives on the last piece: padding inside the rail, margin otherwise.
  const gapStyle = (on: boolean): Style => (!on ? {} : timeline ? { paddingBottom: gap } : { marginBottom: gap })

  const content = (
    <>
      <EntryHead h={head} kind={kind} t={t} p={p} />
      {notes.length > 0 && (
        <View style={{ marginTop: t.sp(1.5) }}>
          {notes.map((n, i) => (
            <Text key={i} style={{ fontFamily: t.fontBody, fontSize: t.fs.sm, lineHeight: t.lh, color: p.muted }}>
              {n}
            </Text>
          ))}
        </View>
      )}
      {paragraph ? (
        <Text style={{ marginTop: t.sp(2), fontFamily: t.fontBody, fontSize: t.fs.base, lineHeight: t.lh, color: p.body }}>{paragraph}</Text>
      ) : null}
      {first.length > 0 && (
        <View style={{ marginTop: t.sp(3) }}>
          {first.map((b, i) => (
            <BulletLine key={i} text={b} kind={bullet} t={t} p={p} />
          ))}
        </View>
      )}
    </>
  )

  const top = (
    <View wrap={false} style={{ position: 'relative', ...rail, ...(off ? { marginTop: off } : {}), ...gapStyle(rest.length === 0) }}>
      <Mark t={t} id={id} />
      {timeline && (
        <View
          style={{
            position: 'absolute',
            left: -4.05,
            top: 3.2,
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: '#ffffff',
            borderWidth: 1.8,
            borderColor: p.fill,
          }}
        />
      )}
      {dateLeft ? (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: DATE_COL, paddingRight: 8 }}>
            {head.date ? (
              <Text style={{ fontFamily: t.fontBody, fontSize: t.fs.sm, lineHeight: 1.3, color: p.muted, fontWeight: 600 }}>{head.date}</Text>
            ) : null}
          </View>
          <View style={{ flex: 1 }}>{content}</View>
        </View>
      ) : (
        content
      )}
    </View>
  )

  const restNode =
    rest.length > 0 ? (
      <View style={{ ...rail, ...(dateLeft ? { marginLeft: DATE_COL } : {}), ...gapStyle(true), position: 'relative' }}>
        {rest.map((b, i) => (
          <BulletLine key={i} text={b} kind={bullet} t={t} p={p} markId={id} />
        ))}
      </View>
    ) : null

  return { top, rest: restNode }
}

/** Left-column width used by the date-column entry style (sections add the same indent to follow-up pieces). */
export const DATE_COLUMN = DATE_COL
