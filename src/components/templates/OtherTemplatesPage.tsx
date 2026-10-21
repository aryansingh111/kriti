import { ArrowLeft, Check, Copy, PenLine, Search, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { SiteFooter } from '@/components/SiteFooter'
import { Button, ButtonLink } from '@/components/ui/Button'
import { filterTemplates, NO_FILTERS } from '@/lib/templateFilter'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { CATEGORIES, type Category, type TemplateSpec } from '@/pdf/specs'
import { useActiveDoc, useStore } from '@/store'
import { TemplateImage } from './TemplateImage'

function Card({ spec, index, mine, current, onOpen }: { spec: TemplateSpec; index: number; mine: React.ComponentProps<typeof TemplateImage>['mine']; current: boolean; onOpen: () => void }) {
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.025, duration: 0.3 }}
      className={cn('group flex flex-col rounded-2xl border bg-surface p-2.5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-pop', current ? 'border-brand ring-2 ring-brand/30' : 'border-line hover:border-line-strong')}
    >
      <button type="button" onClick={onOpen} aria-label={`Open your resume in ${spec.name}`} className="relative block overflow-hidden rounded-xl bg-surface-2 p-2.5 text-left">
        <div className="proof overflow-hidden !rounded-lg transition-transform duration-500 group-hover:scale-[1.03]">
          <TemplateImage id={spec.id} width={320} mine={mine} />
        </div>
        {current && (
          <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-brand-ink shadow">
            <Check className="size-3" strokeWidth={3.5} /> Current design
          </span>
        )}
      </button>
      <div className="flex flex-1 flex-col px-1 pb-0.5 pt-3.5">
        <h3 className="truncate text-[15.5px] font-extrabold text-ink">{spec.name}</h3>
        <p className="truncate text-[12.5px] text-muted">{spec.tagline}</p>
        <Button variant={current ? 'secondary' : 'primary'} size="sm" className="mt-3.5 w-full !rounded-lg" onClick={onOpen}>
          {current ? (
            <>
              <PenLine className="size-3.5" /> Open
            </>
          ) : (
            <>
              <PenLine className="size-3.5" /> Open and edit
            </>
          )}
        </Button>
      </div>
    </motion.article>
  )
}

/**
 * /resumes/:id/other-templates - one resume's content shown in every template. Opening a design makes a new copy of
 * the resume in that template (the original stays as it is), and goes straight to the editor.
 */
export function OtherTemplatesPage() {
  const navigate = useNavigate()
  const doc = useActiveDoc()
  const copyToTemplate = useStore((s) => s.copyToTemplate)
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<Category | 'All'>('All')

  const mine = doc?.data
  const list = useMemo(() => filterTemplates({ ...NO_FILTERS, q, category }), [q, category])

  if (!doc || !mine) return null

  const open = (spec: TemplateSpec) => {
    if (spec.id === doc.settings.template) return navigate(paths.edit(doc.id, doc.isSample ? 'design' : 'content'))
    const id = copyToTemplate(doc.id, spec.id)
    if (!id) return
    toast.success(`Opened in ${spec.name}`, { description: `A new copy, "${useStore.getState().docs.find((d) => d.id === id)?.name}". "${doc.name}" is unchanged.` })
    navigate(paths.edit(id, 'design'))
  }

  return (
    <div className="min-h-[calc(100dvh-72px)] bg-bg">
      <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-8 sm:px-6">
        <ButtonLink to={paths.resumes} variant="ghost" size="sm" className="-ml-2 mb-4">
          <ArrowLeft className="size-4" /> My resumes
        </ButtonLink>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">{doc.name}</p>
            <h1 className="font-display mt-3 text-[34px] leading-tight text-ink sm:text-[44px]">Try your data in every template</h1>
            <p className="mt-3 max-w-xl text-[15.5px] text-muted">
              Every design below is filled with <b className="text-ink">{doc.data.basics.fullName.trim() || 'your details'}</b>. Open any one to keep editing it there, and tidy anything that does not fit.
            </p>
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search designs"
              aria-label="Search designs"
              className="h-11 w-full rounded-xl border border-line-strong bg-surface pl-10 pr-9 text-[14.5px] outline-none placeholder:text-faint focus:border-brand focus:ring-4 focus:ring-brand/15"
            />
            {q && (
              <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-faint hover:text-ink">
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-surface-2 p-4">
          <p className="flex items-start gap-2.5 text-[13.5px] leading-snug text-muted">
            <Copy className="mt-0.5 size-4 shrink-0 text-brand" />
            <span>
              Only your <b className="text-ink">text and photo</b> are placed in each design. Its colours, fonts and layout stay as they were made. Opening one saves a <b className="text-ink">new resume</b> and leaves this one untouched.
            </span>
          </p>
        </div>

        <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {(['All', ...CATEGORIES] as (Category | 'All')[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn('h-9 shrink-0 rounded-full border px-4 text-[13.5px] font-semibold transition-colors', category === c ? 'border-ink bg-ink text-bg' : 'border-line-strong bg-surface text-ink hover:bg-surface-2')}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mb-5 mt-6 text-[13.5px] text-muted">
          <b className="text-ink">{list.length}</b> design{list.length === 1 ? '' : 's'}
        </p>
        {list.length ? (
          <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {list.map((s, i) => (
              <Card key={s.id} spec={s} index={i} mine={mine} current={s.id === doc.settings.template} onOpen={() => open(s)} />
            ))}
          </div>
        ) : (
          <div className="grid place-items-center rounded-2xl border border-dashed border-line-strong px-6 py-24 text-center">
            <Search className="size-8 text-faint" />
            <p className="mt-3 text-[17px] font-bold text-ink">No design matches</p>
            <Button
              variant="soft"
              className="mt-5"
              onClick={() => {
                setQ('')
                setCategory('All')
              }}
            >
              Show all designs
            </Button>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}
