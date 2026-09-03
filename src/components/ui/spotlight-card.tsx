import { motion, useMotionTemplate, useMotionValue } from 'motion/react'
import type { MotionStyle } from 'motion/react'
import type { MouseEvent, ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Realce radial que segue o cursor, e as mesmas coordenadas em
 * --glass-light-x/y para a aresta acender do lado por onde ele entra. As
 * coordenadas vivem em motion values, fora do ciclo de render.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const background = useMotionTemplate`radial-gradient(360px circle at ${mouseX}px ${mouseY}px, rgba(76,164,232,0.13), transparent 70%)`
  const lightX = useMotionTemplate`${mouseX}px`
  const lightY = useMotionTemplate`${mouseY}px`

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      // MotionStyle não tipa custom properties; o runtime escreve-as na mesma.
      style={
        { '--glass-light-x': lightX, '--glass-light-y': lightY } as MotionStyle
      }
      className={cn(
        'group glass relative overflow-hidden rounded-xl',
        className,
      )}
    >
      <motion.div
        aria-hidden
        style={{ background }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative h-full">{children}</div>
    </motion.div>
  )
}
