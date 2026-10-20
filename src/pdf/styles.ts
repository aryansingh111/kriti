// UI-safe description of every swappable visual style (no react-pdf imports).

export const HEADING_KINDS = [
  'rule',
  'caps',
  'line',
  'bar',
  'pill',
  'dot',
  'plain',
  'num',
  'underline',
  'filled',
  'tab',
  'box',
  'center',
  'double',
  'ulcaps',
  'slash',
  'none',
] as const
export type HeadingKind = (typeof HEADING_KINDS)[number]

export const ENTRY_KINDS = ['split', 'org', 'stack', 'inline', 'timeline', 'dateleft', 'compact', 'mini'] as const
export type EntryKind = (typeof ENTRY_KINDS)[number]

export const SKILL_KINDS = ['tags', 'outline', 'solid', 'inline', 'bars', 'dots', 'grid', 'columns', 'list'] as const
export type SkillKind = (typeof SKILL_KINDS)[number]

export const BULLET_KINDS = ['dot', 'dash', 'arrow', 'square', 'diamond', 'check', 'none'] as const
export type BulletKind = (typeof BULLET_KINDS)[number]

export type LangKind = 'list' | 'dots' | 'inline'

export const ICON_SETS = ['line', 'bold', 'badge', 'square', 'dot', 'label', 'none'] as const
export type IconSet = (typeof ICON_SETS)[number]

export type PhotoShape = 'auto' | 'circle' | 'rounded' | 'square'
export type LinkStyle = 'plain' | 'underline' | 'accent'
export type NameCase = 'auto' | 'normal' | 'upper'

interface Opt<T extends string> {
  id: T
  label: string
  hint?: string
}

export const HEADING_OPTIONS: Opt<Exclude<HeadingKind, 'none'>>[] = [
  { id: 'rule', label: 'Underline rule' },
  { id: 'caps', label: 'Spaced caps' },
  { id: 'line', label: 'Quiet label' },
  { id: 'bar', label: 'Side bar' },
  { id: 'pill', label: 'Pill' },
  { id: 'dot', label: 'Dot & line' },
  { id: 'plain', label: 'Plain accent' },
  { id: 'num', label: 'Numbered' },
  { id: 'underline', label: 'Short underline' },
  { id: 'filled', label: 'Filled strip' },
  { id: 'tab', label: 'Tab' },
  { id: 'box', label: 'Outlined box' },
  { id: 'center', label: 'Centred' },
  { id: 'double', label: 'Double rule' },
  { id: 'ulcaps', label: 'Caps + underline' },
  { id: 'slash', label: 'Code comment' },
]

export const ENTRY_OPTIONS: Opt<Exclude<EntryKind, 'mini'>>[] = [
  { id: 'split', label: 'Classic', hint: 'Role & dates, company & place' },
  { id: 'org', label: 'Company first', hint: 'Institution bold, role italic' },
  { id: 'stack', label: 'Date on top', hint: 'Small date above the title' },
  { id: 'inline', label: 'One line', hint: 'Role, company and dates inline' },
  { id: 'dateleft', label: 'Date column', hint: 'Dates in a left column' },
  { id: 'compact', label: 'Compact', hint: 'Dense single-line heads' },
  { id: 'timeline', label: 'Timeline', hint: 'Vertical thread with dots' },
]

export const SKILL_OPTIONS: Opt<SkillKind>[] = [
  { id: 'tags', label: 'Soft chips' },
  { id: 'outline', label: 'Outlined chips' },
  { id: 'solid', label: 'Solid chips' },
  { id: 'inline', label: 'Inline list' },
  { id: 'bars', label: 'Level bars' },
  { id: 'dots', label: 'Level dots' },
  { id: 'grid', label: 'Two columns' },
  { id: 'columns', label: 'Three columns' },
  { id: 'list', label: 'Bulleted list' },
]

export const BULLET_OPTIONS: Opt<BulletKind>[] = [
  { id: 'dot', label: 'Dot' },
  { id: 'dash', label: 'Dash' },
  { id: 'arrow', label: 'Arrow' },
  { id: 'square', label: 'Square' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'check', label: 'Tick' },
  { id: 'none', label: 'None' },
]

export const ICON_OPTIONS: Opt<IconSet>[] = [
  { id: 'line', label: 'Line' },
  { id: 'bold', label: 'Bold' },
  { id: 'badge', label: 'Round badge' },
  { id: 'square', label: 'Square badge' },
  { id: 'dot', label: 'Dots' },
  { id: 'label', label: 'Text labels' },
  { id: 'none', label: 'No icons' },
]
