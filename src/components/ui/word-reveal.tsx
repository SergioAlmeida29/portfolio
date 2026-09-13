import { motion, useReducedMotion } from 'motion/react'
import { cn } from '../../lib/cn'

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
  const words = text.split(' ')

  if (reduce) return <span className={className}>{text}</span>

  const animation = { variants: { hidden: { y: '115%' }, visible: { y: '0%' } } }

  return (
    <motion.span
      className={cn('inline-flex flex-wrap', className)}
      // Observe the visible wrapper, not a translated child clipped by overflow.
      initial="hidden"
      animate={!inView ? 'visible' : undefined}
      whileInView={inView ? 'visible' : undefined}
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
