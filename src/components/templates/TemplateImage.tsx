import { useInView } from '@/lib/hooks'
import { useMyTemplateThumb, useTemplateThumb } from '@/lib/thumbs'
import type { ResumeData } from '@/types'
import { cn } from '@/lib/utils'
import { EMPTY_DATA } from '@/lib/defaults'
import { PaperSkeleton } from './PaperSkeleton'

/** The live render of a template (page 1, with its own sample resume). Renders lazily once scrolled near. */
export function TemplateImage({
  id,
  width = 300,
  className,
  eager,
  alt,
  mine,
}: {
  id: string
  width?: number
  className?: string
  /** render immediately instead of waiting to scroll into view */
  eager?: boolean
  alt?: string
  /** put this person's text and photo into the template (keeping the template's own design) instead of its sample person */
  mine?: ResumeData
}) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const show = !!(eager || seen)
  const sample = useTemplateThumb(id, width, show && !mine)
  const own = useMyTemplateThumb(id, width, show && !!mine, mine ?? EMPTY_DATA)
  const url = mine ? own : sample
  return (
    <div ref={ref} className={cn('relative aspect-[1/1.4142] overflow-hidden bg-white', className)}>
      {url ? <img src={url} alt={alt ?? `${id} resume template preview`} draggable={false} className="size-full object-cover object-top" /> : <PaperSkeleton />}
    </div>
  )
}
