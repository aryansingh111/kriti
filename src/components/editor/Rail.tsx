import { ShieldCheck, LayoutTemplate, ListOrdered, Palette, PenLine, Eye } from 'lucide-react'
import { Link } from 'react-router'
import { paths, type Rail as RailId } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'

const ITEMS: { id: RailId; label: string; icon: typeof Palette }[] = [
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'content', label: 'Content', icon: PenLine },
  { id: 'sections', label: 'Sections', icon: ListOrdered },
  { id: 'check', label: 'Check', icon: ShieldCheck },
]

/** Tool rail (left on desktop, bottom bar on phones). Each tool is its own route. */
export function Rail({ rail }: { rail: RailId }) {
  const activeId = useStore((s) => s.activeId)
  const select = useStore((s) => s.select)
  const pane = useStore((s) => s.pane)
  const setPane = useStore((s) => s.setPane)

  const button = (id: RailId, label: string, Icon: typeof Palette) => {
    const on = rail === id && pane === 'edit'
    return (
      <Link
        key={id}
        to={paths.edit(activeId, id)}
        onClick={() => {
          select(null)
          setPane('edit')
        }}
        aria-current={on ? 'page' : undefined}
        className={cn(
          'group relative flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-colors max-lg:flex-1',
          on ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-surface-2 hover:text-ink',
        )}
      >
        <Icon className="size-[22px]" strokeWidth={on ? 2.3 : 1.9} />
        {label}
      </Link>
    )
  }

  return (
    <>
      <nav aria-label="Editor tools" className="hidden w-[78px] shrink-0 flex-col gap-1 border-r border-line bg-surface p-2 lg:flex">
        {ITEMS.map((i) => button(i.id, i.label, i.icon))}
      </nav>

      <nav aria-label="Editor tools" className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-0.5 border-t border-line bg-surface px-1.5 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1 lg:hidden">
        {ITEMS.map((i) => button(i.id, i.label, i.icon))}
        <button
          type="button"
          onClick={() => setPane(pane === 'preview' ? 'edit' : 'preview')}
          className={cn(
            'flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition-colors',
            pane === 'preview' ? 'bg-ink text-bg' : 'text-muted hover:bg-surface-2',
          )}
        >
          <Eye className="size-[22px]" />
          Preview
        </button>
      </nav>
    </>
  )
}
