import { ArrowRight, Bug, Check, Copy, Lightbulb, Mail, RotateCcw, ShieldCheck } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Field, inputCls, TextArea, TextInput } from '@/components/ui/Field'
import { FEEDBACK_EMAIL, mailtoHref, reportBody, WHERE_OPTIONS, type FeedbackKind, type FeedbackReport } from '@/lib/feedback'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { container, PageFrame } from './parts'

const KINDS: { id: FeedbackKind; icon: typeof Bug; title: string; text: string }[] = [
  { id: 'bug', icon: Bug, title: 'Report a bug', text: 'Something is broken or looks wrong' },
  { id: 'feature', icon: Lightbulb, title: 'Request a feature', text: 'An idea that would make Kriti better' },
]

const COPY: Record<FeedbackKind, { title: string; titlePh: string; details: string; detailsPh: string; extra: string; extraPh: string }> = {
  bug: {
    title: 'In a few words, what went wrong?',
    titlePh: 'The PDF download button does nothing',
    details: 'What happened?',
    detailsPh: 'Tell us what you saw and what you expected to see instead.',
    extra: 'What did you do just before it happened? (optional)',
    extraPh: '1. Opened a template  2. Added a photo  3. Pressed Download',
  },
  feature: {
    title: 'What would you like us to add?',
    titlePh: 'Let me export my resume as a Word file',
    details: 'Describe the idea',
    detailsPh: 'The more detail, the better. A short example helps a lot.',
    extra: 'How would it help you? (optional)',
    extraPh: 'I apply to companies that only accept .docx files.',
  },
}

const EMPTY: Omit<FeedbackReport, 'kind'> = { title: '', details: '', extra: '', where: '', email: '' }

export function FeedbackPage() {
  const [params, setParams] = useSearchParams()
  const kind: FeedbackKind = params.get('type') === 'feature' ? 'feature' : 'bug'
  const [form, setForm] = useState(EMPTY)
  const [withEnv, setWithEnv] = useState(true)
  const [errors, setErrors] = useState<{ title?: string; details?: string; email?: string }>({})
  const [sent, setSent] = useState<FeedbackReport | null>(null)
  const c = COPY[kind]
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (form.title.trim().length < 4) next.title = 'Please add a short title.'
    if (form.details.trim().length < 15) next.details = 'Please tell us a little more, at least a sentence.'
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'That email address does not look right.'
    setErrors(next)
    if (Object.keys(next).length) return
    const report: FeedbackReport = { kind, ...form }
    setSent(report)
    if (FEEDBACK_EMAIL) window.location.href = mailtoHref(report, withEnv)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const copy = async (r: FeedbackReport) => {
    try {
      await navigator.clipboard.writeText(reportBody(r, withEnv))
      toast.success('Report copied')
    } catch {
      toast.error('Could not copy. Select the text and copy it by hand.')
    }
  }

  return (
    <PageFrame>
      <section className="ruled border-b border-line">
        <div className={cn(container, 'pb-12 pt-14 sm:pt-20')}>
          <span className="eyebrow">Feedback</span>
          <h1 className="font-display mt-4 max-w-3xl text-[38px] leading-[1.08] text-ink sm:text-[54px]">
            Help us make Kriti <em>better.</em>
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted">Found something broken, or thought of something that would help? Tell us. We read every message.</p>
        </div>
      </section>

      <section className={cn(container, 'grid gap-8 pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12')}>
        {/* what to expect */}
        <aside className="space-y-5 lg:pt-2">
          <div className="rounded-2xl border border-line bg-surface-2 p-6">
            <h2 className="text-[17px] font-extrabold text-ink">Good reports are easy to act on</h2>
            <ul className="mt-4 space-y-3">
              {['Say what you expected and what happened instead.', 'Mention the page and the template, if it matters.', 'For an idea, tell us the problem it would solve for you.'].map((t) => (
                <li key={t} className="flex gap-3 text-[14.5px] leading-snug text-muted">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3 rounded-2xl border border-line p-5">
            <ShieldCheck className="mt-0.5 size-6 shrink-0 text-brand" />
            <p className="text-[14px] leading-relaxed text-muted">
              <b className="font-extrabold text-ink">Your resume stays private.</b> Nothing from your resume is attached. You can see exactly what is sent before you send it. <Link to={paths.privacy} className="font-semibold text-brand underline underline-offset-2">Privacy Policy</Link>
            </p>
          </div>
        </aside>

        {/* form */}
        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div key="done" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8">
                <span className="grid size-14 place-items-center rounded-full bg-brand text-brand-ink">
                  <Check className="size-7" strokeWidth={3} />
                </span>
                <h2 className="font-display mt-5 text-[30px] leading-tight text-ink">{FEEDBACK_EMAIL ? 'Your email app is opening.' : 'Thank you. Your report is ready.'}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  {FEEDBACK_EMAIL ? 'Press Send there to finish. If nothing opened, use the buttons below.' : 'Copy it and send it to the Kriti team.'}
                </p>
                <pre className="mt-5 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-surface-2 p-4 text-[12.5px] leading-relaxed text-muted">{reportBody(sent, withEnv)}</pre>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {FEEDBACK_EMAIL && (
                    <a href={mailtoHref(sent, withEnv)} className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-brand-ink shadow-sm hover:bg-brand-hover">
                      <Mail className="size-4" /> Open email
                    </a>
                  )}
                  <Button variant={FEEDBACK_EMAIL ? 'secondary' : 'primary'} className="!rounded-full" onClick={() => void copy(sent)}>
                    <Copy className="size-4" /> Copy report
                  </Button>
                  <Button
                    variant="ghost"
                    className="!rounded-full"
                    onClick={() => {
                      setForm(EMPTY)
                      setSent(null)
                    }}
                  >
                    <RotateCcw className="size-4" /> Send another
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-8">
                <fieldset>
                  <legend className="mb-3 text-[13px] font-bold uppercase tracking-wider text-faint">What would you like to do?</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {KINDS.map((k) => {
                      const on = kind === k.id
                      return (
                        <button
                          key={k.id}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => setParams({ type: k.id }, { replace: true })}
                          className={cn(
                            'group flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all',
                            on ? 'border-brand bg-brand-soft shadow-card' : 'border-line hover:-translate-y-0.5 hover:border-line-strong hover:shadow-card',
                          )}
                        >
                          <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl transition-colors', on ? 'bg-brand text-brand-ink' : 'bg-surface-2 text-brand')}>
                            <k.icon className="size-5" />
                          </span>
                          <span>
                            <span className="block text-[15px] font-extrabold text-ink">{k.title}</span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-muted">{k.text}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="mt-6 space-y-5">
                  <Field label={c.title}>
                    <TextInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder={c.titlePh} maxLength={90} aria-invalid={!!errors.title} />
                    {errors.title && <p className="mt-1.5 text-[12.5px] font-semibold text-bad">{errors.title}</p>}
                  </Field>

                  <Field label="Where did you notice it?" hint="Optional. It helps us find the problem faster.">
                    <select value={form.where} onChange={(e) => set('where', e.target.value)} className={cn(inputCls, 'h-10')}>
                      <option value="">Choose a page</option>
                      {WHERE_OPTIONS.map((w) => (
                        <option key={w}>{w}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label={c.details} right={<span className="font-mono text-[11px] tabular-nums text-faint">{form.details.length} / 1500</span>}>
                    <TextArea value={form.details} onChange={(e) => set('details', e.target.value)} placeholder={c.detailsPh} minRows={4} maxLength={1500} aria-invalid={!!errors.details} />
                    {errors.details && <p className="mt-1.5 text-[12.5px] font-semibold text-bad">{errors.details}</p>}
                  </Field>

                  <Field label={c.extra}>
                    <TextArea value={form.extra} onChange={(e) => set('extra', e.target.value)} placeholder={c.extraPh} minRows={2} maxLength={800} />
                  </Field>

                  <Field label="Your email (optional)" hint="Only so we can reply. We do not add you to any list.">
                    <TextInput type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" autoComplete="email" aria-invalid={!!errors.email} />
                    {errors.email && <p className="mt-1.5 text-[12.5px] font-semibold text-bad">{errors.email}</p>}
                  </Field>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-surface-2 p-3.5">
                    <input type="checkbox" checked={withEnv} onChange={(e) => setWithEnv(e.target.checked)} className="mt-0.5 size-4 accent-[var(--brand)]" />
                    <span className="text-[13.5px] leading-snug text-muted">
                      <b className="font-bold text-ink">Include my browser details.</b> Browser name, screen size and theme. This is the quickest way to reproduce a bug.
                    </span>
                  </label>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Button type="submit" variant="primary" size="lg" className="!rounded-full px-8">
                    {kind === 'bug' ? 'Send bug report' : 'Send feature request'} <ArrowRight className="size-4" />
                  </Button>
                  <p className="text-[13px] text-faint">You will see the message before it goes anywhere.</p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageFrame>
  )
}
