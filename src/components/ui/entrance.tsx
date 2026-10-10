import { useEffect, useState, type ReactNode } from 'react'
import { EntranceReadyContext } from '../../lib/entrance'

export function Entrance({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    let frame = 0
    let timeout: ReturnType<typeof setTimeout>
    const fontBudget = new Promise<void>(resolve => { timeout = setTimeout(resolve, 2000) })

    void Promise.race([document.fonts.ready, fontBudget]).then(() => {
      clearTimeout(timeout)
      if (!active) return
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => setReady(true))
      })
    })

    return () => {
      active = false
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <EntranceReadyContext value={ready}>{children}</EntranceReadyContext>
}
