import { toast } from 'sonner'
import { renderResume } from '@/pdf/client'
import { useStore } from '@/store'
import type { Settings } from '@/types'

/** Count pages by scanning the PDF's page dictionaries (cheaper than loading it into pdf.js). */
export async function countPages(blob: Blob): Promise<number> {
  const text = new TextDecoder('latin1').decode(await blob.arrayBuffer())
  return Math.max(1, (text.match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length)
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** One "compression" knob c ∈ [0,1] (1 = as designed) scales text, spacing and margins together. */
function squeeze(base: Settings, c: number): Partial<Settings> {
  const r = (n: number) => Math.round(n * 100) / 100
  return {
    textScale: r(base.textScale * lerp(0.88, 1, c)),
    spacingScale: r(base.spacingScale * lerp(0.6, 1, c)),
    marginScale: r(base.marginScale * lerp(0.65, 1, c)),
  }
}

/**
 * Finds the least aggressive combination of smaller text, tighter spacing and narrower margins that keeps the resume
 * on one page, then applies it. Returns false when even the tightest setting spills over.
 */
export async function fitToOnePage(): Promise<boolean> {
  const { data, settings } = useStore.getState()
  const pagesAt = async (c: number) => countPages(await renderResume(data, { ...settings, ...squeeze(settings, c) }, { priority: 'high' }))

  const t = toast.loading('Fitting to one page…')
  try {
    if ((await pagesAt(1)) <= 1) {
      toast.success('Already on one page', { id: t })
      return true
    }
    if ((await pagesAt(0)) > 1) {
      toast.error('Too much content for one page', { id: t, description: 'Trim older roles or shorten bullets, then try again.' })
      return false
    }
    let lo = 0 // fits
    let hi = 1 // doesn't fit
    for (let i = 0; i < 6; i++) {
      const mid = (lo + hi) / 2
      if ((await pagesAt(mid)) <= 1) lo = mid
      else hi = mid
    }
    useStore.getState().setSettings(squeeze(settings, lo))
    toast.success('Fitted to one page', { id: t, description: 'Text, spacing and margins were tightened just enough.' })
    return true
  } catch (e) {
    toast.error('Could not fit the page', { id: t, description: e instanceof Error ? e.message : undefined })
    return false
  }
}
