export interface Palette {
  id: string
  name: string
  accent: string
  /** band / sidebar colour */
  tone: string
}

/** Curated colour stories (accent + header/sidebar colour). */
export const PALETTES: Palette[] = [
  { id: 'indigo', name: 'Indigo night', accent: '#4f46e5', tone: '#1e1b4b' },
  { id: 'royal', name: 'Royal blue', accent: '#2563eb', tone: '#1e3a8a' },
  { id: 'sky', name: 'Sky', accent: '#0284c7', tone: '#0c4a6e' },
  { id: 'teal', name: 'Teal calm', accent: '#0d9488', tone: '#134e4a' },
  { id: 'peacock', name: 'Peacock', accent: '#0f766e', tone: '#042f2e' },
  { id: 'emerald', name: 'Emerald', accent: '#059669', tone: '#064e3b' },
  { id: 'forest', name: 'Forest', accent: '#15803d', tone: '#14532d' },
  { id: 'marigold', name: 'Marigold', accent: '#d97706', tone: '#78350f' },
  { id: 'saffron', name: 'Saffron', accent: '#ea580c', tone: '#7c2d12' },
  { id: 'rose', name: 'Rose', accent: '#e11d48', tone: '#4c0519' },
  { id: 'maroon', name: 'Maroon', accent: '#9f1239', tone: '#3b0a1c' },
  { id: 'magenta', name: 'Magenta', accent: '#c026d3', tone: '#4a044e' },
  { id: 'violet', name: 'Violet', accent: '#7c3aed', tone: '#2e1065' },
  { id: 'navy-gold', name: 'Navy & gold', accent: '#b8893b', tone: '#0f1a2e' },
  { id: 'slate', name: 'Slate', accent: '#334155', tone: '#0f172a' },
  { id: 'charcoal', name: 'Charcoal', accent: '#111827', tone: '#030712' },
]

export const ACCENT_SWATCHES = ['#4f46e5', '#2563eb', '#0284c7', '#0d9488', '#059669', '#65a30d', '#ca8a04', '#ea580c', '#e11d48', '#c026d3', '#7c3aed', '#334155', '#111827']
export const TONE_SWATCHES = ['#0f1a2e', '#1e1b4b', '#1e3a8a', '#134e4a', '#064e3b', '#78350f', '#7c2d12', '#4c0519', '#4a044e', '#2e1065', '#1f2937', '#030712']

/** Colours that read well as text on white paper. */
export const TEXT_SWATCHES = [
  { name: 'Black', hex: '#111827' },
  { name: 'Charcoal', hex: '#374151' },
  { name: 'Grey', hex: '#6b7280' },
  { name: 'Forest green', hex: '#0b5a32' },
  { name: 'Teal', hex: '#0f766e' },
  { name: 'Blue', hex: '#1d4ed8' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Purple', hex: '#6d28d9' },
  { name: 'Maroon', hex: '#9f1239' },
  { name: 'Orange', hex: '#c2410c' },
  { name: 'White', hex: '#ffffff' },
]
