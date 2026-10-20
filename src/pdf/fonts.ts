import { Font } from '@react-pdf/renderer'
import type { FallbackId, FontId } from './fontMeta'
import { FACES, FALLBACK_FACES } from './fonts.generated'

export const FONT_FAMILY = Object.fromEntries(Object.entries(FACES).map(([id, f]) => [id, f.family])) as Record<FontId, string>
export const FALLBACK_FAMILY = Object.fromEntries(
  Object.entries(FALLBACK_FACES).map(([id, f]) => [id, f.family]),
) as Record<FallbackId, string>

let registered = false

export function registerFonts() {
  if (registered) return
  registered = true
  for (const { family, faces } of Object.values(FACES)) Font.register({ family, fonts: faces })
  // Fallback scripts have no italic cuts: reuse the upright files so italic text (job titles…) still resolves.
  for (const { family, faces } of Object.values(FALLBACK_FACES)) {
    const upright = faces.filter((f) => f.fontStyle !== 'italic')
    Font.register({ family, fonts: [...upright, ...upright.map((f) => ({ ...f, fontStyle: 'italic' as const }))] })
  }
  // Never hyphenate – broken words look sloppy on a resume.
  Font.registerHyphenationCallback((word) => [word])
}
