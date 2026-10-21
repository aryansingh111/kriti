import { Camera, ImagePlus, Plus, Trash2, UserRound, X } from 'lucide-react'
import { Reorder, useDragControls, AnimatePresence } from 'motion/react'
import { GripVertical } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { BrandIcon } from '@/components/BrandIcon'
import { Button } from '@/components/ui/Button'
import { Field, TextArea, TextInput } from '@/components/ui/Field'
import { guessLinkKind, LINK_BY_KIND, LINK_META } from '@/lib/links'
import { displayUrl, initials } from '@/lib/resume'
import { paths } from '@/lib/routes'
import { cn, readSquarePhoto } from '@/lib/utils'
import { specFor } from '@/pdf/specs'
import { useStore } from '@/store'
import type { LinkKind, ProfileLink } from '@/types'

/* ─────────── photo ─────────── */

function PhotoField() {
  const photo = useStore((s) => s.data.basics.photo)
  const name = useStore((s) => s.data.basics.fullName)
  const template = useStore((s) => s.settings.template)
  const showPhoto = useStore((s) => s.settings.showPhoto)
  const setBasics = useStore((s) => s.setBasics)
  const input = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const spec = specFor(template)

  const take = async (file?: File | null) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return void toast.error('Please choose an image file.')
    if (file.size > 20 * 1024 * 1024) return void toast.error('That image is over 20 MB – try a smaller one.')
    try {
      setBasics({ photo: await readSquarePhoto(file) })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not read that image.')
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDrag(true)
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDrag(false)
        void take(e.dataTransfer.files[0])
      }}
      className={cn('flex items-center gap-4 rounded-lg border border-dashed p-3 transition-colors', drag ? 'border-brand bg-brand-soft' : 'border-line-strong bg-surface-2/50')}
    >
      <button
        type="button"
        onClick={() => input.current?.click()}
        aria-label="Upload photo"
        className="group relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-line transition hover:ring-brand"
      >
        {photo ? (
          <img src={photo} alt="Your profile photo" decoding="async" className="size-full object-cover" />
        ) : (
          <span className="grid size-full place-items-center bg-brand text-lg font-bold text-white">
            {name.trim() ? initials(name) : <UserRound className="size-6" />}
          </span>
        )}
        <span className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Camera className="size-5" />
        </span>
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => input.current?.click()}>
            <ImagePlus className="size-3.5" /> {photo ? 'Change photo' : 'Upload photo'}
          </Button>
          {photo && (
            <Button size="sm" variant="ghost" onClick={() => setBasics({ photo: '' })}>
              <Trash2 className="size-3.5" /> Remove
            </Button>
          )}
        </div>
        <p className="mt-1.5 text-[11.5px] leading-snug text-faint">
          {!spec.photo
            ? `${spec.name} doesn’t show a photo – switch to a template with the camera icon to use one.`
            : !showPhoto
              ? 'Photo is switched off in Design.'
              : (
                  <>
                    Drop an image here. It’s cropped square and stays on your device.{' '}
                    <a href={paths.privacy} target="_blank" rel="noreferrer" className="font-semibold text-brand underline underline-offset-2">
                      Privacy
                    </a>
                  </>
                )}
        </p>
      </div>
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => void take(e.target.files?.[0])} />
    </div>
  )
}

/* ─────────── personal details ─────────── */

export function BasicsForm() {
  const b = useStore((s) => s.data.basics)
  const set = useStore((s) => s.setBasics)
  const bind = (k: 'fullName' | 'title' | 'email' | 'phone' | 'location') => ({
    value: b[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set({ [k]: e.target.value }),
  })

  return (
    <>
      <PhotoField />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Full name">
          <TextInput placeholder="Aarav Sharma" autoComplete="name" {...bind('fullName')} />
        </Field>
        <Field label="Job title">
          <TextInput placeholder="Software Engineer" autoComplete="organization-title" {...bind('title')} />
        </Field>
        <Field label="Email">
          <TextInput type="email" placeholder="aarav.sharma@gmail.com" autoComplete="email" {...bind('email')} />
        </Field>
        <Field label="Phone">
          <TextInput type="tel" placeholder="+91 98765 43210" autoComplete="tel" {...bind('phone')} />
        </Field>
      </div>
      <Field label="Location">
        <TextInput placeholder="Bengaluru, Karnataka" autoComplete="address-level2" {...bind('location')} />
      </Field>
    </>
  )
}

export function SummaryForm() {
  const summary = useStore((s) => s.data.basics.summary)
  const set = useStore((s) => s.setBasics)
  const len = summary.trim().length
  const tone = len === 0 ? 'text-faint' : len < 150 || len > 600 ? 'text-warn' : 'text-ok'
  return (
    <Field
      label="Professional summary / career objective"
      right={<span className={cn('font-mono text-[11px] tabular-nums', tone)}>{len} chars</span>}
      hint="2–4 sentences: who you are, what you’re great at, and one standout result. Aim for 200–450 characters. Freshers: state the role you want."
    >
      <TextArea
        minRows={4}
        value={summary}
        onChange={(e) => set({ summary: e.target.value })}
        placeholder="Product-minded engineer with 5+ years building fast, accessible web apps for Indian fintech and e-commerce…"
      />
    </Field>
  )
}

/* ─────────── links ─────────── */

function LinkRow({ link }: { link: ProfileLink }) {
  const update = useStore((s) => s.updateLink)
  const remove = useStore((s) => s.removeLink)
  const controls = useDragControls()
  const meta = LINK_BY_KIND[link.kind] ?? LINK_BY_KIND.other

  return (
    <Reorder.Item
      as="div"
      value={link}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 14px 30px -10px rgb(0 0 0 / 0.35)', zIndex: 30 }}
      className="rounded-lg border border-line bg-surface-2/50 p-2"
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(e) => controls.start(e)}
          className="touch-none cursor-grab rounded-md p-1 text-faint hover:text-ink active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <label className="relative flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-line-strong bg-surface pl-2.5 pr-1 text-ink">
          <BrandIcon name={meta.icon} size={16} className="text-brand" />
          <select
            aria-label="Platform"
            value={link.kind}
            onChange={(e) => update(link.id, { kind: e.target.value as LinkKind })}
            className="h-full w-[6.4rem] cursor-pointer appearance-none truncate bg-transparent pr-1 text-[13px] font-semibold outline-none"
          >
            {LINK_META.map((m) => (
              <option key={m.kind} value={m.kind}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <TextInput
          value={link.url}
          onChange={(e) => {
            const url = e.target.value
            update(link.id, link.kind === 'other' && url ? { url, kind: guessLinkKind(url) } : { url })
          }}
          placeholder={meta.urlPlaceholder}
          aria-label={`${meta.label} URL`}
          className="min-w-0 flex-1"
        />
        <Button variant="ghost" size="icon-sm" onClick={() => remove(link.id)} aria-label="Remove link" className="hover:bg-bad/10 hover:text-bad">
          <X className="size-3.5" />
        </Button>
      </div>
      <div className="mt-1.5 pl-7">
        <TextInput
          value={link.label}
          onChange={(e) => update(link.id, { label: e.target.value })}
          placeholder={link.url ? `Shown as “${displayUrl(link.url)}” – type to change` : 'Text shown on the resume (optional)'}
          aria-label="Text shown on the resume"
          className="h-9 text-[13px]"
        />
      </div>
    </Reorder.Item>
  )
}

export function LinksForm() {
  const links = useStore((s) => s.data.basics.links)
  const addLink = useStore((s) => s.addLink)
  const updateLink = useStore((s) => s.updateLink)
  const setLinks = useStore((s) => s.setLinks)
  const have = new Set(links.map((l) => l.kind))
  const quick: LinkKind[] = (['linkedin', 'github', 'portfolio', 'leetcode', 'behance', 'x'] as LinkKind[]).filter((k) => !have.has(k))

  return (
    <>
      <p className="text-[12.5px] leading-snug text-muted">
        Optional. Each link is clickable in the PDF – the URL decides where it goes, the text (if you set one) is what people read.
      </p>
      <Reorder.Group as="div" axis="y" values={links} onReorder={setLinks} className="space-y-2">
        <AnimatePresence initial={false}>
          {links.map((l) => (
            <LinkRow key={l.id} link={l} />
          ))}
        </AnimatePresence>
      </Reorder.Group>
      <div className="flex flex-wrap gap-1.5">
        {quick.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              const id = addLink(k)
              updateLink(id, { kind: k })
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line-strong px-3 text-[12.5px] font-semibold text-muted transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
          >
            <BrandIcon name={LINK_BY_KIND[k].icon} size={14} /> {LINK_BY_KIND[k].label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => addLink('other')}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-dashed border-line-strong px-3 text-[12.5px] font-semibold text-muted transition-colors hover:border-brand hover:text-brand"
        >
          <Plus className="size-3.5" /> Other link
        </button>
      </div>
    </>
  )
}

