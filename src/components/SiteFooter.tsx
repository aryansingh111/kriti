import { ArrowRight, ArrowUp, Bug, Check, Lightbulb, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router'
import { IndiaFlag } from '@/components/IndiaFlag'
import { StudioMark, WordMark } from '@/components/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { paths } from '@/lib/routes'

const EXPLORE = [
  { label: 'Home', to: paths.home },
  { label: 'Templates', to: paths.templates() },
  { label: 'Fresher templates', to: paths.templates({ style: 'Fresher' }) },
  { label: 'My resumes', to: paths.resumes },
  { label: 'Made for India', to: paths.india },
]

const POLICIES = [
  { label: 'Privacy Policy', to: paths.privacy },
  { label: 'Terms of Use', to: paths.terms },
  { label: 'Cookies and Storage', to: paths.cookies },
]

const PROMISES = ['No sign-up', 'No upload', 'No watermark']
const YEAR = new Date().getFullYear()

/** One link of the footer: pale on the deep green, bright with a small arrow on hover. */
function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-white/70 transition-colors hover:text-[#8ee6b3]">
      {children}
      <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#8ee6b3]/80">{children}</p>
}

/** The site footer: a deep green panel in both themes, with a call to action, links, policies and a large wordmark. */
export function SiteFooter() {
  return (
    <footer className="relative isolate mt-24 overflow-hidden rounded-t-[2rem] bg-[#0a2a1b] text-white sm:rounded-t-[3rem]">
      {/* soft light from the corners, a fine dot texture and a bright hairline along the top edge */}
      <div aria-hidden className="absolute -left-40 -top-52 -z-10 size-[560px] rounded-full bg-[#1c8a55]/30 blur-3xl" />
      <div aria-hidden className="absolute -bottom-60 -right-40 -z-10 size-[560px] rounded-full bg-[#34b36b]/20 blur-3xl" />
      <div aria-hidden className="absolute inset-0 -z-10 text-white/[0.07]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8ee6b3]/60 to-transparent" />

      <div className="mx-auto max-w-[1200px] px-4 pt-14 sm:px-6 sm:pt-20">
        {/* call to action */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-[34px] leading-[1.08] sm:text-[48px]">
              Your next opportunity starts with a <em className="text-[#8ee6b3]">good resume.</em>
            </p>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/70">Pick a template, add your details and download a clean PDF in minutes.</p>
          </div>
          <div className="flex flex-col items-start gap-5 lg:items-end">
            <ButtonLink to={paths.templates()} size="lg" className="!rounded-full bg-white px-7 text-[#0b5a32] shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:bg-[#e5f3ea]">
              Create my resume <ArrowRight className="size-4" />
            </ButtonLink>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {PROMISES.map((p) => (
                <li key={p} className="flex items-center gap-1.5 text-[13.5px] font-semibold text-white/80">
                  <span className="grid size-4 place-items-center rounded-full bg-[#34b36b] text-[#06301d]">
                    <Check className="size-2.5" strokeWidth={3.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* links */}
        <div className="mt-14 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_0.9fr] lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to={paths.home} aria-label="Kriti home" className="inline-block rounded-lg">
              <WordMark className="!bg-white" />
            </Link>
            <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-white/65">A free resume builder for students, freshers and professionals across India. Everything runs in your browser, so your details never leave your device.</p>
            <Link
              to={paths.india}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] py-1 pl-1 pr-4 text-[13px] font-semibold text-white transition-all hover:-translate-y-px hover:border-white/30 hover:bg-white/10"
            >
              <IndiaFlag />
              Made in India, for India
            </Link>
          </div>

          <nav aria-label="Footer">
            <Heading>Explore</Heading>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Heading>Help us improve</Heading>
            <ul className="mt-4 space-y-2.5">
              <li>
                <FooterLink to={paths.feedback('bug')}>
                  <Bug className="size-4" /> Report a bug
                </FooterLink>
              </li>
              <li>
                <FooterLink to={paths.feedback('feature')}>
                  <Lightbulb className="size-4" /> Request a feature
                </FooterLink>
              </li>
            </ul>
          </div>

          <nav aria-label="Policies">
            <Heading>Policies</Heading>
            <ul className="mt-4 space-y-2.5">
              {POLICIES.map((l) => (
                <li key={l.label}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-start gap-2 text-[13px] leading-snug text-white/55">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#8ee6b3]" /> Your resume stays on your device.
            </p>
          </nav>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-white/55">&copy; {YEAR} Kriti. The word means a work, a creation.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-[13px] font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:self-auto"
          >
            <ArrowUp className="size-3.5" /> Back to top
          </button>
        </div>
      </div>

      {/* the wordmark, large and faint, sitting along the very bottom */}
      <div aria-hidden className="pointer-events-none mx-auto max-w-[1200px] px-4 pb-8 sm:px-6">
        <StudioMark className="mx-auto !block !h-auto w-[82%] max-w-[860px] !bg-white/[0.07]" />
      </div>
    </footer>
  )
}
