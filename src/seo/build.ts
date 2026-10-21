/**
 * Turns the SEO data in site.ts into the files and HTML the build writes: head tags, a readable fallback body for
 * crawlers that do not run JavaScript, sitemap.xml, robots.txt and llms.txt. Pure string functions, used by vite.config.ts.
 */
import { absUrl, DISALLOW, FAQS, headModel, PAGES, SITE, TEMPLATE_COUNT, type PageSeo } from './site.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** The <head> tags for a page, between the markers index.html leaves for them. */
export function headHtml(page: PageSeo): string {
  const h = headModel(page)
  const lines = [`<title>${esc(h.title)}</title>`]
  for (const t of h.meta) lines.push(`<meta ${t.attr}="${esc(t.key)}" content="${esc(t.content)}" />`)
  if (h.canonical) lines.push(`<link rel="canonical" href="${esc(h.canonical)}" />`)
  // `<` is escaped so that no text inside the JSON can close the script tag early
  lines.push(`<script type="application/ld+json" id="ld-json">${h.jsonLd.replace(/</g, '\\u003c')}</script>`)
  return lines.join('\n    ')
}

/**
 * Plain HTML for the page's first paint, before JavaScript runs (and for crawlers that never run it): the heading, a
 * sentence about the page, the other pages as links and, on the home page, the FAQ. React replaces it when the app starts.
 */
export function bodyHtml(page: PageSeo): string {
  const links = PAGES.filter((p) => p.path !== page.path)
    .map((p) => `<li><a href="${esc(p.path)}">${esc(p.crumb)}</a></li>`)
    .join('')
  const faq =
    page.path === '/'
      ? `<section><h2>Frequently asked questions</h2>${FAQS.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('')}</section>`
      : ''
  return `<main><h1>${esc(page.h1)}</h1><p>${esc(page.intro)}</p><nav aria-label="Pages"><ul>${links}</ul></nav>${faq}</main>`
}

const MARK = {
  head: /<!--seo:head-->[\s\S]*?<!--\/seo:head-->/,
  body: /<!--seo:body-->[\s\S]*?<!--\/seo:body-->/,
}

/** Fills the two marker pairs of index.html with a page's head tags and fallback body. The markers stay, so it can be done again for another page. */
export function applySeo(html: string, page: PageSeo): string {
  return html
    .replace(MARK.head, () => `<!--seo:head-->\n    ${headHtml(page)}\n    <!--/seo:head-->`)
    .replace(MARK.body, () => `<!--seo:body-->${bodyHtml(page)}<!--/seo:body-->`)
}

/** sitemap.xml: the indexable pages, with the home page's banner images. `banners` are paths like /banners/1.webp. */
export function sitemapXml(banners: string[], lastmod: string): string {
  const images = banners
    .map((b) => `    <image:image><image:loc>${esc(SITE.url + b)}</image:loc><image:title>${esc(SITE.name + ' banner')}</image:title></image:image>`)
    .join('\n')
  const urls = PAGES.filter((p) => p.index)
    .map((p) =>
      [
        '  <url>',
        `    <loc>${esc(absUrl(p.path))}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${p.changefreq}</changefreq>`,
        `    <priority>${p.priority.toFixed(1)}</priority>`,
        p.path === '/' && images ? images : '',
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`
}

export function robotsTxt(): string {
  return [
    '# Kriti Studio: crawlers are welcome on every public page.',
    'User-agent: *',
    'Allow: /',
    ...DISALLOW.map((p) => `Disallow: ${p}`),
    '',
    `Sitemap: ${SITE.url}/sitemap.xml`,
    '',
  ].join('\n')
}

/** llms.txt: a short, plain-text guide to the site for AI assistants and the tools that read the web for them. */
export function llmsTxt(): string {
  const pages = PAGES.filter((p) => p.index && p.path !== '/')
    .map((p) => `- [${p.crumb}](${absUrl(p.path)}): ${p.description}`)
    .join('\n')
  const faqs = FAQS.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')
  return `# ${SITE.name}

> ${SITE.description}

${SITE.name} (${SITE.url}) is a free, browser-based resume builder for students, freshers and professionals in India. It offers ${TEMPLATE_COUNT} resume templates, a live PDF preview, colour, font and layout controls, a resume strength check with job-description keyword matching, and PDF download. There is no sign-up and no watermark. Resumes are created and stored in the user's own browser and are never uploaded to a server.

## Pages

- [Home](${SITE.url}/): ${PAGES[0].description}
${pages}

## Frequently asked questions

${faqs}

## Good to know

- The product is free to use. It does not need an account.
- Personal resume data stays on the user's device, so the site cannot see or recover it.
- Pages for a person's own resumes (${SITE.url}/resumes) are private and not meant for indexing.
- Sitemap: ${SITE.url}/sitemap.xml
`
}
