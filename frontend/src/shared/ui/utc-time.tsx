import { useEffect, useState } from 'react'

export function UtcTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const datePart = now.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).replace(',', '')
  const timePart = now.toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <span className="shrink-0 font-normal text-sm text-muted-foreground" aria-live="polite">
      {datePart}, {timePart} UTC
    </span>
  )
}
