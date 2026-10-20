import { useId } from 'react'
import { cn } from '@/lib/utils'

/** The shapes of the Ashoka Chakra (a ring, a hub and 24 spokes) centred at cx, cy with outer radius r. */
function ChakraShapes({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <g stroke={color} fill="none">
      <circle cx={cx} cy={cy} r={r * 0.9} strokeWidth={r * 0.09} />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i * Math.PI) / 12
        return <line key={i} x1={cx + Math.cos(a) * r * 0.18} y1={cy + Math.sin(a) * r * 0.18} x2={cx + Math.cos(a) * r * 0.86} y2={cy + Math.sin(a) * r * 0.86} strokeWidth={r * 0.034} />
      })}
      <circle cx={cx} cy={cy} r={r * 0.17} fill={color} stroke="none" />
    </g>
  )
}

/** The Ashoka Chakra, always drawn upright and still. */
export function Chakra({ className, color = 'var(--navy)' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <ChakraShapes cx={50} cy={50} r={50} color={color} />
    </svg>
  )
}

/** Ring of petals around the centre of a 400x400 canvas. */
function Petals({ n, r, w, offset = 0, stroke, fill }: { n: number; r: number; w: number; offset?: number; stroke: string; fill: string }) {
  const step = 360 / n
  return (
    <g stroke={stroke} fill={fill} strokeWidth="1.4" strokeLinejoin="round">
      {Array.from({ length: n }, (_, i) => (
        <path
          key={i}
          transform={`rotate(${step * i + offset * step} 200 200)`}
          d={`M200 ${200 - r} Q ${200 + w} ${200 - r * 0.72} 200 ${200 - r * 0.38} Q ${200 - w} ${200 - r * 0.72} 200 ${200 - r}Z`}
        />
      ))}
    </g>
  )
}

/** A mandala in saffron, green and navy with the Chakra at its heart, the way rangoli is drawn at a doorstep. */
export function Mandala({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden>
      <circle cx="200" cy="200" r="197" fill="none" stroke="#ff9933" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
      <Petals n={24} r={188} w={22} stroke="#ff9933" fill="rgba(255,153,51,0.12)" />
      <Petals n={24} r={152} w={17} offset={0.5} stroke="#138808" fill="rgba(19,136,8,0.12)" />
      <circle cx="200" cy="200" r="118" fill="none" stroke="#000080" strokeOpacity="0.45" strokeWidth="1.2" />
      <Petals n={12} r={114} w={27} stroke="#ff9933" fill="rgba(255,153,51,0.2)" />
      <Petals n={12} r={86} w={19} offset={0.5} stroke="#138808" fill="rgba(19,136,8,0.2)" />
      <circle cx="200" cy="200" r="58" fill="#ffffff" fillOpacity="0.9" stroke="#000080" strokeOpacity="0.35" />
      <ChakraShapes cx={200} cy={200} r={52} color="#000080" />
    </svg>
  )
}

/** A thin flag-coloured bar. */
export function TricolorBar({ className }: { className?: string }) {
  return <div aria-hidden className={cn('tricolor-bar h-2 w-full', className)} />
}

/** A border of diamonds in saffron, navy and green, like the edge of a sari or a doorway. */
export function Rangoli({ className }: { className?: string }) {
  const id = `rangoli-${useId().replace(/:/g, '')}`
  return (
    <svg className={cn('h-4 w-full', className)} aria-hidden>
      <defs>
        <pattern id={id} width="72" height="16" patternUnits="userSpaceOnUse">
          <path d="M12 2 20 8 12 14 4 8Z" fill="#ff9933" />
          <circle cx="24" cy="8" r="1.8" fill="#ff9933" fillOpacity="0.6" />
          <path d="M36 2 44 8 36 14 28 8Z" fill="#000080" fillOpacity="0.85" />
          <circle cx="48" cy="8" r="1.8" fill="#000080" fillOpacity="0.5" />
          <path d="M60 2 68 8 60 14 52 8Z" fill="#138808" />
          <circle cx="72" cy="8" r="1.8" fill="#138808" fillOpacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="16" fill={`url(#${id})`} />
    </svg>
  )
}
