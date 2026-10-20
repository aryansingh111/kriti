import type { ResumeData } from '@/types'
import { PART1 } from './part1'
import { PART2 } from './part2'
import { PART3 } from './part3'
import { PART4 } from './part4'

/** One Indian sample resume per template (100 in total) – different names, careers and content. */
export const PERSONAS: Record<string, ResumeData> = { ...PART1, ...PART2, ...PART3, ...PART4 }

export function personaFor(templateId: string): ResumeData {
  return structuredClone(PERSONAS[templateId] ?? PERSONAS.aurora)
}
