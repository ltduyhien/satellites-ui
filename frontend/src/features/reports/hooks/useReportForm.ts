import { useCallback, useRef, useState } from 'react'
import { ALLOWED_EXTENSIONS } from '../constants'
import { partitionFiles } from '../utils'

export function useReportForm(onSend: (notes: string, fileNames: string[]) => void) {
  const [customReport, setCustomReport] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [rejectReason, setRejectReason] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const processChosenFiles = useCallback((chosen: File[]) => {
    const { allowed, rejected } = partitionFiles(chosen)
    if (rejected.length) {
      setRejectReason(
        `Rejected (unsupported): ${rejected.join(', ')}. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
      )
    }
    setFiles((prev) => [...prev, ...allowed])
  }, [])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setRejectReason(null)
      processChosenFiles(Array.from(e.target.files ?? []))
      e.target.value = ''
    },
    [processChosenFiles]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setRejectReason(null)
      processChosenFiles(Array.from(e.dataTransfer.files))
    },
    [processChosenFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSend(customReport, files.map((f) => f.name))
      setCustomReport('')
      setFiles([])
    },
    [customReport, files, onSend]
  )

  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setCustomReport('')
      setFiles([])
      setRejectReason(null)
    },
    []
  )

  const resetOnMonthChange = useCallback(() => {
    setCustomReport('')
    setFiles([])
    setRejectReason(null)
  }, [])

  return {
    customReport,
    setCustomReport,
    files,
    rejectReason,
    inputRef,
    handleFileChange,
    handleDrop,
    handleDragOver,
    removeFile,
    handleSend,
    handleReset,
    resetOnMonthChange,
  }
}
