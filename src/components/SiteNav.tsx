import { FolderOpen, House, LayoutGrid, Menu as MenuIcon, type LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink } from 'react-router'
import { IndiaFlag } from '@/components/IndiaFlag'
import { WordMark } from '@/components/Logo'
import { MobileMenu } from '@/components/MobileMenu'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'

const LINKS: { label: string; to: string; end?: boolean; icon: LucideIcon }[] = [
  { label: 'Home', to: paths.home, end: true, icon: House },
  { label: 'Templates', to: '/templates', icon: LayoutGrid },
  { label: 'My resumes', to: paths.resumes, icon: FolderOpen },
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
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const links = LINKS
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 6)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-40 text-ink transition-shadow duration-300',
        'bg-[linear-gradient(100deg,#dff3e6_0%,#f2fbf6_32%,#e9f7ef_62%,#d3efdd_100%)] dark:bg-[linear-gradient(100deg,#0f2a1c_0%,#10261a_45%,#0d2418_100%)]',
        scrolled ? 'shadow-[0_12px_28px_-14px_rgb(11_90_50/0.5)]' : 'shadow-[0_1px_0_rgb(11_90_50/0.06)]',
      )}
    >
      {/* soft green light in the corners, a fine dot texture that fades toward the middle, and a bright green line along the bottom edge */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-24 size-56 rounded-full bg-[#34b36b]/25 blur-3xl dark:bg-[#34b36b]/15" />
        <div className="absolute -right-20 -top-28 size-64 rounded-full bg-[#7ed9a3]/35 blur-3xl dark:bg-[#1c8a55]/25" />
        <div
          className="absolute inset-0 text-[#0b7a43]/[0.16] dark:text-white/[0.06]"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            maskImage: 'linear-gradient(to right, #000, transparent 30%, transparent 70%, #000)',
            WebkitMaskImage: 'linear-gradient(to right, #000, transparent 30%, transparent 70%, #000)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#0b7a43] via-[#34b36b] to-[#b6ecc9] dark:from-[#1c8a55] dark:via-[#3fcf84] dark:to-[#1c8a55]/40" />
      </div>
      <div className="relative mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to={paths.home} aria-label="Kriti home" className="shrink-0 rounded-lg">
          <WordMark />
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-full border border-white/80 bg-white/65 p-1 shadow-[0_2px_10px_-2px_rgb(11_90_50/0.18),inset_0_1px_0_rgb(255_255_255/0.9)] backdrop-blur dark:border-line dark:bg-surface-2 lg:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => cn('relative rounded-full px-4 py-2 text-[14px] font-semibold transition-colors duration-300', isActive ? 'text-white dark:text-[#06301d]' : 'text-muted hover:text-brand')}
            >
              {({ isActive }) => (
                <>
                  {/* one green pill that glides to whichever link is current */}
                  {isActive && <motion.span layoutId="nav-pill" aria-hidden className="absolute inset-0 rounded-full bg-gradient-to-b from-[#1f9a5c] to-[#0b7a43] shadow-[0_6px_14px_-4px_rgb(11_122_67/0.7),inset_0_1px_0_rgb(255_255_255/0.25)] dark:from-[#3fcf84] dark:to-[#2fb872]" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                  <span className="relative">{l.label}</span>
                </>
              )}
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
                isActive ? 'border-brand/40 bg-white text-brand dark:bg-brand-soft' : 'border-[#cfe6d8] bg-white/80 text-ink dark:border-line dark:bg-surface-2',
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
          <ThemeToggle className="!border-[#cfe6d8] !bg-white/80 hover:!bg-white dark:!border-line dark:!bg-surface-2" />
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
            <MenuIcon className="size-5" />
          </Button>
        </div>
      </div>

      {/* in a portal: the header's blur would otherwise make "full screen" mean "header sized" */}
      {createPortal(<AnimatePresence>{open && <MobileMenu links={links} onClose={close} />}</AnimatePresence>, document.body)}
    </header>
  )
}
