import { AnimatePresence, Reorder, useDragControls } from 'motion/react'
import { GripVertical, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { TextInput } from '@/components/ui/Field'
import { Toggle } from '@/components/ui/Toggle'
import { cn } from '@/lib/utils'
import { specFor } from '@/pdf/specs'
import { useStore } from '@/store'
import type { Skill } from '@/types'

const SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'Git', 'AWS', 'Docker', 'MS Excel', 'Tally Prime', 'GST', 'SAP', 'Power BI', 'Figma',
  'Digital Marketing', 'SEO', 'Project Management', 'Communication', 'Leadership', 'Data Analysis', 'Problem Solving', 'Agile', 'Public Speaking', 'Teamwork',
]
const GROUPS = ['Languages', 'Frameworks', 'Tools', 'Databases', 'Cloud', 'Core skills', 'Soft skills']

function LevelDots({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-0.5" role="radiogroup" aria-label="Skill level">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`Level ${n} of 5`}
          onClick={() => onChange(n)}
          className="group grid size-4 place-items-center"
        >
          <span className={cn('size-2.5 rounded-full transition-all group-hover:scale-125', n <= value ? 'bg-brand' : 'bg-surface-3 group-hover:bg-faint')} />
        </button>
      ))}
    </div>
  )
}

function SkillRow({ skill, grouped }: { skill: Skill; grouped: boolean }) {
  const controls = useDragControls()
  const update = useStore((s) => s.updateItem)
  const remove = useStore((s) => s.removeItem)
  return (
    <Reorder.Item
      as="div"
      value={skill}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 14px 30px -10px rgb(0 0 0 / 0.35)', zIndex: 30 }}
      className="flex items-center gap-1 rounded-lg border border-line bg-surface-2/50 py-1 pl-0.5 pr-1"
    >
      <button
        type="button"
        aria-label="Drag to reorder"
        onPointerDown={(e) => controls.start(e)}
        className="touch-none cursor-grab rounded-md p-1 text-faint hover:text-ink active:cursor-grabbing"
      >
        <GripVertical className="size-4" />
      </button>
      <TextInput
        value={skill.name}
        onChange={(e) => update('skills', skill.id, { name: e.target.value })}
        aria-label="Skill name"
        placeholder="Skill"
        className="h-8 min-w-0 flex-1 border-transparent bg-transparent px-2 hover:border-line"
      />
      {grouped && (
        <TextInput
          value={skill.group}
          onChange={(e) => update('skills', skill.id, { group: e.target.value })}
          aria-label="Group"
          placeholder="Group"
          list="skill-groups"
          className="h-8 w-[5.6rem] shrink-0 border-line px-2 text-[12px]"
        />
      )}
      <LevelDots value={skill.level} onChange={(level) => update('skills', skill.id, { level })} />
      <Button variant="ghost" size="icon-sm" onClick={() => remove('skills', skill.id)} aria-label={`Remove ${skill.name || 'skill'}`} className="hover:bg-bad/10 hover:text-bad">
        <X className="size-3.5" />
      </Button>
    </Reorder.Item>
  )
}

export function SkillsForm() {
  const skills = useStore((s) => s.data.skills)
  const addItem = useStore((s) => s.addItem)
  const setItems = useStore((s) => s.setItems)
  const template = useStore((s) => s.settings.template)
  const [draft, setDraft] = useState('')
  const [group, setGroup] = useState('')
  const [grouped, setGrouped] = useState(() => skills.some((s) => s.group))
  const spec = specFor(template)

  const have = new Set(skills.map((s) => s.name.trim().toLowerCase()))
  const add = (names: string[]) => {
    const seen = new Set(have)
    for (const n of names.map((x) => x.trim()).filter(Boolean)) {
      if (!seen.has(n.toLowerCase())) {
        seen.add(n.toLowerCase())
        addItem('skills', { name: n, group: grouped ? group.trim() : '' })
      }
    }
  }
  const commit = () => {
    add(draft.split(','))
    setDraft('')
  }
  const suggestions = SUGGESTIONS.filter((s) => !have.has(s.toLowerCase())).slice(0, 10)

  return (
    <>
      <Toggle
        checked={grouped}
        onChange={setGrouped}
        label="Group skills under headings"
        description="e.g. Languages: Java · Python   Tools: Git · Docker. Shown as separate lines or blocks."
      />
      <div className="flex gap-2">
        <TextInput
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              commit()
            }
          }}
          placeholder="Type a skill and press Enter…"
          aria-label="Add a skill"
        />
        {grouped && (
          <TextInput value={group} onChange={(e) => setGroup(e.target.value)} placeholder="Group" list="skill-groups" aria-label="Group for new skills" className="w-28 shrink-0" />
        )}
        <Button onClick={commit} disabled={!draft.trim()} aria-label="Add skill">
          <Plus className="size-4" /> Add
        </Button>
      </div>
      <datalist id="skill-groups">
        {[...new Set([...skills.map((s) => s.group).filter(Boolean), ...GROUPS])].map((g) => (
          <option key={g} value={g} />
        ))}
      </datalist>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add([s])}
              className="rounded-full border border-line-strong px-2.5 py-1 text-xs font-semibold text-muted transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
            >
              + {s}
            </button>
          ))}
        </div>
      )}

      <Reorder.Group as="div" axis="y" values={skills} onReorder={(next) => setItems('skills', next)} className="space-y-1.5">
        <AnimatePresence initial={false}>
          {skills.map((s) => (
            <SkillRow key={s.id} skill={s} grouped={grouped} />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <p className="text-[11.5px] leading-snug text-faint">
        {spec.levels ? `${spec.name} draws these levels as bars or dots.` : `${spec.name} lists skills without levels – pick Level bars / dots in Design to show them.`}
      </p>
    </>
  )
}
