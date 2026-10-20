import { motion } from 'motion/react'
import { LogoMark } from '@/components/Logo'

/**
 * Full-screen loading effect: the logo stays still while a band of light sweeps across it. It fades in and out.
 * Used for page changes and while a page's code loads, and it matches the splash screen shown on a full reload
 * (see index.html).
 */
export function LogoLoader() {
  return (
    <motion.div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] grid place-items-center bg-bg"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
        <LogoMark shine className="size-[96px]" />
      </motion.div>
    </motion.div>
  )
}
