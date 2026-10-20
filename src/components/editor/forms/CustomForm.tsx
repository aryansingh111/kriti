import { AnimatePresence, Reorder, useDragControls } from 'motion/react'
import { GripVertical, Plus, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Field, TextArea, TextInput, inputCls } from '@/components/ui/Field'
import type { CustomSection, DetailRow } from '@/types'
import { cn } from '@/lib/utils'
import { specFor } from '@/pdf/specs'
import { useStore } from '@/store'
import { ReorderEntries } from './shared'

const KIND_LABEL: Record<CustomSection['kind'], string> = {
  text: 'Paragraph',
  bullets: 'Bullet list',
  tags: 'Tags',
  entries: 'Dated entries',
  details: 'Key – value rows',
}

const DETAIL_SUGGESTIONS = ['Date of birth', 'Nationality', 'Marital status', 'Gender', 'Address', 'Father’s name', 'Languages known', 'Passport', 'Notice period', 'Current CTC', 'Expected CTC']

function DetailRowEditor({ sectionId, row }: { sectionId: string; row: DetailRow }) {
  const controls = useDragControls()
  const update = useStore((s) => s.updateDetailRow)
  const remove = useStore((s) => s.removeDetailRow)
  return (
    <Reorder.Item
      as="div"
      value={row}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 14px 30px -10px rgb(0 0 0 / 0.35)', zIndex: 30 }}
      className="flex items-center gap-1 rounded-lg border border-line bg-surface-2/50 p-1"
    >
      <button type="button" aria-label="Drag to reorder" onPointerDown={(e) => controls.start(e)} className="touch-none cursor-grab rounded-md p-1 text-faint hover:text-ink active:cursor-grabbing">
        <GripVertical className="size-4" />
      </button>
      <TextInput
        value={row.label}
        onChange={(e) => update(sectionId, row.id, { label: e.target.value })}
        list="detail-labels"
        placeholder="Label"
        aria-label="Label"
        className="h-9 w-[7.4rem] shrink-0 text-[13px]"
      />
      <TextInput value={row.value} onChange={(e) => update(sectionId, row.id, { value: e.target.value })} placeholder="Value" aria-label="Value" className="h-9 min-w-0 flex-1 text-[13px]" />
      <Button variant="ghost" size="icon-sm" onClick={() => remove(sectionId, row.id)} aria-label="Remove row" className="hover:bg-bad/10 hover:text-bad">
        <X className="size-3.5" />
      </Button>
    </Reorder.Item>
  )
}

/** Editor for one user-added section. */
export function CustomForm({ section: c }: { section: CustomSection }) {
  const update = useStore((s) => s.updateCustom)
  const remove = useStore((s) => s.removeCustom)
  const addEntry = useStore((s) => s.addCustomEntry)
  const updateEntry = useStore((s) => s.updateCustomEntry)
  const removeEntry = useStore((s) => s.removeCustomEntry)
  const setEntries = useStore((s) => s.setCustomEntries)
  const addRow = useStore((s) => s.addDetailRow)
  const setRows = useStore((s) => s.setDetailRows)
  const template = useStore((s) => s.settings.template)
  const twoCol = specFor(template).layout.kind !== 'single'

  const del = () => {
    remove(c.id)
    toast('Section removed', { action: { label: 'Undo', onClick: () => useStore.getState().undo() } })
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Field label="Section title">
          <TextInput value={c.title} onChange={(e) => update(c.id, { title: e.target.value })} placeholder="e.g. Volunteering" />
        </Field>
        <Field label="Type">
          <div className="flex h-10 items-center rounded-lg bg-surface-2 px-3 text-[13px] font-semibold text-muted">{KIND_LABEL[c.kind]}</div>
        </Field>
      </div>

      {c.kind === 'text' && (
        <Field label="Text">
          <TextArea minRows={4} value={c.text} onChange={(e) => update(c.id, { text: e.target.value })} placeholder="Write a short paragraph…" />
        </Field>
      )}
      {c.kind === 'bullets' && (
        <Field label="Points" hint="One per line.">
          <TextArea minRows={4} value={c.text} onChange={(e) => update(c.id, { text: e.target.value })} placeholder={'Winner, Smart India Hackathon 2022\nAll India Rank 412 in GATE 2023'} />
        </Field>
      )}
      {c.kind === 'tags' && (
        <Field label="Items" hint="Separate with commas or new lines.">
          <TextArea minRows={3} value={c.text} onChange={(e) => update(c.id, { text: e.target.value })} placeholder="Chess, Trekking, Classical music, Photography" />
        </Field>
      )}
      {c.kind === 'entries' && (
        <ReorderEntries
          items={c.items}
          onReorder={(next) => setEntries(c.id, next)}
          onAdd={() => addEntry(c.id)}
          onRemove={(id) => removeEntry(c.id, id)}
          addLabel="Add entry"
          summary={(i) => ({ title: i.title || i.subtitle, subtitle: [i.subtitle && i.title ? i.subtitle : '', i.date].filter(Boolean).join(' · ') })}
        >
          {(i) => (
            <>
              <Field label="Title">
                <TextInput value={i.title} onChange={(e) => updateEntry(c.id, i.id, { title: e.target.value })} placeholder="Volunteer Teacher" />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Organisation">
                  <TextInput value={i.subtitle} onChange={(e) => updateEntry(c.id, i.id, { subtitle: e.target.value })} placeholder="Teach For India" />
                </Field>
                <Field label="Dates">
                  <TextInput value={i.date} onChange={(e) => updateEntry(c.id, i.id, { date: e.target.value })} placeholder="2021 – 2022" />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Location">
                  <TextInput value={i.location} onChange={(e) => updateEntry(c.id, i.id, { location: e.target.value })} placeholder="Pune" />
                </Field>
                <Field label="Link" hint="Optional – title becomes clickable.">
                  <TextInput value={i.link} onChange={(e) => updateEntry(c.id, i.id, { link: e.target.value })} placeholder="example.org" />
                </Field>
              </div>
              <Field label="Details" hint="One bullet per line.">
                <TextArea minRows={2} value={i.description} onChange={(e) => updateEntry(c.id, i.id, { description: e.target.value })} placeholder="Taught maths to 40 students" />
              </Field>
            </>
          )}
        </ReorderEntries>
      )}
      {c.kind === 'details' && (
        <div className="space-y-2">
          <datalist id="detail-labels">
            {DETAIL_SUGGESTIONS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
          <Reorder.Group as="div" axis="y" values={c.rows} onReorder={(rows) => setRows(c.id, rows)} className="space-y-1.5">
            <AnimatePresence initial={false}>
              {c.rows.map((r) => (
                <DetailRowEditor key={r.id} sectionId={c.id} row={r} />
              ))}
            </AnimatePresence>
          </Reorder.Group>
          <button
            type="button"
            onClick={() => addRow(c.id)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line-strong py-2 text-[13px] font-semibold text-muted hover:border-brand hover:bg-brand-soft hover:text-brand"
          >
            <Plus className="size-4" /> Add row
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        {twoCol ? (
          <label className="flex items-center gap-2 text-[12.5px] font-semibold text-muted">
            Column
            <select className={cn(inputCls, 'h-8 w-32 py-0 text-[13px]')} value={c.column} onChange={(e) => update(c.id, { column: e.target.value as CustomSection['column'] })}>
              <option value="auto">Automatic</option>
              <option value="main">Main column</option>
              <option value="side">Side column</option>
            </select>
          </label>
        ) : (
          <span />
        )}
        <Button variant="danger" size="sm" onClick={del}>
          <Trash2 className="size-3.5" /> Delete section
        </Button>
      </div>
    </>
  )
}

