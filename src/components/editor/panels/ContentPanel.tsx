import {
  AlignLeft,
  Award,
  Briefcase,
  CalendarRange,
  FolderKanban,
  GraduationCap,
  Languages,
  Link2,
  List,
  ListChecks,
  Plus,
  Sparkles,
  Tags,
  TextQuote,
  Trophy,
  User,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { customSection, hasContent, normalizedOrder, sectionTitle } from '@/lib/resume'
import { personaFor } from '@/personas'
import { specFor } from '@/pdf/specs'
import { useStore } from '@/store'
import { isCustomKey, type BuiltInSection, type CustomKind, type SectionKey } from '@/types'
import { AddSectionModal } from '../AddSectionModal'
import { BasicsForm, LinksForm, SummaryForm } from '../forms/BasicsForm'
import { CustomForm } from '../forms/CustomForm'
import { AwardsForm, CertificationsForm, EducationForm, ExperienceForm, LanguagesForm, ProjectsForm } from '../forms/lists'
import { SectionCard } from '../forms/shared'
import { SkillsForm } from '../forms/SkillsForm'
import { PanelShell } from './PanelShell'

const BUILTIN: Record<BuiltInSection, { icon: LucideIcon; description: string }> = {
  summary: { icon: TextQuote, description: 'Your elevator pitch' },
  experience: { icon: Briefcase, description: 'Roles, companies and achievements' },
  projects: { icon: FolderKanban, description: 'Side projects, academic & open source' },
  education: { icon: GraduationCap, description: 'Schools, degrees, CGPA' },
  skills: { icon: Wrench, description: 'Tools, languages and strengths' },
  certifications: { icon: Award, description: 'Licences and courses' },
  languages: { icon: Languages, description: 'Spoken languages' },
  awards: { icon: Trophy, description: 'Recognition and ranks' },
}

const CUSTOM_ICON: Record<CustomKind, LucideIcon> = { text: AlignLeft, bullets: List, tags: Tags, entries: CalendarRange, details: ListChecks }

function SampleBanner() {
  const isSample = useStore((s) => s.isSample)
  const template = useStore((s) => s.settings.template)
  const [dismissed, setDismissed] = useState(false)
  if (!isSample || dismissed) return null
  const persona = personaFor(template).basics
  return (
    <div className="mb-3 rounded-xl border border-brand/25 bg-brand-soft p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-brand-ink">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink">This is {persona.fullName}’s sample resume</p>
          <p className="mt-0.5 text-[13px] leading-snug text-muted">
            Every {specFor(template).name} preview comes with its own example so you can see the design working. Overwrite it with your own details.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" variant="primary" onClick={() => setDismissed(true)}>
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ContentPanel() {
  const data = useStore((s) => s.data)
  const settings = useStore((s) => s.settings)
  const focus = useStore((s) => s.focus)
  const toggleSection = useStore((s) => s.toggleSection)
  const [open, setOpen] = useState<Record<string, boolean>>({ basics: true })
  const [adding, setAdding] = useState(false)
  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }))

  // jump to a card when the preview asks ("Edit content")
  useEffect(() => {
    if (!focus) return
    const id = focus.kind === 'basics' ? 'basics' : focus.id
    setOpen((o) => ({ ...o, [id]: true }))
    const t = setTimeout(() => document.getElementById(`card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    return () => clearTimeout(t)
  }, [focus])

  const order = normalizedOrder(data, settings)
  const hidden = (k: SectionKey) => settings.hiddenSections.includes(k)

  const body = (key: SectionKey) => {
    if (isCustomKey(key)) {
      const c = customSection(data, key)
      return c ? <CustomForm section={c} /> : null
    }
    switch (key as BuiltInSection) {
      case 'summary':
        return <SummaryForm />
      case 'experience':
        return <ExperienceForm />
      case 'projects':
        return <ProjectsForm />
      case 'education':
        return <EducationForm />
      case 'skills':
        return <SkillsForm />
      case 'certifications':
        return <CertificationsForm />
      case 'languages':
        return <LanguagesForm />
      case 'awards':
        return <AwardsForm />
    }
  }

  const count = (key: SectionKey): number | undefined => {
    if (isCustomKey(key)) {
      const c = customSection(data, key)
      return c?.kind === 'entries' ? c.items.length : c?.kind === 'details' ? c.rows.length : undefined
    }
    return key === 'summary' ? undefined : (data[key as Exclude<BuiltInSection, 'summary'>] as unknown[]).length
  }

  return (
    <PanelShell title="Your content" blurb="Fill in the details – the preview updates as you type.">
      <SampleBanner />
      <div className="space-y-3">
        <SectionCard
          id="basics"
          icon={User}
          title="Personal details"
          description="Name, contact info and photo"
          filled={!!data.basics.fullName.trim()}
          open={!!open.basics}
          onToggle={() => toggle('basics')}
        >
          <BasicsForm />
        </SectionCard>

        <SectionCard
          id="links"
          icon={Link2}
          title="Links"
          description="LinkedIn, GitHub, portfolio… clickable in the PDF"
          count={data.basics.links.length}
          filled={data.basics.links.length > 0}
          open={!!open.links}
          onToggle={() => toggle('links')}
        >
          <LinksForm />
        </SectionCard>

        {order.map((key) => {
          const custom = isCustomKey(key)
          const c = custom ? customSection(data, key) : undefined
          const Icon = custom ? CUSTOM_ICON[c?.kind ?? 'text'] : BUILTIN[key as BuiltInSection].icon
          return (
            <SectionCard
              key={key}
              id={key}
              icon={Icon}
              title={sectionTitle(key, data, settings)}
              description={custom ? 'Custom section' : BUILTIN[key as BuiltInSection].description}
              count={count(key)}
              filled={hasContent(data, key)}
              hidden={hidden(key)}
              onToggleHidden={() => toggleSection(key)}
              open={!!open[key]}
              onToggle={() => toggle(key)}
            >
              {body(key)}
            </SectionCard>
          )
        })}

        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line-strong py-3.5 text-sm font-bold text-muted transition-all hover:border-brand hover:bg-brand-soft hover:text-brand"
        >
          <Plus className="size-4" /> Add a section
          <span className="text-xs font-medium text-faint">Declaration · Personal details · Volunteering…</span>
        </button>
      </div>
      <AddSectionModal open={adding} onClose={() => setAdding(false)} />
    </PanelShell>
  )
}
