import { useLayoutEffect, useRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const inputCls =
  'w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-faint outline-none transition-[border-color,box-shadow] hover:border-faint focus:border-brand focus:ring-4 focus:ring-brand/15'

export function Field({
  label,
  hint,
  children,
  className,
  right,
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
  right?: ReactNode
}) {
  return (
    <label className={cn('block min-w-0', className)}>
      <span className="mb-1.5 flex items-center justify-between gap-2 text-[12px] font-medium tracking-wide text-muted">
        <span>{label}</span>
        {right}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-[11.5px] leading-snug text-faint">{hint}</span> : null}
    </label>
  )
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputCls, 'h-10', className)} {...props} />
}

export function TextArea({
  className,
  minRows = 3,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { minRows?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const value = props.value

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight + 2}px`
  }, [value])

  return (
    <textarea
      ref={ref}
      rows={minRows}
      className={cn(inputCls, 'resize-none py-2.5 leading-relaxed', className)}
      {...props}
    />
  )
}
