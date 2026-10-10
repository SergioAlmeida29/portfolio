import { motion, useReducedMotion } from 'motion/react'
import { useContext, type ReactNode } from 'react'
import { EntranceReadyContext } from '../../lib/entrance'

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
  const ready = useContext(EntranceReadyContext)

  return (
    <motion.div
      className={className}
      animate={reduce ? { opacity: 1, transform: 'translateY(0px)' } : undefined}
      initial={reduce ? false : { opacity: 0, transform: 'translateY(28px)' }}
      whileInView={ready ? { opacity: 1, transform: 'translateY(0px)' } : undefined}
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
