import type { ReactNode } from 'react'

/** Paragraph and list styles shared by the policy text. */
export const P = ({ children }: { children: ReactNode }) => <p className="mt-3 text-[15.5px] leading-[1.75] text-muted first:mt-0">{children}</p>

export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2.5 text-[15.5px] leading-[1.7] text-muted">
          <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-brand" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}
