import { AnimatePresence, motion, Reorder, useDragControls } from 'motion/react'
import { ChevronDown, Eye, EyeOff, GripVertical, Plus, Trash2, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

/* ─────────── collapsible section card ─────────── */

export function SectionCard({
  id,
  icon: Icon,
  title,
  description,
  count,
  filled,
  hidden,
  onToggleHidden,
  open,
  onToggle,
  children,
}: {
  id: string
  icon: LucideIcon
  title: string
  description?: string
  count?: number
  filled?: boolean
  /** hidden from the resume (shows an eye toggle) */
  hidden?: boolean
  onToggleHidden?: () => void
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <section
      id={`card-${id}`}
      className={cn(
        'scroll-mt-4 overflow-hidden rounded-xl border bg-surface transition-colors',
        open ? 'border-line-strong shadow-card' : 'border-line hover:border-line-strong',
        hidden && 'opacity-70',
      )}
    >
      <div className="flex items-center gap-1 pr-2">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-3 text-left">
          <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg transition-colors', open ? 'bg-brand text-brand-ink' : 'bg-surface-2 text-muted')}>
            <Icon className="size-[18px]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 text-[14.5px] font-bold tracking-tight text-ink">
              <span className="truncate">{title}</span>
              {typeof count === 'number' && count > 0 && (
                <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[11px] font-bold text-muted">{count}</span>
              )}
              {hidden && <span className="rounded-md bg-warn/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-warn">Hidden</span>}
            </span>
            {description ? <span className="block truncate text-xs text-muted">{description}</span> : null}
          </span>
          {filled && !hidden && <span className="size-2 shrink-0 rounded-full bg-ok" title="Section has content" />}
        </button>
        {onToggleHidden && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onToggleHidden}
            aria-label={hidden ? `Show ${title} on the resume` : `Hide ${title} from the resume`}
            title={hidden ? 'Show on resume' : 'Hide from resume'}
          >
            {hidden ? <EyeOff className="size-4 text-faint" /> : <Eye className="size-4" />}
          </Button>
        )}
        <button type="button" onClick={onToggle} aria-label={open ? `Collapse ${title}` : `Expand ${title}`} className="rounded-md p-1.5 text-faint hover:text-ink">
          <ChevronDown className={cn('size-4 transition-transform duration-200', open && 'rotate-180')} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-3.5 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ─────────── draggable, collapsible entry ─────────── */

export function EntryCard<T>({
  item,
  title,
  subtitle,
  open,
  onToggle,
  onRemove,
  children,
}: {
  item: T
  title: string
  subtitle?: string
  open: boolean
  onToggle: () => void
  onRemove: () => void
  children: ReactNode
}) {
  const controls = useDragControls()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [open])

  return (
    <Reorder.Item
      as="div"
      ref={ref}
      value={item}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 18px 40px -12px rgb(0 0 0 / 0.35)', zIndex: 30 }}
      className={cn('relative rounded-lg border bg-surface-2/50 transition-colors', open ? 'border-line-strong' : 'border-line')}
    >
      <div className="flex items-center gap-0.5 p-1.5">
        <button
          type="button"
          aria-label="Drag to reorder"
          title="Drag to reorder"
          onPointerDown={(e) => controls.start(e)}
          className="touch-none cursor-grab rounded-md p-1.5 text-faint transition-colors hover:bg-surface-3 hover:text-ink active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-left">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-semibold text-ink">{title || <span className="text-faint">Untitled</span>}</span>
            {subtitle ? <span className="block truncate text-xs text-muted">{subtitle}</span> : null}
          </span>
          <ChevronDown className={cn('size-4 shrink-0 text-faint transition-transform duration-200', open && 'rotate-180')} />
        </button>
        <Button variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Remove entry" title="Remove" className="hover:bg-bad/10 hover:text-bad">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-3 px-3.5 pb-3.5 pt-1.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  )
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong py-2.5 text-[13px] font-semibold text-muted transition-all hover:border-brand hover:bg-brand-soft hover:text-brand"
    >
      <Plus className="size-4 transition-transform group-hover:rotate-90" />
      {label}
    </button>
  )
}

/* ─────────── generic reorderable list of entries ─────────── */

export function ReorderEntries<T extends { id: string }>({
  items,
  onReorder,
  onAdd,
  onRemove,
  addLabel,
  summary,
  children,
}: {
  items: T[]
  onReorder: (next: T[]) => void
  onAdd: () => string
  onRemove: (id: string) => void
  addLabel: string
  summary: (item: T) => { title: string; subtitle?: string }
  children: (item: T) => ReactNode
}) {
  const [openId, setOpenId] = useState<string | null>(items.length === 1 ? items[0].id : null)

  return (
    <div className="space-y-2.5">
      <Reorder.Group as="div" axis="y" values={items} onReorder={onReorder} className="space-y-2.5">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const { title, subtitle } = summary(item)
            return (
              <EntryCard
                key={item.id}
                item={item}
                title={title}
                subtitle={subtitle}
                open={openId === item.id}
                onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                onRemove={() => onRemove(item.id)}
              >
                {children(item)}
              </EntryCard>
            )
          })}
        </AnimatePresence>
      </Reorder.Group>
      <AddButton label={addLabel} onClick={() => setOpenId(onAdd())} />
    </div>
  )
}
