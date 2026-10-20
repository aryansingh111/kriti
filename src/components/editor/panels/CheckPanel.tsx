import { Circle, CircleAlert, CircleCheck, FileDown, Lightbulb, Plus, ScanSearch, Sparkles, Target, Wand2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Segmented } from '@/components/ui/Segmented'
import { TextArea } from '@/components/ui/Field'
import { fitToOnePage } from '@/lib/fit'
import { useCountUp } from '@/lib/hooks'
import { matchJob } from '@/lib/jobmatch'
import { resumeText } from '@/lib/resume'
import { analyze, type Check, type CheckGroup } from '@/lib/score'
import { cn } from '@/lib/utils'
import { specFor } from '@/pdf/specs'
import { useActiveDoc, useStore } from '@/store'
import { PanelShell } from './PanelShell'

export function Ring({ score, size = 144, label = 'of 100' }: { score: number; size?: number; label?: string }) {
  const r = 54
  const c = 2 * Math.PI * r
  const color = score >= 80 ? 'var(--ok)' : score >= 55 ? 'var(--warn)' : 'var(--bad)'
  const shown = useCountUp(score)
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 128 128" className="size-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10" className="stroke-surface-3" />
        <motion.circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - score / 100) }}
          transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display tabular-nums tracking-tight text-ink" style={{ fontSize: size * 0.3 }}>
            {shown}
          </div>
          <div className="-mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-muted">{label}</div>
        </div>
      </div>
    </div>
  )
}

function Row({ c }: { c: Check }) {
  const done = c.value >= 0.999
  const partial = !done && c.value > 0
  const Icon = done ? CircleCheck : partial ? CircleAlert : Circle
  return (
    <li className="flex gap-3 py-2.5">
      <Icon className={cn('mt-0.5 size-[18px] shrink-0', done ? 'text-ok' : partial ? 'text-warn' : 'text-faint')} strokeWidth={done ? 2.4 : 2} />
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-ink">{c.label}</p>
        {!done && <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{c.tip}</p>}
      </div>
    </li>
  )
}

export function ScoreView() {
  const data = useStore((s) => s.data)
  const pageCount = useStore((s) => s.pageCount)
  const settings = useStore((s) => s.settings)
  const spec = specFor(settings.template)
  const { score, checks, verdict } = useMemo(() => analyze(data, pageCount), [data, pageCount])
  const groups: CheckGroup[] = ['Essentials', 'Impact', 'Polish']
  const todo = checks.filter((c) => c.value < 0.999).length

  return (
    <div className="space-y-3">
      <section className="flex items-center gap-5 rounded-xl border border-line bg-surface p-5">
        <Ring score={score} />
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Resume strength</p>
          <h3 className="mt-1 font-display text-[20px] leading-tight text-ink">{verdict}</h3>
          <p className="mt-1.5 text-[13px] leading-snug text-muted">
            {todo === 0 ? 'Every check passes. Nicely done.' : `${todo} thing${todo === 1 ? '' : 's'} to improve – biggest wins first.`}
          </p>
        </div>
      </section>

      {pageCount > 1 && (
        <section className="flex items-center gap-3 rounded-xl border border-warn/30 bg-warn/10 p-3.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-warn/20 text-warn">
            <Wand2 className="size-[18px]" />
          </span>
          <p className="min-w-0 flex-1 text-[13px] leading-snug text-ink">
            Your resume is <b>{pageCount} pages</b>. Recruiters prefer one.
          </p>
          <Button size="sm" variant="dark" onClick={() => void fitToOnePage()}>
            Fit to 1 page
          </Button>
        </section>
      )}

      <section className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-ok/12 text-ok">
          <ScanSearch className="size-[18px]" />
        </span>
        <div>
          <p className="text-[13.5px] font-bold text-ink">
            ATS compatibility · {spec.name}
            <span className="ml-2 inline-flex gap-[3px] align-middle">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={cn('size-1.5 rounded-full', i < spec.ats ? 'bg-ok' : 'bg-surface-3')} />
              ))}
            </span>
          </p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-muted">
            Your PDF has real, selectable text and standard headings.{' '}
            {spec.ats < 5 ? 'Multi-column layouts are read correctly by modern systems; single-column templates are safest for older ones.' : 'This single-column layout is the safest choice for any applicant-tracking system.'}
          </p>
        </div>
      </section>

      {groups.map((g) => {
        const list = checks.filter((c) => c.group === g).sort((a, b) => (a.value >= 0.999 ? 1 : 0) - (b.value >= 0.999 ? 1 : 0) || b.weight - a.weight)
        return (
          <section key={g} className="rounded-xl border border-line bg-surface px-4 pb-1.5 pt-3.5">
            <h4 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-muted">
              {g === 'Impact' && <Lightbulb className="size-3.5" />} {g}
            </h4>
            <ul className="divide-y divide-line">
              {list.map((c) => (
                <Row key={c.id} c={c} />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

/* ─────────── job match ─────────── */

export function JobMatchView() {
  const doc = useActiveDoc()
  const data = useStore((s) => s.data)
  const setJd = useStore((s) => s.setJobDescription)
  const addItem = useStore((s) => s.addItem)
  const [jd, setLocal] = useState(doc?.jobDescription ?? '')
  const skills = useStore((s) => s.data.skills)

  const result = useMemo(() => (jd.trim().length > 40 ? matchJob(jd, data) : null), [jd, data])
  const have = new Set(skills.map((s) => s.name.toLowerCase()))
  const missing = result?.keywords.filter((k) => !k.found) ?? []
  const found = result?.keywords.filter((k) => k.found) ?? []
  const titleCase = (t: string) => (t.length <= 4 && !/\s/.test(t) ? t.toUpperCase() : t.replace(/\b\w/g, (m) => m.toUpperCase()))

  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-line bg-surface p-4">
        <div className="mb-2 flex items-center gap-2">
          <Target className="size-4 text-brand" />
          <h3 className="text-[14px] font-bold text-ink">Paste a job description</h3>
        </div>
        <TextArea
          minRows={6}
          value={jd}
          onChange={(e) => {
            setLocal(e.target.value)
            setJd(e.target.value)
          }}
          placeholder="Paste the full job posting here – from Naukri, LinkedIn, Instahyre or a company careers page. Nothing leaves your browser."
        />
        <p className="mt-1.5 text-[11.5px] text-faint">We compare the skills and keywords in the posting with your resume, like an applicant-tracking system would.</p>
      </section>

      {result && (
        <>
          <section className="flex items-center gap-5 rounded-xl border border-line bg-surface p-5">
            <Ring score={result.score} size={112} label="match" />
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Keyword match</p>
              <p className="mt-1 text-[14px] font-semibold leading-snug text-ink">
                {result.matched} of {result.total} keywords found
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-muted">
                {result.score >= 75 ? 'Strong alignment – tailor the summary and you’re set.' : result.score >= 45 ? 'Decent. Work the missing keywords into real bullets.' : 'Low overlap – add genuine experience with the missing terms.'}
              </p>
            </div>
          </section>

          {missing.length > 0 && (
            <section className="rounded-xl border border-line bg-surface p-4">
              <h4 className="mb-2.5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-warn">
                <CircleAlert className="size-3.5" /> Missing ({missing.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {missing.map((k) => {
                  const canAdd = k.skillLike && !have.has(k.term)
                  return (
                    <button
                      key={k.term}
                      type="button"
                      disabled={!canAdd}
                      onClick={() => {
                        addItem('skills', { name: titleCase(k.term) })
                        toast.success(`Added “${titleCase(k.term)}” to Skills`)
                      }}
                      title={canAdd ? 'Add to Skills (only if it’s true!)' : undefined}
                      className={cn(
                        'inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[12.5px] font-semibold',
                        canAdd ? 'border-warn/40 bg-warn/10 text-warn hover:bg-warn/20' : 'border-line bg-surface-2 text-muted',
                      )}
                    >
                      {canAdd && <Plus className="size-3" />}
                      {k.term}
                      {k.count > 1 && <span className="text-[10px] opacity-70">×{k.count}</span>}
                    </button>
                  )
                })}
              </div>
              <p className="mt-2.5 text-[11.5px] text-faint">Only add skills you genuinely have – interviewers will ask.</p>
            </section>
          )}

          {found.length > 0 && (
            <section className="rounded-xl border border-line bg-surface p-4">
              <h4 className="mb-2.5 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-ok">
                <CircleCheck className="size-3.5" /> Matched ({found.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {found.map((k) => (
                  <span key={k.term} className="inline-flex h-7 items-center rounded-full bg-ok/12 px-2.5 text-[12.5px] font-semibold text-ok">
                    {k.term}
                  </span>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {!result && (
        <div className="grid place-items-center rounded-xl border border-dashed border-line-strong px-6 py-10 text-center">
          <Sparkles className="mb-2 size-6 text-brand" />
          <p className="text-[13.5px] font-semibold text-ink">Tailor your resume to every job</p>
          <p className="mt-1 max-w-[17rem] text-[12.5px] text-muted">Recruiters and ATS filters look for the exact words in the posting. See what you’re missing.</p>
        </div>
      )}
    </div>
  )
}

export function CheckPanel() {
  const [tab, setTab] = useState<'score' | 'match'>('score')
  return (
    <PanelShell
      title="Check"
      blurb="Make sure it’s strong, scannable and tailored."
      action={
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            const { data, settings } = useStore.getState()
            void navigator.clipboard.writeText(resumeText(data, settings)).then(() => toast.success('Plain text copied'))
          }}
          title="Copy the resume as plain text (what an ATS reads)"
        >
          <FileDown className="size-3.5" /> Copy text
        </Button>
      }
    >
      <Segmented
        className="mb-4 w-full"
        ariaLabel="Check type"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'score', label: 'Strength score' },
          { value: 'match', label: 'Job match' },
        ]}
      />
      {tab === 'score' ? <ScoreView /> : <JobMatchView />}
    </PanelShell>
  )
}
