import { Plus } from 'lucide-react'
import { Link } from 'react-router'
import { container } from '@/components/pages/parts'
import { paths } from '@/lib/routes'
import { FAQS } from '@/seo/site'

/**
 * Frequently asked questions at the foot of the home page. The same list is described in the FAQPage JSON-LD, so what
 * search engines read matches what people see. Native <details> keeps every answer in the page, readable without scripts.
 */
export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className={`${container} pt-24`}>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="eyebrow">FAQ</span>
          <h2 id="faq-heading" className="font-display mt-4 text-[32px] leading-tight text-ink sm:text-[40px]">
            Questions, answered
          </h2>
          <p className="mt-3 max-w-sm text-[15.5px] leading-relaxed text-muted">The short answers to what students and freshers ask us most.</p>
          <p className="mt-6 text-[14.5px] text-muted">
            Something else?{' '}
            <Link to={paths.feedback()} className="font-semibold text-brand underline underline-offset-2">
              Ask us
            </Link>
            .
          </p>
        </div>

        <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 text-left marker:hidden hover:bg-surface-2 sm:px-6 [&::-webkit-details-marker]:hidden">
                <h3 className="flex-1 text-[16.5px] font-bold leading-snug text-ink">{f.q}</h3>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand transition-transform duration-300 group-open:rotate-45">
                  <Plus className="size-4" strokeWidth={2.6} />
                </span>
              </summary>
              <p className="px-5 pb-6 pr-14 text-[15.5px] leading-[1.7] text-muted sm:px-6 sm:pr-16">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
