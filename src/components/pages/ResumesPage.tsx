import { Copy, FilePlus2, LayoutTemplate, MoreHorizontal, PenLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PaperSkeleton } from '@/components/templates/PaperSkeleton'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Menu } from '@/components/ui/Menu'
import { Modal } from '@/components/ui/Modal'
import { useInView } from '@/lib/hooks'
import { paths } from '@/lib/routes'
import { useDocThumb } from '@/lib/thumbs'
import { timeAgo } from '@/lib/time'
import { specFor } from '@/pdf/specs'
import { useStore } from '@/store'
import type { Doc } from '@/types'
import { container, PageFrame, PageHeader } from './parts'

function DocCard({ doc, onDelete }: { doc: Doc; onDelete: () => void }) {
  const navigate = useNavigate()
  const duplicateDoc = useStore((s) => s.duplicateDoc)
  const [ref, seen] = useInView<HTMLDivElement>()
  const thumb = useDocThumb(doc, 280, seen)
  const spec = specFor(doc.settings.template)
  const to = paths.edit(doc.id, doc.isSample ? 'design' : 'content')
  return (
    <div className="group relative">
      <Link to={to} className="block w-full text-left">
        <div ref={ref} className="proof relative aspect-[1/1.4142] overflow-hidden">
          {thumb ? <img src={thumb} alt={`${doc.name} preview`} draggable={false} className="size-full object-cover object-top" /> : <PaperSkeleton />}
          {doc.isSample && <span className="absolute bottom-2 left-2 rounded-full bg-ink/85 px-2 py-0.5 text-[10.5px] font-bold text-bg">Sample</span>}
        </div>
        <p className="mt-4 truncate text-[14.5px] font-bold text-ink">{doc.name}</p>
        <p className="truncate text-[12.5px] text-muted">
          {spec.name} · edited {timeAgo(doc.updatedAt)}
        </p>
      </Link>
      <div className="absolute right-2 top-2 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
        <Menu
          trigger={() => (
            <span role="button" aria-label="More" className="grid size-8 place-items-center rounded border border-line-strong bg-bg text-ink shadow-card hover:bg-surface-2">
              <MoreHorizontal className="size-4" />
            </span>
          )}
          items={[
            { label: 'Open', icon: <PenLine className="size-4" />, onSelect: () => navigate(to) },
            ...(doc.isSample ? [] : [{ label: 'Try other templates', icon: <LayoutTemplate className="size-4" />, onSelect: () => navigate(paths.otherTemplates(doc.id)) }]),
            { label: 'Duplicate', icon: <Copy className="size-4" />, onSelect: () => duplicateDoc(doc.id) },
            { label: 'Delete', icon: <Trash2 className="size-4" />, danger: true, separatorBefore: true, onSelect: onDelete },
          ]}
        />
      </div>
    </div>
  )
}

export function ResumesPage() {
  const docs = useStore((s) => s.docs)
  const deleteDoc = useStore((s) => s.deleteDoc)
  const [target, setTarget] = useState<Doc | null>(null)
  const sorted = [...docs].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <PageFrame>
      <PageHeader label="My resumes" title={docs.length ? <>Pick up where you <em>left off.</em></> : <>Nothing here yet.</>} sub="Saved privately in this browser. Nothing is uploaded." />
      <section className={`${container} pt-12`}>
        {docs.length ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            <Link
              to={paths.templates()}
              className="group flex aspect-[1/1.4142] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-line-strong bg-surface-2/50 text-muted transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
            >
              <span className="grid size-12 place-items-center rounded-full border border-line-strong bg-surface transition-transform group-hover:scale-105">
                <FilePlus2 className="size-5" />
              </span>
              <span className="text-[14px] font-bold">New resume</span>
            </Link>
            {sorted.map((d) => (
              <DocCard key={d.id} doc={d} onDelete={() => setTarget(d)} />
            ))}
          </div>
        ) : (
          <div className="grid place-items-center rounded-3xl bg-surface-2 px-6 py-24 text-center">
            <p className="font-display text-[28px] text-ink">Create your first resume in a few minutes.</p>
            <ButtonLink to={paths.templates()} variant="primary" size="lg" className="mt-6">
              <FilePlus2 className="size-4" /> Create a resume
            </ButtonLink>
          </div>
        )}
      </section>

      <Modal open={!!target} onClose={() => setTarget(null)} title="Delete this resume?" description={target ? `"${target.name}" will be removed from this browser. This cannot be undone.` : undefined}>
        <div className="flex justify-end gap-2 px-6 py-5">
          <Button variant="secondary" onClick={() => setTarget(null)}>
            Keep it
          </Button>
          <Button
            variant="primary"
            className="!bg-bad !shadow-none hover:!bg-bad/90"
            onClick={() => {
              if (target) deleteDoc(target.id)
              setTarget(null)
            }}
          >
            <Trash2 className="size-4" /> Delete
          </Button>
        </div>
      </Modal>
    </PageFrame>
  )
}
