import { Text } from '@react-pdf/renderer'
import { View, type Palette } from './kit'
import type { HeadingKind } from './styles'
import type { PdfTheme } from './theme'

export function SectionHeading({
  title,
  kind,
  t,
  p,
  index = 0,
}: {
  title: string
  kind: HeadingKind
  t: PdfTheme
  p: Palette
  index?: number
}) {
  const fh = t.fontHeading
  const mb = t.sp(6)
  const upper = { textTransform: 'uppercase' } as const

  switch (kind) {
    case 'none':
      return null

    case 'rule':
      return (
        <View style={{ borderBottomWidth: 0.9, borderBottomColor: p.heading, paddingBottom: t.sp(2.5), marginBottom: mb }}>
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.sm * 1.08, letterSpacing: 1.1, ...upper, color: p.heading }}>
            {title}
          </Text>
        </View>
      )

    case 'caps':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: mb + 1 }}>
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.sm * 1.05, letterSpacing: 2.2, ...upper, color: p.heading }}>
            {title}
          </Text>
          <View style={{ flex: 1, height: 0.7, backgroundColor: p.rule, marginLeft: 9 }} />
        </View>
      )

    case 'line':
      return (
        <View style={{ marginBottom: mb }}>
          <Text style={{ fontFamily: fh, fontWeight: 600, fontSize: t.fs.xs * 1.05, letterSpacing: 1.8, ...upper, color: p.muted }}>
            {title}
          </Text>
        </View>
      )

    case 'bar':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: mb }}>
          <View style={{ width: 3, height: t.fs.md * 1.25, backgroundColor: p.fill, borderRadius: 1.5, marginRight: 7 }} />
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.md, letterSpacing: 0.9, ...upper, color: p.heading }}>
            {title}
          </Text>
        </View>
      )

    case 'pill':
      return (
        <View style={{ flexDirection: 'row', marginBottom: mb + 1 }}>
          <View style={{ backgroundColor: p.fill, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 2.6 }}>
            <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.sm * 0.98, letterSpacing: 1, ...upper, color: p.onAccent }}>
              {title}
            </Text>
          </View>
        </View>
      )

    case 'slash':
      return (
        <View style={{ marginBottom: mb }}>
          <Text style={{ fontFamily: t.fontMono, fontWeight: 700, fontSize: t.fs.md, color: p.heading }}>
            <Text style={{ color: p.accent }}>{'// '}</Text>
            {title.toLowerCase()}
          </Text>
        </View>
      )

    case 'dot':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: mb }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: p.fill, marginRight: 7 }} />
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.md, letterSpacing: 0.4, color: p.heading }}>{title}</Text>
          <View style={{ flex: 1, height: 0.7, backgroundColor: p.rule, marginLeft: 9 }} />
        </View>
      )

    case 'plain':
      return (
        <View style={{ marginBottom: mb }}>
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.md * 1.05, color: p.accent }}>{title}</Text>
        </View>
      )

    case 'num':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: mb + 1 }}>
          <Text style={{ fontFamily: fh, fontWeight: 800, fontSize: t.fs.md, color: p.accent, marginRight: 7 }}>
            {String(index + 1).padStart(2, '0')}
          </Text>
          <Text style={{ fontFamily: fh, fontWeight: 800, fontSize: t.fs.md, letterSpacing: 1.2, ...upper, color: p.heading }}>
            {title}
          </Text>
          <View style={{ flex: 1, height: 1.2, backgroundColor: p.heading, marginLeft: 9, opacity: 0.9 }} />
        </View>
      )

    case 'underline':
      return (
        <View style={{ marginBottom: mb + 1 }}>
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.md * 1.06, letterSpacing: 0.3, color: p.heading }}>{title}</Text>
          <View style={{ width: 28, height: 2.4, backgroundColor: p.fill, marginTop: 3, borderRadius: 1.2 }} />
        </View>
      )

    case 'filled':
      return (
        <View
          style={{
            backgroundColor: p.chipBg,
            borderLeftWidth: 3.5,
            borderLeftColor: p.fill,
            paddingVertical: 3.4,
            paddingHorizontal: 8,
            marginBottom: mb + 1,
          }}
        >
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.sm * 1.04, letterSpacing: 1.3, ...upper, color: p.heading }}>
            {title}
          </Text>
        </View>
      )

    case 'tab':
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            borderBottomWidth: 1.3,
            borderBottomColor: p.fill,
            marginBottom: mb + 1,
          }}
        >
          <View
            style={{
              backgroundColor: p.fill,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
            }}
          >
            <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.sm * 1.02, letterSpacing: 1.2, ...upper, color: p.onAccent }}>
              {title}
            </Text>
          </View>
        </View>
      )

    case 'box':
      return (
        <View style={{ flexDirection: 'row', marginBottom: mb + 1 }}>
          <View style={{ borderWidth: 1, borderColor: p.fill, paddingHorizontal: 9, paddingVertical: 2.8 }}>
            <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.sm * 1.02, letterSpacing: 1.3, ...upper, color: p.heading }}>
              {title}
            </Text>
          </View>
        </View>
      )

    case 'center':
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: mb + 1 }}>
          <View style={{ flex: 1, height: 0.8, backgroundColor: p.rule }} />
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.sm * 1.05, letterSpacing: 2.4, ...upper, color: p.heading, marginHorizontal: 11 }}>
            {title}
          </Text>
          <View style={{ flex: 1, height: 0.8, backgroundColor: p.rule }} />
        </View>
      )

    case 'ulcaps':
      return (
        <View style={{ marginBottom: mb + 1 }}>
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.sm, letterSpacing: 1.8, ...upper, color: p.heading }}>{title}</Text>
          <View style={{ width: 22, height: 1.6, backgroundColor: p.fill, marginTop: 3.5 }} />
        </View>
      )

    case 'double':
      return (
        <View style={{ marginBottom: mb + 1 }}>
          <Text style={{ fontFamily: fh, fontWeight: 700, fontSize: t.fs.sm * 1.06, letterSpacing: 1.6, ...upper, color: p.heading }}>
            {title}
          </Text>
          <View style={{ height: 1.7, backgroundColor: p.heading, marginTop: 3.4 }} />
          <View style={{ height: 0.6, backgroundColor: p.heading, marginTop: 1.5 }} />
        </View>
      )
  }
}
