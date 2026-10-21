import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { headModel, pageFor } from './site'

function upsert(selector: string, create: () => HTMLElement, set: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  set(el)
}

/**
 * Keeps the document head in step with the page. The build already wrote the right tags into each page's HTML, so this
 * matters for moving between pages without a reload: it sets the title, description, robots, canonical address, social
 * tags and the JSON-LD for the page you are now on.
 */
export function useSeo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const head = headModel(pageFor(pathname))
    document.title = head.title
    for (const t of head.meta) {
      upsert(
        `meta[${t.attr}="${t.key}"]`,
        () => {
          const m = document.createElement('meta')
          m.setAttribute(t.attr, t.key)
          return m
        },
        (el) => el.setAttribute('content', t.content),
      )
    }
    const canonical = document.head.querySelector('link[rel="canonical"]')
    if (head.canonical) {
      upsert(
        'link[rel="canonical"]',
        () => {
          const l = document.createElement('link')
          l.rel = 'canonical'
          return l
        },
        (el) => el.setAttribute('href', head.canonical!),
      )
    } else canonical?.remove()
    upsert(
      'script#ld-json',
      () => {
        const s = document.createElement('script')
        s.type = 'application/ld+json'
        s.id = 'ld-json'
        return s
      },
      (el) => (el.textContent = head.jsonLd),
    )
  }, [pathname])
}
