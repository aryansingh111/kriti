import type { ResumeData } from '@/types'
import { resumeText } from './resume'

/** Terms worth matching on – hard skills, tools and domain words common in Indian job descriptions. */
const TERMS = [
  // engineering
  'javascript', 'typescript', 'react', 'react native', 'angular', 'vue', 'next.js', 'node.js', 'express', 'java', 'spring boot', 'kotlin', 'swift', 'flutter', 'dart', 'python', 'django', 'flask', 'fastapi', 'golang', 'go', 'rust', 'c++', 'c#', '.net', 'php', 'laravel', 'ruby', 'rails', 'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'kafka', 'rabbitmq', 'graphql', 'rest api', 'microservices', 'system design', 'data structures', 'algorithms', 'oop', 'html', 'css', 'tailwind', 'sass', 'webpack', 'git', 'github', 'ci/cd', 'jenkins', 'docker', 'kubernetes', 'terraform', 'ansible', 'aws', 'azure', 'gcp', 'linux', 'devops', 'sre', 'selenium', 'cypress', 'playwright', 'junit', 'test automation', 'agile', 'scrum', 'jira', 'api design', 'serverless', 'lambda',
  // data & ai
  'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'spark', 'hadoop', 'airflow', 'dbt', 'tableau', 'power bi', 'looker', 'excel', 'data analysis', 'data science', 'data engineering', 'etl', 'statistics', 'a/b testing', 'forecasting', 'mlops', 'llm', 'generative ai',
  // product, design, marketing
  'product management', 'roadmap', 'user research', 'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'after effects', 'ux', 'ui', 'wireframing', 'prototyping', 'design systems', 'seo', 'sem', 'google ads', 'meta ads', 'google analytics', 'content marketing', 'email marketing', 'social media', 'copywriting', 'brand strategy', 'performance marketing', 'crm', 'hubspot', 'salesforce', 'zoho', 'go-to-market', 'market research', 'campaign management',
  // business, finance, ops
  'financial modelling', 'valuation', 'budgeting', 'forecasting', 'accounting', 'audit', 'gst', 'tds', 'income tax', 'tally', 'sap', 'ind as', 'ifrs', 'taxation', 'reconciliation', 'accounts payable', 'accounts receivable', 'treasury', 'risk management', 'compliance', 'kyc', 'aml', 'supply chain', 'procurement', 'logistics', 'inventory', 'lean', 'six sigma', 'project management', 'stakeholder management', 'vendor management', 'negotiation', 'business development', 'key account management', 'sales strategy', 'lead generation', 'customer success', 'customer support', 'operations', 'p&l', 'strategy', 'consulting', 'business analysis', 'requirements gathering', 'process improvement',
  // people & other
  'recruitment', 'talent acquisition', 'employee engagement', 'hr analytics', 'payroll', 'onboarding', 'labour laws', 'training', 'coaching', 'leadership', 'communication', 'teamwork', 'problem solving', 'presentation', 'public speaking', 'research', 'teaching', 'curriculum', 'patient care', 'clinical', 'autocad', 'solidworks', 'ansys', 'catia', 'revit', 'sketchup', 'matlab',
]

const STOP = new Set(
  `a an the and or but if then else for of on in at to from by with without within into over under about as is are was were be been being this that these those it its we you your our their they he she i me my us them
  will would can could should may might must shall do does did done have has had having not no yes so than too very just also more most such other any all each both few many much some own same only
  job role position candidate candidates opportunity looking seeking required requirements preferred responsibilities responsibility qualifications qualification experience experienced years year plus
  work working worked team teams ability able strong good great excellent knowledge skills skill understanding understand using use used including include includes etc per well new etc
  company organisation organization business join help helping support supporting ensure ensuring develop developing development build building drive driving manage managing management lead leading
  across within across across highly proven demonstrated environment fast paced hands-on based related relevant least minimum bachelor bachelors master masters degree equivalent`
    .split(/\s+/)
    .filter(Boolean),
)

export interface Keyword {
  term: string
  /** how many times it appears in the job description */
  count: number
  found: boolean
  /** looks like something that belongs in a skills list */
  skillLike: boolean
}

export interface MatchResult {
  keywords: Keyword[]
  score: number
  matched: number
  total: number
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

function countIn(text: string, term: string): number {
  const re = new RegExp(`(?<![\\w])${esc(term)}(?![\\w])`, 'gi')
  return (text.match(re) ?? []).length
}

export function extractKeywords(jd: string): { term: string; count: number; skillLike: boolean }[] {
  const text = jd.replace(/[’']/g, "'")
  const out = new Map<string, { count: number; skillLike: boolean }>()

  for (const term of new Set(TERMS)) {
    const count = countIn(text, term)
    if (count > 0) out.set(term, { count, skillLike: true })
  }

  // other recurring words / tech-looking tokens (Node.js, C++, CI/CD…)
  const freq = new Map<string, number>()
  for (const raw of text.match(/[A-Za-z][A-Za-z0-9+#./&-]{1,24}/g) ?? []) {
    const w = raw.replace(/[.,;:)-]+$/g, '').toLowerCase()
    if (w.length < 3 || STOP.has(w) || /^\d/.test(w)) continue
    freq.set(w, (freq.get(w) ?? 0) + 1)
  }
  const covered = [...out.keys()].join(' ')
  for (const [w, c] of freq) {
    if (out.has(w) || covered.includes(w)) continue
    const techy = /[+#./]/.test(w) && w.length <= 12
    if (c >= 3 || techy) out.set(w, { count: c, skillLike: techy })
  }

  return [...out]
    .map(([term, v]) => ({ term, ...v }))
    .sort((a, b) => Number(b.skillLike) - Number(a.skillLike) || b.count - a.count)
    .slice(0, 36)
}

export function matchJob(jd: string, data: ResumeData): MatchResult {
  const resume = resumeText(data).toLowerCase()
  const kws = extractKeywords(jd).map((k) => ({ ...k, found: countIn(resume, k.term) > 0 }))
  const weight = (k: { count: number; skillLike: boolean }) => (k.skillLike ? 2 : 1) * Math.min(k.count, 4)
  const total = kws.reduce((s, k) => s + weight(k), 0)
  const got = kws.reduce((s, k) => s + (k.found ? weight(k) : 0), 0)
  return {
    keywords: kws,
    score: total === 0 ? 0 : Math.round((got / total) * 100),
    matched: kws.filter((k) => k.found).length,
    total: kws.length,
  }
}
