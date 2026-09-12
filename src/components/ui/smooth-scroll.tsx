import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'

/**
 * Smooth scroll com inércia (Lenis) + integração com os links âncora.
 * Desligado automaticamente com prefers-reduced-motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    let lenis: Lenis | undefined
    function sync() {
      lenis?.destroy()
      lenis = undefined
      if (!preference.matches) {
        lenis = new Lenis({
          lerp: 0.075,
          smoothWheel: true,
          // Lenis already reads CSS scroll-padding-top for the fixed navigation.
          anchors: true,
          autoRaf: true,
        })
      }
    }
    sync()
    const initialHashFrame = requestAnimationFrame(() => {
      if (!window.location.hash) return
      let id = window.location.hash.slice(1)
      try { id = decodeURIComponent(id) } catch {}
      const target = document.getElementById(id)
      if (!target) return
      const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-offset')) || 0
      const top = target.getBoundingClientRect().top + window.scrollY - offset
      if (lenis) lenis.scrollTo(top, { immediate: true })
      else window.scrollTo({ top, behavior: 'instant' })
    })
    preference.addEventListener('change', sync)

    return () => {
      cancelAnimationFrame(initialHashFrame)
      preference.removeEventListener('change', sync)
      lenis?.destroy()
    }
  }, [])

  return null
}
