// Runs react-pdf off the main thread so typing never stutters while the preview re-renders.
import type { ResumeData, Settings } from '@/types'
import { renderResumeBlob, type RenderOptions } from './render'

interface Request {
  id: number
  data: ResumeData
  settings: Settings
  opts: RenderOptions
}

const scope = self as unknown as Worker

scope.addEventListener('message', async (event: MessageEvent<Request>) => {
  const { id, data, settings, opts } = event.data
  try {
    const blob = await renderResumeBlob(data, settings, opts)
    scope.postMessage({ id, ok: true, blob })
  } catch (err) {
    scope.postMessage({ id, ok: false, error: err instanceof Error ? err.message : String(err) })
  }
})
