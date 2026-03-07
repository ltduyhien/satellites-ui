import type { SavedReport } from './constants'
import { ALLOWED_EXTENSIONS, DUMMY_REPORTS, REPORTS_STORAGE_KEY } from './constants'

export function loadReports(): Record<string, SavedReport> {
  try {
    const raw = localStorage.getItem(REPORTS_STORAGE_KEY)
    if (!raw) return { ...DUMMY_REPORTS }
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { ...DUMMY_REPORTS }
    }
    const saved: Record<string, SavedReport> = {}
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v === 'object' && v !== null && typeof (v as SavedReport).notes === 'string' && Array.isArray((v as SavedReport).fileNames)) {
        saved[k] = { notes: (v as SavedReport).notes, fileNames: (v as SavedReport).fileNames }
      }
    }
    return { ...DUMMY_REPORTS, ...saved }
  } catch {
    return { ...DUMMY_REPORTS }
  }
}

export function saveReports(reports: Record<string, SavedReport>) {
  localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports))
}

export function isAllowedFile(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase()
  return Boolean(ext && ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number]))
}

export function partitionFiles(chosen: File[]): { allowed: File[]; rejected: string[] } {
  const allowed: File[] = []
  const rejected: string[] = []
  chosen.forEach((f) => {
    if (isAllowedFile(f)) allowed.push(f)
    else rejected.push(f.name)
  })
  return { allowed, rejected }
}

export function getFileIcon(ext: string): string {
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼'
  return '📄'
}

export function getAvailableMonths(acquisitions: { timestamp: number }[]): { year: number; month: number }[] {
  const now = new Date()
  const currentY = now.getUTCFullYear()
  const currentM = now.getUTCMonth()

  let startY = currentY
  let startM = 0
  let endY = currentY
  let endM = currentM

  if (acquisitions.length) {
    const minTs = Math.min(...acquisitions.map((a) => a.timestamp))
    const maxTs = Math.max(...acquisitions.map((a) => a.timestamp))
    const min = new Date(minTs * 1000)
    const max = new Date(maxTs * 1000)
    startY = min.getUTCFullYear()
    startM = min.getUTCMonth()
    endY = max.getUTCFullYear()
    endM = max.getUTCMonth()
  }

  const minStartY = currentY - 1
  const minStartM = 0
  if (startY > minStartY || (startY === minStartY && startM > minStartM)) {
    startY = minStartY
    startM = minStartM
  }
  if (endY < currentY || (endY === currentY && endM < currentM)) {
    endY = currentY
    endM = currentM
  }
  const listStartY = 2025
  const listStartM = 10
  if (startY < listStartY || (startY === listStartY && startM < listStartM)) {
    startY = listStartY
    startM = listStartM
  }

  const months: { year: number; month: number }[] = []
  let y = startY
  let m = startM
  while (y < endY || (y === endY && m <= endM)) {
    months.push({ year: y, month: m })
    m += 1
    if (m > 11) {
      m = 0
      y += 1
    }
  }
  return months.length ? months : [{ year: currentY, month: currentM }]
}

export function monthKey(year: number, month: number): string {
  return `${year}-${month}`
}
