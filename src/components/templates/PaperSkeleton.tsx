import { cn } from '@/lib/utils'

/** A shimmering fake resume shown while the real thumbnail renders. */
export function PaperSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-white p-[9%]', className)} aria-hidden>
      <div className="flex gap-[6%]">
        <div className="flex-1 space-y-[3%]">
          <div className="skeleton h-[5%] min-h-3 w-3/5 rounded bg-neutral-200" />
          <div className="skeleton mt-2 h-2 w-2/5 rounded bg-neutral-200" />
        </div>
        <div className="skeleton size-[16%] rounded-full bg-neutral-200" />
      </div>
      <div className="mt-[9%] space-y-[3.4%]">
        {Array.from({ length: 17 }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-[1.8%] min-h-1.5 rounded bg-neutral-200"
            style={{ width: `${[100, 92, 96, 40, 100, 86, 94, 58, 100, 90, 98, 46, 100, 88, 95, 62, 78][i]}%` }}
          />
        ))}
      </div>
    </div>
  )
}
