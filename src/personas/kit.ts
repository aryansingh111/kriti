import type { CustomSection, LinkKind, ResumeData } from '@/types'

type Link = [kind: LinkKind, url: string, label?: string]
type Exp = [role: string, company: string, location: string, start: string, end: string, bullets: string[], link?: string]
type Edu = [school: string, degree: string, field: string, location: string, start: string, end: string, details?: string, link?: string]
type Proj = [name: string, link: string, tech: string, bullets: string[], linkLabel?: string]
type Cert = [name: string, issuer: string, date: string, link?: string]
type Skill = string | [name: string, level: number]

export interface PersonaInput {
  name: string
  title: string
  email: string
  phone: string
  location: string
  links?: Link[]
  summary: string
  exp?: Exp[]
  edu?: Edu[]
  skills?: Skill[]
  /** grouped skills – use instead of `skills` for developer-style resumes */
  skillGroups?: [group: string, names: Skill[]][]
  projects?: Proj[]
  certs?: Cert[]
  langs?: [string, string][]
  awards?: [title: string, issuer: string, date: string, description: string][]
  custom?: (id: string) => CustomSection[]
}

const AUTO_LEVELS = [5, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 3]

/** Builds a resume with stable ids (thumbnails are cached by content, so ids must not change between runs). */
export function persona(id: string, o: PersonaInput): ResumeData {
  let n = 0
  const lvl = () => AUTO_LEVELS[Math.min(n++, AUTO_LEVELS.length - 1)]
  const sk = (s: Skill, group: string) =>
    typeof s === 'string'
      ? { name: s, level: lvl(), group }
      : { name: s[0], level: s[1], group }

  const skills = o.skillGroups
    ? o.skillGroups.flatMap(([g, names]) => {
        n = 0
        return names.map((s, i) => ({ id: `${id}-s${g}${i}`, ...sk(s, g) }))
      })
    : (o.skills ?? []).map((s, i) => ({ id: `${id}-s${i}`, ...sk(s, '') }))

  return {
    basics: {
      fullName: o.name,
      title: o.title,
      email: o.email,
      phone: o.phone,
      location: o.location,
      links: (o.links ?? []).map(([kind, url, label], i) => ({ id: `${id}-l${i}`, kind, url, label: label ?? '' })),
      photo: '',
      summary: o.summary,
    },
    experience: (o.exp ?? []).map(([role, company, location, start, end, bullets, link], i) => ({
      id: `${id}-e${i}`,
      role,
      company,
      location,
      start,
      end,
      current: end === '',
      link: link ?? '',
      highlights: bullets.join('\n'),
    })),
    education: (o.edu ?? []).map(([school, degree, field, location, start, end, details, link], i) => ({
      id: `${id}-d${i}`,
      school,
      degree,
      field,
      location,
      start,
      end,
      link: link ?? '',
      details: details ?? '',
    })),
    skills,
    projects: (o.projects ?? []).map(([name, link, tech, bullets, linkLabel], i) => ({
      id: `${id}-p${i}`,
      name,
      link,
      linkLabel: linkLabel ?? '',
      tech,
      description: bullets.join('\n'),
    })),
    certifications: (o.certs ?? []).map(([name, issuer, date, link], i) => ({
      id: `${id}-c${i}`,
      name,
      issuer,
      date,
      link: link ?? '',
    })),
    languages: (o.langs ?? []).map(([name, level], i) => ({ id: `${id}-g${i}`, name, level })),
    awards: (o.awards ?? []).map(([title, issuer, date, description], i) => ({
      id: `${id}-a${i}`,
      title,
      issuer,
      date,
      description,
      link: '',
    })),
    customSections: o.custom ? o.custom(id) : [],
  }
}

export const details = (id: string, rows: [string, string][]): CustomSection => ({
  id: `${id}-x-details`,
  title: 'Personal details',
  kind: 'details',
  text: '',
  items: [],
  rows: rows.map(([label, value], i) => ({ id: `${id}-x-r${i}`, label, value })),
  column: 'auto',
})

export const textSection = (id: string, key: string, title: string, text: string): CustomSection => ({
  id: `${id}-x-${key}`,
  title,
  kind: 'text',
  text,
  items: [],
  rows: [],
  column: 'auto',
})

export const bulletSection = (id: string, key: string, title: string, lines: string[]): CustomSection => ({
  id: `${id}-x-${key}`,
  title,
  kind: 'bullets',
  text: lines.join('\n'),
  items: [],
  rows: [],
  column: 'auto',
})

export const tagSection = (id: string, key: string, title: string, tags: string[]): CustomSection => ({
  id: `${id}-x-${key}`,
  title,
  kind: 'tags',
  text: tags.join(', '),
  items: [],
  rows: [],
  column: 'auto',
})

export const entrySection = (
  id: string,
  key: string,
  title: string,
  items: [title: string, subtitle: string, date: string, description: string[]][],
): CustomSection => ({
  id: `${id}-x-${key}`,
  title,
  kind: 'entries',
  text: '',
  items: items.map(([t, s, date, d], i) => ({
    id: `${id}-x-${key}-${i}`,
    title: t,
    subtitle: s,
    date,
    location: '',
    link: '',
    description: d.join('\n'),
  })),
  rows: [],
  column: 'auto',
})

export const DECLARATION =
  'I hereby declare that the information furnished above is true and correct to the best of my knowledge and belief.'
