import { Check, RotateCcw } from 'lucide-react'
import { TEXT_SWATCHES } from '@/lib/palettes'
import { cn } from '@/lib/utils'

/** A round colour dot. */
export function Swatch({ color, active, onClick, label, size = 'md' }: { color: string; active: boolean; onClick: () => void; label: string; size?: 'sm' | 'md' }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn('relative rounded-full ring-offset-2 ring-offset-surface transition-transform hover:scale-110', size === 'sm' ? 'size-6' : 'size-7', active ? 'ring-2 ring-brand' : 'ring-1 ring-black/10')}
      style={{ background: color }}
    >
      {active && <Check className="absolute inset-0 m-auto size-3.5 text-white mix-blend-difference" strokeWidth={3.5} />}
    </button>
  )
}

/** The rainbow dot that opens the browser's own colour picker, so any colour is possible. */
export function ColourInput({ value, onChange, size = 'md' }: { value: string; onChange: (c: string) => void; size?: 'sm' | 'md' }) {
  return (
    <label
      title="Pick any colour"
      className={cn('relative grid cursor-pointer place-items-center overflow-hidden rounded-full ring-1 ring-black/10 transition-transform hover:scale-110', size === 'sm' ? 'size-6' : 'size-7')}
      style={{ background: 'conic-gradient(#f43f5e, #f59e0b, #84cc16, #06b6d4, #6366f1, #d946ef, #f43f5e)' }}
    >
      <span className="size-3 rounded-full bg-white ring-1 ring-black/10" style={{ background: value }} />
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 size-full cursor-pointer opacity-0" aria-label="Custom colour" />
    </label>
  )
}

/** A row of text colours, a custom colour dot and a way back to the template's own colour. */
export function TextColourRow({ value, onChange, onClear, size = 'md' }: { value: string | undefined; onChange: (c: string) => void; onClear: () => void; size?: 'sm' | 'md' }) {
  const cur = (value ?? '').toLowerCase()
  return (
    <div className="flex flex-wrap items-center gap-2">
      {TEXT_SWATCHES.map((c) => (
        <Swatch key={c.hex} color={c.hex} label={c.name} size={size} active={cur === c.hex} onClick={() => onChange(c.hex)} />
      ))}
      <ColourInput value={value ?? '#111827'} onChange={onChange} size={size} />
      {value && (
        <button type="button" onClick={onClear} className="ml-0.5 inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11.5px] font-semibold text-muted hover:border-line-strong hover:text-ink">
          <RotateCcw className="size-3" /> Template’s
        </button>
      )}
    </div>
  )
}
