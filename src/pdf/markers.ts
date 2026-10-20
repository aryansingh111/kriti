/** Invisible link annotations written by `Mark` start with this URL (UI-safe constant). */
export const MARK_PREFIX = 'https://kriti.invalid/b/'

/** `item:experience:abc` → `sec:experience`; `item:custom:xyz:eid` → `sec:custom:xyz`. */
export function sectionOfItem(id: string): string | null {
  if (!id.startsWith('item:')) return null
  const rest = id.slice('item:'.length)
  if (rest.startsWith('custom:')) {
    const parts = rest.split(':')
    return `sec:custom:${parts[1]}`
  }
  return `sec:${rest.split(':')[0]}`
}
