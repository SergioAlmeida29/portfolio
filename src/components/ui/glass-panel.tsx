import { Glass, type GlassOptics } from '@samasante/liquid-glass'
import { animate, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState, type PointerEvent, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { EmptyBackdropGlass } from './empty-backdrop-glass'
import { Reveal } from './reveal'

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
const materialStyle = { display: 'block', position: 'absolute', inset: 0, borderRadius: 'inherit' } as const

type PanelProps = {
  children: ReactNode
  className?: string
}

export function GlassPanel({ delay = 0, ...props }: PanelProps & { delay?: number; defer?: boolean }) {
  return (
    <Reveal delay={delay}>
      <div className="glass-backdrop">
        <GlassSurface {...props} />
      </div>
    </Reveal>
  )
}

export function NavigationGlass(props: PanelProps) {
  return <GlassSurface {...props} navigation />
}

function GlassSurface({ children, className, navigation = false, defer = false }: PanelProps & {
  navigation?: boolean
  defer?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const [opaque, setOpaque] = useState(() => matchMedia('(prefers-reduced-transparency: reduce)').matches)
  const [navigationReady, setNavigationReady] = useState(false)
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
    if (!navigation) return
    const reveal = () => setNavigationReady(true)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(reveal, { timeout: 500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(reveal, 0)
    return () => window.clearTimeout(id)
  }, [navigation])

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

  return (
    <div
      className={cn('liquid-panel', className)}
      data-surface={navigation ? 'navigation' : 'panel'}
      data-opaque={opaque || undefined}
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
      {!opaque && (navigation
        ? navigationReady
          ? <Glass aria-hidden className="glass-material" style={materialStyle} optics={navigationOptics}><></></Glass>
          : <div aria-hidden className="glass-material" />
        : <EmptyBackdropGlass optics={optics} defer={defer} />)}
      <motion.span aria-hidden className="glass-pointer-rim" style={{ opacity }}>
        <motion.span className="glass-pointer-light" style={{ x, y }} />
      </motion.span>
      <div className="glass-content">{children}</div>
    </div>
  )
}
