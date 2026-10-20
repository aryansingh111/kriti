import {
  ArrowDown,
  ArrowUp,
  Baseline,
  ChevronsUpDown,
  CornerLeftUp,
  EyeOff,
  GripVertical,
  Minus,
  PenLine,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { TextColourRow } from '@/components/editor/ColourPicker'
import { blockLabel, focusTarget } from '@/lib/blocklabel'
import { cn, clamp } from '@/lib/utils'
import type { Block, BlockRect } from '@/pdf/pdfjs'
import { sectionOfItem } from '@/pdf/markers'
import { useStore } from '@/store'
import type { SectionKey } from '@/types'

const MIN_OFFSET = -24
const MAX_OFFSET = 160

interface Props {
  page: number
  blocks: Block[]
  /** CSS pixels per PDF point */
  k: number
  pageW: number
  pageH: number
}

/** Draggable handles drawn over one page of the preview – the "drag it to adjust spacing" layer. */
export function BlockOverlay({ page, blocks, k, pageW, pageH }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = useStore((s) => s.selected)
  const select = useStore((s) => s.select)
  const settings = useStore((s) => s.settings)
  const data = useStore((s) => s.data)
  const setSpacing = useStore((s) => s.setSpacing)
  const setDragging = useStore((s) => s.setDragging)
  const moveBlock = useStore((s) => s.moveBlock)
  const [hover, setHover] = useState<string | null>(null)
  const [drag, setDrag] = useState<{ id: string; offset: number } | null>(null)

  // reorder drags must wait for the new layout before swapping again
  const lock = useRef<Block[] | null>(null)
  useEffect(() => {
    lock.current = null
  }, [blocks])

  const here = blocks
    .map((b) => ({ b, r: b.rects.find((r) => r.page === page) }))
    .filter((x): x is { b: Block; r: BlockRect } => !!x.r)
    // sections first, items above them, header last – so the smallest block under the pointer wins
    .sort((a, b) => ({ section: 0, item: 1, header: 2 })[a.b.kind] - ({ section: 0, item: 1, header: 2 })[b.b.kind])

  const offsetOf = (id: string) => settings.spacing[id] ?? 0

  /* ── drag: adjust the space above a block ── */
  const startSpacing = (e: RPointerEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    const startY = e.clientY
    const base = offsetOf(id)
    setDragging(true)
    select(id)
    let raf = 0
    const move = (ev: PointerEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const v = clamp(Math.round((base + (ev.clientY - startY) / k) / 2) * 2, MIN_OFFSET, MAX_OFFSET)
        setDrag({ id, offset: v })
        setSpacing(id, v)
      })
    }
    const up = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      setDragging(false)
      setDrag(null)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
  }

  /* ── drag: move a block up / down among its siblings ── */
  const startReorder = (e: RPointerEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    select(id)
    setDragging(true)
    const siblings = (b: Block) => {
      const mine = b.rects.find((r) => r.page === page)!
      const sec = sectionOfItem(b.id)
      return blocks
        .filter((o) => o.kind === b.kind && o.id !== 'hdr' && (b.kind === 'section' || sectionOfItem(o.id) === sec))
        .map((o) => ({ o, r: o.rects.find((r) => r.page === page) }))
        .filter((x): x is { o: Block; r: BlockRect } => !!x.r && x.r.x < mine.x + mine.w * 0.7 && x.r.x + x.r.w > mine.x + mine.w * 0.3)
        .sort((a, c) => a.r.y - c.r.y)
    }
    const move = (ev: PointerEvent) => {
      if (lock.current === blocks) return
      const box = rootRef.current?.getBoundingClientRect()
      const cur = blocks.find((b) => b.id === id)
      if (!box || !cur) return
      const yPt = (ev.clientY - box.top) / k
      const list = siblings(cur)
      const i = list.findIndex((x) => x.o.id === id)
      if (i < 0) return
      const next = list[i + 1]
      const prev = list[i - 1]
      if (next && yPt > next.r.y + next.r.h / 2) {
        lock.current = blocks
        moveBlock(id, 1)
      } else if (prev && yPt < prev.r.y + prev.r.h / 2) {
        lock.current = blocks
        moveBlock(id, -1)
      }
    }
    const up = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      setDragging(false)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
  }

  const sel = here.find((x) => x.b.id === selected)

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 z-10" style={{ width: pageW, height: pageH }}>
      {here.map(({ b, r }) => {
        const active = selected === b.id
        const hot = hover === b.id || active
        const label = blockLabel(b.id, data, settings)
        const off = drag?.id === b.id ? drag.offset : offsetOf(b.id)
        return (
          <div
            key={b.id}
            data-block={b.id}
            onPointerEnter={() => setHover(b.id)}
            onPointerLeave={() => setHover((h) => (h === b.id ? null : h))}
            onClick={(e) => {
              e.stopPropagation()
              select(active ? null : b.id)
            }}
            className={cn(
              'pointer-events-auto absolute rounded-[3px] transition-[background-color,box-shadow] duration-100',
              active
                ? 'bg-brand/[0.06] shadow-[0_0_0_1.5px_var(--brand)]'
                : hot
                  ? 'bg-brand/[0.04] shadow-[0_0_0_1.5px_color-mix(in_srgb,var(--brand)_70%,transparent)]'
                  : 'hover:bg-brand/[0.03]',
            )}
            style={{ left: r.x * k - 3, top: r.y * k - 2, width: r.w * k + 6, height: r.h * k + 4 }}
          >
            {hot && (
              <>
                <span className="pointer-events-none absolute -top-[18px] left-0 max-w-[70%] truncate rounded-t-md bg-brand px-1.5 py-[1px] text-[10px] font-semibold leading-[15px] text-brand-ink">
                  {label}
                  {off !== 0 && <span className="ml-1.5 opacity-80">{off > 0 ? `+${off}` : off}pt</span>}
                </span>
                {/* space-above handle */}
                <button
                  type="button"
                  aria-label={`Drag to change the space above ${label}`}
                  title="Drag up / down to adjust spacing"
                  onPointerDown={(e) => startSpacing(e, b.id)}
                  className="absolute -top-[11px] left-1/2 flex h-[18px] w-9 -translate-x-1/2 cursor-ns-resize touch-none items-center justify-center rounded-full bg-brand text-brand-ink shadow-md ring-2 ring-white/90 hover:scale-110"
                >
                  <ChevronsUpDown className="size-3" strokeWidth={2.6} />
                </button>
                {/* reorder grip */}
                {b.kind !== 'header' && (
                  <button
                    type="button"
                    aria-label={`Drag to move ${label}`}
                    title="Drag to reorder"
                    onPointerDown={(e) => startReorder(e, b.id)}
                    className="absolute -left-[11px] top-1/2 flex h-9 w-[18px] -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-full bg-brand text-brand-ink shadow-md ring-2 ring-white/90 hover:scale-110 active:cursor-grabbing"
                  >
                    <GripVertical className="size-3" strokeWidth={2.6} />
                  </button>
                )}
              </>
            )}
          </div>
        )
      })}

      {sel && <BlockToolbar block={sel.b} rect={sel.r} k={k} pageW={pageW} offset={offsetOf(sel.b.id)} />}
    </div>
  )
}

/** Floating actions for the selected block. */
function BlockToolbar({ block, rect, k, pageW, offset }: { block: Block; rect: BlockRect; k: number; pageW: number; offset: number }) {
  const setSpacing = useStore((s) => s.setSpacing)
  const select = useStore((s) => s.select)
  const moveBlock = useStore((s) => s.moveBlock)
  const requestFocus = useStore((s) => s.requestFocus)
  const blockColor = useStore((s) => s.settings.blockColors[block.id])
  const setBlockColor = useStore((s) => s.setBlockColor)
  const [colourOpen, setColourOpen] = useState(false)
  const toggleSection = useStore((s) => s.toggleSection)
  const isSection = block.kind === 'section'
  const parent = block.kind === 'item' ? sectionOfItem(block.id) : null

  const width = 366
  const left = clamp((rect.x + rect.w / 2) * k - width / 2, 4, Math.max(4, pageW - width - 4))
  const top = Math.max(4, rect.y * k - 52)

  const btn = 'grid size-8 place-items-center rounded-lg text-white/90 transition-colors hover:bg-white/15 disabled:opacity-40'
  const nudge = (d: number) => setSpacing(block.id, clamp(offset + d, MIN_OFFSET, MAX_OFFSET))

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="pointer-events-auto absolute z-20 flex items-center gap-0.5 rounded-xl bg-ink px-1 py-1 text-white shadow-pop"
      style={{ left, top, width }}
      role="toolbar"
      aria-label="Block actions"
    >
      {block.kind !== 'header' && (
        <>
          <button className={btn} onClick={() => moveBlock(block.id, -1)} title="Move up" aria-label="Move up">
            <ArrowUp className="size-4" />
          </button>
          <button className={btn} onClick={() => moveBlock(block.id, 1)} title="Move down" aria-label="Move down">
            <ArrowDown className="size-4" />
          </button>
          <span className="mx-0.5 h-5 w-px bg-white/20" />
        </>
      )}
      <button className={btn} onClick={() => nudge(-2)} title="Less space above" aria-label="Less space above">
        <Minus className="size-4" />
      </button>
      <span className="min-w-[3.1rem] text-center font-mono text-[11px] tabular-nums">{offset > 0 ? `+${offset}` : offset} pt</span>
      <button className={btn} onClick={() => nudge(2)} title="More space above" aria-label="More space above">
        <Plus className="size-4" />
      </button>
      <button className={btn} onClick={() => setSpacing(block.id, null)} disabled={offset === 0} title="Reset spacing" aria-label="Reset spacing">
        <RotateCcw className="size-3.5" />
      </button>
      <span className="mx-0.5 h-5 w-px bg-white/20" />
      <button className={cn(btn, colourOpen && 'bg-white/20')} onClick={() => setColourOpen((o) => !o)} title="Text colour" aria-label="Text colour" aria-expanded={colourOpen}>
        <span className="flex flex-col items-center gap-px">
          <Baseline className="size-4" />
          <i className="block h-[3px] w-4 rounded-full" style={{ background: blockColor ?? 'rgba(255,255,255,0.35)' }} />
        </span>
      </button>
      <button
        className={btn}
        onClick={() => {
          const t = focusTarget(block.id)
          requestFocus(t.kind, t.id)
        }}
        title="Edit content"
        aria-label="Edit content"
      >
        <PenLine className="size-4" />
      </button>
      {isSection && (
        <button className={btn} onClick={() => toggleSection(block.id.slice(4) as SectionKey)} title="Hide this section" aria-label="Hide this section">
          <EyeOff className="size-4" />
        </button>
      )}
      {parent && (
        <button className={btn} onClick={() => select(parent)} title="Select the whole section" aria-label="Select the whole section">
          <CornerLeftUp className="size-4" />
        </button>
      )}
      <button className={cn(btn, 'ml-auto')} onClick={() => select(null)} title="Deselect" aria-label="Deselect">
        <X className="size-4" />
      </button>

      {colourOpen && (
        <div className="absolute left-0 top-full z-30 mt-2 w-[326px] rounded-xl border border-line bg-surface p-3.5 text-ink shadow-pop">
          <p className="mb-2.5 text-[12px] font-bold text-muted">Text colour of this {block.kind === 'header' ? 'header' : block.kind === 'section' ? 'section' : 'entry'}</p>
          <TextColourRow value={blockColor} onChange={(c) => setBlockColor(block.id, c)} onClear={() => setBlockColor(block.id, null)} size="sm" />
        </div>
      )}
    </div>
  )
}

