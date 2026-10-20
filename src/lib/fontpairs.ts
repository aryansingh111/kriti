import type { FontId } from '@/types'

export interface FontPair {
  id: string
  name: string
  heading: FontId
  body: FontId
}

/** Curated heading + body combinations. */
export const FONT_PAIRS: FontPair[] = [
  { id: 'clean', name: 'Clean', heading: 'inter', body: 'inter' },
  { id: 'friendly', name: 'Friendly', heading: 'nunito', body: 'nunito' },
  { id: 'geometric', name: 'Geometric', heading: 'poppins', body: 'inter' },
  { id: 'corporate', name: 'Corporate', heading: 'montserrat', body: 'open-sans' },
  { id: 'contemporary', name: 'Contemporary', heading: 'manrope', body: 'manrope' },
  { id: 'technical', name: 'Technical', heading: 'space-grotesk', body: 'inter' },
  { id: 'code', name: 'Developer', heading: 'code-pro', body: 'inter' },
  { id: 'editorial', name: 'Editorial', heading: 'playfair', body: 'source-sans' },
  { id: 'elegant', name: 'Elegant', heading: 'cormorant', body: 'work-sans' },
  { id: 'literary', name: 'Literary', heading: 'lora', body: 'lora' },
  { id: 'warm', name: 'Warm serif', heading: 'merriweather', body: 'lato' },
  { id: 'classic', name: 'Classic', heading: 'tinos', body: 'tinos' },
  { id: 'academic', name: 'Academic', heading: 'noto-serif', body: 'noto-serif' },
  { id: 'display', name: 'Bold display', heading: 'dm-serif', body: 'inter' },
  { id: 'humanist', name: 'Humanist', heading: 'source-sans', body: 'source-sans' },
  { id: 'modern-ibm', name: 'IBM Plex', heading: 'plex-sans', body: 'plex-sans' },
]
