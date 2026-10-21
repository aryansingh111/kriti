import { ArrowRight, ChevronLeft, ChevronRight, FilePlus2 } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ButtonLink } from '@/components/ui/Button'
import { paths } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { PAGES, SITE } from '@/seo/site'

const INTERVAL = 10_000
const SWIPE = 45

/** Hero carousel over the banners in public/banners; moves on by itself every 10 seconds, and by swipe, arrows, dots or keys. */
export function BannerCarousel({ banners }: { banners: string[] }) {
  const n = banners.length
  const [index, setIndex] = useState(0)
  // which way the last change went (1 forwards, -1 back): the old banner leaves that way and the new one comes from the other
  const [dir, setDir] = useState<1 | -1>(1)
  const calm = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [hidden, setHidden] = useState(false)
  const bar = useRef<HTMLSpanElement>(null)
  const elapsed = useRef(0)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

  // a folder that shrank can leave the index past the end
  const current = n ? Math.min(index, n - 1) : 0
  const go = useCallback(
    (to: number, d: 1 | -1 = 1) => {
      setDir(d)
      setIndex(((to % n) + n) % n)
    },
    [n],
  )

  useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // the 10 second clock: counts only while the banner is in view and not being pointed at, and feeds the active dot's fill
  useEffect(() => {
    elapsed.current = 0
    if (bar.current) bar.current.style.transform = 'scaleX(0)'
    if (n < 2 || reduced || hover || hidden) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      elapsed.current += now - last
      last = now
      if (elapsed.current >= INTERVAL) return go(current + 1)
      if (bar.current) bar.current.style.transform = `scaleX(${elapsed.current / INTERVAL})`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [current, n, hover, hidden, reduced, go])

  // fetch the next banner a moment after this one is up (not at the same time, so the first one paints first), unless data saving is on
  useEffect(() => {
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (n < 2 || saver) return
    const id = window.setTimeout(() => void (new Image().src = banners[(current + 1) % n]), 2500)
    return () => window.clearTimeout(id)
  }, [banners, current, n])

  if (!n) return null

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    setHover(true)
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const t = touch.current
    touch.current = null
    setHover(false)
    if (!t) return
    const dx = e.changedTouches[0].clientX - t.x
    const dy = e.changedTouches[0].clientY - t.y
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy) * 1.4) {
      go(current + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1)
    }
  }

  return (
    <section className="hero-banner relative isolate border-b border-line" aria-roledescription="carousel" aria-label="Kriti Studio highlights">
      {/* the banner pictures carry their own text, so the page's one <h1> is written here for search engines and screen readers */}
      <h1 className="sr-only">{PAGES[0].h1}</h1>
      <div className="w-full pb-3 sm:pb-4">
        <div
          className="group relative aspect-[13/10] overflow-hidden border-b border-line bg-surface focus-visible:outline-2 focus-visible:outline-brand sm:aspect-[1983/793] sm:max-h-[760px]"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(current + 1)
            if (e.key === 'ArrowLeft') go(current - 1, -1)
          }}
          style={{ touchAction: 'pan-y' }}
        >
          {/* the banners slide the whole way across: the old one leaves one end as the new one enters from the other */}
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={banners[current]}
              custom={dir}
              role="group"
              aria-roledescription="slide"
              aria-label={`${current + 1} of ${n}`}
              className="absolute inset-0"
              variants={{
                enter: (d: number) => (calm ? { opacity: 0 } : { x: `${d * 100}%` }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => (calm ? { opacity: 0 } : { x: `${d * -100}%` }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
            >
              <img src={banners[current]} alt={`${SITE.name}, a free resume builder for students and freshers in India: resume templates and the editor (banner ${current + 1} of ${n})`} width={1983} height={793} draggable={false} decoding="async" fetchPriority={current === 0 ? 'high' : 'auto'} className="size-full select-none object-cover object-left sm:object-center" />
            </motion.div>
          </AnimatePresence>

          {/* the whole picture is a way into the templates, as the buttons drawn in it suggest */}
          <Link to={paths.templates()} aria-label="Create my resume" tabIndex={-1} className="absolute inset-0 z-20" />

          {n > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(current - 1, -1)}
                aria-label="Previous banner"
                className="absolute left-3 top-1/2 z-30 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/90 text-ink opacity-0 shadow-pop backdrop-blur transition-opacity hover:bg-surface focus-visible:opacity-100 group-hover:opacity-100 md:grid"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(current + 1)}
                aria-label="Next banner"
                className="absolute right-3 top-1/2 z-30 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface/90 text-ink opacity-0 shadow-pop backdrop-blur transition-opacity hover:bg-surface focus-visible:opacity-100 group-hover:opacity-100 md:grid"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>

        <div className="mx-auto mt-3 flex max-w-[1200px] items-center justify-between gap-4 px-4 sm:mt-4 sm:px-6">
          {/* real button for small screens, where the picture's own text is tiny */}
          <ButtonLink to={paths.templates()} variant="primary" size="md" className="!rounded-full px-5 sm:hidden">
            <FilePlus2 className="size-4" /> Create my resume
          </ButtonLink>
          <span className="hidden text-[13px] font-medium text-muted sm:inline-flex sm:items-center sm:gap-1.5">
            Free for students and freshers <ArrowRight className="size-3.5 text-brand" />
          </span>

          {n > 1 && (
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose banner">
              {banners.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Banner ${i + 1}`}
                  onClick={() => go(i, i < current ? -1 : 1)}
                  className="relative grid h-6 place-items-center"
                >
                  <span className={cn('relative block h-1.5 overflow-hidden rounded-full bg-line-strong transition-all duration-300', i === current ? 'w-10' : 'w-4 hover:bg-faint')}>
                    {i === current && <span ref={bar} className="absolute inset-0 origin-left rounded-full bg-brand" style={{ transform: reduced ? 'scaleX(1)' : 'scaleX(0)' }} />}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
