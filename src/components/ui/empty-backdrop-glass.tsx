import type { GlassOptics } from '@samasante/liquid-glass'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react'
import { createSpecularAlphaMap, specularDefaults } from '../../lib/specular-map'

export interface EmptyBackdropGlassProps extends HTMLAttributes<HTMLDivElement> {
  optics?: Partial<GlassOptics>
  defer?: boolean
}

const layer: CSSProperties = {
  position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit',
}

/** Only for empty backdrop roots: native frost and a stationary, cached B mask. */
export function EmptyBackdropGlass({
  optics, children, className, style, defer = false, ...rest
}: EmptyBackdropGlassProps) {
  const root = useRef<HTMLDivElement>(null)
  const mask = useRef<HTMLDivElement>(null)
  const [supportsRefraction] = useState(() => {
    // Match the library's fallback: other engines did not render the SVG sheen.
    const ua = navigator.userAgent
    return (navigator as Navigator & { userAgentData?: unknown }).userAgentData != null ||
      /\b(?:Chrome|Chromium|Edg)\//.test(ua) && !/\b(?:CriOS|EdgiOS|FxiOS|OPiOS)\b/.test(ua) && !/iPhone|iPad|iPod/.test(ua)
  })
  const [nearViewport, setNearViewport] = useState(!defer)
  const cache = useRef({ key: '', url: '', canvas: null as HTMLCanvasElement | null })
  const o = { ...specularDefaults, ...optics }
  const enabled = nearViewport && supportsRefraction && o.specular > 0 && (o.glow > 0 || o.sheen > 0)
  const brightness = Math.min(1, Math.abs(o.brightness))
  const gain = Math.max(0, Math.min(1.5, o.specular))
  const backdrop = [
    o.frost > 0 ? `blur(${o.frost}px)` : '',
    o.saturate !== 1 ? `saturate(${o.saturate})` : '',
  ].filter(Boolean).join(' ') || 'none'

  useEffect(() => {
    if (!defer || nearViewport || !root.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setNearViewport(true)
      observer.disconnect()
    }, { rootMargin: '200px 0px' })
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [defer, nearViewport])

  useLayoutEffect(() => {
    const el = root.current, overlay = mask.current
    if (!el || !overlay || !enabled) return
    const measure = () => {
      const cs = getComputedStyle(el)
      const { width, height } = el.getBoundingClientRect()
      const radius = parseFloat(cs.borderTopLeftRadius) || 0
      // Move White(A) above tint and veil without changing their coefficients.
      const rgb = cs.backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0]
      const tint = rgb[3] ?? 1
      const veil = o.brightness > 0 ? 255 : 0
      overlay.style.backgroundColor = `rgb(${rgb.slice(0, 3).map(channel =>
        (1 - brightness) * ((1 - tint) * 255 + tint * channel) + brightness * veil,
      ).join(',')})`
      if (width <= 0 || height <= 0) return
      const key = JSON.stringify([
        width, height, radius, o.mapSize, o.clipToShape, o.softEdge, o.depth,
        o.sheenAngle, o.sheen, o.sheenWidth, o.sheenFalloff, o.glow, o.glowSpread, o.glowFalloff,
      ])
      const cached = cache.current
      if (key !== cached.key) {
        const canvas = cached.canvas ?? (cached.canvas = document.createElement('canvas'))
        if (canvas.width !== o.mapSize || canvas.height !== o.mapSize) {
          canvas.width = canvas.height = o.mapSize
        }
        const context = canvas.getContext('2d')
        if (!context) return
        const image = context.createImageData(o.mapSize, o.mapSize)
        const alpha = createSpecularAlphaMap(width, height, radius, optics)
        image.data.fill(255)
        for (let i = 0; i < alpha.length; i++) image.data[i * 4 + 3] = alpha[i]
        context.putImageData(image, 0, 0)
        cached.url = canvas.toDataURL('image/png')
        cached.key = key
      }
      const image = `url("${cached.url}")`
      overlay.style.maskImage = image
      overlay.style.webkitMaskImage = image
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [optics, className, style, enabled, brightness, o.brightness, o.mapSize,
    o.clipToShape, o.softEdge, o.depth, o.sheenAngle, o.sheen, o.sheenWidth,
    o.sheenFalloff, o.glow, o.glowSpread, o.glowFalloff])

  return (
    <div {...rest} ref={root} data-liquid-glass="empty-backdrop" className={className}
      style={{ display: 'block', position: 'relative', ...style,
        backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}>
      <div aria-hidden data-lg-layer="" style={{ ...layer,
        background: o.brightness > 0 ? '#fff' : '#000', opacity: brightness }} />
      <div ref={mask} aria-hidden data-lg-layer="" style={{ ...layer,
        display: enabled ? undefined : 'none', opacity: o.specular,
        maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
        maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat' }} />
      {children}
      <div aria-hidden data-lg-layer="" style={{ ...layer, boxShadow: [
        `inset 0 1px 0 rgba(255,255,255,${(0.55 * gain).toFixed(3)})`,
        `inset 0 0 0 1px rgba(255,255,255,${(0.12 * gain).toFixed(3)})`,
      ].join(', ') }} />
    </div>
  )
}
