import { Cookie } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'
import { getChoice, setChoice, subscribeChoice } from '@/lib/ga'
import { paths } from '@/lib/routes'

/** Asks once whether visits may be counted with Google Analytics. Nothing is loaded from Google until the answer is yes. */
export function ConsentBanner() {
  const choice = useSyncExternalStore(subscribeChoice, getChoice, () => null)
  // wait a moment so the page paints first and the banner does not cover what the visitor came to see
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 1500)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <AnimatePresence>
      {ready && choice === null && (
        <motion.div
          role="dialog"
          aria-label="Analytics cookies"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 z-[45] rounded-2xl border border-line-strong bg-surface p-5 shadow-pop sm:right-auto sm:w-[25rem]"
        >
          <p className="flex items-center gap-2.5 text-[16px] font-extrabold text-ink">
            <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand">
              <Cookie className="size-4" />
            </span>
            Can we count visits?
          </p>
          <p className="mt-2 text-[14px] leading-snug text-muted">
            We use Google Analytics to see which pages are used. It sets cookies and sends anonymous usage data to Google. Your resume is never included.{' '}
            <Link to={paths.cookies} className="font-semibold text-brand underline underline-offset-2">
              Details
            </Link>
          </p>
          <div className="mt-4 flex gap-2.5">
            <Button variant="primary" className="flex-1 !rounded-full" onClick={() => setChoice('granted')}>
              Accept
            </Button>
            <Button variant="secondary" className="flex-1 !rounded-full" onClick={() => setChoice('denied')}>
              No thanks
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
