import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin, type ResolvedConfig } from 'vite'
import { applySeo, llmsTxt, robotsTxt, sitemapXml } from './src/seo/build.ts'
import { pageFor, PAGES } from './src/seo/site.ts'

const BANNER_DIR = fileURLToPath(new URL('./public/banners', import.meta.url))
const BANNER_ID = 'virtual:banners'

/**
 * `virtual:banners` - the images in public/banners, in name order (1, 2, 10 ...). The home page carousel reads this, so
 * adding, removing or replacing a file in that folder is all it takes to change the hero (the dev server reloads by itself).
 */
const bannerFiles = () => {
  try {
    return readdirSync(BANNER_DIR)
      .filter((f) => /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  } catch {
    return []
  }
}

function banners(): Plugin {
  const list = () => bannerFiles().map((f) => `/banners/${encodeURIComponent(f)}?v=${Math.round(statSync(`${BANNER_DIR}/${f}`).mtimeMs)}`)
  return {
    name: 'kriti-banners',
    resolveId: (id) => (id === BANNER_ID ? `\0${BANNER_ID}` : undefined),
    load: (id) => (id === `\0${BANNER_ID}` ? `export default ${JSON.stringify(list())}` : undefined),
    configureServer(server) {
      server.watcher.add(BANNER_DIR)
      const refresh = (file: string) => {
        if (!file.startsWith(BANNER_DIR)) return
        const mod = server.moduleGraph.getModuleById(`\0${BANNER_ID}`)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', refresh).on('unlink', refresh).on('change', refresh)
    },
  }
}

/**
 * SEO files, all generated from src/seo/site.ts so there is one place to edit:
 *  - sitemap.xml, robots.txt and llms.txt (also served by the dev server),
 *  - the head tags and a readable fallback body for each page, written into index.html,
 *  - one pre-rendered index.html per page (dist/templates/index.html ...) so that crawlers and link previews that do not
 *    run JavaScript still see each page's own title, description, canonical address and structured data,
 *  - 404.html, for hosts that serve it for unknown addresses.
 */
function seo(): Plugin {
  let config: ResolvedConfig
  const images = () => bannerFiles().map((f) => `/banners/${encodeURIComponent(f)}`)
  const files = (): Record<string, string> => ({
    '/sitemap.xml': sitemapXml(images(), new Date().toISOString().slice(0, 10)),
    '/robots.txt': robotsTxt(),
    '/llms.txt': llmsTxt(),
  })
  const types: Record<string, string> = { '/sitemap.xml': 'application/xml', '/robots.txt': 'text/plain', '/llms.txt': 'text/plain' }
  return {
    name: 'kriti-seo',
    configResolved(c) {
      config = c
    },
    // the home page's head goes into index.html; in dev, each address gets its own page's tags
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) => applySeo(html, config.command === 'serve' ? pageFor((ctx.originalUrl ?? '/').split('?')[0]) : PAGES[0]),
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split('?')[0]
        const body = files()[path]
        if (body === undefined) return next()
        res.setHeader('Content-Type', `${types[path]}; charset=utf-8`)
        res.end(body)
      })
    },
    closeBundle: {
      order: 'post',
      handler() {
        if (config.command !== 'build') return
        const out = fileURLToPath(new URL(config.build.outDir + '/', `file://${config.root}/`))
        const home = readFileSync(`${out}index.html`, 'utf8')
        for (const page of PAGES.filter((p) => p.index && p.path !== '/')) {
          mkdirSync(`${out}${page.path.slice(1)}`, { recursive: true })
          writeFileSync(`${out}${page.path.slice(1)}/index.html`, applySeo(home, page))
        }
        writeFileSync(`${out}404.html`, applySeo(home, pageFor('/404')))
        for (const [path, body] of Object.entries(files())) writeFileSync(`${out}${path.slice(1)}`, body)
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // The PDF layer also runs inside a Web Worker, where React Fast Refresh's `window` preamble would crash it
    // (react-pdf's pre-bundled dep looks like a component library to the plugin, so it is excluded too).
    react({ exclude: [/[\\/]src[\\/]pdf[\\/]/, /[\\/]\.vite[\\/]deps[\\/]@react-pdf/, /[\\/]@react-pdf[\\/]/] }),
    tailwindcss(),
    banners(),
    seo(),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  worker: { format: 'es' },
})
