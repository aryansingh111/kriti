import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { renderResume } from '@/pdf/client'
import { useStore } from '@/store'
import { downloadBlob, fileSafeName } from './utils'

async function celebrate() {
  try {
    const { default: confetti } = await import('canvas-confetti')
    const colors = ['#7d2ae8', '#00c4cc', '#ffc93c', '#ff5c77', '#4cd6a3']
    const fire = (originX: number, angle: number) =>
      confetti({
        particleCount: 80,
        spread: 66,
        startVelocity: 50,
        angle,
        origin: { x: originX, y: 0.82 },
        colors,
        ticks: 200,
        scalar: 0.95,
        disableForReducedMotion: true,
      })
    fire(0.12, 60)
    fire(0.88, 120)
  } catch {
    /* purely decorative */
  }
}

/** "Priya_Nair_Resume.pdf" – or just "Resume.pdf" while no name has been entered. */
export function pdfFileName(fullName: string): string {
  const name = fileSafeName(fullName)
  return name === 'Resume' ? 'Resume.pdf' : `${name}_Resume.pdf`
}

/** The PDF the user would download right now, plus the file name it gets. */
export async function buildPdf(): Promise<{ blob: Blob; filename: string }> {
  const { data, settings } = useStore.getState()
  const blob = await renderResume(data, settings, { priority: 'high' })
  return { blob, filename: pdfFileName(data.basics.fullName) }
}

export function useDownload() {
  const [busy, setBusy] = useState(false)

  const download = useCallback(async () => {
    if (busy) return
    setBusy(true)
    try {
      const { blob, filename } = await buildPdf()
      downloadBlob(blob, filename)
      toast.success('Your resume is ready', { description: `${filename} · ${(blob.size / 1024).toFixed(0)} KB` })
      void celebrate()
    } catch (err) {
      toast.error('Could not create the PDF', { description: err instanceof Error ? err.message : 'Please try again.' })
    } finally {
      setBusy(false)
    }
  }, [busy])

  return { download, busy }
}

/** Save the active resume (content + design) as a .json backup. */
export function exportDataJson() {
  const { data, settings, docs, activeId } = useStore.getState()
  const name = data.basics.fullName || docs.find((d) => d.id === activeId)?.name || 'Resume'
  const blob = new Blob([JSON.stringify({ app: 'kriti', version: 2, data, settings }, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `${fileSafeName(name)}_kriti.json`)
  toast.success('Data exported', { description: 'Import it later to pick up where you left off.' })
}
