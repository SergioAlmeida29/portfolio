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

  return (
    <motion.div
      className={className}
      animate={reduce ? { opacity: 1, y: 0, filter: 'none' } : undefined}
      initial={reduce ? false : { opacity: 0.6, y: 28, filter: 'blur(3px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -6% 0px' }}
      transition={{
        duration: reduce ? 0 : 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
