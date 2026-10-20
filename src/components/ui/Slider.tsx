import { type CSSProperties } from 'react'

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format?: (v: number) => string
}) {
  const fill = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between text-[12px] font-medium text-muted">
        <span>{label}</span>
        <span className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-ink tabular-nums">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        style={{ '--fill': `${fill}%` } as CSSProperties}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
