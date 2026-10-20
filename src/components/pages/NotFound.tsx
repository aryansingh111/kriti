import { ArrowLeft } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { paths } from '@/lib/routes'
import { container, PageFrame } from './parts'

export function NotFound() {
  return (
    <PageFrame>
      <section className="ruled">
        <div className={`${container} py-28 text-center`}>
          <p className="font-display text-[88px] leading-none text-brand">404</p>
          <h1 className="font-display mt-4 text-[32px] text-ink sm:text-[40px]">We could not find that page</h1>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-muted">The link may be wrong, or the resume it belonged to was deleted.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to={paths.home} variant="primary" size="lg" className="!rounded-full">
              <ArrowLeft className="size-4" /> Back home
            </ButtonLink>
            <ButtonLink to={paths.templates()} size="lg" className="!rounded-full">
              Browse templates
            </ButtonLink>
          </div>
        </div>
      </section>
    </PageFrame>
  )
}
