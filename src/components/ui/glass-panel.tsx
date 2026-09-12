import { Glass, type GlassOptics } from '@samasante/liquid-glass'
import { animate, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState, type PointerEvent, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { EmptyBackdropGlass } from './empty-backdrop-glass'

const optics: Partial<GlassOptics> = {
  strength: 0.24,
  depth: 0.3,
  curvature: 0.24,
  bend: 0.95,
  bendWidth: 0.085,
  dispersion: 0.7,
  frost: 1.2,
  saturate: 1.3,
  brightness: 0.035,
  specular: 0.95,
  sheen: 0.8,
  sheenWidth: 2.6,
  glow: 0.045,
  glowSpread: 0.08,
}
const navigationOptics = { ...optics, frost: 7 }
// A sole child of a transparent filtered Reveal has no backdrop pixels to bend.
// Keep its identical specular map, tint and edge light; skip sampling empty RGB.
const emptyBackdropOptics = { ...optics, strength: 0, dispersion: 0 }
const opaqueOptics = { ...optics, strength: 0, dispersion: 0, frost: 0, saturate: 1, brightness: 0, specular: 0, sheen: 0, glow: 0 }
const panelStyle = { display: 'block', position: 'relative', width: '100%' } as const

export function GlassPanel({
  children,
  className,
  surface = 'panel',
  emptyBackdrop = false,
  defer = false,
}: {
  children: ReactNode
  className?: string
  surface?: 'panel' | 'navigation'
  /** Only valid as the sole child of a transparent, filtered backdrop root. */
  emptyBackdrop?: boolean
  /** Delay a below-fold specular-map generation until the panel approaches view. */
  defer?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const [opaque, setOpaque] = useState(() => matchMedia('(prefers-reduced-transparency: reduce)').matches)
  const [navigationReady, setNavigationReady] = useState(surface !== 'navigation')
  const x = useSpring(0, { stiffness: 450, damping: 40 })
  const y = useSpring(0, { stiffness: 450, damping: 40 })
  const opacity = useMotionValue(0)

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-transparency: reduce)')
    const sync = () => setOpaque(preference.matches)
    preference.addEventListener('change', sync)
    return () => preference.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (surface !== 'navigation' || navigationReady) return
    let disposed = false
    const reveal = () => {
      if (!disposed) setNavigationReady(true)
    }
    const requestIdle = (window as Window & { requestIdleCallback?: typeof window.requestIdleCallback }).requestIdleCallback
    if (requestIdle) {
      const id = requestIdle.call(window, reveal, { timeout: 500 })
      const cancelIdle = (window as Window & { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback
      return () => {
        disposed = true
        cancelIdle?.call(window, id)
      }
    }
    const id = globalThis.setTimeout(reveal, 0)
    return () => {
      disposed = true
      globalThis.clearTimeout(id)
    }
  }, [navigationReady, surface])

  useEffect(() => {
    if (opaque || reducedMotion) opacity.set(0)
  }, [opaque, reducedMotion, opacity])

  function track(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || reducedMotion || opaque) return
    const rect = event.currentTarget.getBoundingClientRect()
    const nextX = event.clientX - rect.left
    const nextY = event.clientY - rect.top
    // Reposition only while invisible; quick re-entry follows the existing spring.
    if (opacity.get() < 0.01) {
      x.jump(nextX)
      y.jump(nextY)
    } else {
      x.set(nextX)
      y.set(nextY)
    }
  }

  if (surface === 'navigation' && !navigationReady) {
    return <div className={cn('liquid-panel', className)} data-surface={surface} data-opaque={opaque || undefined} style={panelStyle}>{children}</div>
  }
  const Material = emptyBackdrop && surface === 'panel' ? EmptyBackdropGlass : Glass

  return (
    <Material
      className={cn('liquid-panel', className)}
      data-surface={surface}
      data-empty-backdrop={emptyBackdrop || undefined}
      data-opaque={opaque || undefined}
      style={panelStyle}
      optics={opaque ? opaqueOptics : surface === 'navigation' ? navigationOptics : emptyBackdrop ? emptyBackdropOptics : optics}
      {...(emptyBackdrop ? { defer } : {})}
      onPointerEnter={(event) => {
        track(event)
        if (event.pointerType === 'mouse' && !reducedMotion && !opaque) {
          animate(opacity, 0.7, { duration: 0.24 })
        }
      }}
      onPointerMove={track}
      onPointerLeave={() => {
        // Fade at the last position. Never reset the coordinates to a corner.
        animate(opacity, 0, { duration: 0.3 })
      }}
    >
      <motion.span aria-hidden className="glass-pointer-rim" style={{ opacity }}>
        <motion.span className="glass-pointer-light" style={{ x, y }} />
      </motion.span>
      <div className="glass-content">{children}</div>
    </Material>
  )
}
