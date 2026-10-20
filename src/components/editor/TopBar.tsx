import {
  Check,
  CloudCheck,
  Copy,
  Download,
  Eraser,
  FileDown,
  FileText,
  FileUp,
  Home,
  LoaderCircle,
  MoreHorizontal,
  Redo2,
  ScanEye,
  Sparkles,
  Undo2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Menu, type MenuItem } from '@/components/ui/Menu'
import { useDownload } from '@/lib/download'
import { resumeText } from '@/lib/resume'
import { paths, type Rail } from '@/lib/routes'
import { cn, downloadBlob, fileSafeName } from '@/lib/utils'
import { useActiveDoc, useStore } from '@/store'

export function SavedIndicator() {
  const savedAt = useStore((s) => s.savedAt)
  const [saving, setSaving] = useState(false)
  const isSaving = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  // Only touch React state on real transitions – calling setState on every keystroke from an effect
  // trips React's nested-update guard during fast typing.
  useEffect(() => {
    if (savedAt === 0) return
    if (!isSaving.current) {
      isSaving.current = true
      setSaving(true)
    }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      isSaving.current = false
      setSaving(false)
    }, 650)
  }, [savedAt])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <div className="hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-muted md:flex" aria-live="polite" title="Your work is saved in this browser">
      {saving ? (
        <>
          <LoaderCircle className="size-3.5 animate-spin" /> Saving…
        </>
      ) : (
        <>
          <CloudCheck className="size-4 text-ok" /> Saved
        </>
      )}
    </div>
  )
}

const STEPS: { label: string; rail?: Rail; review?: boolean }[] = [
  { label: 'Template', rail: 'templates' },
  { label: 'Design', rail: 'design' },
  { label: 'Content', rail: 'content' },
  { label: 'Review', review: true },
]

function Stepper({ rail }: { rail: Rail }) {
  const activeId = useStore((s) => s.activeId)
  const active = rail === 'templates' ? 0 : rail === 'design' ? 1 : 2

  return (
    <ol className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 xl:flex" aria-label="Progress">
      {STEPS.map((st, i) => {
        const done = i < active
        const on = i === active
        return (
          <li key={st.label} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden className={cn('h-0.5 w-6 rounded-full', done || on ? 'bg-brand/40' : 'bg-line-strong')} />}
            <Link
              to={st.review ? paths.review(activeId) : paths.edit(activeId, st.rail!)}
              className={cn('flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition-colors', on ? 'bg-brand-soft' : 'hover:bg-surface-2')}
            >
              <span
                className={cn(
                  'grid size-6 place-items-center rounded-full text-[11px] font-bold',
                  on ? 'bg-brand text-brand-ink' : done ? 'bg-ok/15 text-ok' : 'bg-surface-3 text-muted',
                )}
              >
                {done ? <Check className="size-3" strokeWidth={3.5} /> : i + 1}
              </span>
              <span className={cn('text-[13px] font-semibold', on ? 'text-brand' : 'text-muted')}>{st.label}</span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

export function TopBar({ rail }: { rail: Rail }) {
  const navigate = useNavigate()
  const doc = useActiveDoc()
  const renameDoc = useStore((s) => s.renameDoc)
  const canUndo = useStore((s) => s.canUndo)
  const canRedo = useStore((s) => s.canRedo)
  const undo = useStore((s) => s.undo)
  const redo = useStore((s) => s.redo)
  const { download, busy } = useDownload()
  const fileInput = useRef<HTMLInputElement>(null)

  const exportJson = () => {
    const { data, settings } = useStore.getState()
    const blob = new Blob([JSON.stringify({ app: 'kriti', version: 2, data, settings }, null, 2)], { type: 'application/json' })
    downloadBlob(blob, `${fileSafeName(data.basics.fullName || doc?.name || 'Resume')}_kriti.json`)
    toast.success('Data exported', { description: 'Import it later to pick up where you left off.' })
  }

  const withUndo = (message: string, action: () => void) => {
    action()
    toast(message, { action: { label: 'Undo', onClick: () => useStore.getState().undo() } })
  }

  const onImport = async (file?: File) => {
    if (!file) return
    const res = useStore.getState().importJson(await file.text())
    if (res.ok) toast.success('Imported', { description: file.name, action: { label: 'Undo', onClick: () => useStore.getState().undo() } })
    else toast.error(res.error)
  }

  const items: MenuItem[] = [
    { label: 'Review & download page', icon: <ScanEye className="size-4" />, onSelect: () => navigate(paths.review(doc?.id ?? '')) },
    { label: 'Export data (.json)', separatorBefore: true, icon: <FileDown className="size-4" />, onSelect: exportJson },
    { label: 'Import data…', icon: <FileUp className="size-4" />, onSelect: () => fileInput.current?.click() },
    {
      label: 'Copy as plain text',
      icon: <FileText className="size-4" />,
      onSelect: () => {
        const { data, settings } = useStore.getState()
        void navigator.clipboard.writeText(resumeText(data, settings)).then(() => toast.success('Copied to clipboard'))
      },
    },
    {
      label: 'Duplicate this resume',
      icon: <Copy className="size-4" />,
      onSelect: () => {
        const id = useStore.getState().activeId
        useStore.getState().duplicateDoc(id)
        toast.success('Duplicated', { description: 'Find the copy on your home page.' })
      },
    },
    {
      label: 'Load sample content',
      icon: <Sparkles className="size-4" />,
      separatorBefore: true,
      onSelect: () => withUndo('Sample content loaded', () => useStore.getState().loadSample()),
    },
    {
      label: 'Clear all content',
      icon: <Eraser className="size-4" />,
      danger: true,
      onSelect: () => withUndo('Resume cleared', () => useStore.getState().clearAll()),
    },
    { label: 'My resumes', icon: <Home className="size-4" />, separatorBefore: true, onSelect: () => navigate(paths.resumes) },
  ]

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-line bg-surface px-2 sm:px-4">
      <div className="flex min-w-0 items-center gap-1.5">
        <Link to={paths.home} aria-label="Kriti home" className="rounded p-1">
          <Logo compact className="sm:hidden" />
          <Logo className="hidden sm:flex" />
        </Link>
        <span className="mx-1 hidden h-6 w-px bg-line sm:block" />
        <input
          value={doc?.name ?? ''}
          onChange={(e) => doc && renameDoc(doc.id, e.target.value)}
          aria-label="Resume name"
          maxLength={60}
          className="h-9 w-28 rounded-lg border border-transparent bg-transparent px-2 text-sm font-semibold text-ink outline-none transition-colors hover:bg-surface-2 focus:border-brand focus:bg-surface sm:w-48"
        />
        <div className="ml-1 hidden items-center sm:flex">
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} aria-label="Undo" title="Undo (Ctrl/⌘ Z)">
            <Undo2 className="size-[18px]" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} aria-label="Redo" title="Redo (Ctrl/⌘ Shift Z)">
            <Redo2 className="size-[18px]" />
          </Button>
        </div>
      </div>

      <Stepper rail={rail} />

      <div className="flex items-center gap-1">
        <SavedIndicator />
        <ThemeToggle />
        <Menu
          items={items}
          trigger={() => (
            <Button variant="ghost" size="icon" aria-label="File menu" title="More">
              <MoreHorizontal className="size-5" />
            </Button>
          )}
        />
        <ButtonLink to={paths.review(doc?.id ?? '')} variant="secondary" size="md" className="hidden sm:inline-flex">
          <ScanEye className="size-4" /> Review
        </ButtonLink>
        <Button variant="primary" size="md" onClick={download} disabled={busy} className="ml-0.5 px-3 sm:px-4">
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
          <span className="hidden sm:inline">Download</span>
        </Button>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          void onImport(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </header>
  )
}

