import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let lenis: Lenis | undefined
    let frame = 0

    const alignHash = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        let id = window.location.hash.slice(1)
        try { id = decodeURIComponent(id) } catch {}
        const target = document.getElementById(id)
        if (!target) return
        const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0
        if (lenis) lenis.scrollTo(target, { immediate: true })
        else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'instant' })
      })
    }

    const sync = () => {
      lenis?.destroy()
      lenis = undefined
      if (!preference.matches) {
        lenis = new Lenis({
          lerp: 0.075,
          smoothWheel: true,
          anchors: true,
          autoRaf: true,
        })
      }
    }

    sync()
    alignHash()
    const onHashChange = () => {
      if (!lenis) alignHash()
    }
    preference.addEventListener('change', sync)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      cancelAnimationFrame(frame)
      preference.removeEventListener('change', sync)
      window.removeEventListener('hashchange', onHashChange)
      lenis?.destroy()
    }
  }, [])

  return null
}
