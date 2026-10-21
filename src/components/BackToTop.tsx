import { ArrowUp } from 'lucide-react'

/** A round button fixed at the bottom right of every page that has the site header; it scrolls smoothly back to the top. */
export function BackToTop() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-4 right-4 z-30 grid size-12 place-items-center rounded-full border-2 border-white/80 bg-brand text-brand-ink shadow-[0_10px_24px_-6px_rgb(11_90_50/0.55)] transition-all duration-200 hover:-translate-y-1 hover:bg-brand-hover hover:shadow-[0_14px_28px_-6px_rgb(11_90_50/0.6)] active:translate-y-0 active:scale-95 sm:bottom-6 sm:right-6 dark:border-[#0c1c14]"
    >
      <ArrowUp className="size-5" strokeWidth={2.6} />
    </button>
  )
}
