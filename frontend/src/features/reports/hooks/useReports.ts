import { useEffect, useState } from 'react'
import type { SavedReport } from '../constants'
import { loadReports, saveReports } from '../utils'

export function useReports() {
  const [reports, setReports] = useState<Record<string, SavedReport>>(loadReports)

  useEffect(() => {
    saveReports(reports)
  }, [reports])

  const updateReport = (key: string, report: SavedReport) => {
    setReports((prev) => ({ ...prev, [key]: report }))
  }

  return { reports, setReports, updateReport }
}
