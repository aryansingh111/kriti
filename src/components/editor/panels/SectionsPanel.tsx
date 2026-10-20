import { Reorder, useDragControls } from 'motion/react'
import { Eye, EyeOff, GripVertical, MoveVertical, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Segmented } from '@/components/ui/Segmented'
import { regionOf, sideKeysOf } from '@/lib/regions'
import { customSection, hasContent, normalizedOrder, sectionTitle } from '@/lib/resume'
import { cn } from '@/lib/utils'
import { specFor } from '@/pdf/specs'
import { useStore } from '@/store'
import { isCustomKey, SECTION_LABEL, type BuiltInSection, type SectionKey } from '@/types'
import { AddSectionModal } from '../AddSectionModal'
import { PanelShell } from './PanelShell'

function Row({ k, twoCol }: { k: SectionKey; twoCol: boolean }) {
  const controls = useDragControls()
  const data = useStore((s) => s.data)
  const settings = useStore((s) => s.settings)
  const toggle = useStore((s) => s.toggleSection)
  const rename = useStore((s) => s.renameSection)
  const updateCustom = useStore((s) => s.updateCustom)
  const remove = useStore((s) => s.removeCustom)
  const setColumn = useStore((s) => s.setSectionColumn)
  const spec = specFor(settings.template)

  const custom = isCustomKey(k)
  const c = custom ? customSection(data, k) : undefined
  const title = sectionTitle(k, data, settings)
  const hidden = settings.hiddenSections.includes(k)
  const empty = !hasContent(data, k)
  const renamed = !custom && !!settings.sectionTitles[k]
  const region = regionOf(k, sideKeysOf(spec), data, settings)
  const forced = !!settings.sectionColumn[k]

  return (
    <Reorder.Item
      as="div"
      value={k}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02, boxShadow: '0 14px 30px -10px rgb(0 0 0 / 0.35)', zIndex: 30 }}
      className={cn('rounded-lg border bg-surface p-2', hidden ? 'border-line opacity-75' : 'border-line-strong')}
    >
      <div className="flex items-center gap-1">
        <button type="button" aria-label={`Drag ${title} to reorder`} onPointerDown={(e) => controls.start(e)} className="touch-none cursor-grab rounded-md p-1.5 text-faint hover:text-ink active:cursor-grabbing">
          <GripVertical className="size-4" />
        </button>
        <input
          value={title}
          onChange={(e) => (custom ? c && updateCustom(c.id, { title: e.target.value }) : rename(k, e.target.value))}
          aria-label={`Heading for ${SECTION_LABEL[k as BuiltInSection] ?? 'section'}`}
          className={cn('h-8 min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1.5 text-[13.5px] font-semibold outline-none hover:border-line focus:border-brand focus:bg-surface', hidden ? 'text-faint line-through' : 'text-ink')}
        />
        {empty && <span className="rounded-md bg-surface-3 px-1.5 py-0.5 text-[10px] font-bold text-muted">EMPTY</span>}
        {renamed && (
          <Button variant="ghost" size="icon-sm" onClick={() => rename(k, '')} aria-label="Reset heading" title="Reset heading">
            <RotateCcw className="size-3.5" />
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" onClick={() => toggle(k)} aria-label={hidden ? `Show ${title}` : `Hide ${title}`} title={hidden ? 'Show on resume' : 'Hide from resume'}>
          {hidden ? <EyeOff className="size-4 text-faint" /> : <Eye className="size-4" />}
        </Button>
        {custom && c && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="hover:bg-bad/10 hover:text-bad"
            aria-label={`Delete ${title}`}
            title="Delete section"
            onClick={() => {
              remove(c.id)
              toast('Section removed', { action: { label: 'Undo', onClick: () => useStore.getState().undo() } })
            }}
          >
            <Trash2 className="size-3.5" />
          </Button>
        )}
      </div>
      {twoCol && (
        <div className="mt-1.5 flex items-center justify-between pl-8">
          <span className="text-[11.5px] text-faint">{forced ? 'Moved by you' : 'Column'}</span>
          <Segmented
            size="sm"
            ariaLabel={`Column for ${title}`}
            value={region}
            onChange={(v) => setColumn(k, v)}
            options={[
              { value: 'main', label: 'Main' },
              { value: 'side', label: 'Side' },
            ]}
          />
        </div>
      )}
    </Reorder.Item>
  )
}

export function SectionsPanel() {
  const data = useStore((s) => s.data)
  const settings = useStore((s) => s.settings)
  const setOrder = useStore((s) => s.setSectionOrder)
  const resetSpacing = useStore((s) => s.resetSpacing)
  const [adding, setAdding] = useState(false)
  const order = normalizedOrder(data, settings)
  const twoCol = specFor(settings.template).layout.kind !== 'single'
  const nudged = Object.keys(settings.spacing).length

  return (
    <PanelShell title="Sections" blurb="Reorder, rename or hide sections – and add your own.">
      <Reorder.Group as="div" axis="y" values={order} onReorder={setOrder} className="space-y-2">
        {order.map((k) => (
          <Row key={k} k={k} twoCol={twoCol} />
        ))}
      </Reorder.Group>

      <button
        type="button"
        onClick={() => setAdding(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong py-3.5 text-sm font-bold text-muted transition-all hover:border-brand hover:bg-brand-soft hover:text-brand"
      >
        <Plus className="size-4" /> Add a section
      </button>

      {twoCol && <p className="mt-3 text-[12px] leading-snug text-faint">Order applies within each column. Use Main / Side to move a section across.</p>}

      <div className="mt-5 flex items-start gap-3 rounded-xl bg-surface-2 p-3.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <MoveVertical className="size-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-bold text-ink">Fine-tune spacing in the preview</p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
            Hover a section on the page and drag the green handles – up/down to change the gap above it, or the side grip to reorder. Your adjustments are kept in the downloaded PDF.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <span className="rounded-md bg-surface px-2 py-1 text-[11.5px] font-semibold text-muted ring-1 ring-line">{nudged} adjusted</span>
            <Button size="sm" variant="secondary" onClick={resetSpacing} disabled={nudged === 0}>
              <RotateCcw className="size-3.5" /> Reset all
            </Button>
          </div>
        </div>
      </div>
      <AddSectionModal open={adding} onClose={() => setAdding(false)} />
    </PanelShell>
  )
}
