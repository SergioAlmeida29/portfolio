import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { ReactNode } from 'react'
import { useRef } from 'react'

/**
 * Carril vertical cuja linha de progresso se desenha com o scroll.
 * Narrativa: o percurso preenche-se a medida que se le. Anima scaleY,
 * nunca height, e o carril fica estatico com movimento reduzido.
 */
export function Timeline({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 65%', 'end 55%'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="absolute left-0 top-2 bottom-2 w-px bg-line md:left-[13.5rem]"
      >
        <motion.div
          style={reduce ? { scaleY: 1 } : { scaleY }}
          className="h-full w-px origin-top bg-gradient-to-b from-accent to-accent/20"
        />
      </div>
      <ul>{children}</ul>
    </div>
  )
}

export function TimelineItem({
  when,
  role,
  org,
  note,
  index,
}: {
  when: string
  role: string
  org: string
  note: string
  index: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col gap-1.5 py-7 pl-8 md:flex-row md:gap-10 md:pl-0"
    >
      <span
        aria-hidden
        className="absolute left-0 top-[2.2rem] h-1.5 w-1.5 -translate-x-[0.1875rem] rounded-full bg-line-bright md:left-[13.5rem]"
      />
      <p className="font-mono text-xs text-muted md:w-[11.5rem] md:shrink-0 md:pt-1 md:text-right">
        {when}
      </p>
      <div className="md:pl-10">
        <p className="text-[15px]">
          <span className="font-medium">{role}</span>
          <span className="text-muted">, {org}</span>
        </p>
        <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted">{note}</p>
      </div>
    </motion.li>
  )
}
