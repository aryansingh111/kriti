import type { ResumeData, Settings } from '@/types'

/** Thrown to callers whose queued render was replaced by a newer one on the same channel. */
export class SupersededError extends Error {
  constructor() {
    super('superseded')
    this.name = 'SupersededError'
  }
}

interface Job {
  seq: number
  data: ResumeData
  settings: Settings
  priority: number
  markers: boolean
  channel?: string
  resolve: (blob: Blob) => void
  reject: (err: Error) => void
}

export interface RenderOptions {
  /** 'high' jobs (the live preview) jump ahead of 'low' ones (thumbnails). */
  priority?: 'high' | 'low'
  /** A newer queued job on the same channel replaces an older, not-yet-started one. */
  channel?: string
  /** write invisible position markers (live preview only) */
  markers?: boolean
}

let worker: Worker | null = null
let workerBroken = false
let seq = 0
let busy = false
const queue: Job[] = []
const waiting = new Map<number, { resolve: (b: Blob) => void; reject: (e: Error) => void }>()

function spawnWorker(): Worker | null {
  if (workerBroken) return null
  if (worker) return worker
  try {
    const w = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
    w.onmessage = (event: MessageEvent<{ id: number; ok: boolean; blob?: Blob; error?: string }>) => {
      const m = event.data
      const p = waiting.get(m.id)
      if (!p) return
      waiting.delete(m.id)
      if (m.ok && m.blob) p.resolve(m.blob)
      else p.reject(new Error(m.error ?? 'render failed'))
    }
    w.onerror = () => {
      // The worker could not even boot (old browser, blocked module workers…): use the main thread instead.
      workerBroken = true
      worker = null
      for (const p of waiting.values()) p.reject(new Error('worker unavailable'))
      waiting.clear()
    }
    worker = w
    return w
  } catch {
    workerBroken = true
    return null
  }
}

function inWorker(job: Job): Promise<Blob> | null {
  const w = spawnWorker()
  if (!w) return null
  return new Promise<Blob>((resolve, reject) => {
    waiting.set(job.seq, { resolve, reject })
    w.postMessage({ id: job.seq, data: job.data, settings: job.settings, opts: { markers: job.markers } })
  })
}

async function onMainThread(job: Job): Promise<Blob> {
  const { renderResumeBlob } = await import('./render')
  return renderResumeBlob(job.data, job.settings, { markers: job.markers })
}

async function run(job: Job) {
  try {
    const viaWorker = inWorker(job)
    let blob: Blob
    if (viaWorker) {
      try {
        blob = await viaWorker
      } catch {
        // One retry on the main thread covers both "worker can't run react-pdf" and flaky workers.
        blob = await onMainThread(job)
      }
    } else {
      blob = await onMainThread(job)
    }
    job.resolve(blob)
  } catch (err) {
    job.reject(err instanceof Error ? err : new Error(String(err)))
  }
}

function pump() {
  if (busy || queue.length === 0) return
  queue.sort((a, b) => b.priority - a.priority || a.seq - b.seq)
  const job = queue.shift()!
  busy = true
  void run(job).finally(() => {
    busy = false
    pump()
  })
}

/** Render a resume to a PDF blob (serialised, prioritised, off the main thread when possible). */
export function renderResume(data: ResumeData, settings: Settings, opts: RenderOptions = {}): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    if (opts.channel) {
      for (let i = queue.length - 1; i >= 0; i--) {
        if (queue[i].channel === opts.channel) {
          queue[i].reject(new SupersededError())
          queue.splice(i, 1)
        }
      }
    }
    queue.push({
      seq: ++seq,
      data,
      settings,
      priority: opts.priority === 'high' ? 1 : 0,
      markers: !!opts.markers,
      channel: opts.channel,
      resolve,
      reject,
    })
    pump()
  })
}

/** Warm up the worker (and its fonts) before the first real render. */
export function warmUp() {
  spawnWorker()
}
