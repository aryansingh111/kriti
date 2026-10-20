import { pdf } from '@react-pdf/renderer'
import { createElement, type ReactElement } from 'react'
import { resumeText } from '@/lib/resume'
import type { ResumeData, Settings } from '@/types'
import { registerFonts } from './fonts'
import TemplateRoot from './engine'
import { fallbacksFor, stripScript } from './scripts'
import { specFor } from './specs'
import { makeTheme } from './theme'

type Transform = (s: string) => string

function walk(value: unknown, fn: Transform, key?: string): unknown {
  if (typeof value === 'string') return key === 'photo' ? value : fn(value)
  if (Array.isArray(value)) return value.map((v) => walk(v, fn))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v, fn, k)]))
  }
  return value
}

/**
 * react-pdf's line breaker mishandles runs of 2+ spaces (prints stray hyphens) and some fonts choke on NBSP,
 * so normalise whitespace – and drop zero-width characters – before anything reaches the renderer.
 */
const tidy: Transform = (s) =>
  s
    .replace(/[​-‍﻿⁠]/g, '')
    .replace(/[  -   　]/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+$/gm, '')

/** Last-resort: keep only characters every bundled font is known to contain. */
const safeChars: Transform = (s) =>
  s.replace(/[^\n -~¡-ſ–—‘’“”•…·€₹]/g, '?')

export interface RenderOptions {
  /** write invisible position markers (live preview only) */
  markers?: boolean
}

async function build(data: ResumeData, settings: Settings, opts: RenderOptions, useFallbacks: boolean): Promise<Blob> {
  const spec = specFor(settings.template)
  const text = resumeText(data, settings) + Object.values(settings.sectionTitles).join(' ')
  const t = makeTheme(spec, settings, { markers: opts.markers, fallbacks: useFallbacks ? fallbacksFor(text) : [] })
  const element = createElement(TemplateRoot, { data, settings, t }) as ReactElement
  // `pdf()` is typed for <Document/> elements; our template returns one.
  return pdf(element as Parameters<typeof pdf>[0]).toBlob()
}

/**
 * Render a resume to a real, text-selectable PDF. If a font chokes, retries with progressively safer input: first
 * without the one script that breaks (so e.g. a Malayalam glitch doesn't also blank out Devanagari), then with plain
 * characters only.
 */
export async function renderResumeBlob(data: ResumeData, settings: Settings, opts: RenderOptions = {}): Promise<Blob> {
  registerFonts()
  const clean = walk(data, tidy) as ResumeData
  const cleanSettings = { ...settings, sectionTitles: walk(settings.sectionTitles, tidy) as Settings['sectionTitles'] }
  try {
    return await build(clean, cleanSettings, opts, true)
  } catch (first) {
    console.warn('[kriti] render failed, retrying with safer input', first)
    const text = resumeText(clean, cleanSettings) + Object.values(cleanSettings.sectionTitles).join(' ')
    for (const id of fallbacksFor(text).filter((s) => s !== 'ext')) {
      try {
        return await build(walk(clean, stripScript(id)) as ResumeData, cleanSettings, opts, true)
      } catch {
        /* try the next script */
      }
    }
    try {
      return await build(walk(clean, safeChars) as ResumeData, cleanSettings, opts, false)
    } catch {
      return build(walk(clean, safeChars) as ResumeData, { ...cleanSettings, fontBody: 'inter', fontHeading: 'inter' }, opts, false)
    }
  }
}
