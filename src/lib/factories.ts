import type {
  CustomEntry,
  CustomKind,
  CustomSection,
  DetailRow,
  LinkKind,
  ListItemMap,
  ListKey,
  ProfileLink,
} from '@/types'
import { uid } from './utils'

export const FACTORIES: { [K in ListKey]: () => ListItemMap[K] } = {
  experience: () => ({
    id: uid(),
    role: '',
    company: '',
    location: '',
    start: '',
    end: '',
    current: false,
    link: '',
    highlights: '',
  }),
  education: () => ({
    id: uid(),
    school: '',
    degree: '',
    field: '',
    location: '',
    start: '',
    end: '',
    link: '',
    details: '',
  }),
  skills: () => ({ id: uid(), name: '', level: 4, group: '' }),
  projects: () => ({ id: uid(), name: '', link: '', linkLabel: '', tech: '', description: '' }),
  certifications: () => ({ id: uid(), name: '', issuer: '', date: '', link: '' }),
  languages: () => ({ id: uid(), name: '', level: 'Fluent' }),
  awards: () => ({ id: uid(), title: '', issuer: '', date: '', description: '', link: '' }),
}

export const newLink = (kind: LinkKind = 'linkedin', url = '', label = ''): ProfileLink => ({
  id: uid(),
  kind,
  url,
  label,
})

export const newCustomEntry = (init: Partial<CustomEntry> = {}): CustomEntry => ({
  id: uid(),
  title: '',
  subtitle: '',
  date: '',
  location: '',
  link: '',
  description: '',
  ...init,
})

export const newDetailRow = (init: Partial<DetailRow> = {}): DetailRow => ({ id: uid(), label: '', value: '', ...init })

export function newCustomSection(kind: CustomKind, title = '', init: Partial<CustomSection> = {}): CustomSection {
  return {
    id: uid(),
    title,
    kind,
    text: '',
    items: kind === 'entries' ? [newCustomEntry()] : [],
    rows: kind === 'details' ? [newDetailRow()] : [],
    column: 'auto',
    ...init,
  }
}

export interface CustomPreset {
  id: string
  title: string
  description: string
  kind: CustomKind
  build: () => CustomSection
}

/** One-click section ideas – several are standard on Indian resumes. */
export const CUSTOM_PRESETS: CustomPreset[] = [
  {
    id: 'personal',
    title: 'Personal details',
    description: 'Date of birth, nationality, address…',
    kind: 'details',
    build: () =>
      newCustomSection('details', 'Personal details', {
        rows: [
          newDetailRow({ label: 'Date of birth', value: '14 August 1999' }),
          newDetailRow({ label: 'Nationality', value: 'Indian' }),
          newDetailRow({ label: 'Marital status', value: 'Single' }),
          newDetailRow({ label: 'Address', value: 'Koramangala, Bengaluru – 560034' }),
        ],
      }),
  },
  {
    id: 'declaration',
    title: 'Declaration',
    description: 'A closing statement, common on Indian CVs',
    kind: 'text',
    build: () =>
      newCustomSection('text', 'Declaration', {
        text: 'I hereby declare that the information furnished above is true and correct to the best of my knowledge and belief.',
      }),
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Ranks, hackathons, scholarships',
    kind: 'bullets',
    build: () => newCustomSection('bullets', 'Achievements', { text: 'All India Rank 412 in GATE 2023 (CS)\nWinner, Smart India Hackathon 2022 – Software Edition' }),
  },
  {
    id: 'interests',
    title: 'Hobbies & interests',
    description: 'A short, human touch',
    kind: 'tags',
    build: () => newCustomSection('tags', 'Hobbies & interests', { text: 'Chess, Trekking, Classical music, Photography' }),
  },
  {
    id: 'volunteering',
    title: 'Volunteering',
    description: 'NGOs, NSS/NCC, community work',
    kind: 'entries',
    build: () =>
      newCustomSection('entries', 'Volunteering', {
        items: [newCustomEntry({ title: 'Volunteer Teacher', subtitle: 'Teach For India', date: '2021 – 2022', description: 'Taught maths to 40 students from low-income families' })],
      }),
  },
  {
    id: 'internships',
    title: 'Internships',
    description: 'Summer or semester internships',
    kind: 'entries',
    build: () => newCustomSection('entries', 'Internships'),
  },
  {
    id: 'positions',
    title: 'Positions of responsibility',
    description: 'Clubs, councils, societies',
    kind: 'entries',
    build: () => newCustomSection('entries', 'Positions of responsibility'),
  },
  {
    id: 'publications',
    title: 'Publications',
    description: 'Papers, patents and articles',
    kind: 'entries',
    build: () => newCustomSection('entries', 'Publications'),
  },
  {
    id: 'courses',
    title: 'Courses',
    description: 'MOOCs and training programmes',
    kind: 'entries',
    build: () => newCustomSection('entries', 'Courses'),
  },
  {
    id: 'extracurricular',
    title: 'Extra-curricular',
    description: 'Sports, clubs, cultural activities',
    kind: 'bullets',
    build: () => newCustomSection('bullets', 'Extra-curricular activities'),
  },
  {
    id: 'references',
    title: 'References',
    description: 'Or “Available on request”',
    kind: 'text',
    build: () => newCustomSection('text', 'References', { text: 'Available on request.' }),
  },
  {
    id: 'blank-text',
    title: 'Blank – paragraph',
    description: 'Free text',
    kind: 'text',
    build: () => newCustomSection('text', 'New section'),
  },
  {
    id: 'blank-bullets',
    title: 'Blank – bullet list',
    description: 'One point per line',
    kind: 'bullets',
    build: () => newCustomSection('bullets', 'New section'),
  },
  {
    id: 'blank-entries',
    title: 'Blank – dated entries',
    description: 'Title, organisation, dates, points',
    kind: 'entries',
    build: () => newCustomSection('entries', 'New section'),
  },
]
