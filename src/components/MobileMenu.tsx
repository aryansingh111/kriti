import { ArrowRight, ArrowUpRight, X, type LucideIcon } from 'lucide-react'
import { motion, type Variants } from 'motion/react'
import { useEffect } from 'react'
import { Link, NavLink } from 'react-router'
import { IndiaFlag } from '@/components/IndiaFlag'
import { WordMark } from '@/components/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'

export interface MenuLink {
  label: string
  to: string
  end?: boolean
  icon: LucideIcon
}

/** The circle opens from where the hamburger button sits (top right) and covers the whole screen. */
const ORIGIN = 'calc(100% - 40px) 36px'
const SHEET: Variants = {
  hidden: { clipPath: `circle(0px at ${ORIGIN})` },
  show: { clipPath: `circle(160vmax at ${ORIGIN})`, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
  gone: { clipPath: `circle(0px at ${ORIGIN})`, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: 0.08 } },
}
const LIST: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.28, staggerChildren: 0.08 } },
  gone: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
}
const ITEM: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  gone: { opacity: 0, y: -12, transition: { duration: 0.2 } },
}

const SMALL = [
  { label: 'Privacy', to: paths.privacy },
  { label: 'Terms', to: paths.terms },
  { label: 'Cookies', to: paths.cookies },
  { label: 'Report a bug', to: paths.feedback('bug') },
]

/**
 * The phone menu: a full-screen green sheet that opens as a circle from the hamburger, with the pages as large
 * links sliding up one after another. Drawn in a portal so it covers the whole page, header included.
 */
export function MobileMenu({ links, onClose }: { links: MenuLink[]; onClose: () => void }) {
  // no scrolling behind the menu, Escape closes it, and it closes by itself if the window grows to desktop size
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const wide = matchMedia('(min-width: 1024px)')
    const onWide = () => wide.matches && onClose()
    window.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      variants={SHEET}
      initial="hidden"
      animate="show"
      exit="gone"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[#0a2a1b] text-white lg:hidden"
    >
      {/* soft light, a dot texture and a big faint K give the sheet some depth */}
      <div aria-hidden className="pointer-events-none absolute -left-32 -top-40 size-[420px] rounded-full bg-[#1c8a55]/35 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-32 size-[420px] rounded-full bg-[#34b36b]/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 text-white/[0.07]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* same row as the page header, so the logo stays put and the close button sits where the hamburger was */}
      <div className="relative flex h-[72px] shrink-0 items-center justify-between px-4">
        <Link to={paths.home} onClick={onClose} aria-label="Kriti home" className="rounded-lg">
          <WordMark className="!bg-white" />
        </Link>
        <div className="flex items-center gap-1.5">
          <ThemeToggle className="!border-white/20 !bg-white/10 hover:!bg-white/20" />
          <motion.button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1, transition: { delay: 0.25, type: 'spring', stiffness: 320, damping: 20 } }}
            whileTap={{ scale: 0.88 }}
            className="grid size-10 place-items-center rounded-full bg-white text-[#0b5a32] shadow-lg"
          >
            <X className="size-5" strokeWidth={2.4} />
          </motion.button>
        </div>
      </div>

      <motion.nav variants={LIST} aria-label="Mobile" className="relative flex flex-1 flex-col px-5 pb-6 pt-4">
        <motion.p variants={ITEM} className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#8ee6b3]/80">
          Menu
        </motion.p>

        <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
          {links.map((l, i) => (
            <motion.li key={l.to} variants={ITEM}>
              <NavLink to={l.to} end={l.end} onClick={onClose} className="group flex items-center gap-4 py-5">
                {({ isActive }) => (
                  <>
                    <span className="w-7 font-mono text-[13px] text-white/40">{String(i + 1).padStart(2, '0')}</span>
                    <span className={cn('font-display flex-1 text-[34px] leading-none transition-colors', isActive ? 'text-[#8ee6b3]' : 'text-white group-active:text-[#8ee6b3]')}>{l.label}</span>
                    <ArrowRight className={cn('size-6 transition-transform group-active:translate-x-1', isActive ? 'text-[#8ee6b3]' : 'text-white/40')} />
                  </>
                )}
              </NavLink>
            </motion.li>
          ))}
        </ul>

        <motion.div variants={ITEM} className="mt-6">
          <NavLink
            to={paths.india}
            onClick={onClose}
            className="relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.07] p-3.5 pr-4 active:bg-white/10"
          >
            <IndiaFlag className="size-11" />
            <span className="flex-1">
              <span className="block text-[16px] font-extrabold">Made for India</span>
              <span className="block text-[13px] text-white/60">Why Kriti, and who it is for</span>
            </span>
            <ArrowUpRight className="size-5 text-white/50" />
          </NavLink>
        </motion.div>

        <motion.div variants={ITEM} className="mt-auto pt-8">
          <Link
            to={paths.templates()}
            onClick={onClose}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white text-[16px] font-extrabold text-[#0b5a32] shadow-xl shadow-black/25 active:scale-[0.98]"
          >
            Create my resume <ArrowRight className="size-5" />
          </Link>
          <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2">
            {SMALL.map((s) => (
              <li key={s.label}>
                <Link to={s.to} onClick={onClose} className="text-[13px] font-medium text-white/55 underline-offset-4 active:text-white">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.nav>
    </motion.div>
  )
}
