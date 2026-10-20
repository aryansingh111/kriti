import { Camera, Check, LayoutGrid, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { TemplateImage } from '@/components/templates/TemplateImage'
import { ButtonLink } from '@/components/ui/Button'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { filterTemplates, NO_FILTERS } from '@/lib/templateFilter'
import { CATEGORIES, specFor, type Category } from '@/pdf/specs'
import { useStore } from '@/store'
import { PanelShell } from './PanelShell'

/** Rail → Templates: try any of the designs instantly, with your own content flowing into them. */
export function TemplatesPanel() {
  const current = useStore((s) => s.settings.template)
  const switchTemplate = useStore((s) => s.switchTemplate)
  const activeId = useStore((s) => s.activeId)
  const pick = (id: string, name: string) => {
    if (id === current) return
    const before = current
    switchTemplate(id)
    toast(`Switched to ${name}`, { action: { label: 'Undo', onClick: () => useStore.getState().undo() }, description: specFor(before).name + ' is one click away' })
  }
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<Category | 'All'>('All')

  const list = useMemo(() => filterTemplates({ ...NO_FILTERS, q, category: cat }), [q, cat])

  return (
    <PanelShell
      title="Templates"
      blurb="Click any design – your content moves with you."
      action={
        <ButtonLink to={paths.switchTemplate(activeId)} size="sm" variant="secondary" title="Browse with filters">
          <LayoutGrid className="size-3.5" /> Browse all
        </ButtonLink>
      }
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search – fresher, developer, CA…"
          aria-label="Search templates"
          className="h-10 w-full rounded-lg border border-line-strong bg-surface pl-9 pr-8 text-sm outline-none placeholder:text-faint focus:border-brand focus:ring-4 focus:ring-brand/15"
        />
        {q && (
          <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-faint hover:text-ink">
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 pb-1">
        {(['All', ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={cn(
              'h-8 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold transition-colors',
              cat === c ? 'border-ink bg-ink text-bg' : 'border-line-strong bg-surface text-muted hover:text-ink',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {list.map((s) => {
          const on = s.id === current
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => pick(s.id, s.name)}
              aria-pressed={on}
              aria-label={`Use the ${s.name} template`}
              className="group text-left"
            >
              <span
                className={cn(
                  'relative block overflow-hidden rounded-lg bg-surface-2 p-1.5 transition-all',
                  on ? 'ring-2 ring-brand' : 'ring-1 ring-line group-hover:ring-2 group-hover:ring-brand/50',
                )}
              >
                <TemplateImage id={s.id} width={200} className="rounded shadow-sm ring-1 ring-black/5" />
                {on && (
                  <span className="absolute right-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-brand text-brand-ink shadow">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                )}
                {s.photo && (
                  <span className="absolute left-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-white/90 text-ink shadow" title="Includes a photo">
                    <Camera className="size-3" />
                  </span>
                )}
              </span>
              <span className="mt-1.5 flex items-center justify-between px-0.5">
                <span className={cn('truncate text-[13px] font-semibold', on ? 'text-brand' : 'text-ink')}>{s.name}</span>
                <span className="text-[11px] text-faint">{s.category}</span>
              </span>
            </button>
          )
        })}
      </div>

      {list.length === 0 && <p className="py-12 text-center text-sm text-muted">No templates match – try a different word.</p>}
    </PanelShell>
  )
}
