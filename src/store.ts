import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { DEFAULT_SETTINGS, EMPTY_DATA, normalizeSettings } from './lib/defaults'
import { FACTORIES, newCustomEntry, newDetailRow, newLink } from './lib/factories'
import { hasContent, migrateData, normalizedOrder } from './lib/resume'
import { uid } from './lib/utils'
import { personaFor } from './personas'
import { specFor } from './pdf/specs'
import {
  DEFAULT_SECTION_ORDER,
  customKey,
  isCustomKey,
  type Basics,
  type CustomEntry,
  type CustomSection,
  type DetailRow,
  type Doc,
  type LinkKind,
  type ListItemMap,
  type ListKey,
  type ProfileLink,
  type ResumeData,
  type SectionKey,
  type Settings,
  type TemplateId,
  type TextRole,
} from './types'

export type Pane = 'edit' | 'preview'

interface Snap {
  data: ResumeData
  settings: Settings
  isSample: boolean
}

export interface FocusRequest {
  kind: 'section' | 'item' | 'basics'
  id: string
  /** bumps so the same target can be requested twice */
  n: number
}

interface State {
  docs: Doc[]
  activeId: string
  /** mirror of the active document */
  data: ResumeData
  settings: Settings
  isSample: boolean
  /** bumps on every change – drives the “saved” indicator */
  savedAt: number

  // ephemeral UI state
  pane: Pane
  pageCount: number
  selected: string | null
  dragging: boolean
  adjustLayout: boolean
  focus: FocusRequest | null
  canUndo: boolean
  canRedo: boolean

  // ui
  setPane: (pane: Pane) => void
  setPageCount: (n: number) => void
  select: (id: string | null) => void
  setDragging: (d: boolean) => void
  setAdjustLayout: (on: boolean) => void
  requestFocus: (kind: FocusRequest['kind'], id: string) => void

  // documents
  /** creates a document, makes it the active one and returns its id */
  startDoc: (templateId: TemplateId) => string
  /** makes an existing document the active one (the route decides where to show it) */
  openDoc: (id: string) => boolean
  duplicateDoc: (id: string) => void
  deleteDoc: (id: string) => void
  renameDoc: (id: string, name: string) => void
  setJobDescription: (text: string) => void

  // content
  setBasics: (patch: Partial<Basics>) => void
  addLink: (kind?: LinkKind) => string
  updateLink: (id: string, patch: Partial<ProfileLink>) => void
  removeLink: (id: string) => void
  setLinks: (links: ProfileLink[]) => void
  addItem: <K extends ListKey>(key: K, init?: Partial<ListItemMap[K]>) => string
  updateItem: <K extends ListKey>(key: K, id: string, patch: Partial<ListItemMap[K]>) => void
  removeItem: (key: ListKey, id: string) => void
  setItems: <K extends ListKey>(key: K, items: ListItemMap[K][]) => void

  // custom sections
  addCustomSection: (section: CustomSection) => void
  updateCustom: (id: string, patch: Partial<CustomSection>) => void
  removeCustom: (id: string) => void
  addCustomEntry: (sectionId: string) => string
  updateCustomEntry: (sectionId: string, entryId: string, patch: Partial<CustomEntry>) => void
  removeCustomEntry: (sectionId: string, entryId: string) => void
  setCustomEntries: (sectionId: string, items: CustomEntry[]) => void
  addDetailRow: (sectionId: string) => void
  updateDetailRow: (sectionId: string, rowId: string, patch: Partial<DetailRow>) => void
  removeDetailRow: (sectionId: string, rowId: string) => void
  setDetailRows: (sectionId: string, rows: DetailRow[]) => void

  // design
  setSettings: (patch: Partial<Settings>) => void
  setSpacing: (blockId: string, value: number | null) => void
  resetSpacing: () => void
  /** colour of one kind of text for the whole resume (null clears it) */
  setTextColor: (role: TextRole, color: string | null) => void
  /** colour of the text in one block of the preview (null clears it) */
  setBlockColor: (blockId: string, color: string | null) => void
  resetTextColors: () => void
  resetDesign: () => void
  switchTemplate: (id: TemplateId) => void
  /** a new resume in another template holding this resume's text and photo, with the template's own design; returns the new id */
  copyToTemplate: (docId: string, templateId: TemplateId) => string

  // sections
  toggleSection: (key: SectionKey) => void
  setSectionOrder: (order: SectionKey[]) => void
  renameSection: (key: SectionKey, title: string) => void
  setSectionColumn: (key: SectionKey, column: 'main' | 'side' | null) => void
  moveSection: (key: SectionKey, dir: -1 | 1) => void
  moveBlock: (blockId: string, dir: -1 | 1) => void

  // lifecycle
  loadSample: () => void
  clearAll: () => void
  importJson: (text: string) => { ok: true } | { ok: false; error: string }
  undo: () => void
  redo: () => void
}

const HISTORY_LIMIT = 120
let past: Snap[] = []
let future: Snap[] = []
let lastKey = ''
let lastAt = 0

const snapOf = (s: Pick<State, 'data' | 'settings' | 'isSample'>): Snap => ({ data: s.data, settings: s.settings, isSample: s.isSample })

/** Apply a change to the active document, recording undo history (consecutive edits with the same key coalesce). */
function change(s: State, key: string, patch: Partial<Snap>): Partial<State> {
  const now = Date.now()
  if (!(key === lastKey && now - lastAt < 900)) {
    past = [...past, snapOf(s)].slice(-HISTORY_LIMIT)
    future = []
  }
  lastKey = key
  lastAt = now
  const next: Snap = {
    data: patch.data ?? s.data,
    settings: patch.settings ?? s.settings,
    isSample: patch.isSample ?? s.isSample,
  }
  return {
    ...next,
    docs: s.docs.map((d) => (d.id === s.activeId ? { ...d, ...next, updatedAt: now } : d)),
    savedAt: now,
    canUndo: past.length > 0,
    canRedo: false,
  }
}

const uniq = () => `x${Date.now()}${Math.random()}`

const EMPTY: Snap = { data: personaFor('aurora'), settings: DEFAULT_SETTINGS, isSample: true }

function resetHistory() {
  past = []
  future = []
  lastKey = ''
}

function docName(templateId: string, docs: Doc[]): string {
  const base = `${specFor(templateId).name} resume`
  const taken = new Set(docs.map((d) => d.name))
  if (!taken.has(base)) return base
  for (let i = 2; i < 99; i++) if (!taken.has(`${base} ${i}`)) return `${base} ${i}`
  return base
}

/** "Resume (Aurora)" - made unique among the existing names. */
function copyName(srcName: string, templateId: string, docs: Doc[]): string {
  const base = `${srcName.replace(/ \([^)]*\)$/, '')} (${specFor(templateId).name})`
  const taken = new Set(docs.map((d) => d.name))
  if (!taken.has(base)) return base
  for (let i = 2; i < 99; i++) if (!taken.has(`${base} ${i}`)) return `${base} ${i}`
  return base
}

function moveWithin<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const j = index + dir
  if (index < 0 || j < 0 || j >= list.length) return list
  const next = [...list]
  ;[next[index], next[j]] = [next[j], next[index]]
  return next
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      docs: [],
      activeId: '',
      ...EMPTY,
      savedAt: 0,

      pane: 'edit',
      pageCount: 1,
      selected: null,
      dragging: false,
      adjustLayout: true,
      focus: null,
      canUndo: false,
      canRedo: false,

      /* ───────── ui ───────── */
      setPane: (pane) => set({ pane }),
      setPageCount: (pageCount) => set({ pageCount }),
      select: (selected) => set({ selected }),
      setDragging: (dragging) => set({ dragging }),
      setAdjustLayout: (adjustLayout) => set({ adjustLayout, selected: null }),
      requestFocus: (kind, id) => set((s) => ({ focus: { kind, id, n: (s.focus?.n ?? 0) + 1 }, pane: 'edit' })),

      /* ───────── documents ───────── */
      startDoc: (templateId) => {
        const s = get()
        const spec = specFor(templateId)
        const doc: Doc = {
          id: uid(),
          name: docName(templateId, s.docs),
          data: personaFor(templateId),
          settings: { ...DEFAULT_SETTINGS, template: templateId, sectionOrder: spec.order ?? DEFAULT_SECTION_ORDER },
          isSample: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        resetHistory()
        set({
          docs: [...s.docs, doc],
          activeId: doc.id,
          data: doc.data,
          settings: doc.settings,
          isSample: doc.isSample,
          pane: 'edit',
          selected: null,
          canUndo: false,
          canRedo: false,
          savedAt: Date.now(),
        })
        return doc.id
      },

      openDoc: (id) => {
        const doc = get().docs.find((d) => d.id === id)
        if (!doc) return false
        if (id === get().activeId) return true
        resetHistory()
        set({
          activeId: id,
          data: doc.data,
          settings: doc.settings,
          isSample: doc.isSample,
          pane: 'edit',
          selected: null,
          canUndo: false,
          canRedo: false,
        })
        return true
      },

      duplicateDoc: (id) => {
        const s = get()
        const src = s.docs.find((d) => d.id === id)
        if (!src) return
        const copy: Doc = {
          ...structuredClone(src),
          id: uid(),
          name: `${src.name} (copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set({ docs: [...s.docs, copy] })
      },

      deleteDoc: (id) => {
        const s = get()
        const docs = s.docs.filter((d) => d.id !== id)
        if (id !== s.activeId) return set({ docs })
        const next = docs[docs.length - 1]
        resetHistory()
        set({
          docs,
          activeId: next?.id ?? '',
          data: next?.data ?? EMPTY.data,
          settings: next?.settings ?? EMPTY.settings,
          isSample: next?.isSample ?? true,
          canUndo: false,
          canRedo: false,
        })
      },

      renameDoc: (id, name) => set((s) => ({ docs: s.docs.map((d) => (d.id === id ? { ...d, name } : d)), savedAt: Date.now() })),

      setJobDescription: (text) =>
        set((s) => ({ docs: s.docs.map((d) => (d.id === s.activeId ? { ...d, jobDescription: text } : d)) })),

      /* ───────── content ───────── */
      setBasics: (patch) =>
        set((s) => change(s, 'basics', { data: { ...s.data, basics: { ...s.data.basics, ...patch } }, isSample: false })),

      addLink: (kind = 'linkedin') => {
        const link = newLink(kind)
        set((s) => change(s, uniq(), { data: { ...s.data, basics: { ...s.data.basics, links: [...s.data.basics.links, link] } }, isSample: false }))
        return link.id
      },
      updateLink: (id, patch) =>
        set((s) =>
          change(s, `link:${id}`, {
            data: { ...s.data, basics: { ...s.data.basics, links: s.data.basics.links.map((l) => (l.id === id ? { ...l, ...patch } : l)) } },
            isSample: false,
          }),
        ),
      removeLink: (id) =>
        set((s) =>
          change(s, uniq(), {
            data: { ...s.data, basics: { ...s.data.basics, links: s.data.basics.links.filter((l) => l.id !== id) } },
            isSample: false,
          }),
        ),
      setLinks: (links) => set((s) => change(s, uniq(), { data: { ...s.data, basics: { ...s.data.basics, links } }, isSample: false })),

      addItem: (key, init) => {
        const item = { ...FACTORIES[key](), ...init } as ListItemMap[typeof key]
        set((s) => change(s, uniq(), { data: { ...s.data, [key]: [...(s.data[key] as unknown[]), item] }, isSample: false }))
        return item.id
      },
      updateItem: (key, id, patch) =>
        set((s) =>
          change(s, `item:${key}:${id}`, {
            data: { ...s.data, [key]: (s.data[key] as { id: string }[]).map((it) => (it.id === id ? { ...it, ...patch } : it)) },
            isSample: false,
          }),
        ),
      removeItem: (key, id) =>
        set((s) =>
          change(s, uniq(), {
            data: { ...s.data, [key]: (s.data[key] as { id: string }[]).filter((it) => it.id !== id) },
            isSample: false,
          }),
        ),
      setItems: (key, items) => set((s) => change(s, uniq(), { data: { ...s.data, [key]: items }, isSample: false })),

      /* ───────── custom sections ───────── */
      addCustomSection: (section) => {
        set((s) =>
          change(s, uniq(), {
            data: { ...s.data, customSections: [...s.data.customSections, section] },
            settings: { ...s.settings, sectionOrder: [...normalizedOrder(s.data, s.settings), customKey(section.id)] },
            isSample: false,
          }),
        )
        get().requestFocus('section', customKey(section.id))
      },
      updateCustom: (id, patch) =>
        set((s) =>
          change(s, `custom:${id}`, {
            data: { ...s.data, customSections: s.data.customSections.map((c) => (c.id === id ? { ...c, ...patch } : c)) },
            isSample: false,
          }),
        ),
      removeCustom: (id) =>
        set((s) => {
          const key = customKey(id)
          const sectionOrder = s.settings.sectionOrder.filter((k) => k !== key)
          const { [key]: _t, ...sectionTitles } = s.settings.sectionTitles
          const { [key]: _c, ...sectionColumn } = s.settings.sectionColumn
          void _t
          void _c
          return change(s, uniq(), {
            data: { ...s.data, customSections: s.data.customSections.filter((c) => c.id !== id) },
            settings: {
              ...s.settings,
              sectionOrder,
              hiddenSections: s.settings.hiddenSections.filter((k) => k !== key),
              sectionTitles,
              sectionColumn,
            },
            isSample: false,
          })
        }),
      addCustomEntry: (sectionId) => {
        const entry = newCustomEntry()
        set((s) =>
          change(s, uniq(), {
            data: {
              ...s.data,
              customSections: s.data.customSections.map((c) => (c.id === sectionId ? { ...c, items: [...c.items, entry] } : c)),
            },
            isSample: false,
          }),
        )
        return entry.id
      },
      updateCustomEntry: (sectionId, entryId, patch) =>
        set((s) =>
          change(s, `centry:${entryId}`, {
            data: {
              ...s.data,
              customSections: s.data.customSections.map((c) =>
                c.id === sectionId ? { ...c, items: c.items.map((i) => (i.id === entryId ? { ...i, ...patch } : i)) } : c,
              ),
            },
            isSample: false,
          }),
        ),
      removeCustomEntry: (sectionId, entryId) =>
        set((s) =>
          change(s, uniq(), {
            data: {
              ...s.data,
              customSections: s.data.customSections.map((c) =>
                c.id === sectionId ? { ...c, items: c.items.filter((i) => i.id !== entryId) } : c,
              ),
            },
            isSample: false,
          }),
        ),
      setCustomEntries: (sectionId, items) =>
        set((s) =>
          change(s, uniq(), {
            data: { ...s.data, customSections: s.data.customSections.map((c) => (c.id === sectionId ? { ...c, items } : c)) },
            isSample: false,
          }),
        ),
      addDetailRow: (sectionId) =>
        set((s) =>
          change(s, uniq(), {
            data: {
              ...s.data,
              customSections: s.data.customSections.map((c) => (c.id === sectionId ? { ...c, rows: [...c.rows, newDetailRow()] } : c)),
            },
            isSample: false,
          }),
        ),
      updateDetailRow: (sectionId, rowId, patch) =>
        set((s) =>
          change(s, `drow:${rowId}`, {
            data: {
              ...s.data,
              customSections: s.data.customSections.map((c) =>
                c.id === sectionId ? { ...c, rows: c.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)) } : c,
              ),
            },
            isSample: false,
          }),
        ),
      removeDetailRow: (sectionId, rowId) =>
        set((s) =>
          change(s, uniq(), {
            data: {
              ...s.data,
              customSections: s.data.customSections.map((c) => (c.id === sectionId ? { ...c, rows: c.rows.filter((r) => r.id !== rowId) } : c)),
            },
            isSample: false,
          }),
        ),
      setDetailRows: (sectionId, rows) =>
        set((s) =>
          change(s, uniq(), {
            data: { ...s.data, customSections: s.data.customSections.map((c) => (c.id === sectionId ? { ...c, rows } : c)) },
            isSample: false,
          }),
        ),

      /* ───────── design ───────── */
      setSettings: (patch) =>
        set((s) => change(s, `settings:${Object.keys(patch).join(',')}`, { settings: { ...s.settings, ...patch } })),

      setSpacing: (blockId, value) =>
        set((s) => {
          const spacing = { ...s.settings.spacing }
          if (value === null || Math.abs(value) < 0.5) delete spacing[blockId]
          else spacing[blockId] = Math.round(value * 2) / 2
          return change(s, `spacing:${blockId}`, { settings: { ...s.settings, spacing } })
        }),

      resetSpacing: () => set((s) => change(s, uniq(), { settings: { ...s.settings, spacing: {} } })),

      setTextColor: (role, color) =>
        set((s) => {
          const textColors = { ...s.settings.textColors }
          if (color) textColors[role] = color
          else delete textColors[role]
          return change(s, `textcolor:${role}`, { settings: { ...s.settings, textColors } })
        }),

      setBlockColor: (blockId, color) =>
        set((s) => {
          const blockColors = { ...s.settings.blockColors }
          if (color) blockColors[blockId] = color
          else delete blockColors[blockId]
          return change(s, `blockcolor:${blockId}`, { settings: { ...s.settings, blockColors } })
        }),

      resetTextColors: () => set((s) => change(s, uniq(), { settings: { ...s.settings, textColors: {}, blockColors: {} } })),

      resetDesign: () =>
        set((s) =>
          change(s, uniq(), {
            settings: {
              ...DEFAULT_SETTINGS,
              template: s.settings.template,
              sectionOrder: s.settings.sectionOrder,
              hiddenSections: s.settings.hiddenSections,
              sectionTitles: s.settings.sectionTitles,
              pageSize: s.settings.pageSize,
            },
          }),
        ),

      switchTemplate: (id) => {
        const s = get()
        if (id === s.settings.template && !s.isSample) return
        const spec = specFor(id)
        if (s.isSample) {
          // untouched sample content → show this template's own persona and default section order
          set(
            change(s, uniq(), {
              data: personaFor(id),
              settings: { ...s.settings, template: id, sectionOrder: spec.order ?? DEFAULT_SECTION_ORDER, hiddenSections: [], sectionTitles: {}, sectionColumn: {}, spacing: {}, blockColors: {} },
              isSample: true,
            }),
          )
        } else {
          set(change(s, uniq(), { settings: { ...s.settings, template: id } }))
        }
      },

      copyToTemplate: (docId, templateId) => {
        const s = get()
        const src = s.docs.find((d) => d.id === docId)
        if (!src) return ''
        // only the words and the photo move; colours, fonts, layout and section order stay the template's own
        const spec = specFor(templateId)
        const doc: Doc = {
          id: uid(),
          name: copyName(src.name, templateId, s.docs),
          data: structuredClone(src.data),
          settings: { ...DEFAULT_SETTINGS, template: templateId, sectionOrder: spec.order ?? DEFAULT_SECTION_ORDER },
          isSample: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set({ docs: [...s.docs, doc] })
        return doc.id
      },

      /* ───────── sections ───────── */
      toggleSection: (key) =>
        set((s) => {
          const hidden = s.settings.hiddenSections
          return change(s, uniq(), {
            settings: {
              ...s.settings,
              hiddenSections: hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key],
            },
          })
        }),

      setSectionOrder: (order) => set((s) => change(s, 'section-order', { settings: { ...s.settings, sectionOrder: order } })),

      renameSection: (key, title) =>
        set((s) => {
          const sectionTitles = { ...s.settings.sectionTitles }
          if (title.trim()) sectionTitles[key] = title
          else delete sectionTitles[key]
          return change(s, `rename:${key}`, { settings: { ...s.settings, sectionTitles } })
        }),

      setSectionColumn: (key, column) =>
        set((s) => {
          const sectionColumn = { ...s.settings.sectionColumn }
          if (column) sectionColumn[key] = column
          else delete sectionColumn[key]
          return change(s, uniq(), { settings: { ...s.settings, sectionColumn } })
        }),

      moveSection: (key, dir) =>
        set((s) => {
          const order = normalizedOrder(s.data, s.settings)
          const visible = (k: SectionKey) => !s.settings.hiddenSections.includes(k) && hasContent(s.data, k)
          let i = order.indexOf(key)
          if (i < 0) return {}
          let j = i + dir
          while (j >= 0 && j < order.length && !visible(order[j])) j += dir
          if (j < 0 || j >= order.length) return {}
          const next = [...order]
          ;[next[i], next[j]] = [next[j], next[i]]
          i = j
          return change(s, uniq(), { settings: { ...s.settings, sectionOrder: next } })
        }),

      moveBlock: (blockId, dir) => {
        const s = get()
        if (blockId.startsWith('sec:')) return get().moveSection(blockId.slice(4) as SectionKey, dir)
        if (!blockId.startsWith('item:')) return
        const rest = blockId.slice(5)
        if (rest.startsWith('custom:')) {
          const [, sid, eid] = rest.split(':')
          const sec = s.data.customSections.find((c) => c.id === sid)
          if (!sec) return
          const idx = sec.items.findIndex((i) => i.id === eid)
          return get().setCustomEntries(sid, moveWithin(sec.items, idx, dir))
        }
        const [kind, id] = rest.split(':') as [ListKey, string]
        const list = s.data[kind] as { id: string }[]
        const idx = list.findIndex((i) => i.id === id)
        get().setItems(kind, moveWithin(list, idx, dir) as never)
      },

      /* ───────── lifecycle ───────── */
      loadSample: () =>
        set((s) => change(s, uniq(), { data: personaFor(s.settings.template), isSample: true })),

      clearAll: () => set((s) => change(s, uniq(), { data: structuredClone(EMPTY_DATA), isSample: false })),

      importJson: (text) => {
        try {
          const parsed = JSON.parse(text)
          const incoming = parsed.data ?? parsed
          if (!incoming || typeof incoming !== 'object' || !incoming.basics) {
            return { ok: false, error: 'That file does not look like a Kriti export.' }
          }
          const data = migrateData(incoming)
          const settings = parsed.settings ? normalizeSettings(parsed.settings) : get().settings
          set((s) => change(s, uniq(), { data, settings, isSample: false }))
          return { ok: true }
        } catch {
          return { ok: false, error: 'Could not read that file – is it valid JSON?' }
        }
      },

      undo: () => {
        const s = get()
        const prev = past[past.length - 1]
        if (!prev) return
        future = [...future, snapOf(s)]
        past = past.slice(0, -1)
        lastKey = ''
        set({
          ...prev,
          docs: s.docs.map((d) => (d.id === s.activeId ? { ...d, ...prev, updatedAt: Date.now() } : d)),
          canUndo: past.length > 0,
          canRedo: true,
          savedAt: Date.now(),
        })
      },
      redo: () => {
        const s = get()
        const next = future[future.length - 1]
        if (!next) return
        past = [...past, snapOf(s)]
        future = future.slice(0, -1)
        lastKey = ''
        set({
          ...next,
          docs: s.docs.map((d) => (d.id === s.activeId ? { ...d, ...next, updatedAt: Date.now() } : d)),
          canUndo: true,
          canRedo: future.length > 0,
          savedAt: Date.now(),
        })
      },
    }),
    {
      name: 'kriti:v2',
      version: 2,
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const v = localStorage.getItem(name) ?? localStorage.getItem('vitae:v2') // pre-rebrand data
          if (v) return v
          // one-time upgrade from the single-resume v1 format
          try {
            const old = JSON.parse(localStorage.getItem('vitae:v1') ?? 'null')?.state
            if (!old?.data) return null
            const doc: Doc = {
              id: uid(),
              name: 'My resume',
              data: migrateData(old.data),
              settings: normalizeSettings(old.settings),
              isSample: !!old.isSample,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
            return JSON.stringify({ state: { docs: [doc], activeId: doc.id, resume: !!old.started }, version: 2 })
          } catch {
            return null
          }
        },
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      })),
      partialize: (s) => ({ docs: s.docs, activeId: s.activeId }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as { docs?: Doc[]; activeId?: string }
        const docs = (p.docs ?? []).map((d) => ({
          ...d,
          // documents saved before the rename were called "... resume" with an accent
          name: d.name.replace(/r\u00e9sum\u00e9/gi, (m) => (m[0] === 'R' ? 'Resume' : 'resume')),
          data: migrateData(d.data),
          settings: normalizeSettings(d.settings),
        }))
        const active = docs.find((d) => d.id === p.activeId) ?? docs[docs.length - 1]
        if (!active) return current
        return {
          ...current,
          docs,
          activeId: active.id,
          data: active.data,
          settings: active.settings,
          isSample: active.isSample,
        }
      },
    },
  ),
)

export const useActiveDoc = () => useStore((s) => s.docs.find((d) => d.id === s.activeId))

/** Is this a custom-section key? (re-exported for convenience) */
export { isCustomKey }
