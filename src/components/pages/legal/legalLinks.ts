import { paths } from '@/lib/routes'

/** The three policy pages, for the "also read" cards at the bottom of each one. */
export const LEGAL_LINKS = [
  { to: paths.privacy, title: 'Privacy Policy', text: 'What we collect (almost nothing) and where your resume lives.' },
  { to: paths.terms, title: 'Terms of Use', text: 'The simple rules for using Kriti and the resumes you make.' },
  { to: paths.cookies, title: 'Cookies and Storage', text: 'What Kriti saves in your browser, and how to clear it.' },
]
