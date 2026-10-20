import { FolderOpen, House, LayoutGrid, Menu as MenuIcon, X, type LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { IndiaFlag } from '@/components/IndiaFlag'
import { Logo } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'

const LINKS: { label: string; to: string; end?: boolean; icon: LucideIcon }[] = [
  { label: 'Home', to: paths.home, end: true, icon: House },
  { label: 'Templates', to: '/templates', icon: LayoutGrid },
]

/** The Ashoka Chakra: a navy ring, a hub and 24 spokes. */
function AshokaChakra({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g stroke="#000080" fill="none">
        <circle cx="12" cy="12" r="10.4" strokeWidth="1.7" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i * Math.PI) / 12
          return <line key={i} x1={12 + Math.cos(a) * 2.2} y1={12 + Math.sin(a) * 2.2} x2={12 + Math.cos(a) * 10} y2={12 + Math.sin(a) * 10} strokeWidth="0.8" />
        })}
      </g>
      <circle cx="12" cy="12" r="2.3" fill="#000080" />
    </svg>
  )
}

/** Top navigation shared by every public page. */
export function SiteNav() {
  const docCount = useStore((s) => s.docs.length)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  // "My resumes" sits in the same bar as the other pages, right after Templates
  const links = docCount
    ? [LINKS[0], LINKS[1], { label: 'My resumes', to: paths.resumes, icon: FolderOpen }, ...LINKS.slice(2)]
    : LINKS

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 6)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={cn('sticky top-0 z-40 bg-bg/85 backdrop-blur-xl transition-shadow duration-200', scrolled ? 'shadow-[0_6px_24px_-12px_rgb(12_34_24/0.25)]' : 'border-b border-line')}>
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to={paths.home} aria-label="Kriti home" className="shrink-0 rounded-lg">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-full border border-line bg-surface-2 p-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-4 py-2 text-[14px] font-semibold transition-all',
                  isActive ? 'bg-surface text-brand shadow-[0_1px_2px_rgb(12_34_24/0.12),0_0_0_1px_var(--line)]' : 'text-muted hover:text-ink',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <NavLink
            to={paths.india}
            aria-label="Made for India"
            className={({ isActive }) =>
              cn(
                'group relative hidden h-10 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border py-1 pl-1 pr-4 text-[13.5px] font-semibold transition-all duration-500 md:inline-flex',
                'hover:-translate-y-px hover:rounded-md hover:border-transparent hover:shadow-[0_10px_22px_-8px_rgba(19,136,8,0.6)]',
                isActive ? 'border-brand/40 bg-brand-soft text-brand' : 'border-line bg-surface text-ink',
              )
            }
          >
            {/* on hover the pill becomes a flag: three bands, the Ashoka Chakra in the middle, and a soft sheen */}
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/3 origin-left scale-x-0 bg-[#ff9933] transition-transform duration-500 ease-out group-hover:scale-x-100" />
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/3 h-1/3 bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 origin-right scale-x-0 bg-[#138808] transition-transform duration-500 ease-out group-hover:scale-x-100" />
            <AshokaChakra className="pointer-events-none absolute left-1/2 top-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0 transition-all delay-200 duration-500 group-hover:scale-100 group-hover:opacity-100" />
            <span aria-hidden className="flag-sheen pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <IndiaFlag className="relative transition-opacity duration-300 group-hover:opacity-0" />
            <span className="relative transition-opacity duration-300 group-hover:opacity-0">Made for India</span>
          </NavLink>
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-line bg-bg lg:hidden" aria-label="Mobile">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-1 p-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold', isActive ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-surface-2')}
                >
                  <l.icon className="size-[18px]" />
                  {l.label}
                </NavLink>
              ))}
              <NavLink
                to={paths.india}
                onClick={() => setOpen(false)}
                className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-semibold', isActive ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-surface-2')}
              >
                <IndiaFlag className="size-[22px]" />
                Made for India
              </NavLink>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
