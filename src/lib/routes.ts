import type { Category } from '@/pdf/specs'

/** The tools in the editor's side panel. Each one is its own route: /resumes/:id/edit/:panel */
export const RAILS = ['templates', 'design', 'content', 'sections', 'check'] as const
export type Rail = (typeof RAILS)[number]

export const isRail = (v: string | undefined): v is Rail => !!v && (RAILS as readonly string[]).includes(v)

/** Whether a page is drawn under the site header: everything except the editor, the template switcher and the review page, which have their own bars. */
export const showsSiteNav = (pathname: string) => !/^\/resumes\/[^/]+\/(edit|templates|review)(\/|$)/.test(pathname)

export const paths = {
  home: '/',
  india: '/made-for-india',
  resumes: '/resumes',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  /** the page for reporting a bug or asking for a feature */
  feedback: (kind?: 'bug' | 'feature') => (kind ? `/feedback?type=${kind}` : '/feedback'),
  /** the gallery for starting a new resume; `style` and `q` become query parameters */
  templates: (opts?: { style?: Category | 'All'; q?: string }) => {
    const sp = new URLSearchParams()
    if (opts?.style && opts.style !== 'All') sp.set('style', opts.style)
    if (opts?.q) sp.set('q', opts.q)
    const qs = sp.toString()
    return qs ? `/templates?${qs}` : '/templates'
  },
  edit: (id: string, panel: Rail = 'design') => `/resumes/${id}/edit/${panel}`,
  /** the gallery for changing the template of an existing resume */
  switchTemplate: (id: string) => `/resumes/${id}/templates`,
  /** one resume's content shown in every template */
  otherTemplates: (id: string) => `/resumes/${id}/other-templates`,
  review: (id: string) => `/resumes/${id}/review`,
}
