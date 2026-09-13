import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let lenis: Lenis | undefined
    let frame = 0
    let clickedHash: string | undefined

    const alignHash = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        let id = window.location.hash.slice(1)
        try { id = decodeURIComponent(id) } catch {}
        const target = document.getElementById(id)
        if (!target) {
          lenis?.scrollTo(window.scrollY, { immediate: true })
          return
        }
        const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0
        const top = target.getBoundingClientRect().top + window.scrollY - offset
        if (lenis) lenis.scrollTo(top, { immediate: true })
        else window.scrollTo({ top, behavior: 'instant' })
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
    const onClick = (event: MouseEvent) => {
      const link = event.composedPath().find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement)
      const url = link?.href ? new URL(link.href) : undefined
      clickedHash = url?.origin === location.origin && url.pathname === location.pathname ? url.hash : undefined
    }
    const onHashChange = () => {
      const handledByLenis = lenis && clickedHash === location.hash
      clickedHash = undefined
      if (!handledByLenis) alignHash()
    }
    preference.addEventListener('change', sync)
    window.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      cancelAnimationFrame(frame)
      preference.removeEventListener('change', sync)
      window.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', onHashChange)
      lenis?.destroy()
    }
  }, [])

  return null
}
