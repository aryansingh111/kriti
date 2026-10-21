import { Eye } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store'

const KEY = 'kriti:hint-preview'
const DELAY = 9000
/** The tip shows once and "Got it" is remembered on this browser. Set to false to show it every time the editor opens. */
const REMEMBER = true

const seenBefore = () => {
  if (!REMEMBER) return false
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/**
 * A nudge on phones, a few seconds into editing: it points at the Preview button of the bottom bar and says the
 * resume can be checked there. It goes away with "Got it" (or by opening the preview). With REMEMBER on, it does not come back.
 */
export function PreviewHint() {
  const pane = useStore((s) => s.pane)
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(seenBefore)

  function finish() {
    setShow(false)
    setDone(true)
    if (!REMEMBER) return
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* the hint just shows again next time */
    }
  }

  // the user found the preview on their own
  useEffect(() => {
    if (done) return
    return useStore.subscribe((st, prev) => {
      if (st.pane === 'preview' && prev.pane !== 'preview') finish()
    })
  }, [done])

  useEffect(() => {
    if (done) return
    const id = window.setTimeout(() => setShow(true), DELAY)
    return () => window.clearTimeout(id)
  }, [done])

  return (
    <AnimatePresence>
      {show && !done && pane === 'edit' && (
        <motion.div
          role="dialog"
          aria-label="Tip: preview your resume"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-2 z-50 w-[min(18.5rem,calc(100vw-1rem))] rounded-2xl border border-line-strong bg-ink p-4 text-bg shadow-pop lg:hidden"
        >
          <p className="flex items-center gap-2 text-[15px] font-extrabold">
            <span className="grid size-7 place-items-center rounded-full bg-brand text-brand-ink">
              <Eye className="size-4" />
            </span>
            See your resume
          </p>
          <p className="mt-1.5 text-[14px] leading-snug opacity-80">Tap Preview to check how it looks so far.</p>
          <Button size="sm" variant="primary" className="mt-3 w-full !rounded-full" onClick={finish}>
            Got it
          </Button>
          {/* arrow down to the Preview button, the last of six equal buttons in the bar */}
          <span aria-hidden className="absolute -bottom-1.5 size-3 rotate-45 bg-ink" style={{ right: 'calc((100vw - 0.75rem) / 12 - 0.5rem - 0.4rem)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
