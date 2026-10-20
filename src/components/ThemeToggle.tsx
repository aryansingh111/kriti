import { motion } from 'motion/react'
import { useId } from 'react'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

const EASE = [0.4, 0, 0.2, 1] as const
const DURATION = 0.6

/** Eight sun rays, as [x1, y1, x2, y2] around a 24x24 centre. */
const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4
  const c = (r: number) => [12 + Math.cos(a) * r, 12 + Math.sin(a) * r] as const
  const [x1, y1] = c(7.6)
  const [x2, y2] = c(10)
  return [x1, y1, x2, y2]
})

/**
 * A round icon button. On click the sun slowly turns into a crescent moon (rays fold in and turn, a shadow circle
 * slides over the sun's face and craters appear), and back again.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggle } = useTheme()
  const mask = `moon-mask-${useId().replace(/:/g, '')}`
  const t = { duration: DURATION, ease: EASE }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'group relative grid size-10 shrink-0 place-items-center rounded-full border border-line bg-surface-2 transition-colors hover:border-line-strong hover:bg-surface-3 focus-visible:rounded-full',
        className,
      )}
    >
      {/* a soft halo that changes colour with the icon */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        initial={false}
        animate={{ boxShadow: dark ? '0 0 14px 1px rgba(190,225,205,0.22)' : '0 0 14px 1px rgba(245,158,11,0.28)' }}
        transition={t}
      />
      <motion.svg
        viewBox="0 0 24 24"
        className="relative size-[22px]"
        initial={false}
        animate={{ rotate: dark ? -30 : 0, color: dark ? '#d6e9de' : '#f59e0b' }}
        transition={t}
        style={{ overflow: 'visible' }}
        aria-hidden
      >
        <defs>
          <mask id={mask}>
            <rect x="-4" y="-4" width="32" height="32" fill="#fff" />
            {/* the shadow that carves the moon out of the sun */}
            <motion.circle r="7.2" cy="8" fill="#000" initial={false} animate={{ cx: dark ? 16.5 : 32 }} transition={t} />
          </mask>
        </defs>
        <g mask={`url(#${mask})`}>
          <motion.circle cx="12" cy="12" fill="currentColor" initial={false} animate={{ r: dark ? 8.2 : 5.4 }} transition={t} />
          <motion.g fill="#000" initial={false} animate={{ opacity: dark ? 0.13 : 0 }} transition={t}>
            <circle cx="8.6" cy="15" r="1.7" />
            <circle cx="12.4" cy="18" r="1.1" />
            <circle cx="6.8" cy="10.8" r="1" />
          </motion.g>
        </g>
        <motion.g
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: dark ? 0 : 1, scale: dark ? 0.35 : 1, rotate: dark ? 90 : 0 }}
          transition={t}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          {RAYS.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </motion.g>
      </motion.svg>
    </motion.button>
  )
}
