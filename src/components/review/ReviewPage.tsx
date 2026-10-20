import { ArrowLeft, CircleCheck, Download, ExternalLink, FileDown, FileText, Link2, LoaderCircle, PartyPopper, Pencil, Wand2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { ScoreView } from '@/components/editor/panels/CheckPanel'
import { PdfStage } from '@/components/stage/PdfStage'
import { getPreviewBlob } from '@/components/stage/previewBlob'
import { Button } from '@/components/ui/Button'
import { Segmented } from '@/components/ui/Segmented'
import { exportDataJson, pdfFileName, useDownload } from '@/lib/download'
import { fitToOnePage } from '@/lib/fit'
import { useMedia } from '@/lib/hooks'
import { LINK_META } from '@/lib/links'
import { paths, type Rail } from '@/lib/routes'
import { resumeText, safeHref } from '@/lib/resume'
import { analyze } from '@/lib/score'
import { specFor } from '@/pdf/specs'
import { useActiveDoc, useStore } from '@/store'
import type { ResumeData } from '@/types'

/** How many links the PDF will carry, and which ones. */
function linkReport(d: ResumeData) {
  const found: string[] = []
  for (const l of d.basics.links) if (safeHref(l.url) ?? (l.url ? undefined : safeHref(l.label))) found.push(l.label || LINK_META.find((m) => m.kind === l.kind)?.label || 'Link')
  if (d.basics.email) found.push('Email')
  if (d.basics.phone) found.push('Phone')
  const named = (items: { link: string }[], label: string) => {
    const c = items.filter((i) => safeHref(i.link)).length
    if (c) found.push(`${c} ${label}${c === 1 ? '' : 's'}`)
  }
  named(d.experience, 'company link')
  named(d.education, 'school link')
  named(d.projects, 'project link')
  named(d.certifications, 'certificate link')
  named(d.awards, 'award link')
  const custom = d.customSections.reduce((n, s) => n + s.items.filter((i) => safeHref(i.link)).length, 0)
  if (custom) found.push(`${custom} other link${custom === 1 ? '' : 's'}`)
  return found
}

export function ReviewPage() {
  const navigate = useNavigate()
  const isSample = useStore((s) => s.isSample)
  const data = useStore((s) => s.data)
  const settings = useStore((s) => s.settings)
  const pageCount = useStore((s) => s.pageCount)
  const doc = useActiveDoc()
  const { download, busy } = useDownload()
  const desktop = useMedia('(min-width: 1024px)')
  const [pane, setPane] = useState<'preview' | 'summary'>('preview')
  const spec = specFor(settings.template)

  const links = useMemo(() => linkReport(data), [data])
  const { score } = useMemo(() => analyze(data, pageCount), [data, pageCount])
  const headline = score >= 80 ? 'Looks ready to send.' : score >= 55 ? 'Almost there.' : 'A few things to polish first.'
  const filename = pdfFileName(data.basics.fullName)

  const backToEdit = (rail?: Rail) => navigate(paths.edit(doc?.id ?? '', rail ?? (isSample ? 'design' : 'content')))

  const summary = (
    <div className="space-y-3 p-4 pb-24 lg:pb-10">
      <section className="relative overflow-hidden rounded-2xl bg-brand p-5 text-white shadow-pop">
        <div aria-hidden className="absolute -right-12 -top-16 size-48 rounded-full bg-white/10" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/18 px-2.5 py-1 text-[11.5px] font-bold">
            <PartyPopper className="size-3.5" /> Final step
          </span>
          <h2 className="mt-3 font-display text-[24px] leading-tight">{headline}</h2>
          <p className="mt-1 text-[13.5px] text-white/85">
            {spec.name} · {pageCount} page{pageCount === 1 ? '' : 's'} · {settings.pageSize === 'A4' ? 'A4' : 'US Letter'}
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-[13px] font-semibold backdrop-blur">
            <FileText className="size-4 shrink-0" />
            <span className="truncate">{filename}</span>
          </div>
          <Button variant="secondary" size="lg" className="mt-3 w-full border-white bg-white text-[#0b5a32] hover:bg-[#e5f3ea]" onClick={download} disabled={busy}>
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
            Download PDF
          </Button>
          <div className="mt-2.5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(resumeText(data, settings)).then(() => toast.success('Plain text copied'))
              }}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded bg-white/15 text-[12.5px] font-semibold hover:bg-white/25"
            >
              <FileText className="size-3.5" /> Copy text
            </button>
            <button type="button" onClick={exportDataJson} className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded bg-white/15 text-[12.5px] font-semibold hover:bg-white/25">
              <FileDown className="size-3.5" /> Backup data
            </button>
            <button
              type="button"
              onClick={() => {
                const b = getPreviewBlob()
                if (b) window.open(URL.createObjectURL(b), '_blank', 'noopener')
              }}
              className="grid h-9 w-9 place-items-center rounded bg-white/15 hover:bg-white/25"
              aria-label="Open in a new tab"
              title="Open in a new tab"
            >
              <ExternalLink className="size-3.5" />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-surface p-4">
        <h3 className="flex items-center gap-2 text-[14px] font-bold text-ink">
          <Link2 className="size-4 text-brand" /> Clickable in the PDF
        </h3>
        {links.length ? (
          <>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {links.map((l, i) => (
                <span key={`${l}-${i}`} className="inline-flex h-7 items-center gap-1.5 rounded-full bg-ok/12 px-2.5 text-[12.5px] font-semibold text-ok">
                  <CircleCheck className="size-3.5" /> {l}
                </span>
              ))}
            </div>
            <p className="mt-2.5 text-[12px] text-faint">Recruiters can tap these in any PDF viewer. Test one by opening the PDF in a new tab.</p>
          </>
        ) : (
          <p className="mt-1.5 text-[13px] text-muted">No links yet. Add LinkedIn, GitHub or project links in Content so readers can open them straight from the PDF.</p>
        )}
        <Button size="sm" variant="secondary" className="mt-3" onClick={() => backToEdit('content')}>
          <Pencil className="size-3.5" /> Edit links
        </Button>
      </section>

      {pageCount > 1 && (
        <section className="flex items-center gap-3 rounded-xl border border-warn/30 bg-warn/10 p-3.5">
          <Wand2 className="size-5 shrink-0 text-warn" />
          <p className="min-w-0 flex-1 text-[13px] leading-snug text-ink">
            This runs to <b>{pageCount} pages</b>.
          </p>
          <Button size="sm" variant="dark" onClick={() => void fitToOnePage()}>
            Fit to 1 page
          </Button>
        </section>
      )}

      <ScoreView />
    </div>
  )

  return (
    <div className="flex h-dvh flex-col bg-bg">
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-line bg-surface px-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Button variant="secondary" onClick={() => backToEdit()}>
            <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Keep editing</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <Link to={paths.home} aria-label="Kriti home" className="hidden rounded p-1 md:block">
            <Logo />
          </Link>
        </div>
        <p className="hidden truncate text-[14px] font-semibold text-ink md:block">Review · {doc?.name}</p>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button variant="primary" onClick={download} disabled={busy}>
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">Download</span>
          </Button>
        </div>
      </header>

      {!desktop && (
        <div className="shrink-0 border-b border-line bg-surface px-3 py-2">
          <Segmented
            className="w-full"
            ariaLabel="Review view"
            value={pane}
            onChange={setPane}
            options={[
              { value: 'preview', label: 'Full preview' },
              { value: 'summary', label: 'Checks & download' },
            ]}
          />
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <main className={desktop || pane === 'preview' ? 'min-h-0 min-w-0 flex-1' : 'hidden'}>
          <PdfStage toolbar maxWidth={900} />
        </main>
        {(desktop || pane === 'summary') && (
          <aside className="scroll-thin min-h-0 w-full shrink-0 overflow-y-auto border-l border-line bg-surface-2/50 lg:w-[26rem]" aria-label="Review summary">
            {summary}
          </aside>
        )}
      </div>
    </div>
  )
}
