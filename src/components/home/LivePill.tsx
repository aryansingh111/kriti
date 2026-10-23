import type { ReactNode } from 'react'
import { useSyncExternalStore } from 'react'
import { getLive, subscribeLive } from '@/lib/live'
import { cn } from '@/lib/utils'

/** The count is hidden until at least this many people are online, so a quiet moment never reads "1 person online". */
const MIN = 3

/** "N people online now". Shows `fallback` instead (or nothing) while the count is unknown or small. */
export function LivePill({ fallback = null, className, tone = 'light' }: { fallback?: ReactNode; className?: string; /** 'dark' is for the green footer */ tone?: 'light' | 'dark' }) {
  const count = useSyncExternalStore(subscribeLive, getLive, () => null)
  if (count === null || count < MIN) return <>{fallback}</>
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-semibold',
        tone === 'dark' ? 'border-white/15 bg-white/[0.06] text-white' : 'border-line bg-surface text-ink shadow-card',
        className,
      )}
      role="status"
    >
      <span className="relative flex size-2.5" aria-hidden>
        <span className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-60', tone === 'dark' ? 'bg-[#8ee6b3]' : 'bg-[#34b36b]')} />
        <span className={cn('relative inline-flex size-2.5 rounded-full', tone === 'dark' ? 'bg-[#8ee6b3]' : 'bg-[#1c9a5c]')} />
      </span>
      <span>
        <b className="font-extrabold tabular-nums">{count}</b> people online now
      </span>
    </span>
  )
}
