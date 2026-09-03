import { motion, useReducedMotion } from 'motion/react'
import { cn } from '../../lib/cn'

/**
 * Revela palavra a palavra por baixo de uma mascara. Usado so onde a
 * hierarquia manda: o nome no hero e os titulos de seccao.
 * O padding vertical reserva espaco para descendentes (o "g" de Sergio)
 * e e anulado pela margem negativa para nao mexer no layout.
 */
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

  const animation = inView
    ? { whileInView: { y: '0%' }, viewport: { once: true, amount: 0.6 } }
    : { animate: { y: '0%' } }

  return (
    <span className={cn('inline-flex flex-wrap', className)}>
      {words.map((word, i) => (
        <span
          key={word + i}
          className="inline-block overflow-hidden py-[0.16em] -my-[0.16em] pr-[0.26em] last:pr-0"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '115%' }}
            {...animation}
            transition={{
              duration: 0.75,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
