import { FilePlus2 } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { paths } from '@/lib/routes'
import { container } from './parts'

/** Closing call to action used at the bottom of the public pages. */
export function CtaBand() {
  return (
    <section className={`${container} pt-24`}>
      <div className="rounded-3xl border border-line bg-surface-2 px-6 py-14 text-center sm:px-12">
        <h2 className="font-display mx-auto max-w-xl text-[30px] leading-tight text-ink sm:text-[40px]">Ready to build your resume?</h2>
        <p className="mx-auto mt-3 max-w-md text-[16px] text-muted">Pick a template, add your details and download a PDF. It takes about ten minutes.</p>
        <ButtonLink to={paths.templates()} variant="primary" size="lg" className="mt-7 !rounded-full">
          <FilePlus2 className="size-4" /> Create a resume
        </ButtonLink>
      </div>
    </section>
  )
}
