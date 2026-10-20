import { Text } from '@react-pdf/renderer'
import { View, sepOf, type Palette } from './kit'
import type { LangKind, SkillKind } from './styles'
import type { PdfTheme } from './theme'

type SkillItem = { name: string; level: number; group?: string }

const LEVEL_DOTS: Record<string, number> = { native: 5, fluent: 5, advanced: 4, intermediate: 3, basic: 2 }

export function Dots({ value, max = 5, size = 4.6, p }: { value: number; max?: number; size?: number; p: Palette }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: max }).map((_, i) => (
        <View
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: i === 0 ? 0 : 2.4,
            backgroundColor: i < value ? p.fill : p.track,
          }}
        />
      ))}
    </View>
  )
}

function groupSkills(skills: SkillItem[]) {
  if (!skills.some((s) => s.group?.trim())) return [{ name: '', items: skills }]
  const map = new Map<string, SkillItem[]>()
  for (const s of skills) {
    const key = s.group?.trim() || 'Other'
    map.set(key, [...(map.get(key) ?? []), s])
  }
  return [...map].map(([name, items]) => ({ name, items }))
}

function List({ skills, kind, t, p }: { skills: SkillItem[]; kind: SkillKind; t: PdfTheme; p: Palette }) {
  let k = kind
  if (!t.showLevels && (k === 'bars' || k === 'dots')) k = 'list'
  const txt = { fontFamily: t.fontBody, fontSize: t.fs.base, color: p.body, lineHeight: 1.3 } as const

  if (k === 'tags' || k === 'outline' || k === 'solid') {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {skills.map((s, i) => (
          <View
            key={i}
            style={{
              backgroundColor: k === 'tags' ? p.chipBg : k === 'solid' ? p.fill : 'transparent',
              borderWidth: k === 'outline' ? 0.8 : 0,
              borderColor: p.chipBorder,
              borderRadius: k === 'outline' ? 2.5 : 3.5,
              paddingHorizontal: 5.5,
              paddingVertical: 2.1,
              marginRight: 4,
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontFamily: k === 'outline' ? t.fontMono : t.fontBody,
                fontWeight: k === 'outline' ? 400 : 600,
                fontSize: t.fs.sm * (k === 'outline' ? 0.96 : 1),
                color: k === 'solid' ? p.onAccent : p.chipText,
              }}
            >
              {s.name}
            </Text>
          </View>
        ))}
      </View>
    )
  }
  if (k === 'bars') {
    return (
      <View>
        {skills.map((s, i) => (
          <View key={i} wrap={false} style={{ marginBottom: t.sp(5.5) }}>
            <Text style={{ ...txt, color: p.ink, marginBottom: 2.4 }}>{s.name}</Text>
            <View style={{ height: 3, borderRadius: 1.5, backgroundColor: p.track }}>
              <View style={{ height: 3, borderRadius: 1.5, backgroundColor: p.fill, width: `${s.level * 20}%` }} />
            </View>
          </View>
        ))}
      </View>
    )
  }
  if (k === 'dots') {
    return (
      <View>
        {skills.map((s, i) => (
          <View
            key={i}
            wrap={false}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp(3.8) }}
          >
            <Text style={{ ...txt, flex: 1, paddingRight: 6 }}>{s.name}</Text>
            <Dots value={s.level} p={p} />
          </View>
        ))}
      </View>
    )
  }
  if (k === 'grid' || k === 'columns') {
    const w = k === 'grid' ? '50%' : '33.33%'
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {skills.map((s, i) => (
          <View key={i} style={{ width: w, flexDirection: 'row', marginBottom: t.sp(2.4), paddingRight: 6 }}>
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: p.accent, marginTop: 4.2, marginRight: 6 }} />
            <Text style={{ ...txt, flex: 1 }}>{s.name}</Text>
          </View>
        ))}
      </View>
    )
  }
  // list
  return (
    <View>
      {skills.map((s, i) => (
        <View key={i} wrap={false} style={{ flexDirection: 'row', marginBottom: t.sp(2.6) }}>
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: p.accent, marginTop: 4.2, marginRight: 6 }} />
          <Text style={{ ...txt, flex: 1 }}>{s.name}</Text>
        </View>
      ))}
    </View>
  )
}

export function SkillsBody({
  skills,
  kind,
  t,
  p,
  narrow,
}: {
  skills: SkillItem[]
  kind: SkillKind
  t: PdfTheme
  p: Palette
  /** a narrow column can't fit multi-column grids */
  narrow?: boolean
}) {
  const k: SkillKind = narrow && (kind === 'grid' || kind === 'columns') ? 'list' : kind
  const groups = groupSkills(skills)
  const sep = sepOf(t.fontBodyName).dot
  const txt = { fontFamily: t.fontBody, fontSize: t.fs.base, color: p.body, lineHeight: t.lh } as const

  if (k === 'inline') {
    return (
      <View>
        {groups.map((g, i) => (
          <Text key={i} style={{ ...txt, marginBottom: i === groups.length - 1 ? 0 : t.sp(2.6) }}>
            {g.name ? <Text style={{ fontWeight: 700, color: p.ink }}>{`${g.name}: `}</Text> : null}
            {g.items.map((s) => s.name).join(sep)}
          </Text>
        ))}
      </View>
    )
  }

  if (groups.length === 1 && !groups[0].name) return <List skills={skills} kind={k} t={t} p={p} />

  return (
    <View>
      {groups.map((g, i) => (
        <View key={i} style={{ marginBottom: i === groups.length - 1 ? 0 : t.sp(6) }}>
          <Text
            style={{
              fontFamily: t.fontHeading,
              fontWeight: 700,
              fontSize: t.fs.xs * 1.05,
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: p.muted,
              marginBottom: t.sp(3),
            }}
          >
            {g.name}
          </Text>
          <List skills={g.items} kind={k} t={t} p={p} />
        </View>
      ))}
    </View>
  )
}

export function LanguagesBody({
  items,
  kind,
  t,
  p,
}: {
  items: { name: string; level: string }[]
  kind: LangKind
  t: PdfTheme
  p: Palette
}) {
  const txt = { fontFamily: t.fontBody, fontSize: t.fs.base, color: p.body, lineHeight: 1.3 } as const
  if (kind === 'inline') {
    return (
      <Text style={{ ...txt, lineHeight: t.lh }}>
        {items.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).join(sepOf(t.fontBodyName).dot)}
      </Text>
    )
  }
  return (
    <View>
      {items.map((l, i) => (
        <View
          key={i}
          wrap={false}
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: t.sp(3.2) }}
        >
          <Text style={{ ...txt, flex: 1, paddingRight: 6, color: p.ink }}>{l.name}</Text>
          {kind === 'dots' ? (
            <Dots value={LEVEL_DOTS[l.level.toLowerCase()] ?? 3} p={p} />
          ) : (
            <Text style={{ ...txt, fontSize: t.fs.sm, color: p.muted }}>{l.level}</Text>
          )}
        </View>
      ))}
    </View>
  )
}
