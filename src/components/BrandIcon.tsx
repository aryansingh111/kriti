import { ICON_DATA } from '@/pdf/iconData'

/** A link platform / UI glyph from the same icon data the PDF uses. */
export function BrandIcon({ name, className, size = 16 }: { name: string; className?: string; size?: number }) {
  const nodes = ICON_DATA[name] ?? ICON_DATA.link
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      {nodes.map(([tag, a], i) => {
        const paint =
          a.fill === true
            ? { fill: 'currentColor' }
            : { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
        if (tag === 'path') return <path key={i} d={String(a.d)} {...paint} />
        if (tag === 'rect') return <rect key={i} x={a.x as string} y={a.y as string} width={a.width as string} height={a.height as string} rx={a.rx as string} {...paint} />
        return <circle key={i} cx={a.cx as string} cy={a.cy as string} r={a.r as string} {...paint} />
      })}
    </svg>
  )
}
