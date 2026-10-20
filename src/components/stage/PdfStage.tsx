import { AnimatePresence, motion } from 'motion/react'
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  LoaderCircle,
  Maximize2,
  MousePointerClick,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useDownload } from '@/lib/download'
import { fitToOnePage } from '@/lib/fit'
import { useDebounced } from '@/lib/hooks'
import { clamp, cn } from '@/lib/utils'
import { renderResume, SupersededError } from '@/pdf/client'
import { PAGE_DIMENSIONS } from '@/pdf/specs'
import type { Block, PdfDoc } from '@/pdf/pdfjs'
import { useStore } from '@/store'
import { BlockOverlay } from './BlockOverlay'
import { PdfPage } from './PdfPage'
import { getPreviewBlob, setPreviewBlob } from './previewBlob'

const ZOOM_STEPS = [0.5, 0.65, 0.8, 0.9, 1, 1.15, 1.3, 1.5, 1.75, 2]
const GAP = 28

interface Props {
  /** draw drag handles over the pages (editor) */
  interactive?: boolean
  /** show the floating zoom / page toolbar */
  toolbar?: boolean
  /** widest a page may grow at 100% */
  maxWidth?: number
  className?: string
}

export function PdfStage({ interactive = false, toolbar = true, maxWidth = 860, className }: Props) {
  const data = useStore((s) => s.data)
  const settings = useStore((s) => s.settings)
  const dragging = useStore((s) => s.dragging)
  const adjust = useStore((s) => s.adjustLayout)
  const setAdjust = useStore((s) => s.setAdjustLayout)
  const setPageCount = useStore((s) => s.setPageCount)
  const select = useStore((s) => s.select)
  const { download, busy: downloading } = useDownload()

  const request = useMemo(() => ({ data, settings }), [data, settings])
  const debounced = useDebounced(request, dragging ? 30 : 280)

  const [view, setView] = useState<{ doc: PdfDoc; blocks: Block[] } | null>(null)
  const [settled, setSettled] = useState<typeof debounced | null>(null)
  const rendering = settled !== debounced
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  /* ── produce the PDF ── */
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const blob = await renderResume(debounced.data, debounced.settings, { priority: 'high', channel: 'preview', markers: interactive })
        if (cancelled) return
        const { loadPdf, destroyPdf, readBlocks } = await import('@/pdf/pdfjs')
        const next = await loadPdf(blob)
        const blocks = interactive ? (await readBlocks(next)).blocks : []
        if (cancelled) {
          destroyPdf(next)
          return
        }
        setPreviewBlob(blob)
        setPageCount(next.numPages)
        setError(null)
        setView((prev) => {
          // let in-flight page renders on the old document finish before releasing it
          if (prev) setTimeout(() => destroyPdf(prev.doc), 1500)
          return { doc: next, blocks }
        })
      } catch (err) {
        if (err instanceof SupersededError || cancelled) return
        setError(err instanceof Error ? err.message : 'Rendering failed')
      } finally {
        if (!cancelled) setSettled(debounced)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [debounced, retry, setPageCount, interactive])

  /* ── layout ── */
  const scroller = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [zoom, setZoom] = useState(1)
  const [current, setCurrent] = useState(1)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setBox({ w: Math.round(entry.contentRect.width), h: Math.round(entry.contentRect.height) }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const dims = PAGE_DIMENSIONS[settings.pageSize]
  const aspect = dims.h / dims.w
  const fit = clamp(box.w - 48, 260, maxWidth)
  const pageW = Math.round(fit * zoom)
  const pageH = pageW * aspect
  const k = pageW / dims.w
  const pages = view?.doc.numPages ?? 1

  const onScroll = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const idx = Math.floor((el.scrollTop + el.clientHeight * 0.4 - 28) / (pageH + GAP + 30)) + 1
    setCurrent(clamp(idx, 1, pages))
  }, [pageH, pages])

  const goTo = (n: number) => {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ top: (clamp(n, 1, pages) - 1) * (pageH + GAP + 30), behavior: 'smooth' })
  }

  const zoomBy = (dir: 1 | -1) =>
    setZoom((z) => {
      const i = ZOOM_STEPS.findIndex((s) => s >= z - 0.001)
      return ZOOM_STEPS[clamp((i < 0 ? ZOOM_STEPS.length - 1 : i) + dir, 0, ZOOM_STEPS.length - 1)]
    })

  const openInTab = () => {
    const blob = getPreviewBlob()
    if (blob) window.open(URL.createObjectURL(blob), '_blank', 'noopener')
  }

  // keyboard nudging for the selected block
  const selected = useStore((s) => s.selected)
  useEffect(() => {
    if (!interactive || !selected) return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      const st = useStore.getState()
      if (e.key === 'Escape') st.select(null)
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        const step = e.shiftKey ? 10 : 2
        const cur = st.settings.spacing[selected] ?? 0
        st.setSpacing(selected, clamp(cur + (e.key === 'ArrowDown' ? step : -step), -24, 160))
      } else if (e.key === 'Delete' || e.key === 'Backspace') st.setSpacing(selected, null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [interactive, selected])

  const ready = !!view
  const showHandles = interactive && adjust && ready

  return (
    <div className={cn('stage relative flex h-full min-h-0 flex-col', className)}>
      <div
        ref={scroller}
        onScroll={onScroll}
        onPointerDown={(e) => {
          if (interactive && !(e.target as HTMLElement).closest('[data-block],[role=toolbar]')) select(null)
        }}
        className="scroll-thin min-h-0 flex-1 overflow-auto"
      >
        <div className="mx-auto flex flex-col items-center px-6 pb-36 pt-9" style={{ width: Math.max(pageW + 48, box.w), gap: GAP }}>
          {view ? (
            Array.from({ length: pages }).map((_, i) => (
              <PdfPage key={i} doc={view.doc} pageNumber={i + 1} width={pageW} aspect={aspect} total={pages}>
                {showHandles && <BlockOverlay page={i} blocks={view.blocks} k={k} pageW={pageW} pageH={pageH} />}
              </PdfPage>
            ))
          ) : (
            <div className="relative overflow-hidden rounded-[2px] bg-white shadow-paper ring-1 ring-black/[0.06]" style={{ width: pageW, height: pageH }}>
              <div className="skeleton absolute inset-0 opacity-70" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-bg shadow-lg">
                  <LoaderCircle className="size-4 animate-spin" /> Rendering your resume…
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* status */}
      <div className="pointer-events-none absolute left-1/2 top-4 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
        <AnimatePresence>
          {ready && rendering && !error && !dragging && (
            <motion.div
              key="updating"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted shadow-card"
            >
              <LoaderCircle className="size-3.5 animate-spin text-brand" /> Updating
            </motion.div>
          )}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-bad/30 bg-surface px-3.5 py-1.5 text-xs font-semibold text-bad shadow-card"
            >
              <AlertTriangle className="size-3.5" /> Couldn’t render the preview
              <button type="button" className="rounded-full bg-bad/10 px-2 py-0.5 hover:bg-bad/20" onClick={() => setRetry((n) => n + 1)}>
                Retry
              </button>
            </motion.div>
          )}
          {interactive && ready && pages > 1 && !rendering && (
            <motion.button
              key="fit"
              type="button"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onClick={() => void fitToOnePage()}
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-bg shadow-pop hover:opacity-90"
            >
              <Sparkles className="size-3.5" /> {pages} pages · Fit to one page
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {interactive && adjust && ready && !dragging && (
        <p className="pointer-events-none absolute bottom-[4.9rem] left-1/2 z-10 hidden -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-medium text-bg backdrop-blur lg:flex">
          <MousePointerClick className="size-3" /> Hover a section, then drag the green handles to adjust spacing or order
        </p>
      )}

      {toolbar && (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-3 max-lg:bottom-[4.75rem]">
          <div className="pointer-events-auto flex items-center gap-0.5 rounded-xl border border-line bg-surface p-1 shadow-pop">
            <Button variant="ghost" size="icon" onClick={() => zoomBy(-1)} aria-label="Zoom out" title="Zoom out" disabled={zoom <= ZOOM_STEPS[0]}>
              <ZoomOut className="size-4" />
            </Button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              title="Reset zoom"
              className="h-9 min-w-[3.4rem] rounded-lg px-1 text-center font-mono text-xs tabular-nums text-ink hover:bg-surface-2"
            >
              {Math.round(zoom * 100)}%
            </button>
            <Button variant="ghost" size="icon" onClick={() => zoomBy(1)} aria-label="Zoom in" title="Zoom in" disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}>
              <ZoomIn className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setZoom(1)} aria-label="Fit to width" title="Fit to width">
              <Maximize2 className="size-4" />
            </Button>

            <span className="mx-1 h-5 w-px bg-line" />

            <Button variant="ghost" size="icon" onClick={() => goTo(current - 1)} disabled={current <= 1} aria-label="Previous page">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[3.2rem] text-center font-mono text-xs tabular-nums text-muted">
              {current} / {pages}
            </span>
            <Button variant="ghost" size="icon" onClick={() => goTo(current + 1)} disabled={current >= pages} aria-label="Next page">
              <ChevronRight className="size-4" />
            </Button>

            {interactive && (
              <>
                <span className="mx-1 h-5 w-px bg-line" />
                <button
                  type="button"
                  onClick={() => setAdjust(!adjust)}
                  aria-pressed={adjust}
                  title="Drag sections in the preview to adjust spacing and order"
                  className={cn(
                    'flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-colors',
                    adjust ? 'bg-brand-soft text-brand' : 'text-muted hover:bg-surface-2 hover:text-ink',
                  )}
                >
                  <MousePointerClick className="size-4" />
                  <span className="hidden sm:inline">Adjust layout</span>
                </button>
              </>
            )}

            <span className="mx-1 hidden h-5 w-px bg-line sm:block" />
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" onClick={openInTab} aria-label="Open PDF in a new tab" title="Open in new tab" disabled={!ready}>
              <ExternalLink className="size-4" />
            </Button>
            <Button variant="primary" size="sm" className="ml-1 hidden h-9 sm:inline-flex" onClick={download} disabled={downloading || !ready}>
              {downloading ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
