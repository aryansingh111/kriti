import { useId } from 'react'
import { cn } from '@/lib/utils'

/** The Indian flag as a small round badge. It is always drawn upright and still. */
export function IndiaFlag({ className }: { className?: string }) {
  const clip = `india-flag-${useId().replace(/:/g, '')}`
  const spokes = Array.from({ length: 12 }, (_, i) => (i * Math.PI) / 6)
  return (
    <svg viewBox="0 0 24 24" className={cn('size-6 shrink-0 rounded-full shadow-[0_0_0_1px_rgb(12_34_24/0.18)]', className)} aria-hidden>
      <defs>
        <clipPath id={clip}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width="24" height="8" y="0" fill="#ff9933" />
        <rect width="24" height="8" y="8" fill="#ffffff" />
        <rect width="24" height="8" y="16" fill="#138808" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="#000080" strokeWidth="0.7" />
        {spokes.map((a, i) => (
          <line key={i} x1={12 + Math.cos(a) * 0.6} y1={12 + Math.sin(a) * 0.6} x2={12 + Math.cos(a) * 3} y2={12 + Math.sin(a) * 3} stroke="#000080" strokeWidth="0.4" />
        ))}
      </g>
    </svg>
  )
}
