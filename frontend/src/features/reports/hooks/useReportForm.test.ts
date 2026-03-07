import { act, renderHook } from '@testing-library/react'
import { useReportForm } from './useReportForm'

describe('useReportForm', () => {
  it('returns initial state', () => {
    const onSend = jest.fn()
    const { result } = renderHook(() => useReportForm(onSend))

    expect(result.current.customReport).toBe('')
    expect(result.current.files).toEqual([])
    expect(result.current.rejectReason).toBeNull()
  })

  it('updates customReport via setCustomReport', () => {
    const onSend = jest.fn()
    const { result } = renderHook(() => useReportForm(onSend))

    act(() => {
      result.current.setCustomReport('test notes')
    })

    expect(result.current.customReport).toBe('test notes')
  })

  it('adds allowed files and sets rejectReason for rejected files', () => {
    const onSend = jest.fn()
    const { result } = renderHook(() => useReportForm(onSend))

    act(() => {
      result.current.handleFileChange({
        target: {
          files: [
            new File([], 'a.jpg'),
            new File([], 'b.txt'),
            new File([], 'c.pdf'),
          ],
          value: '',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    })

    expect(result.current.files).toHaveLength(2)
    expect(result.current.files.map((f) => f.name)).toContain('a.jpg')
    expect(result.current.files.map((f) => f.name)).toContain('c.pdf')
    expect(result.current.rejectReason).toContain('b.txt')
    expect(result.current.rejectReason).toContain('Rejected')
  })

  it('clears rejectReason on next file change', () => {
    const onSend = jest.fn()
    const { result } = renderHook(() => useReportForm(onSend))

    act(() => {
      result.current.handleFileChange({
        target: { files: [new File([], 'x.txt')], value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    })
    expect(result.current.rejectReason).not.toBeNull()

    act(() => {
      result.current.handleFileChange({
        target: { files: [new File([], 'ok.jpg')], value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    })
    expect(result.current.rejectReason).toBeNull()
  })

  it('removes file by index', () => {
    const onSend = jest.fn()
    const { result } = renderHook(() => useReportForm(onSend))

    act(() => {
      result.current.handleFileChange({
        target: {
          files: [new File([], 'a.jpg'), new File([], 'b.jpg')],
          value: '',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    })
    expect(result.current.files).toHaveLength(2)

    act(() => {
      result.current.removeFile(0)
    })
    expect(result.current.files).toHaveLength(1)
    expect(result.current.files[0].name).toBe('b.jpg')
  })

  it('handleSend calls onSend and resets form', () => {
    const onSend = jest.fn()
    const { result } = renderHook(() => useReportForm(onSend))

    act(() => {
      result.current.setCustomReport('notes')
      result.current.handleFileChange({
        target: {
          files: [new File([], 'doc.pdf')],
          value: '',
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleSend({ preventDefault: jest.fn() } as unknown as React.FormEvent)
    })

    expect(onSend).toHaveBeenCalledWith('notes', ['doc.pdf'])
    expect(result.current.customReport).toBe('')
    expect(result.current.files).toEqual([])
  })

  it('handleReset clears form', () => {
    const onSend = jest.fn()
    const { result } = renderHook(() => useReportForm(onSend))

    act(() => {
      result.current.setCustomReport('x')
      result.current.handleFileChange({
        target: { files: [new File([], 'a.jpg')], value: '' },
      } as unknown as React.ChangeEvent<HTMLInputElement>)
    })

    act(() => {
      result.current.handleReset({ preventDefault: jest.fn() } as unknown as React.MouseEvent)
    })

    expect(result.current.customReport).toBe('')
    expect(result.current.files).toEqual([])
    expect(result.current.rejectReason).toBeNull()
  })

  it('resetOnMonthChange clears form', () => {
    const onSend = jest.fn()
    const { result } = renderHook(() => useReportForm(onSend))

    act(() => {
      result.current.setCustomReport('x')
    })

    act(() => {
      result.current.resetOnMonthChange()
    })

    expect(result.current.customReport).toBe('')
    expect(result.current.files).toEqual([])
    expect(result.current.rejectReason).toBeNull()
  })

  it('handleDrop adds files from dataTransfer', () => {
    const onSend = jest.fn()
    const { result } = renderHook(() => useReportForm(onSend))

    act(() => {
      result.current.handleDrop({
        preventDefault: jest.fn(),
        dataTransfer: {
          files: [new File([], 'drop.pdf')],
        },
      } as unknown as React.DragEvent)
    })

    expect(result.current.files).toHaveLength(1)
    expect(result.current.files[0].name).toBe('drop.pdf')
  })

  it('handleDragOver prevents default', () => {
    const onSend = jest.fn()
    const { result } = renderHook(() => useReportForm(onSend))
    const preventDefault = jest.fn()
    const stopPropagation = jest.fn()

    act(() => {
      result.current.handleDragOver({
        preventDefault,
        stopPropagation,
      } as unknown as React.DragEvent)
    })

    expect(preventDefault).toHaveBeenCalled()
    expect(stopPropagation).toHaveBeenCalled()
  })
})
