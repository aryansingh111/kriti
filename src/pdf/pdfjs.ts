import * as pdfjs from 'pdfjs-dist'
import { MARK_PREFIX, sectionOfItem } from './markers'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

export type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
export type PdfDoc = Awaited<ReturnType<typeof loadPdf>>

// One long-lived pdf.js worker shared by every document – spawning one per render would be wasteful.
let sharedWorker: pdfjs.PDFWorker | null = null

export async function loadPdf(blob: Blob) {
  sharedWorker ??= pdfjs.PDFWorker.create({ name: 'kriti' })
  const data = new Uint8Array(await blob.arrayBuffer())
  return pdfjs.getDocument({ data, worker: sharedWorker }).promise
}

/** Release a document's resources (the shared worker stays alive). */
export function destroyPdf(doc: PdfDoc) {
  void doc.loadingTask.destroy().catch(() => undefined)
}

/**
 * Draw a PDF page into `target` at `cssWidth` CSS pixels (× devicePixelRatio).
 * Renders off-screen first and blits in one go so the visible canvas never flashes blank.
 */
export async function drawPage(doc: PdfDoc, pageNumber: number, target: HTMLCanvasElement, cssWidth: number, maxDpr = 2.5) {
  const page = await doc.getPage(pageNumber)
  const base = page.getViewport({ scale: 1 })
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
  // never ask for a bitmap wider than most GPUs can sample comfortably
  const scale = Math.min((cssWidth / base.width) * dpr, 4096 / base.width)
  const viewport = page.getViewport({ scale })

  const off = document.createElement('canvas')
  off.width = Math.ceil(viewport.width)
  off.height = Math.ceil(viewport.height)
  const ctx = off.getContext('2d')!
  await page.render({ canvas: off, canvasContext: ctx, viewport }).promise

  target.width = off.width
  target.height = off.height
  target.getContext('2d')!.drawImage(off, 0, 0)
  return { width: base.width, height: base.height }
}

/* ────────────────────────────── block layout (drag handles) ────────────────────────────── */

export interface BlockRect {
  /** 0-based page index */
  page: number
  /** PDF points, origin top-left */
  x: number
  y: number
  w: number
  h: number
}

export interface Block {
  /** `sec:experience`, `item:experience:abc`, `hdr` … */
  id: string
  kind: 'section' | 'item' | 'header'
  /** one bounding box per page the block touches */
  rects: BlockRect[]
}

function merge(list: BlockRect[]): BlockRect[] {
  const byPage = new Map<number, BlockRect>()
  for (const r of list) {
    const m = byPage.get(r.page)
    if (!m) byPage.set(r.page, { ...r })
    else {
      const x2 = Math.max(m.x + m.w, r.x + r.w)
      const y2 = Math.max(m.y + m.h, r.y + r.h)
      m.x = Math.min(m.x, r.x)
      m.y = Math.min(m.y, r.y)
      m.w = x2 - m.x
      m.h = y2 - m.y
    }
  }
  return [...byPage.values()].sort((a, b) => a.page - b.page)
}

/**
 * Reads the invisible link annotations the preview render writes (see `Mark`) and turns them into rectangles,
 * so the UI knows where every header, section and entry landed on the page.
 */
export async function readBlocks(doc: PdfDoc): Promise<{ blocks: Block[]; pageSizes: { w: number; h: number }[] }> {
  const pageSizes: { w: number; h: number }[] = []
  const raw = new Map<string, BlockRect[]>()
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const vp = page.getViewport({ scale: 1 })
    pageSizes.push({ w: vp.width, h: vp.height })
    for (const a of await page.getAnnotations()) {
      const url: unknown = a.url ?? a.unsafeUrl
      if (a.subtype !== 'Link' || typeof url !== 'string' || !url.startsWith(MARK_PREFIX)) continue
      const id = decodeURIComponent(url.slice(MARK_PREFIX.length))
      const [x1, y1, x2, y2] = a.rect as number[]
      const r: BlockRect = {
        page: i - 1,
        x: Math.min(x1, x2),
        y: vp.height - Math.max(y1, y2),
        w: Math.abs(x2 - x1),
        h: Math.abs(y2 - y1),
      }
      raw.set(id, [...(raw.get(id) ?? []), r])
    }
  }

  const sections = new Map<string, BlockRect[]>()
  const blocks: Block[] = []
  for (const [id, rects] of raw) {
    if (id === 'hdr') blocks.push({ id, kind: 'header', rects: merge(rects) })
    else if (id.startsWith('item:')) {
      blocks.push({ id, kind: 'item', rects: merge(rects) })
      const sec = sectionOfItem(id)
      if (sec) sections.set(sec, [...(sections.get(sec) ?? []), ...rects])
    } else if (id.startsWith('sec:')) sections.set(id, [...(sections.get(id) ?? []), ...rects])
  }
  for (const [id, rects] of sections) blocks.push({ id, kind: 'section', rects: merge(rects) })
  return { blocks, pageSizes }
}
