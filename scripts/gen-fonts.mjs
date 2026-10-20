// Generates the font registry used by the PDF engine from @fontsource packages.
//   node scripts/gen-fonts.mjs
// Output:
//   src/pdf/fonts.generated.ts  – ?url imports + face tables (PDF side, needs react-pdf)
//   src/pdf/fontMeta.ts         – UI-safe metadata (ids, labels, kinds)
//   src/fontsUi.ts              – CSS imports for the typeface previews (lazy-loaded by the Design panel)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkgDir = (pkg) => path.join(root, 'node_modules/@fontsource', pkg, 'files')

// id, PDF family name, @fontsource package, kind, label
const FONTS = [
  ['inter', 'Inter', 'inter', 'Sans', 'Inter'],
  ['dm-sans', 'DM Sans', 'dm-sans', 'Sans', 'DM Sans'],
  ['source-sans', 'Source Sans 3', 'source-sans-3', 'Sans', 'Source Sans'],
  ['poppins', 'Poppins', 'poppins', 'Sans', 'Poppins'],
  ['montserrat', 'Montserrat', 'montserrat', 'Sans', 'Montserrat'],
  ['lato', 'Lato', 'lato', 'Sans', 'Lato'],
  ['open-sans', 'Open Sans', 'open-sans', 'Sans', 'Open Sans'],
  ['roboto', 'Roboto', 'roboto', 'Sans', 'Roboto'],
  ['nunito', 'Nunito', 'nunito', 'Sans', 'Nunito'],
  ['work-sans', 'Work Sans', 'work-sans', 'Sans', 'Work Sans'],
  ['manrope', 'Manrope', 'manrope', 'Sans', 'Manrope'],
  ['outfit', 'Outfit', 'outfit', 'Sans', 'Outfit'],
  ['mulish', 'Mulish', 'mulish', 'Sans', 'Mulish'],
  ['raleway', 'Raleway', 'raleway', 'Sans', 'Raleway'],
  ['plex-sans', 'IBM Plex Sans', 'ibm-plex-sans', 'Sans', 'IBM Plex Sans'],
  ['rubik', 'Rubik', 'rubik', 'Sans', 'Rubik'],
  ['karla', 'Karla', 'karla', 'Sans', 'Karla'],
  ['space-grotesk', 'Space Grotesk', 'space-grotesk', 'Sans', 'Space Grotesk'],
  ['lora', 'Lora', 'lora', 'Serif', 'Lora'],
  ['merriweather', 'Merriweather', 'merriweather', 'Serif', 'Merriweather'],
  ['playfair', 'Playfair Display', 'playfair-display', 'Serif', 'Playfair'],
  ['tinos', 'Tinos', 'tinos', 'Serif', 'Tinos (Times)'],
  ['baskerville', 'Libre Baskerville', 'libre-baskerville', 'Serif', 'Baskerville'],
  ['garamond', 'EB Garamond', 'eb-garamond', 'Serif', 'Garamond'],
  ['crimson', 'Crimson Pro', 'crimson-pro', 'Serif', 'Crimson'],
  ['pt-serif', 'PT Serif', 'pt-serif', 'Serif', 'PT Serif'],
  ['noto-serif', 'Noto Serif', 'noto-serif', 'Serif', 'Noto Serif'],
  ['cormorant', 'Cormorant Garamond', 'cormorant-garamond', 'Serif', 'Cormorant'],
  ['dm-serif', 'DM Serif Display', 'dm-serif-display', 'Serif', 'DM Serif'],
  ['code-pro', 'Source Code Pro', 'source-code-pro', 'Mono', 'Source Code Pro'],
]

// Fallbacks used per glyph when the main face lacks a character (₹, Indic scripts …)
const FALLBACKS = [
  { id: 'ext', family: 'Noto Sans Ext', pkg: 'noto-sans', subset: 'latin-ext', italic: true },
  { id: 'devanagari', family: 'Noto Sans Devanagari', pkg: 'noto-sans-devanagari', subset: 'devanagari' },
  { id: 'bengali', family: 'Noto Sans Bengali', pkg: 'noto-sans-bengali', subset: 'bengali' },
  { id: 'gurmukhi', family: 'Noto Sans Gurmukhi', pkg: 'noto-sans-gurmukhi', subset: 'gurmukhi' },
  { id: 'gujarati', family: 'Noto Sans Gujarati', pkg: 'noto-sans-gujarati', subset: 'gujarati' },
  { id: 'oriya', family: 'Noto Sans Oriya', pkg: 'noto-sans-oriya', subset: 'oriya' },
  { id: 'tamil', family: 'Noto Sans Tamil', pkg: 'noto-sans-tamil', subset: 'tamil' },
  { id: 'telugu', family: 'Noto Sans Telugu', pkg: 'noto-sans-telugu', subset: 'telugu' },
  { id: 'kannada', family: 'Noto Sans Kannada', pkg: 'noto-sans-kannada', subset: 'kannada' },
  { id: 'malayalam', family: 'Anek Malayalam', pkg: 'anek-malayalam', subset: 'malayalam' },
]

const has = (pkg, subset, w, style) => fs.existsSync(path.join(pkgDir(pkg), `${pkg}-${subset}-${w}-${style}.woff`))
const file = (pkg, subset, w, style) => `@fontsource/${pkg}/files/${pkg}-${subset}-${w}-${style}.woff?url`

function pick(pkg, subset, wanted, style) {
  // nearest available weight to `wanted`, preferring heavier on ties
  const all = [100, 200, 300, 400, 500, 600, 700, 800, 900].filter((w) => has(pkg, subset, w, style))
  if (!all.length) return null
  return all.sort((a, b) => Math.abs(a - wanted) - Math.abs(b - wanted) || b - a)[0]
}

let imports = ''
let tables = 'export const FACES: Record<string, { family: string; faces: { src: string; fontWeight: number; fontStyle?: \'italic\' }[] }> = {\n'
let n = 0
const v = () => `f${n++}`

for (const [id, family, pkg] of FONTS) {
  const faces = []
  const addFace = (w, style, regWeight, italic) => {
    const actual = pick(pkg, 'latin', w, style)
    if (!actual) return false
    const name = v()
    imports += `import ${name} from '${file(pkg, 'latin', actual, style)}'\n`
    faces.push(`{ src: ${name}, fontWeight: ${regWeight}${italic ? ", fontStyle: 'italic'" : ''} }`)
    return true
  }
  addFace(400, 'normal', 400, false)
  if (!addFace(400, 'italic', 400, true)) addFace(400, 'normal', 400, true) // upright stand-in
  addFace(600, 'normal', 600, false)
  addFace(700, 'normal', 700, false)
  if (!addFace(700, 'italic', 700, true)) addFace(700, 'normal', 700, true)
  if (id === 'montserrat' || id === 'poppins' || id === 'nunito' || id === 'manrope' || id === 'outfit' || id === 'raleway') addFace(800, 'normal', 800, false)
  tables += `  '${id}': { family: '${family}', faces: [\n    ${faces.join(',\n    ')},\n  ] },\n`
}
tables += '}\n\nexport const FALLBACK_FACES: Record<string, { family: string; faces: { src: string; fontWeight: number; fontStyle?: \'italic\' }[] }> = {\n'
for (const f of FALLBACKS) {
  const faces = []
  for (const w of [400, 700]) {
    const name = v()
    imports += `import ${name} from '${file(f.pkg, f.subset, w, 'normal')}'\n`
    faces.push(`{ src: ${name}, fontWeight: ${w} }`)
    if (f.italic) {
      const iname = v()
      imports += `import ${iname} from '${file(f.pkg, f.subset, w, 'italic')}'\n`
      faces.push(`{ src: ${iname}, fontWeight: ${w}, fontStyle: 'italic' }`)
    }
  }
  tables += `  '${f.id}': { family: '${f.family}', faces: [\n    ${faces.join(',\n    ')},\n  ] },\n`
}
tables += '}\n'

fs.writeFileSync(
  path.join(root, 'src/pdf/fonts.generated.ts'),
  `// AUTO-GENERATED by scripts/gen-fonts.mjs – do not edit.\n// react-pdf embeds TTF/WOFF (not WOFF2), so every face points at a .woff file shipped by @fontsource.\n${imports}\n${tables}`,
)

const meta =
  `// AUTO-GENERATED by scripts/gen-fonts.mjs – do not edit.\n\nexport interface FontOption {\n  id: string\n  label: string\n  /** CSS family name of the matching UI web-font (typeface previews) */\n  css: string\n  kind: 'Sans' | 'Serif' | 'Mono'\n}\n\n` +
  `export const FONT_OPTIONS = [\n${FONTS.map(([id, family, , kind, label]) => `  { id: '${id}', label: '${label}', css: '${family}', kind: '${kind}' },`).join('\n')}\n] as const satisfies readonly FontOption[]\n\n` +
  `export type FontId = (typeof FONT_OPTIONS)[number]['id']\n\n` +
  `export const FALLBACK_IDS = [${FALLBACKS.map((f) => `'${f.id}'`).join(', ')}] as const\nexport type FallbackId = (typeof FALLBACK_IDS)[number]\n`
fs.writeFileSync(path.join(root, 'src/pdf/fontMeta.ts'), meta)

const css = FONTS.map(([, , pkg]) => `import '@fontsource/${pkg}/400.css'`).join('\n')
fs.writeFileSync(path.join(root, 'src/fontsUi.ts'), `// AUTO-GENERATED by scripts/gen-fonts.mjs – web-font CSS for the typeface previews (loaded lazily).\n${css}\n`)
console.log(`generated ${FONTS.length} families, ${FALLBACKS.length} fallbacks, ${n} font files`)
