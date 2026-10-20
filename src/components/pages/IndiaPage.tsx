import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FileCheck2,
  FileSignature,
  Files,
  GraduationCap,
  HeartHandshake,
  Languages,
  Lock,
  MapPin,
  Palette,
  Plus,
  Quote,
  Ruler,
  ScanSearch,
  ScrollText,
  Sparkles,
  Trophy,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { animate, motion, useInView } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { paths } from '@/lib/routes'
import { PERSONAS } from '@/personas'
import { Chakra, Mandala, Rangoli, TricolorBar } from './IndiaArt'
import { IndiaMap } from './IndiaMap'
import { samplePlaces, type Place } from './indiaPlaces'
import { container, PageFrame } from './parts'

/* ───────────────────────── data ───────────────────────── */

type Tone = 'saffron' | 'navy' | 'green'
const TONE: Record<Tone, { bar: string; tile: string; text: string }> = {
  saffron: { bar: 'var(--saffron)', tile: 'bg-saffron-soft text-saffron-deep', text: 'text-saffron-deep' },
  navy: { bar: 'var(--navy)', tile: 'bg-navy-soft text-navy', text: 'text-navy' },
  green: { bar: 'var(--brand)', tile: 'bg-brand-soft text-brand', text: 'text-brand' },
}
const TONES: Tone[] = ['saffron', 'navy', 'green']

const REASONS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: GraduationCap, title: 'Campus first', text: 'Education-first templates with CGPA or percentage, on one page.' },
  { icon: FileCheck2, title: 'Indian sections', text: 'Personal details, Declaration, internships, NSS and NCC, one click away.' },
  { icon: Languages, title: 'Our languages', text: 'Nine Indian scripts and the rupee sign print correctly.' },
  { icon: ScanSearch, title: 'Job portals', text: 'Plain headings that Naukri and LinkedIn read as text.' },
  { icon: Ruler, title: 'A4 first', text: 'A4 by default, US Letter in one click.' },
  { icon: Lock, title: 'Free and private', text: 'No sign-up, no upload. Your data stays in your browser.' },
]

const SECTIONS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: UserRound, title: 'Personal details', text: 'Date of birth, nationality and address' },
  { icon: FileSignature, title: 'Declaration', text: 'The closing statement common on Indian CVs' },
  { icon: Briefcase, title: 'Internships', text: 'Summer and semester internships' },
  { icon: Users, title: 'Positions of responsibility', text: 'Clubs, councils and societies' },
  { icon: Trophy, title: 'Achievements', text: 'Ranks, hackathons and scholarships' },
  { icon: HeartHandshake, title: 'Volunteering', text: 'NGOs, NSS, NCC and community work' },
  { icon: Palette, title: 'Extra-curricular', text: 'Sports, cultural events and clubs' },
  { icon: BookOpen, title: 'Courses', text: 'MOOCs and training programmes' },
  { icon: ScrollText, title: 'Publications', text: 'Papers, patents and articles' },
  { icon: Sparkles, title: 'Hobbies and interests', text: 'A short, human touch' },
  { icon: Quote, title: 'References', text: 'Or simply "Available on request"' },
  { icon: Plus, title: 'Your own section', text: 'Write anything else you need' },
]

const SCRIPTS: { glyph: string; name: string; languages: string }[] = [
  { glyph: 'अ', name: 'Devanagari', languages: 'Hindi, Marathi, Nepali' },
  { glyph: 'அ', name: 'Tamil', languages: 'Tamil' },
  { glyph: 'అ', name: 'Telugu', languages: 'Telugu' },
  { glyph: 'অ', name: 'Bengali', languages: 'Bengali, Assamese' },
  { glyph: 'અ', name: 'Gujarati', languages: 'Gujarati' },
  { glyph: 'ਅ', name: 'Gurmukhi', languages: 'Punjabi' },
  { glyph: 'ಅ', name: 'Kannada', languages: 'Kannada' },
  { glyph: 'ଅ', name: 'Odia', languages: 'Odia' },
  { glyph: 'അ', name: 'Malayalam', languages: 'Malayalam' },
]

/* ───────────────────────── pieces ───────────────────────── */

function Heading({ eyebrow, title, sub, tone = 'saffron' }: { eyebrow: string; title: React.ReactNode; sub?: string; tone?: Tone }) {
  return (
    <div className="mb-10 max-w-2xl">
      <span className="eyebrow" style={tone === 'green' ? { background: 'var(--brand-soft)', color: 'var(--brand)', borderColor: 'transparent' } : undefined}>
        {eyebrow}
      </span>
      <h2 className="font-display mt-4 text-[32px] leading-[1.1] text-ink sm:text-[42px]">{title}</h2>
      {sub && <p className="mt-3 text-[16px] leading-relaxed text-muted">{sub}</p>}
    </div>
  )
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-bg">
      <TricolorBar className="absolute inset-x-0 top-0 z-10 !h-3" />
      <div aria-hidden className="jaali absolute inset-0 -z-10" />
      <div className={`${container} grid items-center gap-10 pb-16 pt-20 sm:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24`}>
        <div className="max-w-xl">
          <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
            Namaste. Made in India, for India.
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display mt-5 text-[40px] leading-[1.05] text-ink sm:text-[58px]"
          >
            A resume builder that understands <em>how India hires.</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted">
            Kriti is a Sanskrit word for a work, a creation. We built it for students, freshers and professionals across the country, from campus drives in Vellore to hiring in Patna and start-ups in Bengaluru.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={paths.templates()} variant="primary" size="lg" className="!rounded-full px-7">
              Create my resume <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink to={paths.templates({ style: 'Fresher' })} size="lg" className="!rounded-full border-navy/40 text-navy hover:bg-navy-soft">
              See fresher templates
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative mx-auto w-full max-w-[460px]">
          <Mandala className="w-full drop-shadow-[0_18px_40px_rgba(255,153,51,0.25)]" />
        </motion.div>
      </div>
    </section>
  )
}

/** A number that counts up from zero the first time it scrolls into view. */
function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])
  return (
    <span ref={ref} className={className} aria-label={String(to)}>
      <span aria-hidden>{n}</span>
    </span>
  )
}

function Stats({ cities, states }: { cities: number; states: number }) {
  const stats: { n: number; label: string; note: string; tone: Tone; icon: LucideIcon; bg: string; mark: React.ReactNode }[] = [
    {
      n: Object.keys(PERSONAS).length,
      label: 'professional resume templates',
      note: 'Each shown with an Indian professional',
      tone: 'saffron',
      icon: Files,
      bg: 'bg-gradient-to-br from-saffron-soft via-surface to-surface',
      mark: <Files className="size-28 text-saffron" strokeWidth={1} />,
    },
    {
      n: cities,
      label: `cities across ${states} states and union territories`,
      note: 'From Guwahati to Thiruvananthapuram',
      tone: 'navy',
      icon: MapPin,
      bg: 'bg-surface',
      mark: <Chakra className="size-28" color="var(--navy)" />,
    },
    {
      n: SCRIPTS.length,
      label: 'Indian scripts that print correctly',
      note: 'Hindi, Tamil, Telugu, Bengali and more',
      tone: 'green',
      icon: Languages,
      bg: 'bg-gradient-to-bl from-brand-soft via-surface to-surface',
      mark: <span className="font-display text-[110px] leading-none text-brand">{SCRIPTS[0].glyph}</span>,
    },
  ]
  return (
    <section className={`${container} relative z-10 -mt-8`}>
      <div className="grid overflow-hidden rounded-2xl border border-line shadow-pop sm:grid-cols-3">
        {stats.map((s, i) => {
          const tone = TONE[s.tone]
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08 }}
              className={`group relative isolate overflow-hidden p-5 ${s.bg} ${i > 0 ? 'border-t border-line sm:border-l sm:border-t-0' : ''}`}
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: tone.bar }} />
              <span aria-hidden className="pointer-events-none absolute -bottom-6 -right-5 -z-10 opacity-[0.08] transition-transform duration-700 group-hover:scale-105">
                {s.mark}
              </span>
              <span className={`grid size-9 place-items-center rounded-lg ${tone.tile}`}>
                <s.icon className="size-[18px]" />
              </span>
              <p className="mt-4 flex items-baseline gap-1">
                <CountUp to={s.n} className={`font-display text-[44px] leading-none tabular-nums ${tone.text}`} />
              </p>
              <p className="mt-2 text-[14.5px] font-bold leading-snug text-ink">{s.label}</p>
              <p className="mt-0.5 text-[12.5px] text-muted">{s.note}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function Why() {
  return (
    <section className={`${container} pt-24`}>
      <div className="relative isolate overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-saffron-soft via-surface to-brand-soft shadow-card">
        <TricolorBar className="h-2" />
        <Chakra className="pointer-events-none absolute -bottom-16 -left-14 -z-10 size-60 opacity-[0.06]" />
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="flex flex-col justify-center">
            <span className="eyebrow self-start">Why Kriti</span>
            <h2 className="font-display mt-4 text-[32px] leading-[1.1] text-ink sm:text-[42px]">
              Built for how India <em>hires.</em>
            </h2>
            <p className="mt-3 max-w-sm text-[15.5px] leading-relaxed text-muted">Six things we got right for the way people here apply.</p>
          </div>
          <ul>
            {REASONS.map((r, i) => {
              const tone = TONE[TONES[i % 3]]
              return (
                <motion.li
                  key={r.title}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 border-b border-line/80 py-3.5 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <r.icon className={`mt-0.5 size-6 shrink-0 ${tone.text}`} strokeWidth={1.9} />
                  <p className="text-[15.5px] leading-snug text-muted">
                    <b className="font-extrabold text-ink">{r.title}.</b> {r.text}
                  </p>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

const PILL_TONE: Record<Tone, string> = {
  saffron: '[--t:var(--saffron)] [--tt:var(--saffron-deep)]',
  navy: '[--t:var(--navy)] [--tt:var(--navy)]',
  green: '[--t:var(--brand)] [--tt:var(--brand)]',
}

function SectionsBlock() {
  // hover, focus or tap a section to read what it is for
  const [open, setOpen] = useState<number | null>(null)
  const s = open === null ? null : SECTIONS[open]
  return (
    <section className={`${container} pt-20`}>
      <div className="relative isolate overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
        <div aria-hidden className="jaali pointer-events-none absolute inset-0 -z-10 opacity-40" />
        <Rangoli className="mt-3" />
        <div className="p-6 pt-5 sm:px-10 sm:pb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">Indian resume sections</span>
              <h2 className="font-display mt-3 text-[28px] leading-[1.1] text-ink sm:text-[36px]">
                Add what Indian recruiters <em>look for.</em>
              </h2>
            </div>
            <ButtonLink to={paths.templates()} variant="primary" className="shrink-0 self-start !rounded-full px-6 sm:self-auto">
              Try it in a template <ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2.5">
            {SECTIONS.map((x, i) => (
              <li key={x.title}>
                <button
                  type="button"
                  onMouseEnter={() => setOpen(i)}
                  onMouseLeave={() => setOpen(null)}
                  onFocus={() => setOpen(i)}
                  onBlur={() => setOpen(null)}
                  onClick={() => setOpen(i)}
                  aria-describedby="india-section-hint"
                  className={`inline-flex items-center gap-2 rounded-full border border-line bg-surface py-2 pl-3 pr-4 text-[14px] font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--tt)] hover:bg-[var(--tt)] hover:text-[var(--brand-ink)] hover:shadow-card focus-visible:border-[var(--tt)] focus-visible:bg-[var(--tt)] focus-visible:text-[var(--brand-ink)] ${PILL_TONE[TONES[i % 3]]} ${open === i ? '!border-[var(--tt)] !bg-[var(--tt)] !text-[var(--brand-ink)]' : ''}`}
                >
                  <x.icon className={`size-4 ${open === i ? '' : 'text-[var(--tt)]'}`} strokeWidth={2} />
                  {x.title}
                </button>
              </li>
            ))}
          </ul>

          <p id="india-section-hint" className="mt-4 min-h-6 text-[14.5px] text-muted" aria-live="polite">
            {s ? (
              <>
                <b className="font-extrabold text-ink">{s.title}.</b> {s.text}.
              </>
            ) : (
              'Point to a section to see what it is for.'
            )}
          </p>
        </div>
      </div>
    </section>
  )
}

function Scripts() {
  return (
    <section className={`${container} pt-24`}>
      <Heading
        eyebrow="Our scripts"
        title={<>Write it in <em>your language.</em></>}
        sub="Names, schools and addresses in nine Indian scripts print correctly in the PDF, so a resume for a local government office or a regional employer reads just as well as an English one."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
        {SCRIPTS.map((s, i) => {
          const tone = TONE[TONES[i % 3]]
          return (
            <div key={s.name} className="rounded-2xl border border-line bg-surface p-4 text-center shadow-card">
              <span className={`mx-auto grid size-14 place-items-center rounded-full text-[28px] font-semibold leading-none ${tone.tile}`} aria-hidden>
                {s.glyph}
              </span>
              <p className="mt-3 text-[14px] font-bold text-ink">{s.name}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted">{s.languages}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Places({ places }: { places: Map<string, Place> }) {
  return (
    <section className={`${container} pt-24`}>
      <Heading
        eyebrow="From every corner"
        title={<>Professional resume templates <em>across India.</em></>}
        sub="Every template is designed for a real Indian profession and shown with a professional from a different city: a nurse in Thiruvananthapuram, a game developer in Hyderabad, a chartered accountant in Kolkata. Each marker shows how many templates are set in that city. Point to one to see them."
      />
      <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-saffron-soft via-surface to-brand-soft p-5 shadow-card sm:p-8">
        <div aria-hidden className="jaali pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative">
          <IndiaMap places={places} />
        </div>
        <p className="relative mt-6 text-center text-[11.5px] text-faint">Map outlines by DataMeet, drawn from India&rsquo;s official state boundaries. For illustration only; not to scale.</p>
      </div>
    </section>
  )
}

function Belief() {
  return (
    <section className={`${container} pt-24`}>
      <div className="relative isolate overflow-hidden rounded-3xl border border-saffron/40 bg-saffron-soft px-6 py-14 text-center sm:px-14">
        <Chakra className="absolute -right-16 -top-16 -z-10 size-64 opacity-[0.07]" />
        <Chakra className="absolute -bottom-20 -left-16 -z-10 size-56 opacity-[0.07]" />
        <p className="font-display mx-auto max-w-3xl text-[28px] leading-[1.25] text-ink sm:text-[38px]">
          Your first resume should not depend on a senior&rsquo;s old file. It should be <em>yours</em>, and it should look like you mean business.
        </p>
        <p className="mt-5 text-[15px] font-semibold text-saffron-deep">The idea behind Kriti</p>
      </div>
    </section>
  )
}

function Finale() {
  return (
    <section className={`${container} pt-24 pb-4`}>
      <div className="relative isolate overflow-hidden rounded-3xl border border-line bg-surface text-center shadow-pop">
        <TricolorBar className="h-3" />
        <Mandala className="absolute left-1/2 top-1/2 -z-10 w-[560px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.12]" />
        <div className="px-6 py-14 sm:px-12">
          <h2 className="font-display mx-auto max-w-2xl text-[34px] leading-[1.1] text-ink sm:text-[46px]">
            Ready to build <em>your</em> resume?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-muted">Pick a template with a sample like you, add your details and download a PDF. Free, with no watermark.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink to={paths.templates()} variant="primary" size="lg" className="!rounded-full px-8">
              Create my resume <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink to={paths.home} size="lg" className="!rounded-full border-navy/40 text-navy hover:bg-navy-soft">
              Back home
            </ButtonLink>
          </div>
        </div>
        <TricolorBar className="h-3" />
      </div>
    </section>
  )
}

export function IndiaPage() {
  const places = useMemo(() => samplePlaces(), [])
  return (
    <PageFrame>
      <div className="theme-india">
        <Hero />
        <Stats cities={places.cities} states={places.states} />
        <Why />
        <Scripts />
        <Places places={places.byCity} />
        <SectionsBlock />
        <Belief />
        <Finale />
      </div>
    </PageFrame>
  )
}
