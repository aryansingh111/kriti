import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { cn } from '@/lib/utils'

export const container = 'mx-auto max-w-[1200px] px-4 sm:px-6'

/** Nav + content + footer: the frame of every public page. */
export function PageFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}

/** Title block that opens each page. */
export function PageHeader({ label, title, sub, children }: { label: string; title: ReactNode; sub?: string; children?: ReactNode }) {
  return (
    <section className="ruled border-b border-line">
      <div className={cn(container, 'pb-14 pt-14 sm:pt-20')}>
        <span className="eyebrow">{label}</span>
        <h1 className="font-display mt-4 max-w-3xl text-[38px] leading-[1.08] text-ink sm:text-[54px]">{title}</h1>
        {sub && <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-muted">{sub}</p>}
        {children}
      </div>
    </section>
  )
}

/** Heading for a section of a page. */
export function SectionHead({ title, sub, action, className }: { no?: string; label?: string; title: string; sub?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-8 flex items-end justify-between gap-4', className)}>
      <div>
        <h2 className="font-display text-[28px] leading-tight text-ink sm:text-[34px]">{title}</h2>
        {sub && <p className="mt-1.5 max-w-2xl text-[15.5px] leading-relaxed text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

/** Kept for compatibility: crop marks are no longer part of the design. */
export function CropMarks() {
  return null
}
