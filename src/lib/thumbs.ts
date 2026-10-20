import { useEffect, useMemo, useState } from 'react'
import { renderResume } from '@/pdf/client'
import { personaFor } from '@/personas'
import { specFor } from '@/pdf/specs'
import { DEFAULT_SETTINGS } from './defaults'
import { idbGet, idbSet } from './idb'
import { hashString } from './utils'
import { DEFAULT_SECTION_ORDER, type Doc, type ResumeData, type Settings } from '@/types'

/** Bump when the PDF engine's output changes in a way templates' cached previews should not survive. */
const ENGINE_VERSION = 'e4'

const memory = new Map<string, string>()
const inflight = new Map<string, Promise<string>>()
const MAX_ENTRIES = 160

function remember(key: string, url: string) {
  memory.set(key, url)
  while (memory.size > MAX_ENTRIES) {
    const oldest = memory.keys().next().value as string
    const stale = memory.get(oldest)
    memory.delete(oldest)
    if (stale) setTimeout(() => URL.revokeObjectURL(stale), 5000)
  }
}

/** Render page 1 of a resume into a crisp bitmap. */
async function makeBlob(data: ResumeData, settings: Settings, cssWidth: number): Promise<Blob> {
  const blob = await renderResume(data, settings, { priority: 'low' })
  const { loadPdf, drawPage, destroyPdf } = await import('@/pdf/pdfjs')
  const doc = await loadPdf(blob)
  try {
    const canvas = document.createElement('canvas')
    await drawPage(doc, 1, canvas, cssWidth, 2)
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), 'image/webp', 0.92),
    )
  } finally {
    destroyPdf(doc)
  }
}

function thumbFor(key: string, make: () => Promise<string>): Promise<string> {
  const hit = memory.get(key)
  if (hit) return Promise.resolve(hit)
  const pending = inflight.get(key)
  if (pending) return pending
  const p = make()
    .then((url) => {
      remember(key, url)
      return url
    })
    .finally(() => inflight.delete(key))
  inflight.set(key, p)
  return p
}

const templateHash = new Map<string, string>()
function hashOf(id: string): string {
  let h = templateHash.get(id)
  if (!h) {
    h = hashString(JSON.stringify([specFor(id), personaFor(id)]))
    templateHash.set(id, h)
  }
  return h
}

export function templateSettings(id: string): Settings {
  return { ...DEFAULT_SETTINGS, template: id, sectionOrder: specFor(id).order ?? DEFAULT_SECTION_ORDER }
}

/**
 * Real render of a template filled with its own Indian sample resume. Cached in memory and IndexedDB, so the
 * gallery is instant after the first visit. Pass `enabled=false` to defer until the card scrolls into view.
 */
export function useTemplateThumb(templateId: string, cssWidth = 300, enabled = true): string | null {
  const key = `tpl:${ENGINE_VERSION}:${templateId}:${cssWidth}:${hashOf(templateId)}`
  const [url, setUrl] = useState<string | null>(() => memory.get(key) ?? null)

  useEffect(() => {
    if (!enabled) return
    let alive = true
    const hit = memory.get(key)
    if (hit) {
      setUrl(hit)
      return
    }
    thumbFor(key, async () => {
      const cached = await idbGet(key)
      if (cached) return URL.createObjectURL(cached)
      const blob = await makeBlob(personaFor(templateId), templateSettings(templateId), cssWidth)
      void idbSet(key, blob)
      return URL.createObjectURL(blob)
    })
      .then((u) => alive && setUrl(u))
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [key, enabled, templateId, cssWidth])

  return url
}

const dataSigs = new WeakMap<object, string>()
const sigOf = (o: object) => {
  let s = dataSigs.get(o)
  if (!s) {
    s = hashString(JSON.stringify(o))
    dataSigs.set(o, s)
  }
  return s
}

/**
 * The person's text and photo placed into a template, with that template's own original design (colours, fonts,
 * layout, section order). Memory-cached only, since it is personal; re-renders when their content changes.
 */
export function useMyTemplateThumb(templateId: string, cssWidth: number, enabled: boolean, data: ResumeData): string | null {
  const key = `me:${ENGINE_VERSION}:${templateId}:${cssWidth}:${sigOf(data)}`
  const [url, setUrl] = useState<string | null>(() => memory.get(key) ?? null)

  useEffect(() => {
    if (!enabled) return
    let alive = true
    thumbFor(key, async () => URL.createObjectURL(await makeBlob(data, templateSettings(templateId), cssWidth)))
      .then((u) => alive && setUrl(u))
      .catch(() => undefined)
    return () => {
      alive = false
    }
    // `data` is captured by `key`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled])

  return memory.get(key) ?? url
}

/** Thumbnail of one of the user's own resumes (re-renders when its content or design changes). */
export function useDocThumb(doc: Pick<Doc, 'id' | 'data' | 'settings'>, cssWidth = 300, enabled = true): string | null {
  const sig = useMemo(() => hashString(JSON.stringify([doc.data, doc.settings])), [doc.data, doc.settings])
  const key = `doc:${ENGINE_VERSION}:${doc.id}:${sig}:${cssWidth}`
  const [url, setUrl] = useState<string | null>(() => memory.get(key) ?? null)

  useEffect(() => {
    if (!enabled) return
    let alive = true
    thumbFor(key, async () => URL.createObjectURL(await makeBlob(doc.data, doc.settings, cssWidth)))
      .then((u) => alive && setUrl(u))
      .catch(() => undefined)
    return () => {
      alive = false
    }
    // `doc` is captured by `key`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled])

  return url
}
