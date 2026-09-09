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
    preference.addEventListener('change', sync)

    return () => {
      preference.removeEventListener('change', sync)
      lenis?.destroy()
    }
  }, [])

  return null
}
