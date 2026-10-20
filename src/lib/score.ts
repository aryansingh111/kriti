import type { ResumeData } from '@/types'
import { customHasContent, splitLines } from './resume'

export type CheckGroup = 'Essentials' | 'Impact' | 'Polish'

export interface Check {
  id: string
  group: CheckGroup
  label: string
  /** shown when the check isn't fully met */
  tip: string
  /** 0 – 1 */
  value: number
  weight: number
}

const WEAK_OPENERS =
  /^(responsible for|duties (included|were)|worked on|helped( to)?|assisted( with| in)?|tasked with|in charge of|involved in|participated in)\b/i

export interface Analysis {
  score: number
  checks: Check[]
  verdict: string
}

export function analyze(data: ResumeData, pageCount: number): Analysis {
  const b = data.basics
  const roles = data.experience.filter((e) => e.role.trim() || e.company.trim())
  const roleBullets = roles.map((e) => splitLines(e.highlights))
  const bullets = [...roleBullets.flat(), ...data.projects.flatMap((p) => splitLines(p.description))]
  const quantified = bullets.filter((x) => /\d|%|[$€£]/.test(x))
  const weak = bullets.filter((x) => WEAK_OPENERS.test(x))
  const long = bullets.filter((x) => x.length > 220)
  const summaryLen = b.summary.trim().length
  const skills = data.skills.filter((s) => s.name.trim()).length
  const hasLink = b.links.some((l) => l.url.trim() || l.label.trim())

  const ratio = (n: number, d: number) => (d === 0 ? 0 : n / d)

  const checks: Check[] = [
    {
      id: 'identity',
      group: 'Essentials',
      label: 'Name and job title',
      tip: 'Add your full name and the role you are targeting – recruiters scan this first.',
      value: (b.fullName.trim() ? 0.5 : 0) + (b.title.trim() ? 0.5 : 0),
      weight: 8,
    },
    {
      id: 'contact',
      group: 'Essentials',
      label: 'Email and phone',
      tip: 'Include both a professional email and a phone number so employers can reach you.',
      value: (b.email.trim() ? 0.5 : 0) + (b.phone.trim() ? 0.5 : 0),
      weight: 8,
    },
    {
      id: 'location',
      group: 'Essentials',
      label: 'Location',
      tip: 'A city and region (or “Remote”) helps with location filters.',
      value: b.location.trim() ? 1 : 0,
      weight: 3,
    },
    {
      id: 'summary',
      group: 'Essentials',
      label: 'Professional summary',
      tip:
        summaryLen === 0
          ? 'Add a 2–4 sentence summary that sells your strongest points.'
          : summaryLen < 150
            ? 'Your summary is short – aim for 200–450 characters.'
            : 'Your summary is long – trim it to the 2–4 sentences that matter most.',
      value: summaryLen >= 150 && summaryLen <= 600 ? 1 : summaryLen >= 60 ? 0.5 : 0,
      weight: 10,
    },
    {
      id: 'experience',
      group: 'Essentials',
      label: 'Work experience',
      tip: 'Add at least one position – internships and freelance work count too.',
      value: roles.length ? 1 : 0,
      weight: 12,
    },
    {
      id: 'education',
      group: 'Essentials',
      label: 'Education',
      tip: 'List your highest qualification, even if it is still in progress.',
      value: data.education.some((e) => e.school.trim() || e.degree.trim()) ? 1 : 0,
      weight: 6,
    },
    {
      id: 'skills',
      group: 'Essentials',
      label: 'At least 6 skills',
      tip: `You have ${skills}. Add the tools and strengths named in job descriptions you want.`,
      value: Math.min(1, skills / 6),
      weight: 10,
    },
    {
      id: 'depth',
      group: 'Impact',
      label: 'Roles list 2+ achievements',
      tip: 'Give each position at least two bullet points describing what you accomplished.',
      value: ratio(roleBullets.filter((r) => r.length >= 2).length, roles.length),
      weight: 10,
    },
    {
      id: 'numbers',
      group: 'Impact',
      label: 'Results are quantified',
      tip: 'Add numbers – %, $, users, time saved – to at least half of your bullet points.',
      value: Math.min(1, ratio(quantified.length, bullets.length) / 0.5),
      weight: 12,
    },
    {
      id: 'verbs',
      group: 'Impact',
      label: 'Strong action verbs',
      tip: `${weak.length} bullet${weak.length === 1 ? '' : 's'} start with weak phrases like “Responsible for” – lead with Built, Led, Reduced, Launched…`,
      value: bullets.length ? 1 - ratio(weak.length, bullets.length) : 0,
      weight: 6,
    },
    {
      id: 'concise',
      group: 'Impact',
      label: 'Concise bullet points',
      tip: `${long.length} bullet${long.length === 1 ? ' is' : 's are'} over 220 characters – split or tighten them.`,
      value: bullets.length ? 1 - ratio(long.length, bullets.length) : 0,
      weight: 4,
    },
    {
      id: 'links',
      group: 'Polish',
      label: 'Profile or portfolio link',
      tip: 'Link your LinkedIn, GitHub or portfolio so recruiters can dig deeper.',
      value: hasLink ? 1 : 0,
      weight: 5,
    },
    {
      id: 'extras',
      group: 'Polish',
      label: 'Projects or certifications',
      tip: 'A project or certification is great proof of skill – especially early in your career.',
      value:
        data.projects.some((p) => p.name.trim()) ||
        data.certifications.some((c) => c.name.trim()) ||
        data.customSections.some((c) => customHasContent(c))
          ? 1
          : 0,
      weight: 4,
    },
    {
      id: 'length',
      group: 'Polish',
      label: 'One or two pages',
      tip: `Your resume runs ${pageCount} pages. Recruiters prefer one page, two at most – tighten spacing or trim older roles.`,
      value: pageCount <= 2 ? 1 : 0,
      weight: 6,
    },
  ]

  const total = checks.reduce((s, c) => s + c.weight, 0)
  const got = checks.reduce((s, c) => s + c.weight * c.value, 0)
  const score = Math.round((got / total) * 100)
  const verdict =
    score >= 90
      ? 'Outstanding – ready to send.'
      : score >= 75
        ? 'Strong – a few tweaks from perfect.'
        : score >= 55
          ? 'Solid start – keep building it out.'
          : 'Getting started – follow the tips below.'

  return { score, checks, verdict }
}
