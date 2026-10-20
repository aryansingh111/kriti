import type { FallbackId } from './fontMeta'

// The bundled text faces only cover Latin, so glyphs such as ₹ or Indic scripts come from Noto fallbacks.
// react-pdf substitutes per glyph, but every listed family is loaded – so only list those actually needed.
export const RANGES: [FallbackId, RegExp][] = [
  ['ext', /[Ā-ɏḀ-ỿ₠-⃏]/],
  ['devanagari', /[ऀ-ॿ꣠-ꣿ]/],
  ['bengali', /[ঀ-৿]/],
  ['gurmukhi', /[਀-੿]/],
  ['gujarati', /[઀-૿]/],
  ['oriya', /[଀-୿]/],
  ['tamil', /[஀-௿]/],
  ['telugu', /[ఀ-౿]/],
  ['kannada', /[ಀ-೿]/],
  ['malayalam', /[ഀ-ൿ]/],
]

/** Fallback families needed to draw every character in `text`. */
export function fallbacksFor(text: string): FallbackId[] {
  return RANGES.filter(([, re]) => re.test(text)).map(([id]) => id)
}

/** Replace every character of one script with "?" (used to isolate a script whose font fails to shape). */
export function stripScript(id: FallbackId): (s: string) => string {
  const re = RANGES.find(([rid]) => rid === id)![1]
  const all = new RegExp(re.source, 'g')
  return (s) => s.replace(all, '?')
}
