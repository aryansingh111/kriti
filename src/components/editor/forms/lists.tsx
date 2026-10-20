import { useState } from 'react'
import { Field, TextArea, TextInput, inputCls } from '@/components/ui/Field'
import { splitLines } from '@/lib/resume'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import { LANGUAGE_LEVELS, type ListItemMap, type ListKey } from '@/types'
import { ReorderEntries } from './shared'

const join = (...parts: (string | undefined)[]) => parts.filter((p) => p && p.trim()).join(' · ')

/** Generic reorderable list backed by one of the resume's list sections. */
function useList<K extends Exclude<ListKey, 'skills'>>(kind: K) {
  const items = useStore((s) => s.data[kind]) as ListItemMap[K][]
  const addItem = useStore((s) => s.addItem)
  const updateItem = useStore((s) => s.updateItem)
  const removeItem = useStore((s) => s.removeItem)
  const setItems = useStore((s) => s.setItems)
  return {
    items,
    onReorder: (next: ListItemMap[K][]) => setItems(kind, next),
    onAdd: () => addItem(kind),
    onRemove: (id: string) => removeItem(kind, id),
    update: (id: string, patch: Partial<ListItemMap[K]>) => updateItem(kind, id, patch),
  }
}

const VERBS: [string, string[]][] = [
  ['Lead', ['Led', 'Managed', 'Mentored', 'Spearheaded', 'Directed']],
  ['Build', ['Built', 'Launched', 'Designed', 'Implemented', 'Automated']],
  ['Improve', ['Reduced', 'Increased', 'Improved', 'Saved', 'Grew']],
  ['Analyse', ['Analysed', 'Forecasted', 'Audited', 'Evaluated']],
  ['Collaborate', ['Presented', 'Negotiated', 'Collaborated', 'Trained']],
]

/** Click a strong verb to start a new bullet with it. */
function VerbHelper({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const lines = splitLines(value)
  const withNumbers = lines.filter((l) => /\d|%|[$€£₹]/.test(l)).length
  const add = (verb: string) => onChange(`${value.replace(/\s+$/, '')}${value.trim() ? '\n' : ''}${verb} `)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-[11.5px] text-faint">
        <span>
          {lines.length > 0 ? (
            <>
              <b className={withNumbers >= Math.ceil(lines.length / 2) ? 'text-ok' : 'text-warn'}>{withNumbers}</b> of {lines.length} bullets include a number
            </>
          ) : (
            'One bullet per line · lead with a verb · add numbers (%, ₹, time saved)'
          )}
        </span>
        <button type="button" onClick={() => setOpen((o) => !o)} className="font-semibold text-brand hover:underline">
          {open ? 'Hide verbs' : 'Power verbs'}
        </button>
      </div>
      {open && (
        <div className="space-y-1.5 rounded-lg bg-surface-2 p-2.5">
          {VERBS.map(([group, verbs]) => (
            <div key={group} className="flex flex-wrap items-center gap-1">
              <span className="w-[4.6rem] text-[10.5px] font-bold uppercase tracking-wider text-faint">{group}</span>
              {verbs.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => add(v)}
                  className="rounded-full border border-line-strong bg-surface px-2 py-0.5 text-[12px] font-medium text-ink hover:border-brand hover:text-brand"
                >
                  {v}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const LinkHint = 'Optional – makes the name clickable in the PDF.'

export function ExperienceForm() {
  const { items, onReorder, onAdd, onRemove, update } = useList('experience')
  return (
    <ReorderEntries
      items={items}
      onReorder={onReorder}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Add position"
      summary={(e) => ({
        title: e.role || e.company,
        subtitle: join(e.role ? e.company : '', e.start && `${e.start} – ${e.current ? 'Present' : e.end || '…'}`),
      })}
    >
      {(e) => (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Job title">
              <TextInput value={e.role} onChange={(ev) => update(e.id, { role: ev.target.value })} placeholder="Senior Software Engineer" />
            </Field>
            <Field label="Company">
              <TextInput value={e.company} onChange={(ev) => update(e.id, { company: ev.target.value })} placeholder="Infosys" />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Location">
              <TextInput value={e.location} onChange={(ev) => update(e.id, { location: ev.target.value })} placeholder="Bengaluru, Karnataka" />
            </Field>
            <Field label="Company website" hint={LinkHint}>
              <TextInput value={e.link} onChange={(ev) => update(e.id, { link: ev.target.value })} placeholder="company.com" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start">
              <TextInput value={e.start} onChange={(ev) => update(e.id, { start: ev.target.value })} placeholder="Jun 2021" />
            </Field>
            <Field label="End">
              <TextInput
                value={e.current ? '' : e.end}
                disabled={e.current}
                onChange={(ev) => update(e.id, { end: ev.target.value })}
                placeholder={e.current ? 'Present' : 'Mar 2024'}
              />
            </Field>
          </div>
          <label className="flex w-fit cursor-pointer items-center gap-2 text-[13px] text-muted select-none">
            <input type="checkbox" className="size-4 accent-brand" checked={e.current} onChange={(ev) => update(e.id, { current: ev.target.checked })} />
            I currently work here
          </label>
          <Field label="Achievements">
            <TextArea
              minRows={4}
              value={e.highlights}
              onChange={(ev) => update(e.id, { highlights: ev.target.value })}
              placeholder={'Led a team of 6 engineers to rebuild checkout, lifting conversion by 18% across ₹4,200 Cr in volume\nCut page-load time by 48% with edge caching and code-splitting'}
            />
          </Field>
          <VerbHelper value={e.highlights} onChange={(v) => update(e.id, { highlights: v })} />
        </>
      )}
    </ReorderEntries>
  )
}

export function EducationForm() {
  const { items, onReorder, onAdd, onRemove, update } = useList('education')
  return (
    <ReorderEntries
      items={items}
      onReorder={onReorder}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Add education"
      summary={(e) => ({ title: e.school || e.degree, subtitle: join(e.school ? [e.degree, e.field].filter(Boolean).join(' in ') : '', e.end) })}
    >
      {(e) => (
        <>
          <Field label="School / college / university">
            <TextInput value={e.school} onChange={(ev) => update(e.id, { school: ev.target.value })} placeholder="IIT Bombay" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Degree">
              <TextInput value={e.degree} onChange={(ev) => update(e.id, { degree: ev.target.value })} placeholder="B.Tech" />
            </Field>
            <Field label="Field of study">
              <TextInput value={e.field} onChange={(ev) => update(e.id, { field: ev.target.value })} placeholder="Computer Science" />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Location">
              <TextInput value={e.location} onChange={(ev) => update(e.id, { location: ev.target.value })} placeholder="Mumbai, Maharashtra" />
            </Field>
            <Field label="Institute website" hint={LinkHint}>
              <TextInput value={e.link} onChange={(ev) => update(e.id, { link: ev.target.value })} placeholder="iitb.ac.in" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start">
              <TextInput value={e.start} onChange={(ev) => update(e.id, { start: ev.target.value })} placeholder="2020" />
            </Field>
            <Field label="End">
              <TextInput value={e.end} onChange={(ev) => update(e.id, { end: ev.target.value })} placeholder="2024" />
            </Field>
          </div>
          <Field label="Details" hint="CGPA / percentage, rank, honours, coursework – one per line.">
            <TextArea
              minRows={2}
              value={e.details}
              onChange={(ev) => update(e.id, { details: ev.target.value })}
              placeholder={'CGPA 8.7 / 10 · Institute rank 14\nCoursework: Data Structures, DBMS, Operating Systems'}
            />
          </Field>
        </>
      )}
    </ReorderEntries>
  )
}

export function ProjectsForm() {
  const { items, onReorder, onAdd, onRemove, update } = useList('projects')
  return (
    <ReorderEntries
      items={items}
      onReorder={onReorder}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Add project"
      summary={(p) => ({ title: p.name, subtitle: p.tech })}
    >
      {(p) => (
        <>
          <Field label="Project name">
            <TextInput value={p.name} onChange={(ev) => update(p.id, { name: ev.target.value })} placeholder="Campus Cart" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Project link" hint="Optional – the project name becomes a clickable link.">
              <TextInput value={p.link} onChange={(ev) => update(p.id, { link: ev.target.value })} placeholder="github.com/aarav/campus-cart" />
            </Field>
            <Field label="Link text" hint="Optional – defaults to the URL.">
              <TextInput value={p.linkLabel} onChange={(ev) => update(p.id, { linkLabel: ev.target.value })} placeholder="View on GitHub" />
            </Field>
          </div>
          <Field label="Tech stack">
            <TextInput value={p.tech} onChange={(ev) => update(p.id, { tech: ev.target.value })} placeholder="React · Node.js · PostgreSQL" />
          </Field>
          <Field label="What you built" hint="One bullet per line – focus on outcomes.">
            <TextArea
              minRows={3}
              value={p.description}
              onChange={(ev) => update(p.id, { description: ev.target.value })}
              placeholder="Student marketplace with 800+ listings in its first month"
            />
          </Field>
        </>
      )}
    </ReorderEntries>
  )
}

export function CertificationsForm() {
  const { items, onReorder, onAdd, onRemove, update } = useList('certifications')
  return (
    <ReorderEntries
      items={items}
      onReorder={onReorder}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Add certification"
      summary={(c) => ({ title: c.name, subtitle: join(c.issuer, c.date) })}
    >
      {(c) => (
        <>
          <Field label="Certification">
            <TextInput value={c.name} onChange={(ev) => update(c.id, { name: ev.target.value })} placeholder="AWS Certified Solutions Architect – Associate" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Issued by">
              <TextInput value={c.issuer} onChange={(ev) => update(c.id, { issuer: ev.target.value })} placeholder="Amazon Web Services" />
            </Field>
            <Field label="Year">
              <TextInput value={c.date} onChange={(ev) => update(c.id, { date: ev.target.value })} placeholder="2023" />
            </Field>
          </div>
          <Field label="Credential URL" hint={LinkHint}>
            <TextInput value={c.link} onChange={(ev) => update(c.id, { link: ev.target.value })} placeholder="credly.com/badges/…" />
          </Field>
        </>
      )}
    </ReorderEntries>
  )
}

export function LanguagesForm() {
  const { items, onReorder, onAdd, onRemove, update } = useList('languages')
  return (
    <ReorderEntries
      items={items}
      onReorder={onReorder}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Add language"
      summary={(l) => ({ title: l.name, subtitle: l.level })}
    >
      {(l) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Language">
            <TextInput value={l.name} onChange={(ev) => update(l.id, { name: ev.target.value })} placeholder="Hindi" />
          </Field>
          <Field label="Proficiency">
            <select className={cn(inputCls, 'h-10')} value={l.level} onChange={(ev) => update(l.id, { level: ev.target.value })}>
              {LANGUAGE_LEVELS.map((lv) => (
                <option key={lv} value={lv}>
                  {lv}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}
    </ReorderEntries>
  )
}

export function AwardsForm() {
  const { items, onReorder, onAdd, onRemove, update } = useList('awards')
  return (
    <ReorderEntries
      items={items}
      onReorder={onReorder}
      onAdd={onAdd}
      onRemove={onRemove}
      addLabel="Add award"
      summary={(a) => ({ title: a.title, subtitle: join(a.issuer, a.date) })}
    >
      {(a) => (
        <>
          <Field label="Award / achievement">
            <TextInput value={a.title} onChange={(ev) => update(a.id, { title: ev.target.value })} placeholder="All India Rank 412 – GATE (CS)" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Awarded by">
              <TextInput value={a.issuer} onChange={(ev) => update(a.id, { issuer: ev.target.value })} placeholder="IIT Kanpur" />
            </Field>
            <Field label="Year">
              <TextInput value={a.date} onChange={(ev) => update(a.id, { date: ev.target.value })} placeholder="2023" />
            </Field>
          </div>
          <Field label="Description">
            <TextArea minRows={2} value={a.description} onChange={(ev) => update(a.id, { description: ev.target.value })} placeholder="Among the top 0.2% of 1,00,000+ candidates" />
          </Field>
          <Field label="Link" hint={LinkHint}>
            <TextInput value={a.link} onChange={(ev) => update(a.id, { link: ev.target.value })} placeholder="example.com/award" />
          </Field>
        </>
      )}
    </ReorderEntries>
  )
}
