import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { PdfStage } from '@/components/stage/PdfStage'
import { useDownload } from '@/lib/download'
import { paths, type Rail as RailId } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'
import { CheckPanel } from './panels/CheckPanel'
import { ContentPanel } from './panels/ContentPanel'
import { DesignPanel } from './panels/DesignPanel'
import { SectionsPanel } from './panels/SectionsPanel'
import { TemplatesPanel } from './panels/TemplatesPanel'
import { Rail } from './Rail'
import { TopBar } from './TopBar'

/** The editor. `rail` is the active tool, taken from the URL: /resumes/:id/edit/:panel */
export default function Editor({ rail }: { rail: RailId }) {
  const navigate = useNavigate()
  const activeId = useStore((s) => s.activeId)
  const pane = useStore((s) => s.pane)
  const focusN = useStore((s) => s.focus?.n ?? 0)
  const { download } = useDownload()

  // "Edit content" on a selected block in the preview opens the Content tool
  const seenFocus = useRef(focusN)
  useEffect(() => {
    if (focusN === seenFocus.current) return
    seenFocus.current = focusN
    if (rail !== 'content') navigate(paths.edit(activeId, 'content'))
  }, [focusN, rail, activeId, navigate])

  // leaving the editor should not leave a block selected for next time
  useEffect(() => () => useStore.getState().select(null), [])

  // ⌘/Ctrl+S downloads · ⌘/Ctrl+Z undoes · ⇧⌘/Ctrl+Shift+Z redoes (outside text fields, where the browser handles undo)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return
      const k = e.key.toLowerCase()
      const tag = (e.target as HTMLElement)?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
      if (k === 's') {
        e.preventDefault()
        void download()
      } else if (k === 'z' && !typing) {
        e.preventDefault()
        if (e.shiftKey) useStore.getState().redo()
        else useStore.getState().undo()
      } else if (k === 'y' && !typing) {
        e.preventDefault()
        useStore.getState().redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [download])

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-bg">
      <TopBar rail={rail} />
      <div className="relative flex min-h-0 flex-1">
        <Rail rail={rail} />
        <aside
          className={cn(
            'min-h-0 w-full shrink-0 flex-col border-r border-line bg-surface pb-16 lg:flex lg:w-[26rem] lg:pb-0',
            pane === 'edit' ? 'flex' : 'hidden',
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={rail}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="flex min-h-0 flex-1 flex-col"
            >
              {rail === 'templates' && <TemplatesPanel />}
              {rail === 'design' && <DesignPanel />}
              {rail === 'content' && <ContentPanel />}
              {rail === 'sections' && <SectionsPanel />}
              {rail === 'check' && <CheckPanel />}
            </motion.div>
          </AnimatePresence>
        </aside>

        <main className={cn('min-w-0 flex-1 lg:block', pane === 'preview' ? 'block' : 'hidden')}>
          <PdfStage interactive />
        </main>
      </div>
    </div>
  )
}
