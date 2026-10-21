import { ArrowRight, Check } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { container, PageFrame, PageHeader } from '../parts'
import { LEGAL_LINKS } from './legalLinks'

export interface LegalSection {
  id: string
  title: string
  body: ReactNode
}

export interface LegalDoc {
  label: string
  title: string
  sub: string
  updated: string
  /** the short version, shown in a card above the full text */
  summary: string[]
  sections: LegalSection[]
}

/** Which section is under the top of the screen, for the contents list. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const onScroll = () => {
      let cur = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 140) cur = id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids])
  return active
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const ids = doc.sections.map((s) => s.id)
  const active = useActiveSection(ids)

  return (
    <PageFrame>
      <PageHeader label={doc.label} title={doc.title} sub={doc.sub}>
        <p className="mt-5 text-[13.5px] font-semibold text-faint">Last updated: {doc.updated}</p>
      </PageHeader>

      <div className={cn(container, 'grid gap-10 pb-8 pt-10 lg:grid-cols-[220px_1fr] lg:gap-16 lg:pt-14')}>
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-faint">On this page</p>
            <ul className="mt-4 space-y-1 border-l border-line">
              {doc.sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={cn('-ml-px block border-l-2 py-1.5 pl-4 text-[14px] font-semibold leading-snug transition-colors', active === s.id ? 'border-brand text-brand' : 'border-transparent text-muted hover:text-ink')}
                  >
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <article className="min-w-0 max-w-3xl">
          <div className="rounded-2xl border border-line bg-brand-soft/60 p-5 sm:p-6">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand">In short</p>
            <ul className="mt-3 space-y-2">
              {doc.summary.map((t) => (
                <li key={t} className="flex gap-2.5 text-[15.5px] leading-snug text-ink">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 border-b border-line py-8 last:border-b-0">
              <h2 className="font-display text-[26px] leading-tight text-ink sm:text-[30px]">
                <span className="mr-2 text-brand">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="mt-4">{s.body}</div>
            </section>
          ))}
        </article>
      </div>

      <div className={cn(container, 'pb-4 pt-8')}>
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-faint">Also read</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {LEGAL_LINKS.filter((l) => l.title !== doc.title).map((l) => (
            <Link key={l.to} to={l.to} className="group rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-pop">
              <h3 className="flex items-center justify-between text-[16px] font-extrabold text-ink">
                {l.title}
                <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1" />
              </h3>
              <p className="mt-1.5 text-[14px] leading-snug text-muted">{l.text}</p>
            </Link>
          ))}
          <Link to={paths.feedback()} className="group rounded-2xl border border-dashed border-line-strong p-5 transition-colors hover:bg-surface-2">
            <h3 className="flex items-center justify-between text-[16px] font-extrabold text-ink">
              Questions?
              <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1" />
            </h3>
            <p className="mt-1.5 text-[14px] leading-snug text-muted">Write to us from the feedback page.</p>
          </Link>
        </div>
      </div>
    </PageFrame>
  )
}
