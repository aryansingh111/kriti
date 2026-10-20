import { ArrowRight, ArrowUp, Bug, Check, Lightbulb } from 'lucide-react'
import { Link } from 'react-router'
import { IndiaFlag } from '@/components/IndiaFlag'
import { Logo } from '@/components/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { paths } from '@/lib/routes'

const LINKS = [
  { label: 'Home', to: paths.home },
  { label: 'Templates', to: paths.templates() },
  { label: 'Fresher templates', to: paths.templates({ style: 'Fresher' }) },
  { label: 'My resumes', to: paths.resumes },
]

const PROMISES = ['No sign-up', 'No upload', 'No watermark']
const YEAR = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface-2">
      <div className="mx-auto max-w-[1200px] px-4 pb-8 pt-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.7fr_1.05fr] lg:gap-14">
          {/* brand */}
          <div>
            <Link to={paths.home} aria-label="Kriti home" className="inline-block rounded-lg">
              <Logo />
            </Link>
            <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-muted">A free resume builder for students, freshers and professionals across India. Everything runs in your browser, so your details never leave your device.</p>
            <Link
              to={paths.india}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3.5 text-[13px] font-semibold text-ink transition-all hover:-translate-y-px hover:border-line-strong hover:shadow-card"
            >
              <IndiaFlag />
              Made in India, for India
            </Link>
          </div>

          {/* links */}
          <nav aria-label="Footer">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-faint">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-muted transition-colors hover:text-brand">
                    {l.label}
                    <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              <li>
                <Link to={paths.india} className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-muted transition-colors hover:text-brand">
                  Made for India
                  <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            </ul>

            <p className="mt-7 text-[12px] font-bold uppercase tracking-[0.14em] text-faint">Help us improve</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to={paths.feedback('bug')} className="group inline-flex items-center gap-2 text-[15px] font-semibold text-muted transition-colors hover:text-brand">
                  <Bug className="size-4" /> Report a bug
                </Link>
              </li>
              <li>
                <Link to={paths.feedback('feature')} className="group inline-flex items-center gap-2 text-[15px] font-semibold text-muted transition-colors hover:text-brand">
                  <Lightbulb className="size-4" /> Request a feature
                </Link>
              </li>
            </ul>
          </nav>

          {/* call to action */}
          <div className="relative isolate overflow-hidden rounded-2xl bg-brand p-6 text-brand-ink shadow-card">
            <div aria-hidden className="absolute -right-10 -top-12 -z-10 size-40 rounded-full bg-white/10" />
            <div aria-hidden className="absolute -bottom-16 -left-8 -z-10 size-40 rounded-full bg-white/10" />
            <h3 className="font-display text-[26px] leading-tight">Ready to build your resume?</h3>
            <p className="mt-2 text-[14px] leading-relaxed opacity-85">Pick a template, add your details and download a clean PDF.</p>
            <ButtonLink to={paths.templates()} size="md" className="mt-5 !rounded-full bg-white px-5 text-[#0b5a32] shadow-md hover:bg-[#e5f3ea]">
              Create my resume <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-faint">&copy; {YEAR} Kriti. The word means a work, a creation.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-center gap-1.5 text-[13px] font-semibold text-muted">
                <span className="grid size-4 place-items-center rounded-full bg-brand-soft text-brand">
                  <Check className="size-2.5" strokeWidth={3.5} />
                </span>
                {p}
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-semibold text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <ArrowUp className="size-3.5" /> Back to top
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
