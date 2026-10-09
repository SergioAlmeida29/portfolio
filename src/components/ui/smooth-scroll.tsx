import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'

export function SmoothScroll() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let lenis: Lenis | undefined
    let frame = 0
    const alignHash = (immediate = true) => {
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
        if (lenis) lenis.scrollTo(top, { immediate })
        else window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
      })
    }

    const sync = () => {
      lenis?.destroy()
      lenis = undefined
      if (!preference.matches) {
        lenis = new Lenis({
          lerp: 0.075,
          smoothWheel: true,
          anchors: false,
          autoRaf: true,
        })
      }
    }

    sync()
    alignHash()
    const onClick = (event: MouseEvent) => {
      const link = event.composedPath().find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement)
      const url = link?.href ? new URL(link.href) : undefined
      const sameDocument = url?.origin === location.origin && url.pathname === location.pathname && url.hash
      if (!sameDocument || !link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return
      let id = url.hash.slice(1)
      try { id = decodeURIComponent(id) } catch {}
      if (!document.getElementById(id)) return
      event.preventDefault()
      history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`)
      alignHash(false)
    }
    const onHashChange = () => {
      alignHash()
    }
    preference.addEventListener('change', sync)
    window.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onHashChange)
    return () => {
      cancelAnimationFrame(frame)
      preference.removeEventListener('change', sync)
      window.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onHashChange)
      lenis?.destroy()
    }
  }, [])

  return null
}
