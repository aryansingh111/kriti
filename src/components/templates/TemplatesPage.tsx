import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Eye, FilePlus2, Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { COLOUR_FAMILIES, countBy, FEATURES, filterTemplates, LAYOUTS, layoutOf, NO_FILTERS, type ColourFamily, type Filters, type Layout, type Sort } from '@/lib/templateFilter'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { FONT_OPTIONS } from '@/pdf/fontMeta'
import { personaFor } from '@/personas'
import { CATEGORIES, SPECS, type Category, type TemplateSpec } from '@/pdf/specs'
import { useStore } from '@/store'
import { TemplateImage } from './TemplateImage'

const fontLabel = (id: string) => FONT_OPTIONS.find((f) => f.id === id)?.label ?? id

function AtsDots({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-[3px]" title={`ATS compatibility ${n}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={cn('block size-1.5 rounded-full', i < n ? 'bg-ok' : 'bg-surface-3')} />
      ))}
    </span>
  )
}

/* ─────────── filters ─────────── */

function Check_({ checked, onChange, children, count }: { checked: boolean; onChange: () => void; children: React.ReactNode; count?: number }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} onClick={onChange} className="group flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left hover:bg-surface-2">
      <span className={cn('grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors', checked ? 'border-brand bg-brand text-brand-ink' : 'border-line-strong bg-surface group-hover:border-faint')}>
        {checked && <Check className="size-3" strokeWidth={3.5} />}
      </span>
      <span className="flex-1 text-[13.5px] font-medium text-ink">{children}</span>
      {typeof count === 'number' && <span className="text-[12px] tabular-nums text-faint">{count}</span>}
    </button>
  )
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-4 first:pt-0 last:border-0">
      <h3 className="mb-2 px-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-faint">{title}</h3>
      {children}
    </div>
  )
}

function FilterPanel({ filters, set, total }: { filters: Filters; set: (p: Partial<Filters>) => void; total: number }) {
  const catCounts = useMemo(() => countBy((s) => s.category), [])
  const layoutCounts = useMemo(() => countBy((s) => layoutOf(s)), [])
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

  return (
    <div>
      <FilterBlock title="Style">
        <button
          type="button"
          onClick={() => set({ category: 'All' })}
          className={cn('flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[13.5px] font-semibold', filters.category === 'All' ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-surface-2')}
        >
          All templates <span className="text-[12px] tabular-nums opacity-70">{SPECS.length}</span>
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => set({ category: c })}
            className={cn('flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-[13.5px] font-semibold', filters.category === c ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-surface-2')}
          >
            {c} <span className="text-[12px] tabular-nums opacity-70">{catCounts[c] ?? 0}</span>
          </button>
        ))}
      </FilterBlock>

      <FilterBlock title="Layout">
        {LAYOUTS.map((l) => (
          <Check_ key={l} checked={filters.layouts.includes(l)} onChange={() => set({ layouts: toggle<Layout>(filters.layouts, l) })} count={layoutCounts[l] ?? 0}>
            {l}
          </Check_>
        ))}
      </FilterBlock>

      <FilterBlock title="Features">
        {FEATURES.map((f) => (
          <Check_ key={f.id} checked={filters.features.includes(f.id)} onChange={() => set({ features: toggle(filters.features, f.id) })} count={SPECS.filter(f.test).length}>
            {f.label}
          </Check_>
        ))}
      </FilterBlock>

      <FilterBlock title="Colour">
        <div className="flex flex-wrap gap-2 px-1.5">
          {COLOUR_FAMILIES.map((c) => {
            const on = filters.colours.includes(c.id)
            return (
              <button
                key={c.id}
                type="button"
                title={c.id}
                aria-label={c.id}
                aria-pressed={on}
                onClick={() => set({ colours: toggle<ColourFamily>(filters.colours, c.id) })}
                className={cn('relative size-8 rounded-full ring-offset-2 ring-offset-bg transition-transform hover:scale-110', on ? 'ring-2 ring-brand' : 'ring-1 ring-black/10')}
                style={{ background: c.hex }}
              >
                {on && <Check className="absolute inset-0 m-auto size-4 text-white" strokeWidth={3.5} />}
              </button>
            )
          })}
        </div>
      </FilterBlock>

      <p className="px-1.5 pt-1 text-[12px] text-faint">
        Showing {total} of {SPECS.length}
      </p>
    </div>
  )
}

/* ─────────── card ─────────── */

function Card({ spec, index, onPreview, onUse, current, mode }: { spec: TemplateSpec; index: number; onPreview: () => void; onUse: () => void; current: boolean; mode: 'new' | 'switch' }) {
  const persona = useMemo(() => personaFor(spec.persona ?? spec.id).basics, [spec])
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.025, duration: 0.3 }}
      className="group"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onPreview}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onPreview())}
        aria-label={`Preview ${spec.name}`}
        className={cn(
          'proof relative cursor-pointer overflow-hidden',
          current && '!border-brand ring-2 ring-brand/40',
        )}
      >
        <TemplateImage id={spec.id} width={320} />
        {current && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-brand px-2 py-1 text-[11px] font-bold text-brand-ink shadow">
            <Check className="size-3" strokeWidth={3.5} /> In use
          </span>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-end gap-2 bg-linear-to-t from-black/60 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:hidden">
          <button
            type="button"
            onClick={(e) => (e.stopPropagation(), onUse())}
            className="inline-flex h-10 w-full max-w-[200px] items-center justify-center gap-1.5 rounded-lg bg-brand text-[13.5px] font-bold text-brand-ink shadow-lg hover:bg-brand-hover"
          >
            {mode === 'new' ? (
              <>
                <FilePlus2 className="size-4" /> Use this template
              </>
            ) : (
              <>
                <Check className="size-4" /> Apply
              </>
            )}
          </button>
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-white/90">
            <Eye className="size-3.5" /> Click to preview
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <h3 className="truncate text-[14.5px] font-bold text-ink">{spec.name}</h3>
          <p className="truncate text-[12.5px] text-muted">
            {persona.fullName.replace(/^(Dr\.?|Prof\.?|CA|Adv\.?)\s+/i, '')} · {persona.title.split(/[·|–-]/)[0].trim()}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
          <AtsDots n={spec.ats} />
          <span className="text-[10.5px] font-semibold text-faint">{spec.category}</span>
        </div>
      </div>
    </motion.article>
  )
}

/* ─────────── preview modal ─────────── */

function PreviewModal({ list, id, onClose, onChange, onUse, mode, current }: { list: TemplateSpec[]; id: string | null; onClose: () => void; onChange: (id: string) => void; onUse: (id: string) => void; mode: 'new' | 'switch'; current: string }) {
  const idx = list.findIndex((s) => s.id === id)
  const spec = idx >= 0 ? list[idx] : null
  const persona = useMemo(() => (spec ? personaFor(spec.persona ?? spec.id) : null), [spec])
  const step = (d: -1 | 1) => list.length && onChange(list[(idx + d + list.length) % list.length].id)

  useEffect(() => {
    if (!spec) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec?.id, list])

  const layoutText = spec ? (spec.layout.kind === 'single' ? 'Single column' : spec.layout.kind === 'split' ? 'Two columns' : `${spec.layout.at === 'left' ? 'Left' : 'Right'} sidebar`) : ''
  return (
    <Modal open={!!spec} onClose={onClose} title={spec?.name ?? ''} description={spec?.tagline} className="sm:max-w-5xl">
      {spec && persona && (
        <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative flex items-start justify-center bg-stage p-5 sm:p-8">
            <button type="button" aria-label="Previous template" onClick={() => step(-1)} className="absolute left-2 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-bg/90 shadow-card backdrop-blur hover:bg-bg">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" aria-label="Next template" onClick={() => step(1)} className="absolute right-2 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-bg/90 shadow-card backdrop-blur hover:bg-bg">
              <ChevronRight className="size-5" />
            </button>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={spec.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className="w-full max-w-[460px] overflow-hidden rounded-md shadow-paper">
                <TemplateImage id={spec.id} width={640} eager />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-bold text-brand">{spec.category}</span>
                <span className="text-[12.5px] font-medium text-faint">
                  {idx + 1} of {list.length}
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 rounded-xl border border-line bg-surface-2/60 p-4 text-[13px]">
              <div>
                <dt className="text-faint">Layout</dt>
                <dd className="mt-0.5 font-semibold text-ink">{layoutText}</dd>
              </div>
              <div>
                <dt className="text-faint">ATS-friendly</dt>
                <dd className="mt-1">
                  <AtsDots n={spec.ats} />
                </dd>
              </div>
              <div>
                <dt className="text-faint">Fonts</dt>
                <dd className="mt-0.5 font-semibold text-ink">
                  {fontLabel(spec.fonts.heading)}
                  {spec.fonts.heading !== spec.fonts.body && <span className="text-muted"> + {fontLabel(spec.fonts.body)}</span>}
                </dd>
              </div>
              <div>
                <dt className="text-faint">Colour</dt>
                <dd className="mt-1 flex gap-1.5">
                  <i className="block size-5 rounded-full ring-1 ring-black/10" style={{ background: spec.accent }} />
                  {spec.tone && <i className="block size-5 rounded-full ring-1 ring-black/10" style={{ background: spec.tone }} />}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-1.5">
              {spec.photo && <Pill>Photo</Pill>}
              {spec.levels && <Pill>Skill levels</Pill>}
              {spec.tags.includes('timeline') && <Pill>Timeline</Pill>}
              {spec.tags.includes('education-first') && <Pill>Education first</Pill>}
              {spec.tags.includes('serif') && <Pill>Serif</Pill>}
              {spec.tags.includes('dark') && <Pill>Dark accents</Pill>}
              {spec.tags.includes('icons') && <Pill>Icons</Pill>}
            </div>

            <div className="rounded-xl border border-dashed border-line-strong p-4">
              <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-faint">Sample shown</p>
              <p className="mt-1.5 text-[15px] font-bold text-ink">{persona.basics.fullName}</p>
              <p className="text-[13px] text-muted">
                {persona.basics.title} · {persona.basics.location}
              </p>
              <p className="mt-2 text-[12px] text-faint">Placeholder content so you can judge the design. You’ll replace it with your own.</p>
            </div>

            <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
              <Button variant="primary" size="lg" className="flex-1" onClick={() => onUse(spec.id)}>
                {mode === 'new' ? (
                  <>
                    <FilePlus2 className="size-4" /> Use this template
                  </>
                ) : current === spec.id ? (
                  <>
                    <Check className="size-4" /> Keep this template
                  </>
                ) : (
                  <>
                    <Check className="size-4" /> Apply to my resume
                  </>
                )}
              </Button>
              <Button variant="secondary" size="lg" onClick={onClose}>
                Keep browsing
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

const Pill = ({ children }: { children: React.ReactNode }) => <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-[12px] font-semibold text-muted">{children}</span>

/* ─────────── page ─────────── */

/**
 * mode "new":    /templates                      - pick a design to start a new resume
 * mode "switch": /resumes/:id/templates          - pick a new design for an existing resume
 * Style and search live in the URL (?style=Classic&q=fresher) so a filtered gallery can be shared or bookmarked.
 */
export function TemplatesPage({ mode }: { mode: 'new' | 'switch' }) {
  const navigate = useNavigate()
  const { id: docId = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const startDoc = useStore((s) => s.startDoc)
  const switchTemplate = useStore((s) => s.switchTemplate)
  const current = useStore((s) => s.settings.template)
  const hasDoc = useStore((s) => s.docs.length > 0)

  const styleParam = params.get('style')
  const base: { category: Category | 'All'; q: string } = {
    category: (CATEGORIES as readonly string[]).includes(styleParam ?? '') ? (styleParam as Category) : 'All',
    q: params.get('q') ?? '',
  }
  const setTemplateFilter = (patch: Partial<typeof base>) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (patch.category !== undefined) {
          if (patch.category === 'All') next.delete('style')
          else next.set('style', patch.category)
        }
        if (patch.q !== undefined) {
          if (patch.q) next.set('q', patch.q)
          else next.delete('q')
        }
        return next
      },
      { replace: true },
    )
  }

  const [extra, setExtra] = useState<Pick<Filters, 'layouts' | 'features' | 'colours'>>({ layouts: [], features: [], colours: [] })
  const [sort, setSort] = useState<Sort>('popular')
  const [preview, setPreview] = useState<string | null>(null)
  const [drawer, setDrawer] = useState(false)

  const filters: Filters = { ...NO_FILTERS, ...base, ...extra }
  const list = useMemo(() => filterTemplates(filters, sort), [base.category, base.q, extra, sort]) // eslint-disable-line react-hooks/exhaustive-deps
  const active = (base.category !== 'All' ? 1 : 0) + extra.layouts.length + extra.features.length + extra.colours.length + (base.q ? 1 : 0)

  const setFilters = (p: Partial<Filters>) => {
    const { category, q, ...rest } = p
    if (category !== undefined || q !== undefined) setTemplateFilter({ ...(category !== undefined && { category }), ...(q !== undefined && { q }) })
    if (Object.keys(rest).length) setExtra((e) => ({ ...e, ...rest }))
  }
  const clear = () => {
    setTemplateFilter({ category: 'All', q: '' })
    setExtra({ layouts: [], features: [], colours: [] })
  }

  const use = (id: string) => {
    setPreview(null)
    if (mode === 'new') navigate(paths.edit(startDoc(id), 'design'))
    else {
      switchTemplate(id)
      navigate(paths.edit(docId, 'templates'))
    }
  }

  return (
    <div className="min-h-dvh bg-bg">
      {mode === 'new' ? (
        <SiteNav />
      ) : (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-line-strong bg-bg/90 px-4 backdrop-blur-xl sm:px-6">
          <ButtonLink to={paths.edit(docId, 'templates')} variant="secondary">
            <ArrowLeft className="size-4" /> Back to editor
          </ButtonLink>
          <p className="hidden text-[14px] font-medium text-muted sm:block">Pick a new design. Your content and colours carry over.</p>
        </header>
      )}

      <div className="mx-auto max-w-[1200px] px-4 pb-24 pt-8 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">{mode === 'new' ? 'New resume' : 'Change template'}</p>
            <h1 className="font-display mt-3 text-[34px] leading-tight text-ink sm:text-[44px]">
              {mode === 'new' ? 'Choose your template' : 'Change template'}
            </h1>
            <p className="mt-3 max-w-xl text-[15.5px] text-muted">
              {SPECS.length} designs, each previewed with a different Indian professional’s resume. Pick one; you can restyle everything next.
            </p>
          </div>
          <div className="flex w-full items-center gap-2.5 lg:w-auto">
            <div className="relative min-w-0 flex-1 lg:w-80 lg:flex-none">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-faint" />
              <input
                value={base.q}
                onChange={(e) => setTemplateFilter({ q: e.target.value })}
                placeholder="Search by role, style or colour…"
                aria-label="Search templates"
                className="h-11 w-full rounded-xl border border-line-strong bg-surface pl-10 pr-9 text-[14.5px] outline-none placeholder:text-faint focus:border-brand focus:ring-4 focus:ring-brand/15"
              />
              {base.q && (
                <button type="button" onClick={() => setTemplateFilter({ q: '' })} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-faint hover:text-ink">
                  <X className="size-4" />
                </button>
              )}
            </div>
            <label className="relative hidden sm:block">
              <span className="sr-only">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11 appearance-none rounded-xl border border-line-strong bg-surface pl-3.5 pr-9 text-[14px] font-semibold text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/15"
              >
                <option value="popular">Most popular</option>
                <option value="ats">Most ATS-friendly</option>
                <option value="az">A – Z</option>
              </select>
              <SlidersHorizontal className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            </label>
            <Button variant="secondary" size="lg" className="lg:hidden" onClick={() => setDrawer(true)}>
              <Filter className="size-4" /> Filters{active > 0 && <span className="grid size-5 place-items-center rounded-full bg-brand text-[11px] text-brand-ink">{active}</span>}
            </Button>
          </div>
        </div>

        {/* quick category chips */}
        <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {(['All', ...CATEGORIES] as (Category | 'All')[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setTemplateFilter({ category: c })}
              className={cn('h-9 shrink-0 rounded-full border px-4 text-[13.5px] font-semibold transition-colors', base.category === c ? 'border-ink bg-ink text-bg' : 'border-line-strong bg-surface text-ink hover:bg-surface-2')}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 flex gap-10">
          <aside className="sticky top-24 hidden h-[calc(100dvh-7rem)] w-60 shrink-0 overflow-y-auto pr-2 scroll-thin lg:block" aria-label="Filters">
            <FilterPanel filters={filters} set={setFilters} total={list.length} />
          </aside>

          <section className="min-w-0 flex-1" aria-live="polite">
            <div className="mb-5 flex items-center justify-between text-[13.5px] text-muted">
              <span>
                <b className="text-ink">{list.length}</b> template{list.length === 1 ? '' : 's'}
              </span>
              {active > 0 && (
                <button type="button" onClick={clear} className="font-semibold text-brand hover:underline">
                  Clear filters
                </button>
              )}
            </div>
            {list.length ? (
              <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 xl:grid-cols-4">
                {list.map((s, i) => (
                  <Card key={s.id} spec={s} index={i} mode={mode} current={mode === 'switch' && s.id === current} onPreview={() => setPreview(s.id)} onUse={() => use(s.id)} />
                ))}
              </div>
            ) : (
              <div className="grid place-items-center rounded-2xl border border-dashed border-line-strong px-6 py-24 text-center">
                <Search className="size-8 text-faint" />
                <p className="mt-3 text-[17px] font-bold text-ink">No template matches</p>
                <p className="mt-1 text-[14px] text-muted">Try fewer filters or a different word.</p>
                <Button variant="soft" className="mt-5" onClick={clear}>
                  Clear all filters
                </Button>
              </div>
            )}
            {mode === 'new' && hasDoc && (
              <div className="mt-14 flex justify-center">
                <ButtonLink to={paths.home} variant="ghost">
                  <ArrowRight className="size-4 rotate-180" /> Back home
                </ButtonLink>
              </div>
            )}
          </section>
        </div>
      </div>

      <PreviewModal list={list} id={preview} onClose={() => setPreview(null)} onChange={setPreview} onUse={use} mode={mode} current={current} />

      {mode === 'new' && <SiteFooter />}

      <Modal open={drawer} onClose={() => setDrawer(false)} title="Filters" className="sm:max-w-md">
        <div className="p-5">
          <FilterPanel filters={filters} set={setFilters} total={list.length} />
          <Button variant="primary" size="lg" className="mt-4 w-full" onClick={() => setDrawer(false)}>
            Show {list.length} templates
          </Button>
        </div>
      </Modal>
    </div>
  )
}
