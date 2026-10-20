import { Circle, Defs, Image, LinearGradient, Rect, Stop, Svg, Text } from '@react-pdf/renderer'
import { mix, readableOn, tint } from '@/lib/color'
import { contactItems, initials, splitName } from '@/lib/resume'
import { Contact } from './contact'
import { Mark, View } from './kit'
import type { RenderCtx } from './sections'
import type { HeaderSpec } from './specTypes'
import type { PdfTheme } from './theme'

/* ────────────────────────────── avatar ────────────────────────────── */

export function Avatar({
  photo,
  name,
  t,
  size,
  bg,
  fg,
  fontFamily,
}: {
  photo: string
  name: string
  t: PdfTheme
  size: number
  bg?: string
  fg?: string
  fontFamily?: string[]
}) {
  if (!t.showPhoto || !t.spec.photo) return null
  const radius = t.photoShape === 'circle' ? size / 2 : t.photoShape === 'rounded' ? size * 0.2 : 0
  if (photo) return <Image src={photo} style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover' }} />
  const fill = bg ?? t.accent
  return (
    <View style={{ width: size, height: size, borderRadius: radius, backgroundColor: fill, alignItems: 'center', justifyContent: 'center' }}>
      <Text
        style={{
          fontFamily: fontFamily ?? t.fontHeading,
          fontWeight: 700,
          fontSize: size * 0.36,
          color: fg ?? readableOn(fill),
          letterSpacing: 0.5,
        }}
      >
        {initials(name)}
      </Text>
    </View>
  )
}

/* ────────────────────────────── header ────────────────────────────── */

const NAME_SIZE = { md: 1.5, lg: 1.95, xl: 2.5, xxl: 3.0, huge: 3.55 } as const

export function Header({ ctx, inMain }: { ctx: RenderCtx; inMain?: boolean }) {
  const { data, t } = ctx
  const spec = t.spec
  const h: HeaderSpec = spec.header
  const kind = inMain ? 'plain' : h.kind ?? 'plain'
  const isBand = kind === 'band' || kind === 'gradient' || kind === 'terminal'
  const align = h.align ?? 'left'
  const center = align === 'center'
  const items = contactItems(data.basics)
  const m = t.margin * (spec.padX ?? 1)
  const vm = t.margin * 0.85 * (spec.padY ?? 1)

  /* surface colours */
  let bandBg = '#ffffff'
  if (kind === 'terminal') bandBg = '#0d1117'
  else if (kind === 'gradient') bandBg = t.accent
  else if (isBand) {
    const b = h.bandBg ?? 'tone'
    bandBg = b === 'tone' ? t.tone : b === 'accent' ? t.accent : b === 'ink' ? '#111827' : b === 'tint' ? t.accentSoft : '#ffffff'
  }
  const dark = isBand && (kind === 'gradient' || readableOn(bandBg) === '#ffffff')
  const gold = tint(t.accent, 0.12)
  /** a colour picked for the whole header in the preview, then the per-kind colours from the Design panel (light headers only) */
  const hdrColor = t.blockColors.hdr
  const roleColor = (role: 'name' | 'title' | 'details') => hdrColor ?? (dark ? undefined : t.textColors[role])

  /* colours */
  const nameCol =
    isBand && dark
      ? '#ffffff'
      : h.nameColor === 'accent'
        ? t.accentInk
        : h.nameColor === 'tone'
          ? t.tone
          : t.ink
  const titleCol =
    h.titleColor === 'muted'
      ? dark
        ? mix('#ffffff', bandBg, 0.28)
        : t.muted
      : h.titleColor === 'ink'
        ? dark
          ? '#ffffff'
          : t.ink
        : h.titleColor === 'gold'
          ? gold
          : dark
            ? kind === 'gradient'
              ? '#ffffff'
              : tint(t.accent, 0.45)
            : t.accentInk
  const contactText = roleColor('details') ?? (dark ? mix('#ffffff', bandBg, kind === 'gradient' ? 0 : 0.1) : t.body)
  const contactIcon = dark ? (kind === 'gradient' ? '#ffffff' : kind === 'terminal' ? tint(t.accent, 0.08) : gold) : t.accentInk
  const badgeBg = dark ? (kind === 'gradient' ? tint(t.accent, 0.3) : mix(bandBg, '#ffffff', 0.18)) : t.accentSoft

  /* name */
  const rawName = data.basics.fullName.trim() || 'Your Name'
  const upper = t.nameUpper ?? h.nameUpper ?? false
  const nameFont = kind === 'terminal' ? t.fontMono : h.nameFont === 'body' ? t.fontBody : t.fontHeading
  const nameStyle = {
    fontFamily: nameFont,
    fontWeight: h.nameWeight ?? 700,
    fontSize: t.fs.base * NAME_SIZE[h.nameSize ?? 'xl'] * (kind === 'terminal' ? 0.92 : 1),
    letterSpacing: h.nameSpacing ?? -0.4,
    lineHeight: 1.12,
    textTransform: upper ? 'uppercase' : 'none',
    textAlign: align,
    color: roleColor('name') ?? nameCol,
  } as const
  const { first, last } = splitName(rawName)
  const nameNode = h.stack && last ? (
    <View>
      <Text style={{ ...nameStyle, fontWeight: 400 }}>{first}</Text>
      <Text style={{ ...nameStyle, color: roleColor('name') ?? (h.twoTone ? (dark ? tint(t.accent, 0.4) : t.accentInk) : nameCol) }}>{last}</Text>
    </View>
  ) : (
    <Text style={nameStyle}>
      {h.twoTone && last ? (
        <>
          {first}
          <Text style={{ color: roleColor('name') ?? (dark ? tint(t.accent, 0.4) : t.accentInk) }}>{` ${last}`}</Text>
        </>
      ) : (
        rawName
      )}
    </Text>
  )

  /* title */
  const title = data.basics.title.trim()
  const ts = h.titleStyle ?? 'plain'
  const titleNode = title ? (
    ts === 'pill' ? (
      <View style={{ flexDirection: 'row', marginTop: 8, justifyContent: center ? 'center' : 'flex-start' }}>
        <View style={{ backgroundColor: kind === 'gradient' ? tint(t.accent, 0.3) : t.accent, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 3.2 }}>
          <Text
            style={{
              fontFamily: t.fontHeading,
              fontWeight: 600,
              fontSize: t.fs.sm,
              letterSpacing: 0.5,
              color: kind === 'gradient' ? '#ffffff' : t.onAccent,
            }}
          >
            {title}
          </Text>
        </View>
      </View>
    ) : (
      <Text
        style={{
          marginTop: ts === 'caps' || ts === 'accent-caps' ? 7 : 5,
          fontFamily: ts === 'italic' ? t.fontBody : t.fontHeading,
          fontStyle: ts === 'italic' ? 'italic' : 'normal',
          fontWeight: ts === 'italic' ? 400 : 600,
          fontSize: ts === 'caps' || ts === 'accent-caps' ? t.fs.sm * 1.02 : t.fs.md * 1.1,
          letterSpacing: ts === 'caps' || ts === 'accent-caps' ? 2.6 : kind === 'terminal' ? 0 : 0.2,
          textTransform: ts === 'caps' || ts === 'accent-caps' ? 'uppercase' : 'none',
          textAlign: align,
          color: roleColor('title') ?? (ts === 'accent-caps' ? (dark ? gold : t.accentInk) : titleCol),
        }}
      >
        {kind === 'terminal' ? `> ${title}` : title}
      </Text>
    )
  ) : null

  /* contact */
  const cMode = inMain ? (h.contact === 'none' ? 'none' : h.contact === 'right' ? 'row' : h.contact ?? 'row') : h.contact ?? 'row'
  const fs = t.fs.sm
  const contactCommon = {
    items,
    t,
    color: contactText,
    iconColor: contactIcon,
    badgeBg,
    size: kind === 'terminal' ? fs * 0.97 : fs,
    font: kind === 'terminal' ? t.fontMono : undefined,
    captionColor: dark ? mix('#ffffff', bandBg, 0.4) : t.muted,
  }
  const contactBelow =
    cMode === 'row' ? (
      <Contact {...contactCommon} layout="row" gap={13} align={center ? 'center' : 'flex-start'} />
    ) : cMode === 'grid' ? (
      <Contact {...contactCommon} layout="grid" />
    ) : cMode === 'inline-pipe' ? (
      <Contact {...contactCommon} layout="inline" sep="pipe" />
    ) : cMode === 'inline-dot' ? (
      <Contact {...contactCommon} layout="inline" sep="dot" />
    ) : null
  const contactRight = cMode === 'right' ? <Contact {...contactCommon} layout="column" gap={t.sp(3.6)} /> : null

  /* photo */
  const photoSize = h.photoSize ?? 74
  const photoPos = inMain ? false : h.photo
  const hasPhoto = !!photoPos && t.showPhoto && spec.photo
  const photoNode = hasPhoto ? (
    <View
      style={
        dark
          ? { padding: 3, borderRadius: t.photoShape === 'circle' ? 60 : 8, backgroundColor: '#ffffff' }
          : {}
      }
    >
      <Avatar photo={data.basics.photo} name={rawName} t={t} size={photoSize} bg={dark ? t.accentDark : undefined} />
    </View>
  ) : null

  /* rule */
  const ruleKind = h.rule ?? 'none'
  const ruleNode =
    ruleKind === 'thin' ? (
      <View style={{ height: 0.8, backgroundColor: t.rule, marginTop: t.sp(9) }} />
    ) : ruleKind === 'thick' ? (
      <View style={{ height: 2.4, backgroundColor: t.accent, marginTop: t.sp(9) }} />
    ) : ruleKind === 'double' ? (
      <View style={{ marginTop: t.sp(9) }}>
        <View style={{ height: 1.8, backgroundColor: t.accentInk }} />
        <View style={{ height: 0.6, backgroundColor: t.accentInk, marginTop: 1.6 }} />
      </View>
    ) : ruleKind === 'dotted' ? (
      <View style={{ borderBottomWidth: 1, borderBottomStyle: 'dotted', borderBottomColor: t.faint, marginTop: t.sp(9) }} />
    ) : null
  const accentBar = h.accentBar ? (
    <View style={{ width: 44, height: 4, backgroundColor: dark ? tint(t.accent, 0.3) : t.accent, marginTop: 10, alignSelf: center ? 'center' : 'flex-start' }} />
  ) : ruleKind === 'short' ? (
    <View style={{ width: 38, height: 2.4, backgroundColor: dark ? gold : t.accent, marginTop: 10, alignSelf: center ? 'center' : 'flex-start' }} />
  ) : null

  /* terminal chrome */
  const terminal =
    kind === 'terminal' ? (
      <View style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
            <View key={c} style={{ width: 6.5, height: 6.5, borderRadius: 3.25, backgroundColor: c, marginRight: 5 }} />
          ))}
        </View>
        <Text style={{ fontFamily: t.fontMono, fontSize: t.fs.xs * 1.05, color: '#6e7681' }}>
          <Text style={{ color: tint(t.accent, 0.08) }}>$ </Text>whoami
        </Text>
      </View>
    ) : null

  const core = (
    <View style={center ? { alignItems: 'center', width: '100%' } : { flex: 1, alignItems: 'flex-start' }}>
      {terminal}
      <View style={{ width: '100%' }}>{nameNode}</View>
      <View style={{ width: '100%' }}>{titleNode}</View>
      {accentBar}
      {contactBelow ? <View style={{ marginTop: t.sp(isBand ? 11 : 10), width: '100%' }}>{contactBelow}</View> : null}
    </View>
  )

  const topRow = center ? (
    <View style={{ alignItems: 'center' }}>
      {photoNode ? <View style={{ marginBottom: 8 }}>{photoNode}</View> : null}
      <View style={{ width: '100%', alignItems: 'center' }}>{core}</View>
    </View>
  ) : (
    <View style={{ flexDirection: 'row', alignItems: contactRight ? 'center' : 'flex-start', justifyContent: 'space-between' }}>
      {photoPos === 'left' && photoNode ? <View style={{ marginRight: 16 }}>{photoNode}</View> : null}
      {core}
      {contactRight ? <View style={{ width: 178, marginLeft: 16 }}>{contactRight}</View> : null}
      {photoPos === 'right' && photoNode ? <View style={{ marginLeft: 16 }}>{photoNode}</View> : null}
    </View>
  )

  const mb = t.sp(h.mb ?? 16)

  /* ── non-band header ── */
  if (!isBand) {
    return (
      <View style={{ marginBottom: mb, paddingHorizontal: inMain ? 0 : m, position: 'relative' }}>
        <Mark t={t} id="hdr" />
        {kind === 'boxed' ? (
          <View style={{ borderWidth: 1.4, borderColor: t.accentInk, paddingVertical: t.sp(11), paddingHorizontal: 16 }}>{topRow}</View>
        ) : (
          topRow
        )}
        {ruleNode}
      </View>
    )
  }

  /* ── band header (full-bleed, pulled up over the page margin) ── */
  const [padTop, padBottom] = h.bandPad ?? [26, 22]
  const gradient = kind === 'gradient'
  const bandH = h.bandH
  const W = t.page.w
  return (
    <View
      style={{
        marginTop: -vm,
        marginBottom: mb,
        backgroundColor: gradient ? undefined : bandBg,
        height: gradient ? bandH ?? 138 : undefined,
        position: 'relative',
      }}
    >
      {gradient ? (
        <Svg width={W} height={bandH ?? 138} viewBox={`0 0 ${W} ${bandH ?? 138}`} style={{ position: 'absolute', top: 0, left: 0 }}>
          <Defs>
            <LinearGradient id="hdr-grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={t.accent} />
              <Stop offset="1" stopColor={t.accent2} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={bandH ?? 138} fill="url(#hdr-grad)" />
          <Circle cx={W - 60} cy={20} r={92} fill="#ffffff" fillOpacity={0.09} />
          <Circle cx={W - 18} cy={(bandH ?? 138) + 6} r={58} fill="#ffffff" fillOpacity={0.08} />
          <Circle cx={30} cy={(bandH ?? 138) + 18} r={44} fill="#000000" fillOpacity={0.06} />
        </Svg>
      ) : null}
      <Mark t={t} id="hdr" />
      <View style={{ paddingHorizontal: m, paddingTop: padTop + vm * 0.25, paddingBottom: padBottom }}>
        {topRow}
        {ruleNode}
      </View>
    </View>
  )
}

