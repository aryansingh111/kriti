import { Check, ChevronDown, Info, FileText, Image as ImageIcon, Link2, Mail, MapPin, Phone, RotateCcw, Ruler, Type, Wand2, Palette as PaletteIcon, Shapes, ListChecks } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Segmented } from '@/components/ui/Segmented'
import { Slider } from '@/components/ui/Slider'
import { Toggle } from '@/components/ui/Toggle'
import { fitToOnePage } from '@/lib/fit'
import { FONT_PAIRS } from '@/lib/fontpairs'
import { ACCENT_SWATCHES, PALETTES, TONE_SWATCHES } from '@/lib/palettes'
import { cn } from '@/lib/utils'
import { FONT_OPTIONS } from '@/pdf/fontMeta'
import { specFor, type TemplateSpec } from '@/pdf/specs'
import {
  BULLET_OPTIONS,
  ENTRY_OPTIONS,
  HEADING_OPTIONS,
  ICON_OPTIONS,
  SKILL_OPTIONS,
  type BulletKind,
  type EntryKind,
  type HeadingKind,
  type IconSet,
  type SkillKind,
} from '@/pdf/styles'
import { useStore } from '@/store'
import { TEXT_ROLES, TEXT_ROLE_INFO, type FontId, type Settings, type TextRole } from '@/types'
import { ColourInput, Swatch, TextColourRow } from '../ColourPicker'
import { PanelShell } from './PanelShell'

/* ─────────── building blocks ─────────── */

function Group({ icon: Icon, title, hint, children, action }: { icon: typeof Type; title: string; hint?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-4">
      <header className="mb-3.5 flex items-start gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-bold leading-tight text-ink">{title}</h3>
          {hint && <p className="mt-0.5 text-[12px] leading-snug text-muted">{hint}</p>}
        </div>
        {action}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Label({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between text-[12px] font-semibold text-muted">
      <span>{children}</span>
      {right}
    </div>
  )
}

const Tick = () => (
  <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-brand text-brand-ink">
    <Check className="size-2.5" strokeWidth={3.5} />
  </span>
)

/** A grid of selectable tiles, each with a small drawn sample. `null` = "template's own". */
function Options<T extends string>({
  value,
  onChange,
  options,
  auto,
  cols = 3,
  tall,
}: {
  value: T | null
  onChange: (v: T | null) => void
  options: { id: T; label: string; visual: ReactNode; hint?: string }[]
  auto?: { label: string; visual: ReactNode }
  cols?: 2 | 3 | 4
  tall?: boolean
}) {
  const all = [...(auto ? [{ id: null as T | null, label: auto.label, visual: auto.visual, hint: undefined as string | undefined }] : []), ...options]
  return (
    <div className={cn('grid gap-2', cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-4' : 'grid-cols-3')}>
      {all.map((o) => {
        const active = (value ?? null) === o.id
        return (
          <button
            key={o.id ?? 'auto'}
            type="button"
            title={o.hint}
            aria-pressed={active}
            onClick={() => onChange(o.id)}
            className={cn(
              'group relative flex flex-col overflow-hidden rounded-lg border text-left transition-all',
              active ? 'border-brand bg-brand-soft/60 ring-2 ring-brand/25' : 'border-line hover:border-line-strong hover:bg-surface-2',
            )}
          >
            <span className={cn('grid place-items-center px-2 pt-2.5', tall ? 'h-[52px]' : 'h-[40px]')}>{o.visual}</span>
            <span className={cn('truncate px-2 pb-2 pt-1 text-center text-[11.5px] font-semibold', active ? 'text-brand' : 'text-muted group-hover:text-ink')}>{o.label}</span>
            {active && <Tick />}
          </button>
        )
      })}
    </div>
  )
}

const Bar = ({ w, h = 3, c = 'bg-faint/70', className }: { w: number | string; h?: number; c?: string; className?: string }) => (
  <i className={cn('block shrink-0 rounded-full', c, className)} style={{ width: w, height: h }} />
)

/* ─────────── colours ─────────── */

const COLOURED_HEADINGS = new Set<string>(['bar', 'pill', 'dot', 'plain', 'num', 'underline', 'filled', 'tab', 'box', 'slash'])

/** Does the current template + chosen styles draw the accent colour anywhere? (Classic ink-only layouts don't.) */
function accentShows(spec: TemplateSpec, s: Settings): boolean {
  if (spec.layout.kind === 'sidebar') return true
  const h = spec.header
  if ((h.kind ?? 'plain') !== 'plain' || h.twoTone || h.accentBar || h.nameColor === 'accent' || h.titleColor === 'accent' || (h.rule && h.rule !== 'none')) return true
  for (const st of [spec.main, spec.aside]) {
    if (!st) continue
    if (COLOURED_HEADINGS.has(s.headingStyle ?? st.heading) || st.headingColor === 'accent' || (st.entryAccent ?? 'accent') === 'accent') return true
    if (['tags', 'outline', 'solid', 'bars', 'dots'].includes(s.skillStyle ?? st.skills)) return true
  }
  return false
}

function Colours() {
  const settings = useStore((s) => s.settings)
  const accent = useStore((s) => s.settings.accent)
  const tone = useStore((s) => s.settings.tone)
  const template = useStore((s) => s.settings.template)
  const setSettings = useStore((s) => s.setSettings)
  const spec = specFor(template)
  const curAccent = (accent ?? spec.accent).toLowerCase()
  const curTone = (tone ?? spec.tone ?? '#1f2937').toLowerCase()
  const showsAccent = accentShows(spec, settings)
  const usesTone =
    spec.layout.kind === 'sidebar' ||
    (spec.header.kind ?? 'plain') !== 'plain' ||
    !!spec.tone ||
    spec.main.headingColor === 'tone' ||
    spec.aside?.headingColor === 'tone' ||
    spec.header.nameColor === 'tone'

  return (
    <Group
      icon={PaletteIcon}
      title="Colour"
      hint="Pick a ready-made palette or mix your own."
      action={
        (accent || tone) && (
          <Button size="sm" variant="ghost" onClick={() => setSettings({ accent: null, tone: null })}>
            <RotateCcw className="size-3.5" /> Reset
          </Button>
        )
      }
    >
      {!showsAccent && (
        <p className="flex gap-2 rounded-lg bg-warn/10 px-3 py-2.5 text-[12.5px] leading-snug text-ink">
          <Info className="mt-0.5 size-4 shrink-0 text-warn" />
          <span>
            {spec.name} is black-and-white by design, so colours won’t show yet. Try the <b>Pill</b>, <b>Side bar</b> or <b>Short underline</b> heading style below to bring colour in.
          </span>
        </p>
      )}
      <div>
        <Label>Palettes</Label>
        <div className="grid grid-cols-4 gap-2">
          {PALETTES.map((p) => {
            const active = curAccent === p.accent.toLowerCase() && (!usesTone || curTone === p.tone.toLowerCase())
            return (
              <button
                key={p.id}
                type="button"
                title={p.name}
                aria-label={p.name}
                aria-pressed={active}
                onClick={() => setSettings({ accent: p.accent, tone: p.tone })}
                className={cn(
                  'group relative overflow-hidden rounded-lg border p-1.5 transition-all',
                  active ? 'border-brand ring-2 ring-brand/25' : 'border-line hover:border-line-strong',
                )}
              >
                <span className="flex h-8 overflow-hidden rounded-md">
                  <span className="flex-1" style={{ background: p.tone }} />
                  <span className="flex-1" style={{ background: p.accent }} />
                </span>
                <span className="mt-1 block truncate text-center text-[10.5px] font-semibold text-muted group-hover:text-ink">{p.name}</span>
                {active && <Tick />}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <Label right={<span className="font-mono text-[11px] text-faint">{curAccent}</span>}>Accent colour</Label>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setSettings({ accent: null })}
            aria-pressed={!accent}
            className={cn('h-7 rounded-full border px-2.5 text-[11.5px] font-semibold', !accent ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted hover:text-ink')}
          >
            Template’s
          </button>
          {ACCENT_SWATCHES.map((c) => (
            <Swatch key={c} color={c} label={c} active={curAccent === c} onClick={() => setSettings({ accent: c })} />
          ))}
          <ColourInput value={curAccent} onChange={(c) => setSettings({ accent: c })} />
        </div>
      </div>

      {usesTone && (
        <div>
          <Label right={<span className="font-mono text-[11px] text-faint">{curTone}</span>}>Header / sidebar colour</Label>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSettings({ tone: null })}
              aria-pressed={!tone}
              className={cn('h-7 rounded-full border px-2.5 text-[11.5px] font-semibold', !tone ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted hover:text-ink')}
            >
              Template’s
            </button>
            {TONE_SWATCHES.map((c) => (
              <Swatch key={c} color={c} label={c} active={curTone === c} onClick={() => setSettings({ tone: c })} />
            ))}
            <ColourInput value={curTone} onChange={(c) => setSettings({ tone: c })} />
          </div>
        </div>
      )}
    </Group>
  )
}

/* ─────────── text colours ─────────── */

/** Colour for each kind of text: name, headings, body, dates... Changes apply to the whole resume. */
function TextColours() {
  const textColors = useStore((s) => s.settings.textColors)
  const blockColors = useStore((s) => s.settings.blockColors)
  const setTextColor = useStore((s) => s.setTextColor)
  const resetTextColors = useStore((s) => s.resetTextColors)
  const [open, setOpen] = useState<TextRole | null>(null)
  const any = Object.keys(textColors).length > 0 || Object.keys(blockColors).length > 0

  return (
    <Group
      icon={Type}
      title="Text colours"
      hint="Colour any kind of text. To colour just one part, click it in the preview and use the colour button."
      action={
        any && (
          <Button size="sm" variant="ghost" onClick={resetTextColors}>
            <RotateCcw className="size-3.5" /> Reset
          </Button>
        )
      }
    >
      <ul className="-mx-1 divide-y divide-line">
        {TEXT_ROLES.map((role) => {
          const info = TEXT_ROLE_INFO[role]
          const value = textColors[role]
          const isOpen = open === role
          return (
            <li key={role}>
              <button type="button" onClick={() => setOpen(isOpen ? null : role)} aria-expanded={isOpen} className="flex w-full items-center gap-3 rounded-lg px-1 py-2.5 text-left hover:bg-surface-2">
                <span className="grid size-8 shrink-0 place-items-center rounded-md border border-line bg-white text-[15px] font-extrabold" style={{ color: value ?? '#111827' }}>
                  Aa
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-bold leading-tight text-ink">{info.label}</span>
                  <span className="block truncate text-[12px] text-muted">{info.hint}</span>
                </span>
                {value ? (
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
                    <i className="block size-3.5 rounded-full ring-1 ring-black/10" style={{ background: value }} />
                    {value}
                  </span>
                ) : (
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-faint">Template</span>
                )}
                <ChevronDown className={cn('size-4 shrink-0 text-muted transition-transform', isOpen && 'rotate-180')} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.16 }} className="overflow-hidden">
                    <div className="px-1 pb-3 pt-1">
                      <TextColourRow value={value} onChange={(c) => setTextColor(role, c)} onClear={() => setTextColor(role, null)} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
      <p className="flex gap-2 text-[12px] leading-snug text-muted">
        <Info className="mt-0.5 size-3.5 shrink-0 text-faint" />
        Text on a dark panel or header keeps its light colour here, so it never disappears. Click that block in the preview to colour it yourself.
      </p>
    </Group>
  )
}

/* ─────────── typography ─────────── */

function useUiFonts() {
  useEffect(() => {
    void import('@/fontsUi')
  }, [])
}

function FontSelect({ label, value, onChange, templateFont }: { label: string; value: FontId | null; onChange: (v: FontId | null) => void; templateFont: FontId }) {
  const [open, setOpen] = useState(false)
  const current = FONT_OPTIONS.find((f) => f.id === (value ?? templateFont))!
  const groups = useMemo(() => (['Sans', 'Serif', 'Mono'] as const).map((k) => ({ kind: k, fonts: FONT_OPTIONS.filter((f) => f.kind === k) })), [])
  return (
    <div>
      <Label>{label}</Label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn('flex h-11 w-full items-center justify-between rounded-lg border bg-surface px-3 text-left transition-colors', open ? 'border-brand ring-4 ring-brand/15' : 'border-line-strong hover:border-faint')}
      >
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="truncate text-[17px] leading-none text-ink" style={{ fontFamily: `'${current.css}', sans-serif` }}>
            {current.label}
          </span>
          {!value && <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-faint">Template</span>}
        </span>
        <ChevronDown className={cn('size-4 shrink-0 text-muted transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="scroll-thin mt-2 max-h-72 overflow-y-auto rounded-lg border border-line bg-surface-2/60 p-1.5">
              <button
                type="button"
                onClick={() => {
                  onChange(null)
                  setOpen(false)
                }}
                className={cn('mb-1 flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[12.5px] font-semibold', !value ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-surface hover:text-ink')}
              >
                Use the template’s font
                {!value && <Check className="size-3.5" />}
              </button>
              {groups.map((g) => (
                <div key={g.kind}>
                  <div className="px-2.5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-faint">{g.kind === 'Sans' ? 'Sans-serif' : g.kind === 'Serif' ? 'Serif' : 'Monospace'}</div>
                  {g.fonts.map((f) => {
                    const active = value === f.id
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          onChange(f.id as FontId)
                          setOpen(false)
                        }}
                        className={cn('flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left transition-colors', active ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-surface')}
                      >
                        <span className="truncate text-[16px] leading-tight" style={{ fontFamily: `'${f.css}', sans-serif` }}>
                          {f.label}
                        </span>
                        {active && <Check className="size-3.5 shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Typography() {
  useUiFonts()
  const s = useStore((st) => st.settings)
  const setSettings = useStore((st) => st.setSettings)
  const spec = specFor(s.template)
  const hId = s.fontHeading ?? spec.fonts.heading
  const bId = s.fontBody ?? spec.fonts.body
  const cssOf = (id: string) => FONT_OPTIONS.find((f) => f.id === id)?.css ?? 'Inter'

  return (
    <Group
      icon={Type}
      title="Fonts"
      hint="Pair a heading font with a body font – or choose a ready-made pairing."
      action={
        (s.fontBody || s.fontHeading) && (
          <Button size="sm" variant="ghost" onClick={() => setSettings({ fontBody: null, fontHeading: null })}>
            <RotateCcw className="size-3.5" /> Reset
          </Button>
        )
      }
    >
      <div className="grid grid-cols-2 gap-2">
        {FONT_PAIRS.map((p) => {
          const active = hId === p.heading && bId === p.body
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSettings({ fontHeading: p.heading, fontBody: p.body })}
              className={cn('relative rounded-lg border px-3 py-2.5 text-left transition-all', active ? 'border-brand bg-brand-soft/60 ring-2 ring-brand/25' : 'border-line hover:border-line-strong hover:bg-surface-2')}
            >
              <span className="block truncate text-[19px] font-semibold leading-tight text-ink" style={{ fontFamily: `'${cssOf(p.heading)}', sans-serif` }}>
                {p.name}
              </span>
              <span className="mt-0.5 block truncate text-[12px] text-muted" style={{ fontFamily: `'${cssOf(p.body)}', sans-serif` }}>
                Product Engineer · Bengaluru
              </span>
              {active && <Tick />}
            </button>
          )
        })}
      </div>
      <FontSelect label="Heading font" value={s.fontHeading} onChange={(v) => setSettings({ fontHeading: v })} templateFont={spec.fonts.heading} />
      <FontSelect label="Body font" value={s.fontBody} onChange={(v) => setSettings({ fontBody: v })} templateFont={spec.fonts.body} />
      <Slider label="Text size" min={0.8} max={1.25} step={0.01} value={s.textScale} onChange={(v) => setSettings({ textScale: v })} format={(v) => `${Math.round(v * 100)}%`} />
    </Group>
  )
}

/* ─────────── icons ─────────── */

function IconSample({ set, accent }: { set: IconSet; accent: string }) {
  const icons = [Mail, Phone, MapPin]
  if (set === 'none')
    return (
      <span className="flex items-center gap-1.5">
        <Bar w={14} c="bg-faint/60" />
        <Bar w={14} c="bg-faint/60" />
        <Bar w={14} c="bg-faint/60" />
      </span>
    )
  if (set === 'label')
    return (
      <span className="flex items-baseline gap-1.5 text-[9px] font-bold uppercase tracking-wide" style={{ color: accent }}>
        <span>E</span>
        <span>P</span>
        <span>L</span>
      </span>
    )
  return (
    <span className="flex items-center gap-1.5">
      {icons.map((I, i) => {
        if (set === 'dot') return <span key={i} className="size-1.5 rounded-full" style={{ background: accent }} />
        if (set === 'badge')
          return (
            <span key={i} className="grid size-[18px] place-items-center rounded-full text-white" style={{ background: accent }}>
              <I className="size-2.5" strokeWidth={2.4} />
            </span>
          )
        if (set === 'square')
          return (
            <span key={i} className="grid size-[18px] place-items-center rounded-[4px] text-white" style={{ background: accent }}>
              <I className="size-2.5" strokeWidth={2.4} />
            </span>
          )
        return <I key={i} className="size-[15px]" style={{ color: accent }} strokeWidth={set === 'bold' ? 2.8 : 1.6} />
      })}
    </span>
  )
}

/* ─────────── style pickers' mini drawings ─────────── */

function HeadingSample({ kind, accent }: { kind: HeadingKind; accent: string }) {
  const t = 'text-[9.5px] font-bold leading-none text-ink'
  const caps = `${t} uppercase tracking-[0.12em]`
  const wrap = 'flex w-full flex-col justify-center'
  switch (kind) {
    case 'rule':
      return (
        <span className={wrap}>
          <span className={caps}>Experience</span>
          <i className="mt-1 block h-px w-full" style={{ background: accent }} />
        </span>
      )
    case 'caps':
      return (
        <span className={wrap}>
          <span className={cn(caps, 'tracking-[0.22em]')} style={{ color: accent }}>
            Experience
          </span>
        </span>
      )
    case 'line':
      return (
        <span className="flex w-full items-center gap-1.5">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted">Experience</span>
          <i className="block h-px flex-1 bg-line-strong" />
        </span>
      )
    case 'bar':
      return (
        <span className="flex items-center gap-1.5">
          <i className="block h-3.5 w-[3px] rounded-full" style={{ background: accent }} />
          <span className={t}>Experience</span>
        </span>
      )
    case 'pill':
      return (
        <span className="rounded-full px-2 py-1 text-[8.5px] font-bold uppercase leading-none tracking-wide text-white" style={{ background: accent }}>
          Experience
        </span>
      )
    case 'dot':
      return (
        <span className="flex w-full items-center gap-1.5">
          <i className="block size-1.5 rounded-full" style={{ background: accent }} />
          <span className={t}>Experience</span>
          <i className="block h-px flex-1 bg-line-strong" />
        </span>
      )
    case 'plain':
      return (
        <span className="text-[11px] font-extrabold leading-none" style={{ color: accent }}>
          Experience
        </span>
      )
    case 'num':
      return (
        <span className="flex items-baseline gap-1.5">
          <span className="text-[10px] font-extrabold" style={{ color: accent }}>
            01
          </span>
          <span className={t}>Experience</span>
        </span>
      )
    case 'underline':
      return (
        <span className={wrap}>
          <span className={t}>Experience</span>
          <i className="mt-1 block h-[2px] w-5 rounded" style={{ background: accent }} />
        </span>
      )
    case 'filled':
      return (
        <span className="w-full rounded-[3px] px-1.5 py-1 text-[8.5px] font-bold uppercase leading-none tracking-wider" style={{ background: `${accent}22`, color: accent }}>
          Experience
        </span>
      )
    case 'tab':
      return (
        <span className="flex w-full flex-col">
          <span className="w-fit rounded-t-[3px] px-1.5 py-1 text-[8.5px] font-bold uppercase leading-none tracking-wide text-white" style={{ background: accent }}>
            Experience
          </span>
          <i className="block h-[2px] w-full" style={{ background: accent }} />
        </span>
      )
    case 'box':
      return (
        <span className="border px-1.5 py-1 text-[8.5px] font-bold uppercase leading-none tracking-wider text-ink" style={{ borderColor: accent }}>
          Experience
        </span>
      )
    case 'center':
      return (
        <span className="flex w-full items-center gap-1.5">
          <i className="block h-px flex-1" style={{ background: accent }} />
          <span className={t}>Experience</span>
          <i className="block h-px flex-1" style={{ background: accent }} />
        </span>
      )
    case 'double':
      return (
        <span className={wrap}>
          <span className={caps}>Experience</span>
          <i className="mt-1 block h-[3px] w-full border-y" style={{ borderColor: accent }} />
        </span>
      )
    case 'ulcaps':
      return (
        <span className={wrap}>
          <span className={cn(caps, 'tracking-[0.08em]')}>Experience</span>
          <i className="mt-[3px] block h-[1.5px] w-full bg-ink" />
        </span>
      )
    case 'slash':
      return <span className="font-mono text-[9.5px] font-semibold leading-none text-ink">// <span style={{ color: accent }}>experience</span></span>
    default:
      return <Bar w={20} />
  }
}

function EntrySample({ kind, accent }: { kind: EntryKind; accent: string }) {
  const D = (w: number) => <Bar w={w} h={4} c="bg-ink/80" />
  const L = (w: number) => <Bar w={w} h={3} c="bg-faint/60" />
  const A = (w: number) => <Bar w={w} h={3} c="" className="" />
  void A
  const acc = (w: number) => <i className="block shrink-0 rounded-full" style={{ width: w, height: 3, background: accent }} />
  switch (kind) {
    case 'split':
      return (
        <span className="flex w-full flex-col gap-1">
          <span className="flex justify-between">
            {D(34)}
            {L(18)}
          </span>
          <span className="flex justify-between">
            {acc(26)}
            {L(14)}
          </span>
        </span>
      )
    case 'org':
      return (
        <span className="flex w-full flex-col gap-1">
          <span className="flex justify-between">
            {D(38)}
            {L(18)}
          </span>
          <span className="flex justify-between">
            {L(28)}
            {L(14)}
          </span>
        </span>
      )
    case 'stack':
      return (
        <span className="flex w-full flex-col gap-1">
          {acc(18)}
          {D(40)}
          {L(28)}
        </span>
      )
    case 'inline':
      return (
        <span className="flex w-full items-center gap-1">
          {D(22)}
          {L(4)}
          {acc(18)}
          {L(4)}
          {L(16)}
        </span>
      )
    case 'dateleft':
      return (
        <span className="flex w-full gap-2">
          <span className="flex flex-col gap-1">
            {L(16)}
            {L(12)}
          </span>
          <span className="flex flex-col gap-1">
            {D(34)}
            {acc(24)}
          </span>
        </span>
      )
    case 'compact':
      return (
        <span className="flex w-full flex-col gap-[3px]">
          <span className="flex justify-between">
            {D(46)}
            {L(14)}
          </span>
          {L(30)}
        </span>
      )
    case 'timeline':
      return (
        <span className="flex w-full gap-1.5">
          <span className="relative flex w-2 flex-col items-center">
            <i className="mt-0.5 block size-1.5 rounded-full" style={{ background: accent }} />
            <i className="block w-px flex-1 bg-line-strong" />
          </span>
          <span className="flex flex-col gap-1">
            {D(34)}
            {L(24)}
          </span>
        </span>
      )
    default:
      return null
  }
}

function SkillSample({ kind, accent }: { kind: SkillKind; accent: string }) {
  const chip = (w: number, style: 'soft' | 'outline' | 'solid', k: number) => (
    <i
      key={k}
      className="block h-[9px] rounded-full"
      style={{
        width: w,
        background: style === 'soft' ? `${accent}26` : style === 'solid' ? accent : 'transparent',
        border: style === 'outline' ? `1px solid ${accent}` : undefined,
      }}
    />
  )
  const ws = [14, 20, 16, 22, 12]
  switch (kind) {
    case 'tags':
    case 'outline':
    case 'solid':
      return <span className="flex max-w-full flex-wrap justify-center gap-[3px]">{ws.map((w, i) => chip(w, kind === 'tags' ? 'soft' : kind, i))}</span>
    case 'inline':
      return (
        <span className="flex items-center gap-1">
          {ws.slice(0, 4).map((w, i) => (
            <span key={i} className="flex items-center gap-1">
              <Bar w={w} />
              {i < 3 && <i className="size-[2px] rounded-full bg-faint" />}
            </span>
          ))}
        </span>
      )
    case 'bars':
      return (
        <span className="flex w-full flex-col gap-[5px]">
          {[0.9, 0.65, 0.8].map((p, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <Bar w={14} />
              <i className="block h-[3px] flex-1 rounded-full bg-surface-3">
                <i className="block h-full rounded-full" style={{ width: `${p * 100}%`, background: accent }} />
              </i>
            </span>
          ))}
        </span>
      )
    case 'dots':
      return (
        <span className="flex w-full flex-col gap-[5px]">
          {[5, 3, 4].map((n, i) => (
            <span key={i} className="flex items-center justify-between">
              <Bar w={16} />
              <span className="flex gap-[2px]">
                {Array.from({ length: 5 }).map((_, j) => (
                  <i key={j} className="block size-[5px] rounded-full" style={{ background: j < n ? accent : 'var(--surface-3)' }} />
                ))}
              </span>
            </span>
          ))}
        </span>
      )
    case 'grid':
    case 'columns': {
      const c = kind === 'grid' ? 2 : 3
      return (
        <span className="grid w-full gap-x-2 gap-y-[5px]" style={{ gridTemplateColumns: `repeat(${c}, 1fr)` }}>
          {Array.from({ length: c * 2 }).map((_, i) => (
            <Bar key={i} w="80%" />
          ))}
        </span>
      )
    }
    case 'list':
      return (
        <span className="flex w-full flex-col gap-[5px]">
          {[28, 22, 26].map((w, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <i className="size-[4px] rounded-full" style={{ background: accent }} />
              <Bar w={w} />
            </span>
          ))}
        </span>
      )
    default:
      return null
  }
}

const BULLET_GLYPH: Record<BulletKind, string> = { dot: '•', dash: '–', arrow: '›', square: '■', diamond: '◆', check: '✓', none: '' }

function BulletSample({ kind, accent }: { kind: BulletKind; accent: string }) {
  return (
    <span className="flex w-full flex-col gap-[5px]">
      {[34, 26].map((w, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className="w-2.5 text-center text-[10px] font-bold leading-none" style={{ color: accent }}>
            {BULLET_GLYPH[kind]}
          </span>
          <Bar w={w} />
        </span>
      ))}
    </span>
  )
}

/* ─────────── groups ─────────── */

function Styles() {
  const s = useStore((st) => st.settings)
  const setSettings = useStore((st) => st.setSettings)
  const spec = specFor(s.template)
  const accent = s.accent ?? spec.accent
  const auto = (visual?: ReactNode) => ({ label: 'Template’s', visual: visual ?? <Wand2 className="size-4 text-muted" /> })
  const hasLevels = spec.levels

  return (
    <>
      <Group icon={Shapes} title="Section headings" hint="How each section title looks.">
        <Options
          value={s.headingStyle}
          onChange={(v) => setSettings({ headingStyle: v as HeadingKind | null })}
          auto={auto()}
          options={HEADING_OPTIONS.map((o) => ({ id: o.id as HeadingKind, label: o.label, visual: <HeadingSample kind={o.id} accent={accent} /> }))}
        />
      </Group>

      <Group icon={Shapes} title="Experience & education" hint="How roles, companies and dates are laid out.">
        <Options
          value={s.entryStyle}
          onChange={(v) => setSettings({ entryStyle: v as EntryKind | null })}
          auto={auto()}
          tall
          options={ENTRY_OPTIONS.map((o) => ({ id: o.id as EntryKind, label: o.label, hint: o.hint, visual: <EntrySample kind={o.id} accent={accent} /> }))}
        />
      </Group>

      <Group icon={ListChecks} title="Skills" hint="Chips, bars, dots or plain lists.">
        <Options
          value={s.skillStyle}
          onChange={(v) => setSettings({ skillStyle: v as SkillKind | null })}
          auto={auto()}
          tall
          options={SKILL_OPTIONS.map((o) => ({ id: o.id, label: o.label, visual: <SkillSample kind={o.id} accent={accent} /> }))}
        />
        <Toggle
          checked={s.showSkillLevels}
          onChange={(v) => setSettings({ showSkillLevels: v })}
          label="Show skill levels"
          description={hasLevels || s.skillStyle === 'bars' || s.skillStyle === 'dots' ? 'Level bars / dots use the 1–5 rating you set per skill.' : 'Only applies to “Level bars” and “Level dots” styles.'}
        />
      </Group>

      <Group icon={ListChecks} title="Bullet points">
        <Options
          value={s.bulletStyle}
          onChange={(v) => setSettings({ bulletStyle: v as BulletKind | null })}
          auto={auto()}
          cols={4}
          options={BULLET_OPTIONS.map((o) => ({ id: o.id, label: o.label, visual: <BulletSample kind={o.id} accent={accent} /> }))}
        />
      </Group>
    </>
  )
}

function Icons() {
  const s = useStore((st) => st.settings)
  const setSettings = useStore((st) => st.setSettings)
  const spec = specFor(s.template)
  const accent = s.accent ?? spec.accent
  return (
    <Group icon={Mail} title="Contact icons" hint="Little marks beside your email, phone and links.">
      <Options
        value={s.iconSet}
        onChange={(v) => setSettings({ iconSet: v as IconSet | null })}
        auto={{ label: 'Template’s', visual: <Wand2 className="size-4 text-muted" /> }}
        options={ICON_OPTIONS.map((o) => ({ id: o.id, label: o.label, visual: <IconSample set={o.id} accent={accent} /> }))}
      />
      <div>
        <Label>Link style</Label>
        <Segmented
          className="w-full"
          ariaLabel="Link style"
          value={s.linkStyle}
          onChange={(v) => setSettings({ linkStyle: v })}
          options={[
            { value: 'plain', label: 'Plain', title: 'Links look like normal text (still clickable)' },
            { value: 'underline', label: 'Underlined' },
            { value: 'accent', label: 'Coloured' },
          ]}
        />
        <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-faint">
          <Link2 className="size-3" /> Every link you add stays clickable in the downloaded PDF.
        </p>
      </div>
    </Group>
  )
}

function Details() {
  const s = useStore((st) => st.settings)
  const setSettings = useStore((st) => st.setSettings)
  const spec = specFor(s.template)
  const canPhoto = spec.photo || spec.header.photo || (spec.layout.kind === 'sidebar' && spec.layout.photo)
  const shapes: Settings['photoShape'][] = ['auto', 'circle', 'rounded', 'square']
  return (
    <Group icon={ImageIcon} title="Photo & name">
      <Toggle checked={s.showPhoto} onChange={(v) => setSettings({ showPhoto: v })} label="Show my photo" description={canPhoto ? 'Add one in Content → Personal details. Many Indian employers expect a photo; global ones usually don’t.' : 'This template is designed without a photo.'} disabled={!canPhoto} />
      {canPhoto && s.showPhoto && (
        <div>
          <Label>Photo shape</Label>
          <Segmented
            className="w-full"
            size="sm"
            ariaLabel="Photo shape"
            value={s.photoShape}
            onChange={(v) => setSettings({ photoShape: v })}
            options={shapes.map((p) => ({ value: p, label: p === 'auto' ? 'Auto' : p[0].toUpperCase() + p.slice(1) }))}
          />
        </div>
      )}
      <div>
        <Label>Name style</Label>
        <Segmented
          className="w-full"
          ariaLabel="Name case"
          value={s.nameCase}
          onChange={(v) => setSettings({ nameCase: v })}
          options={[
            { value: 'auto', label: 'Template’s' },
            { value: 'normal', label: 'Aa' },
            { value: 'upper', label: 'AA' },
          ]}
        />
      </div>
    </Group>
  )
}

function Page() {
  const s = useStore((st) => st.settings)
  const setSettings = useStore((st) => st.setSettings)
  const pageCount = useStore((st) => st.pageCount)
  const resetSpacing = useStore((st) => st.resetSpacing)
  const adjusted = Object.keys(s.spacing).length
  return (
    <Group icon={Ruler} title="Page & spacing">
      <div>
        <Label>Paper size</Label>
        <Segmented
          className="w-full"
          ariaLabel="Paper size"
          value={s.pageSize}
          onChange={(v) => setSettings({ pageSize: v })}
          options={[
            { value: 'A4', label: 'A4 · India & world', title: '210 × 297 mm' },
            { value: 'LETTER', label: 'US Letter' },
          ]}
        />
      </div>
      <Slider label="Spacing between items" min={0.6} max={1.5} step={0.01} value={s.spacingScale} onChange={(v) => setSettings({ spacingScale: v })} format={(v) => `${Math.round(v * 100)}%`} />
      <Slider label="Page margins" min={0.6} max={1.5} step={0.01} value={s.marginScale} onChange={(v) => setSettings({ marginScale: v })} format={(v) => `${Math.round(v * 100)}%`} />
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button size="sm" variant="secondary" onClick={() => void fitToOnePage()} disabled={pageCount <= 1} title={pageCount <= 1 ? 'Already on one page' : undefined}>
          <FileText className="size-3.5" /> Fit to one page
        </Button>
        {adjusted > 0 && (
          <Button size="sm" variant="ghost" onClick={resetSpacing}>
            <RotateCcw className="size-3.5" /> Undo {adjusted} drag adjustment{adjusted === 1 ? '' : 's'}
          </Button>
        )}
      </div>
      <p className="text-[11.5px] leading-snug text-faint">
        Tip: switch on <b className="text-muted">Adjust layout</b> above the preview, then drag any block to add or remove space – it carries into the PDF.
      </p>
    </Group>
  )
}

export function DesignPanel() {
  const resetDesign = useStore((s) => s.resetDesign)
  return (
    <PanelShell
      title="Design"
      blurb="Style it first – the preview on the right updates live."
      action={
        <Button size="sm" variant="secondary" onClick={resetDesign} title="Back to the template’s own look">
          <RotateCcw className="size-3.5" /> Reset
        </Button>
      }
    >
      <div className="space-y-3">
        <Colours />
        <TextColours />
        <Typography />
        <Styles />
        <Icons />
        <Details />
        <Page />
      </div>
    </PanelShell>
  )
}
