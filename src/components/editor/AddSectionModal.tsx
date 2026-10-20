import { AlignLeft, CalendarRange, List, ListChecks, Tags } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { CUSTOM_PRESETS } from '@/lib/factories'
import { useStore } from '@/store'
import type { CustomKind } from '@/types'

const ICON: Record<CustomKind, typeof List> = {
  text: AlignLeft,
  bullets: List,
  tags: Tags,
  entries: CalendarRange,
  details: ListChecks,
}

const TINT: Record<CustomKind, string> = {
  text: 'bg-brand-soft text-brand',
  bullets: 'bg-brand-soft text-brand',
  tags: 'bg-brand-soft text-brand',
  entries: 'bg-brand-soft text-brand',
  details: 'bg-brand-soft text-brand',
}

/** One-click section ideas (several are standard on Indian resumes), plus blank sections of every type. */
export function AddSectionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const add = useStore((s) => s.addCustomSection)
  return (
    <Modal open={open} onClose={onClose} title="Add a section" description="Pick a ready-made idea or start with a blank one." className="sm:max-w-3xl">
      <div className="grid gap-2.5 p-5 sm:grid-cols-2">
        {CUSTOM_PRESETS.map((p) => {
          const Icon = ICON[p.kind]
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                add(p.build())
                onClose()
              }}
              className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-card"
            >
              <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${TINT[p.kind]}`}>
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-bold text-ink group-hover:text-brand">{p.title}</span>
                <span className="block truncate text-[12.5px] text-muted">{p.description}</span>
              </span>
            </button>
          )
        })}
      </div>
    </Modal>
  )
}

