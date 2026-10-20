import { motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { drawPage, type PdfDoc } from '@/pdf/pdfjs'

export function PdfPage({
  doc,
  pageNumber,
  width,
  aspect,
  total,
  children,
  label = true,
}: {
  doc: PdfDoc
  pageNumber: number
  width: number
  /** height / width of the page */
  aspect: number
  total: number
  /** interactive overlay drawn above the canvas */
  children?: ReactNode
  label?: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cancelled = false
    const canvas = ref.current
    if (!canvas) return
    // Small delay so rapid zoom/resize doesn't queue a render per frame.
    const t = setTimeout(() => {
      if (!cancelled) void drawPage(doc, pageNumber, canvas, width).catch(() => undefined)
    }, 50)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [doc, pageNumber, width])

  return (
    <motion.figure
      data-page={pageNumber}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(pageNumber - 1, 3) * 0.05 }}
      className="m-0 flex flex-col items-center"
    >
      <div className="relative rounded-[2px] bg-white shadow-paper ring-1 ring-black/[0.06]" style={{ width, height: width * aspect }}>
        <canvas ref={ref} className="block size-full rounded-[2px]" aria-label={`Resume page ${pageNumber} of ${total}`} />
        {children}
      </div>
      {label && total > 1 && (
        <figcaption className="mt-3 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-semibold text-muted shadow-sm">
          Page {pageNumber} of {total}
        </figcaption>
      )}
    </motion.figure>
  )
}
