import { ArrowRight, Check, Download, FilePlus2, Layers, LayoutGrid, PenLine, Quote, Sparkles } from 'lucide-react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionStyle, type MotionValue } from 'motion/react'
import { useMemo, useState } from 'react'
import banners from 'virtual:banners'
import { useNavigate } from 'react-router'
import { BannerCarousel } from '@/components/home/BannerCarousel'
import { Faq } from '@/components/home/Faq'
import { CtaBand } from '@/components/pages/CtaBand'
import { container, PageFrame, SectionHead } from '@/components/pages/parts'
import { TemplateImage } from '@/components/templates/TemplateImage'
import { Button, ButtonLink } from '@/components/ui/Button'
import { layoutOf } from '@/lib/templateFilter'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { SPECS, type Category, type TemplateSpec } from '@/pdf/specs'
import { useStore } from '@/store'

/* ─────────── hero visual ─────────── */

/** One layer of the hero picture; it drifts a little with the pointer, deeper layers drifting more. */
function Layer({ depth, mx, my, className, style, children }: { depth: number; mx: MotionValue<number>; my: MotionValue<number>; className?: string; style?: MotionStyle; children: React.ReactNode }) {
  const x = useTransform(mx, [-0.5, 0.5], [-depth, depth])
  const y = useTransform(my, [-0.5, 0.5], [-depth, depth])
  return (
    <motion.div className={className} style={{ ...style, x, y }}>
      {children}
    </motion.div>
  )
}

/** The fan: five professional resumes (classic, corporate, executive), the blue-banded Summit in front. Each lifts to the front when you point at it. */
const FAN: { id: string; w: number; left: number; top: number; rotate: number; z: number; depth: number }[] = [
  { id: 'harvard', w: 172, left: -12, top: 104, rotate: -14, z: 1, depth: 8 },
  { id: 'meridian', w: 172, left: 382, top: 104, rotate: 14, z: 1, depth: 8 },
  { id: 'anchor', w: 192, left: 60, top: 50, rotate: -7, z: 2, depth: 14 },
  { id: 'executive', w: 192, left: 290, top: 50, rotate: 7, z: 2, depth: 14 },
  { id: 'summit', w: 244, left: 148, top: 0, rotate: 0, z: 3, depth: 22 },
]

function HeroVisual() {
  const mx = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 })
  const my = useSpring(useMotionValue(0), { stiffness: 80, damping: 18 })
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div onMouseMove={onMove} onMouseLeave={reset} className="relative isolate mx-auto hidden h-[470px] w-full max-w-[540px] lg:block">
      {FAN.map((c, i) => (
        <Layer key={c.id} depth={c.depth} mx={mx} my={my} className="absolute" style={{ left: c.left, top: c.top, width: c.w, rotate: c.rotate, zIndex: c.z }}>
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -14, scale: 1.06, zIndex: 20 }}
            transition={{ delay: 0.12 + i * 0.09, type: 'spring', stiffness: 130, damping: 18 }}
            style={{ position: 'relative' }}
          >
            <div className={c.id === 'summit' ? 'animate-float' : 'animate-float-slow'} style={{ animationDelay: `${i * 0.5}s` }}>
              <div className="proof overflow-hidden !rounded-xl !shadow-[0_26px_50px_-20px_rgba(12,34,24,0.5)]">
                <TemplateImage id={c.id} width={c.w + 40} eager alt={`${c.id} resume template`} />
              </div>
            </div>
          </motion.div>
        </Layer>
      ))}
    </div>
  )
}

/* ─────────── hero ─────────── */

function Hero() {
  return (
    <section className="hero-banner relative isolate overflow-hidden border-b border-line">
      {/* pale circles and a fine dot texture give the light colour some depth */}
      <div aria-hidden className="absolute -left-40 -top-48 -z-10 size-[520px] rounded-full bg-brand/[0.06]" />
      <div aria-hidden className="absolute -bottom-56 left-[40%] -z-10 size-[560px] rounded-full bg-brand/[0.05]" />
      <div aria-hidden className="absolute -right-44 top-6 -z-10 size-[520px] rounded-full bg-brand/[0.07]" />
      <div aria-hidden className="absolute inset-0 -z-10 text-brand/25" style={{ backgroundImage: 'radial-gradient(currentColor 1.1px, transparent 1.1px)', backgroundSize: '28px 28px', maskImage: 'linear-gradient(to right, transparent 40%, #000)', WebkitMaskImage: 'linear-gradient(to right, transparent 40%, #000)' }} />

      <div className={cn(container, 'grid items-center gap-12 pb-16 pt-12 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24')}>
        <div className="max-w-xl">
          <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
            Free for students and freshers
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="font-display mt-5 text-[42px] leading-[1.05] text-ink sm:text-[60px]">
            Build a resume you are <em>proud of.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
            Pick a template, type in your details and download a clean PDF. No sign-up, no watermark.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink to={paths.templates()} variant="primary" size="lg" className="!rounded-full px-7">
              <FilePlus2 className="size-4" /> Create my resume
            </ButtonLink>
          </motion.div>

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-medium text-muted">
            {['Free PDF download', 'No account needed', 'Works with job portals'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span className="grid size-5 place-items-center rounded-full bg-brand-soft text-brand">
                  <Check className="size-3" strokeWidth={3.5} />
                </span>
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}

/* ─────────── the idea behind Kriti ─────────── */

function Belief() {
  return (
    <section className={`${container} pt-16`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        className="relative isolate overflow-hidden rounded-3xl border border-line bg-surface-2 px-6 py-14 text-center sm:px-14"
      >
        <Quote aria-hidden className="absolute -left-4 -top-4 -z-10 size-40 text-brand opacity-[0.07]" strokeWidth={1.2} />
        <Quote aria-hidden className="absolute -bottom-6 -right-4 -z-10 size-40 rotate-180 text-brand opacity-[0.07]" strokeWidth={1.2} />
        <p className="font-display mx-auto max-w-3xl text-[28px] leading-[1.25] text-ink sm:text-[38px]">
          Your first resume should not depend on a senior&rsquo;s old file. It should be <em>yours</em>, and it should look like you mean business.
        </p>
        <p className="mt-5 text-[15px] font-semibold text-brand">The idea behind Kriti</p>
      </motion.div>
    </section>
  )
}

/* ─────────── three simple steps ─────────── */

/** Tiny drawings that sit at the top of each step card. */
function ArtPick() {
  /** Three little drawn sheets in different layouts (plain shapes, so this card costs no template renders). */
  const sheets = [
    { rotate: -12, x: -64, y: 10, z: 1, kind: 'serif' },
    { rotate: 0, x: 0, y: -4, z: 3, kind: 'band' },
    { rotate: 12, x: 64, y: 10, z: 1, kind: 'side' },
  ] as const
  return (
    <div className="relative h-full w-full">
      {sheets.map((s) => (
        <div key={s.kind} className="absolute left-1/2 top-1/2 w-[92px] transition-transform duration-500 group-hover:scale-105" style={{ transform: `translate(calc(-50% + ${s.x}px), calc(-50% + ${s.y}px)) rotate(${s.rotate}deg)`, zIndex: s.z }}>
          <div className="relative aspect-[1/1.4142] overflow-hidden rounded-lg border border-line bg-white p-2 shadow-[0_14px_26px_-12px_rgba(12,34,24,0.45)]">
            {s.kind === 'band' && <i className="absolute inset-x-0 top-0 block h-[26%] bg-brand" />}
            {s.kind === 'side' && <i className="absolute inset-y-0 left-0 block w-[30%] bg-[#1e293b]" />}
            <div className={s.kind === 'side' ? 'ml-[34%]' : s.kind === 'band' ? 'pt-[22%]' : 'text-center'}>
              <i className={`mb-1.5 block h-1.5 rounded-full ${s.kind === 'serif' ? 'mx-auto w-10 bg-ink/80' : 'w-10 bg-ink/80'}`} />
              {s.kind === 'serif' && <i className="mx-auto mb-2 block h-px w-14 bg-ink/40" />}
              {[100, 86, 94, 70, 90, 62, 80].map((w, i) => (
                <i key={i} className={`mb-1 block h-[3px] rounded-full ${i === 2 || i === 5 ? 'mt-2 bg-brand/60' : 'bg-line-strong'} ${s.kind === 'serif' ? 'mx-auto' : ''}`} style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ArtFill() {
  const rows = [
    { label: 'Full name', value: 'Ananya Iyer' },
    { label: 'Email', value: 'ananya@mail.com' },
    { label: 'Skills', value: 'Excel, Tally', active: true },
  ]
  return (
    <div className="mx-auto flex h-full w-[200px] flex-col justify-center gap-2">
      {rows.map((r) => (
        <div key={r.label}>
          <p className="mb-0.5 text-[9.5px] font-bold uppercase tracking-wider text-faint">{r.label}</p>
          <div className={`flex h-7 items-center rounded-lg border bg-surface px-2.5 text-[12px] font-semibold text-ink shadow-sm transition-colors ${r.active ? 'border-brand ring-4 ring-brand/15' : 'border-line-strong'}`}>
            {r.value}
            {r.active && <span className="ml-0.5 inline-block h-3.5 w-px animate-pulse bg-brand" />}
          </div>
        </div>
      ))}
    </div>
  )
}

function ArtDownload() {
  return (
    <div className="relative mx-auto grid h-full w-[150px] place-items-center">
      <div className="relative w-[104px] rounded-xl border border-line bg-surface p-3 shadow-[0_16px_30px_-14px_rgba(12,34,24,0.4)] transition-transform duration-500 group-hover:-translate-y-1">
        <span className="absolute -right-2.5 -top-2.5 rounded-md bg-brand px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-brand-ink shadow">PDF</span>
        <div className="space-y-1.5">
          <i className="block h-2 w-14 rounded-full bg-ink/80" />
          <i className="block h-1.5 w-9 rounded-full bg-brand/70" />
          {[20, 17, 19, 14].map((w, i) => (
            <i key={i} className="block h-1 rounded-full bg-line-strong" style={{ width: `${w * 4}%`, maxWidth: '100%' }} />
          ))}
        </div>
        <span className="absolute -bottom-3 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full bg-brand text-brand-ink shadow-lg ring-4 ring-surface">
          <Download className="size-[18px]" />
        </span>
      </div>
    </div>
  )
}

function Steps() {
  const steps = [
    { icon: Layers, art: <ArtPick />, title: 'Pick a template', text: `Choose from ${SPECS.length} layouts. Each one is shown with a real-looking sample.` },
    { icon: PenLine, art: <ArtFill />, title: 'Add your details', text: 'Fill in a simple form. You see your resume update live as you type.' },
    { icon: Download, art: <ArtDownload />, title: 'Download the PDF', text: 'Check your score, then download. Links in the PDF are clickable.' },
  ]
  return (
    <section className={`${container} pt-20`}>
      <SectionHead title="Done in three steps" sub="No design skills needed." />
      <div className="relative grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="relative">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.09 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-pop"
            >
              {/* picture */}
              <div className="relative h-[200px] overflow-hidden bg-surface-2">
                <div aria-hidden className="absolute -right-10 -top-12 size-44 rounded-full bg-brand/10 transition-transform duration-500 group-hover:scale-110" />
                <div aria-hidden className="absolute -bottom-16 -left-10 size-40 rounded-full bg-brand/[0.07]" />
                <div className="relative h-full" aria-hidden>
                  {s.art}
                </div>
              </div>

              {/* words */}
              <div className="relative flex flex-1 flex-col p-6 pt-7">
                <span className="font-display absolute -top-7 right-5 select-none text-[76px] leading-none text-brand/15 transition-colors group-hover:text-brand/30">{i + 1}</span>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-bold text-brand">
                  <s.icon className="size-3.5" /> Step {i + 1}
                </span>
                <h3 className="mt-3 text-[20px] font-extrabold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{s.text}</p>
              </div>
            </motion.article>
            {/* a small arrow in the gap, pointing at the next card */}
            {i < steps.length - 1 && (
              <span aria-hidden className="absolute -right-[28px] top-[84px] z-10 hidden size-8 place-items-center rounded-full border border-line bg-surface text-brand shadow-card md:grid">
                <ArrowRight className="size-4" />
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─────────── popular templates ─────────── */

type TabId = 'top' | Category
const TABS: { id: TabId; label: string; hint: string }[] = [
  { id: 'top', label: 'Top picks', hint: 'Our most popular layouts to start with' },
  { id: 'Fresher', label: 'Freshers', hint: 'Education first, fits on one page' },
  { id: 'Tech', label: 'Tech', hint: 'For developers, analysts and engineers' },
  { id: 'Professional', label: 'Professional', hint: 'Clean and safe for any office job' },
  { id: 'Creative', label: 'Creative', hint: 'For design, media and marketing' },
  { id: 'Executive', label: 'Executive', hint: 'Senior roles and leadership' },
]

const LAYOUT_LABEL = { 'One column': 'One column', 'Two column': 'Two columns', Sidebar: 'Side panel' } as const

function pick(tab: TabId) {
  const ranked = [...SPECS].sort((a, b) => b.popular - a.popular)
  return (tab === 'top' ? ranked : ranked.filter((s) => s.category === tab)).slice(0, 4)
}

function TemplateCard({ spec, index, topPick, onUse }: { spec: TemplateSpec; index: number; topPick: boolean; onUse: () => void }) {
  const facts = [spec.ats >= 4 ? 'ATS-friendly' : null, LAYOUT_LABEL[layoutOf(spec)], spec.photo ? 'With photo' : null].filter(Boolean) as string[]
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="group relative flex flex-col rounded-2xl border border-line bg-surface p-3 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-pop"
    >
      <button type="button" onClick={onUse} aria-label={`Use the ${spec.name} template`} className="relative block overflow-hidden rounded-xl bg-surface-2 p-3 text-left">
        <div className="proof overflow-hidden !rounded-lg transition-transform duration-500 group-hover:scale-[1.03]">
          <TemplateImage id={spec.id} width={300} />
        </div>
        {topPick && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[11.5px] font-extrabold text-brand-ink shadow">
            <Sparkles className="size-3" /> Top pick
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-extrabold text-ink">{spec.name}</h3>
            <p className="line-clamp-2 min-h-[2.4em] text-[13px] leading-snug text-muted">{spec.tagline}</p>
          </div>
          <span className="inline-flex shrink-0 gap-[3px] pt-1.5" title={`ATS compatibility ${spec.ats} out of 5`} aria-label={`ATS compatibility ${spec.ats} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <i key={i} className={cn('block size-1.5 rounded-full', i < spec.ats ? 'bg-brand' : 'bg-surface-3')} />
            ))}
          </span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {facts.map((f) => (
            <li key={f} className="rounded-full bg-surface-2 px-2.5 py-1 text-[11.5px] font-semibold text-muted">
              {f}
            </li>
          ))}
        </ul>
        <Button variant="primary" className="mt-4 w-full !rounded-xl" onClick={onUse}>
          Use this template <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </motion.article>
  )
}

function Popular() {
  const navigate = useNavigate()
  const startDoc = useStore((s) => s.startDoc)
  const [tab, setTab] = useState<TabId>('top')
  const list = useMemo(() => pick(tab), [tab])
  const current = TABS.find((x) => x.id === tab)!
  const use = (id: string) => navigate(paths.edit(startDoc(id), 'design'))
  const best = list[0]

  return (
    <section className={`${container} pt-24`}>
      <div className="relative isolate overflow-hidden rounded-[28px] border border-line bg-surface-2 px-4 py-8 sm:px-8 sm:py-10">
        <div aria-hidden className="absolute -right-24 -top-28 -z-10 size-80 rounded-full bg-brand/[0.07]" />
        <div aria-hidden className="absolute -bottom-32 -left-20 -z-10 size-80 rounded-full bg-brand/[0.05]" />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-[28px] leading-tight text-ink sm:text-[34px]">Popular templates</h2>
            <p className="mt-1.5 text-[15.5px] text-muted">Tell us who you are and we will show the layouts that suit you. You can change it any time.</p>
          </div>
          <ButtonLink to={paths.templates()} variant="secondary" className="hidden shrink-0 !rounded-full lg:inline-flex">
            Browse all {SPECS.length} <ArrowRight className="size-4" />
          </ButtonLink>
        </div>

        {/* on phones the way into the whole gallery comes first, as a full-width button */}
        <ButtonLink to={paths.templates()} variant="primary" size="lg" className="mt-5 w-full !rounded-full shadow-card lg:hidden">
          <LayoutGrid className="size-4" /> Browse all {SPECS.length} templates <ArrowRight className="size-4" />
        </ButtonLink>

        {/* who is it for */}
        <div role="tablist" aria-label="Who is the resume for" className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {TABS.map((x) => {
            const on = tab === x.id
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setTab(x.id)}
                className={cn(
                  'relative shrink-0 rounded-full border px-4 py-2 text-[14px] font-bold transition-colors',
                  on ? 'border-transparent text-brand-ink' : 'border-line-strong bg-surface text-ink hover:border-brand/50 hover:text-brand',
                )}
              >
                {on && <motion.span layoutId="popular-tab" className="absolute inset-0 -z-0 rounded-full bg-brand" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span className="relative">{x.label}</span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 text-[13.5px] font-medium text-muted" aria-live="polite">
          {current.hint}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} exit={{ opacity: 0, transition: { duration: 0.12 } }} role="tabpanel" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((s, i) => (
              <TemplateCard key={s.id} spec={s} index={i} topPick={tab === 'top' && i === 0} onUse={() => use(s.id)} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* reassurance and a default choice */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 sm:flex-row">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            {['Free to use', 'No sign-up', 'Change the template any time'].map((x) => (
              <li key={x} className="flex items-center gap-1.5 text-[13.5px] font-semibold text-muted">
                <span className="grid size-4.5 place-items-center rounded-full bg-brand-soft text-brand">
                  <Check className="size-3" strokeWidth={3.5} />
                </span>
                {x}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-[13.5px] text-muted">Not sure?</span>
            <Button variant="primary" size="sm" className="!rounded-full" onClick={() => use(best.id)}>
              Start with {best.name} <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Home() {
  return (
    <PageFrame>
      {banners.length ? <BannerCarousel banners={banners} /> : <Hero />}
      <Belief />
      <Steps />
      <Popular />
      <Faq />
      <CtaBand />
    </PageFrame>
  )
}
