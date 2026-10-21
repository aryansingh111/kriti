import { motion } from 'motion/react'
import { useLocation } from 'react-router'
import { LogoMark } from '@/components/Logo'
import { showsSiteNav } from '@/lib/routes'

/**
 * Loading effect over the page (below the site header where there is one): the logo stays still while a band of light sweeps across it. It fades in and out.
 * Used for page changes and while a page's code loads, and it matches the splash screen shown on a full reload
 * (see index.html).
 */
export function LogoLoader() {
  // pages with the site header keep it in view: the loader covers only what is below it
  const below = showsSiteNav(useLocation().pathname)
  return (
    <motion.div
      role="status"
      aria-label="Loading"
      className={`fixed inset-x-0 bottom-0 z-[100] grid place-items-center bg-bg ${below ? 'top-[72px]' : 'top-0'}`}
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
