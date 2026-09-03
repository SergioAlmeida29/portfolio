import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { useContent } from '../../content'

/** Carril vertical que se preenche com o scroll. Anima scaleY, nunca height. */
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

/** Uma linha do percurso; abre só quando traz `detail`. */
export function TimelineItem({
  when,
  role,
  org,
  note,
  detail,
  index,
}: {
  when: string
  role: string
  org: string
  note: string
  detail?: readonly string[]
  index: number
}) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const { ui } = useContent()

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

        {detail && (
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] text-muted transition-colors hover:text-accent"
            >
              <motion.span
                aria-hidden
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="text-[13px] leading-none"
              >
                +
              </motion.span>
              {ui.detail}
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.42,
                    ease: [0.16, 1, 0.3, 1],
                    opacity: { duration: reduce ? 0 : 0.28 },
                  }}
                  className="overflow-hidden"
                >
                  <span className="mt-4 block space-y-2">
                    {detail.map((d, i) => (
                      <span
                        key={i}
                        className="flex max-w-prose gap-3 text-sm leading-relaxed text-muted"
                      >
                        <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-line-bright" />
                        {d}
                      </span>
                    ))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.li>
  )
}
