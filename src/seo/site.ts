/**
 * The single source of truth for SEO: the site facts, every page's title/description, the FAQ and the JSON-LD.
 * It is plain data and pure functions (no React, no DOM), because three things read it:
 *   - the build (vite.config.ts) writes sitemap.xml, robots.txt, llms.txt and one pre-rendered HTML file per page,
 *   - the running app (useSeo) updates the head when you move between pages,
 *   - the home page FAQ section shows the same questions that the FAQPage JSON-LD describes.
 */

export const SITE = {
  /** the deployed address, no trailing slash */
  url: 'https://www.kriti-studio.com',
  name: 'Kriti Studio',
  language: 'en-IN',
  locale: 'en_IN',
  logo: '/logo.png',
  ogImage: '/og-image.jpg',
  ogImageAlt: 'Kriti Studio: a free resume builder for students and freshers in India, showing resume templates and the editor',
  ogImageSize: { width: 1200, height: 630 },
  description:
    'Kriti Studio is a free resume builder made for India. Pick from 100 ATS-friendly templates, type your details and download a clean PDF. No sign-up, no watermark, and your data never leaves your browser.',
  themeColor: '#0b7a43',
} as const

/** How many templates the gallery holds (shown in copy; the gallery itself counts the real list). */
export const TEMPLATE_COUNT = 100

export type Changefreq = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface PageSeo {
  path: string
  /** the <title>; kept near 60 characters */
  title: string
  /** the meta description; kept under 160 characters */
  description: string
  /** the page's one <h1> (for the pre-rendered fallback; the app draws its own) */
  h1: string
  /** a short paragraph of the same idea, for the pre-rendered fallback */
  intro: string
  /** name in breadcrumbs */
  crumb: string
  schema: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage'
  /** false = noindex, left out of the sitemap and disallowed in robots.txt */
  index: boolean
  changefreq: Changefreq
  priority: number
}

export const PAGES: PageSeo[] = [
  {
    path: '/',
    title: 'Kriti Studio: Free Resume Builder for Students & Freshers',
    description: `Build a job-ready resume free with Kriti Studio. ${TEMPLATE_COUNT} ATS-friendly templates made for India, live PDF preview, no sign-up and no watermark. Your data stays in your browser.`,
    h1: 'Kriti Studio: Free Resume Builder for Students and Freshers in India',
    intro: `Pick a template, type in your details and download a clean PDF. Kriti Studio has ${TEMPLATE_COUNT} resume templates, runs entirely in your browser and needs no sign-up.`,
    crumb: 'Home',
    schema: 'WebPage',
    index: true,
    changefreq: 'weekly',
    priority: 1,
  },
  {
    path: '/templates',
    title: `${TEMPLATE_COUNT} Free Resume Templates, ATS-Friendly | Kriti Studio`,
    description: `Browse ${TEMPLATE_COUNT} free resume templates for freshers, students and professionals in India. Filter by style, layout and colour, then edit and download as PDF. No sign-up.`,
    h1: `${TEMPLATE_COUNT} Free Resume Templates`,
    intro: 'Choose from professional, modern, creative, minimal, classic, tech, fresher, executive, academic and healthcare resume templates. Every one is free and ready to edit.',
    crumb: 'Templates',
    schema: 'CollectionPage',
    index: true,
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    path: '/made-for-india',
    title: 'Made for India: Resume Builder for Indian Job Seekers',
    description:
      'Why Kriti Studio is built for Indian students and freshers: resume formats Indian recruiters expect, a Declaration section, photo support, rupee and Indic-script friendly, and free for everyone.',
    h1: 'A resume builder made for India',
    intro: 'Resumes in India are not the same as resumes elsewhere. Kriti Studio is designed around what Indian recruiters look for and how Indian students and freshers actually apply.',
    crumb: 'Made for India',
    schema: 'AboutPage',
    index: true,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/feedback',
    title: 'Report a Bug or Request a Feature | Kriti Studio',
    description: 'Found something broken in Kriti Studio, or have an idea that would help? Report a bug or request a feature in a minute. We read every message.',
    h1: 'Help us make Kriti Studio better',
    intro: 'Report a bug or request a feature. The more detail you give, the faster we can fix or build it.',
    crumb: 'Feedback',
    schema: 'ContactPage',
    index: true,
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | Kriti Studio',
    description: 'How Kriti Studio handles your information: your resume stays on your device, with no accounts, no ads and only cookie-free visit counts.',
    h1: 'Privacy Policy',
    intro: 'Kriti Studio works inside your browser. Your resume is yours, and we never receive it.',
    crumb: 'Privacy Policy',
    schema: 'WebPage',
    index: true,
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/terms',
    title: 'Terms of Use | Kriti Studio',
    description: 'The simple rules for using Kriti Studio: it is free, you own your resumes, and we make no promise of jobs or interviews.',
    h1: 'Terms of Use',
    intro: 'The simple rules for using Kriti Studio. By using the site you agree to them.',
    crumb: 'Terms of Use',
    schema: 'WebPage',
    index: true,
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/cookies',
    title: 'Cookies and Storage | Kriti Studio',
    description: 'Kriti Studio sets no cookies. See exactly what it saves in your browser (your resumes and theme) and how to clear it.',
    h1: 'Cookies and Storage',
    intro: 'Kriti Studio sets no cookies. It saves your work in your own browser, and this page says exactly what that means.',
    crumb: 'Cookies and Storage',
    schema: 'WebPage',
    index: true,
    changefreq: 'yearly',
    priority: 0.3,
  },
]

/** Pages that exist but should not be indexed: the user's own resumes and the editor, and unknown addresses. */
const PRIVATE: PageSeo = {
  path: '/resumes',
  title: 'My Resumes | Kriti Studio',
  description: 'Your saved resumes in Kriti Studio. They are stored privately in this browser.',
  h1: 'My resumes',
  intro: 'Your saved resumes, stored privately in this browser.',
  crumb: 'My resumes',
  schema: 'WebPage',
  index: false,
  changefreq: 'yearly',
  priority: 0,
}

const NOT_FOUND: PageSeo = {
  ...PRIVATE,
  path: '/404',
  title: 'Page not found | Kriti Studio',
  description: 'We could not find that page. Go back to Kriti Studio, the free resume builder for India.',
  h1: 'Page not found',
  intro: 'The link may be wrong, or the resume it belonged to was deleted.',
  crumb: 'Page not found',
}

/** Paths that must never be crawled, for robots.txt. */
export const DISALLOW = ['/resumes', '/kriti-feature-roadmap.pdf']

/** The SEO record for a URL path. Unknown paths are noindex. */
export function pageFor(pathname: string): PageSeo {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const found = PAGES.find((p) => p.path === clean)
  if (found) return found
  return clean === '/resumes' || clean.startsWith('/resumes/') ? PRIVATE : NOT_FOUND
}

export const absUrl = (path: string) => (path === '/' ? SITE.url + '/' : SITE.url + path)

/* ─────────── FAQ ─────────── */

export interface Faq {
  q: string
  a: string
}

/** Shown on the home page and described in the FAQPage JSON-LD, llms.txt and the pre-rendered page. Keep answers plain text. */
export const FAQS: Faq[] = [
  {
    q: 'What is Kriti Studio?',
    a: `Kriti Studio is a free online resume builder made for students, freshers and professionals in India. You pick one of ${TEMPLATE_COUNT} templates, type in your details, see the resume update live and download a clean PDF. The name Kriti means a work, a creation.`,
  },
  {
    q: 'Is Kriti Studio really free?',
    a: 'Yes. There is no sign-up, no watermark and no limit on downloads. You can make as many resumes as you like and download each one as a PDF.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. Kriti Studio has no accounts. Open the site, choose a template and start. Your resumes are saved in your browser so they are waiting for you when you come back.',
  },
  {
    q: 'Is my personal data safe?',
    a: 'Your resume never leaves your device. Everything, including the PDF, is made inside your browser, and your resumes are saved only in your browser storage. There are no ads, and visits are counted with cookie-free analytics that never see your resume. Because of this we cannot read or recover your resumes, so use Export data to keep a backup file.',
  },
  {
    q: 'Are the templates ATS-friendly?',
    a: 'Most are. Many templates use a clean single-column layout, standard headings and real selectable text, which applicant tracking systems read well. Use the ATS-friendly filter in the template gallery, and the Check panel in the editor for a strength score and a keyword match against a job description.',
  },
  {
    q: 'Can I change the template after I start?',
    a: 'Yes, at any time. Switch the template in the editor and your content carries over. You can also open Try other templates from My resumes to see your own text and photo in every design, then keep the one you like as a new copy.',
  },
  {
    q: 'Does it suit Indian resume formats?',
    a: 'Yes. You can add a photo in templates that support one, and add sections that Indian recruiters often expect, such as a Declaration, Achievements, Internships and extra-curricular activities. Indian scripts and the rupee sign display correctly.',
  },
  {
    q: 'Can I use Kriti Studio on my phone?',
    a: 'Yes. The editor works on phones with a bottom toolbar and a full-width preview. Pinch to zoom or double-tap to read the details, then download the PDF from your phone.',
  },
  {
    q: 'What happens if I clear my browser data?',
    a: 'Your saved resumes are removed with it, because they live only in your browser. Before clearing data or changing device, use Export data (.json) in the editor menu to save a backup, and Import data to bring it back.',
  },
]

/* ─────────── JSON-LD ─────────── */

const id = (suffix: string) => `${SITE.url}/#${suffix}`

/** The structured data for a page: one @graph with the organisation, website, page, breadcrumbs, and on the home page the app and the FAQ. */
export function jsonLd(page: PageSeo): Record<string, unknown> {
  const url = absUrl(page.path)
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Organization',
      '@id': id('organization'),
      name: SITE.name,
      url: SITE.url + '/',
      logo: { '@type': 'ImageObject', url: SITE.url + SITE.logo, width: 512, height: 512 },
      description: SITE.description,
      areaServed: { '@type': 'Country', name: 'India' },
    },
    {
      '@type': 'WebSite',
      '@id': id('website'),
      url: SITE.url + '/',
      name: SITE.name,
      description: SITE.description,
      inLanguage: SITE.language,
      publisher: { '@id': id('organization') },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/templates?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': page.schema,
      '@id': `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: SITE.language,
      isPartOf: { '@id': id('website') },
      breadcrumb: { '@id': `${url}#breadcrumb` },
      primaryImageOfPage: { '@type': 'ImageObject', url: SITE.url + SITE.ogImage, width: SITE.ogImageSize.width, height: SITE.ogImageSize.height },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement:
        page.path === '/'
          ? [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' }]
          : [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
              { '@type': 'ListItem', position: 2, name: page.crumb, item: url },
            ],
    },
  ]

  if (page.path === '/') {
    graph.push(
      {
        '@type': 'WebApplication',
        '@id': id('app'),
        name: SITE.name,
        url: SITE.url + '/',
        description: SITE.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Any (runs in a web browser)',
        browserRequirements: 'Requires a modern web browser with JavaScript',
        isAccessibleForFree: true,
        inLanguage: SITE.language,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        audience: { '@type': 'PeopleAudience', audienceType: 'Students, freshers and job seekers in India' },
        featureList: [
          `${TEMPLATE_COUNT} resume templates`,
          'Live PDF preview',
          'ATS-friendly layouts',
          'Colour, font and spacing controls',
          'Resume strength check and job description keyword match',
          'Works in the browser with no sign-up and no watermark',
          'Resumes stay on your device',
        ],
        publisher: { '@id': id('organization') },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    )
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

/* ─────────── head model ─────────── */

export interface HeadModel {
  title: string
  /** meta tags: `key` is the name or property */
  meta: { attr: 'name' | 'property'; key: string; content: string }[]
  /** absent for noindex pages */
  canonical: string | null
  jsonLd: string
}

/** Everything that belongs in <head> for a page. The build turns it into HTML; the app applies it to the live document. */
export function headModel(page: PageSeo): HeadModel {
  const url = absUrl(page.path)
  const image = SITE.url + SITE.ogImage
  const robots = page.index ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' : 'noindex, nofollow'
  const m = (attr: 'name' | 'property', key: string, content: string) => ({ attr, key, content })
  return {
    title: page.title,
    canonical: page.index ? url : null,
    meta: [
      m('name', 'description', page.description),
      m('name', 'robots', robots),
      m('property', 'og:type', 'website'),
      m('property', 'og:site_name', SITE.name),
      m('property', 'og:locale', SITE.locale),
      m('property', 'og:title', page.title),
      m('property', 'og:description', page.description),
      m('property', 'og:url', url),
      m('property', 'og:image', image),
      m('property', 'og:image:width', String(SITE.ogImageSize.width)),
      m('property', 'og:image:height', String(SITE.ogImageSize.height)),
      m('property', 'og:image:alt', SITE.ogImageAlt),
      m('name', 'twitter:card', 'summary_large_image'),
      m('name', 'twitter:title', page.title),
      m('name', 'twitter:description', page.description),
      m('name', 'twitter:image', image),
      m('name', 'twitter:image:alt', SITE.ogImageAlt),
    ],
    jsonLd: JSON.stringify(jsonLd(page)),
  }
}
