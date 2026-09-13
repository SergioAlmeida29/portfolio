import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const fluid = !reduce

  return (
    <motion.div
      className={className}
      // Keep the empty backdrop boundary even before reduced-motion reveals enter.
      style={reduce ? { filter: 'blur(0px)' } : undefined}
      animate={reduce ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      initial={reduce ? false : { opacity: 0.6, y: 28, filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={
        fluid
          ? { once: true, amount: 0.12, margin: '0px 0px -6% 0px' }
          : { once: true, amount: 0.2 }
      }
      transition={{
        duration: reduce ? 0 : fluid ? 0.8 : 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
