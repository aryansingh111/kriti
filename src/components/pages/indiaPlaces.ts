import { PERSONAS } from '@/personas'
import { specFor } from '@/pdf/specs'

/* ───────────────────────── data ───────────────────────── */

export type Region = 'North' | 'West' | 'South' | 'East' | 'Central' | 'Northeast'
export const REGIONS: Region[] = ['North', 'West', 'South', 'East', 'Central', 'Northeast']

/** Which part of the country each state belongs to. The colour of a region is one of the three flag colours. */
export const REGION_OF: Record<string, Region> = {
  Delhi: 'North',
  Haryana: 'North',
  'Uttar Pradesh': 'North',
  Punjab: 'North',
  Chandigarh: 'North',
  Maharashtra: 'West',
  Gujarat: 'West',
  Rajasthan: 'West',
  Karnataka: 'South',
  'Tamil Nadu': 'South',
  Kerala: 'South',
  Telangana: 'South',
  'West Bengal': 'East',
  Bihar: 'East',
  Odisha: 'East',
  'Madhya Pradesh': 'Central',
  Assam: 'Northeast',
}
export const REGION_COLOR: Record<Region, string> = {
  North: 'var(--saffron-deep)',
  East: 'var(--saffron-deep)',
  West: 'var(--navy)',
  Central: 'var(--navy)',
  South: 'var(--brand)',
  Northeast: 'var(--brand)',
}

export interface Place {
  city: string
  state: string
  region: Region
  count: number
  /** the templates set in this city: the template's name and the sample person it is shown with */
  people: { template: string; name: string; title: string }[]
}

/** The cities the 100 templates are set in, worked out from the sample person each template is shown with. */
export function samplePlaces() {
  const byCity = new Map<string, Place>()
  const states = new Set<string>()
  for (const [id, p] of Object.entries(PERSONAS)) {
    const [city, stateRaw = city] = p.basics.location.split(',').map((s) => s.trim())
    const state = stateRaw === 'New Delhi' ? 'Delhi' : stateRaw
    states.add(state)
    const cur = byCity.get(city) ?? { city, state, region: REGION_OF[state] ?? 'Central', count: 0, people: [] }
    cur.count += 1
    cur.people.push({ template: specFor(id).name, name: p.basics.fullName, title: p.basics.title })
    byCity.set(city, cur)
  }
  return { cities: byCity.size, states: states.size, byCity }
}

export const radius = (n: number) => 9 + Math.sqrt(n) * 1.35

