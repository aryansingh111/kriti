import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface MenuItem {
  label: string
  icon?: ReactNode
  onSelect: () => void
  danger?: boolean
  hint?: string
  separatorBefore?: boolean
}

export function Menu({ trigger, items, align = 'right' }: { trigger: (open: boolean) => ReactNode; items: MenuItem[]; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((o) => !o)}>{trigger(open)}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className={cn(
              'absolute top-full z-50 mt-2 w-64 origin-top rounded-xl border border-line bg-surface p-1.5 shadow-pop',
              align === 'right' ? 'right-0' : 'left-0',
            )}
          >
            {items.map((it) => (
              <div key={it.label}>
                {it.separatorBefore && <div className="my-1.5 h-px bg-line" />}
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    it.onSelect()
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors hover:bg-surface-2',
                    it.danger ? 'text-bad' : 'text-ink',
                  )}
                >
                  <span className="grid size-4 place-items-center text-muted">{it.icon}</span>
                  <span className="flex-1">{it.label}</span>
                  {it.hint ? <span className="text-[11px] text-faint">{it.hint}</span> : null}
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
