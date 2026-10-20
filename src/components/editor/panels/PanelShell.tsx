import type { ReactNode } from 'react'

/** Shared chrome of every left-hand panel: title, blurb, scrollable body. */
export function PanelShell({
  title,
  blurb,
  action,
  children,
}: {
  title: string
  blurb?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <>
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-5 pb-3.5 pt-4">
        <div className="min-w-0">
          <h2 className="font-display text-[20px] leading-tight text-ink">{title}</h2>
          {blurb ? <p className="mt-0.5 text-[13px] leading-snug text-muted">{blurb}</p> : null}
        </div>
        {action}
      </div>
      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-4 pb-24 pt-4 lg:pb-10">{children}</div>
    </>
  )
}
