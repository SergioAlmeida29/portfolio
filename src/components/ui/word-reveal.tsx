import { motion, useReducedMotion } from 'motion/react'
import { useContext } from 'react'
import { cn } from '../../lib/cn'
import { EntranceReadyContext } from '../../lib/entrance'

export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.08,
  inView = false,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  inView?: boolean
}) {
  const reduce = useReducedMotion()
  const ready = useContext(EntranceReadyContext)
  const words = text.split(' ')

  if (reduce) return <span className={className}>{text}</span>

  const animation = {
    variants: {
      hidden: { transform: 'translateY(115%)' },
      visible: { transform: 'translateY(0%)' },
    },
  }

  return (
    <motion.span
      className={cn('inline-flex flex-wrap', className)}
      // Observe the visible wrapper, not a translated child clipped by overflow.
      initial="hidden"
      animate={!inView && ready ? 'visible' : undefined}
      whileInView={inView && ready ? 'visible' : undefined}
      viewport={{ once: true, amount: 0.2 }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden py-[0.16em] -my-[0.16em] pr-[0.26em] last:pr-0"
        >
          <motion.span
            className="inline-block will-change-transform"
            {...animation}
            transition={{
              duration: 0.75,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}{i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}
