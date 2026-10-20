import { customId, isCustomKey, type ResumeData, type Settings } from '@/types'
import { sectionTitle } from './resume'

/** Human label for a preview block id (`sec:experience`, `item:projects:abc`, `hdr`). */
export function blockLabel(id: string, data: ResumeData, settings: Pick<Settings, 'sectionTitles'>): string {
  if (id === 'hdr') return 'Header'
  if (id.startsWith('sec:')) return sectionTitle(id.slice(4) as never, data, settings)
  if (id.startsWith('item:')) {
    const rest = id.slice(5)
    if (rest.startsWith('custom:')) {
      const [, sid, eid] = rest.split(':')
      const c = data.customSections.find((x) => x.id === sid)
      const e = c?.items.find((i) => i.id === eid)
      return e?.title || e?.subtitle || 'Entry'
    }
    const [kind, item] = rest.split(':')
    switch (kind) {
      case 'experience': {
        const e = data.experience.find((x) => x.id === item)
        return e?.role || e?.company || 'Position'
      }
      case 'education': {
        const e = data.education.find((x) => x.id === item)
        return e?.school || e?.degree || 'Education'
      }
      case 'projects':
        return data.projects.find((x) => x.id === item)?.name || 'Project'
      case 'certifications':
        return data.certifications.find((x) => x.id === item)?.name || 'Certification'
      case 'awards':
        return data.awards.find((x) => x.id === item)?.title || 'Award'
    }
  }
  return 'Block'
}

/** Content-panel focus target for a block id. */
export function focusTarget(id: string): { kind: 'section' | 'item' | 'basics'; id: string } {
  if (id === 'hdr') return { kind: 'basics', id: 'basics' }
  if (id.startsWith('sec:')) return { kind: 'section', id: id.slice(4) }
  const rest = id.slice(5)
  if (rest.startsWith('custom:')) return { kind: 'item', id: `custom:${rest.split(':')[1]}` }
  return { kind: 'item', id: rest.split(':')[0] }
}

export { customId, isCustomKey }
