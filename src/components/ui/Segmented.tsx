import { motion } from 'motion/react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SegmentedOption<T extends string> {
  value: T
  label: ReactNode
  title?: string
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
  ariaLabel,
}: {
  options: SegmentedOption<T>[]
  value: T
  onChange: (v: T) => void
  className?: string
  size?: 'sm' | 'md'
  ariaLabel?: string
}) {
  const id = useId()
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn('relative inline-flex rounded-lg bg-surface-2 p-1', className)}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            title={o.title}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              'relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-md font-semibold transition-colors',
              size === 'sm' ? 'h-7 px-3 text-xs' : 'h-8 px-3.5 text-[13px]',
              active ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                transition={{ type: 'spring', stiffness: 520, damping: 38 }}
                className="absolute inset-0 -z-10 rounded-md bg-surface shadow-[0_1px_3px_rgb(0_0_0/0.12),0_0_0_1px_var(--line)]"
              />
            )}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
