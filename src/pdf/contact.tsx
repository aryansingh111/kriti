import { Link, Text } from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { ContactItem } from '@/lib/resume'
import { SetIcon, View, linkStyle, sepOf } from './kit'
import type { PdfTheme } from './theme'

export interface ContactProps {
  items: ContactItem[]
  t: PdfTheme
  layout: 'row' | 'column' | 'inline' | 'grid'
  /** text colour */
  color: string
  /** line-icon / dot colour (defaults to the text colour) */
  iconColor?: string
  /** background of badge-style icons */
  badgeBg?: string
  size?: number
  /** inline separator */
  sep?: 'dot' | 'pipe'
  align?: 'flex-start' | 'center' | 'flex-end'
  gap?: number
  font?: string[]
  /** colour for the captions of the "text labels" icon set */
  captionColor?: string
}

function Label({ item, t, color, size, font }: { item: ContactItem; t: PdfTheme; color: string; size: number; font: string[] }) {
  const style: Style = { fontFamily: font, fontSize: size, color, lineHeight: 1.3 }
  if (!item.href) return <Text style={style}>{item.label}</Text>
  return (
    <Link src={item.href} style={{ ...style, ...linkStyle(t, color) }}>
      {item.label}
    </Link>
  )
}

export function Contact({
  items,
  t,
  layout,
  color,
  iconColor,
  badgeBg,
  size,
  sep = 'pipe',
  align = 'flex-start',
  gap,
  font,
  captionColor,
}: ContactProps) {
  if (!items.length) return null
  const fs = size ?? t.fs.sm
  const family = font ?? t.fontBody
  const ic = iconColor ?? color
  const set = t.iconSet

  if (layout === 'inline') {
    const sp = sepOf(t.fontBodyName)[sep]
    return (
      <Text style={{ fontFamily: family, fontSize: fs, color, textAlign: 'center', lineHeight: 1.45 }}>
        {items.map((it, i) => (
          <Text key={it.key}>
            {i > 0 ? sp : ''}
            {it.href ? (
              <Link src={it.href} style={linkStyle(t, color)}>
                {it.label}
              </Link>
            ) : (
              it.label
            )}
          </Text>
        ))}
      </Text>
    )
  }

  const iconSize = fs * 1.05
  const hasIcon = set !== 'none' && set !== 'label'
  const iconBox = set === 'badge' || set === 'square' ? iconSize * 1.85 : iconSize
  const g = gap ?? (layout === 'column' ? t.sp(5) : 12)
  const inRow = layout === 'row' || layout === 'grid'

  return (
    <View
      style={{
        flexDirection: layout === 'column' ? 'column' : 'row',
        // a wrapping *column* lets children grow wider than the container, so long links would never wrap
        flexWrap: layout === 'column' ? 'nowrap' : 'wrap',
        justifyContent: align,
      }}
    >
      {items.map((it) => (
        <View
          key={it.key}
          style={{
            flexDirection: 'row',
            alignItems: set === 'label' ? 'baseline' : 'center',
            flexShrink: 1,
            width: layout === 'grid' ? '50%' : undefined,
            paddingRight: layout === 'grid' ? 8 : 0,
            marginRight: layout === 'row' ? g : 0,
            marginBottom: inRow ? t.sp(3.2) : g,
          }}
        >
          {hasIcon && (
            <View style={{ width: iconBox, marginRight: fs * 0.55, alignItems: 'center' }}>
              <SetIcon name={it.icon} set={set} size={iconSize} color={ic} badgeBg={badgeBg} />
            </View>
          )}
          {set === 'label' && (
            <Text
              style={{
                fontFamily: t.fontHeading,
                fontWeight: 700,
                fontSize: fs * 0.78,
                letterSpacing: 0.8,
                textTransform: 'uppercase',
                color: captionColor ?? ic,
                marginRight: 5,
              }}
            >
              {it.caption}
            </Text>
          )}
          <View style={{ flexShrink: 1 }}>
            <Label item={it} t={t} color={color} size={fs} font={family} />
          </View>
        </View>
      ))}
    </View>
  )
}
