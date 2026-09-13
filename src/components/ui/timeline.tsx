import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import type { ReactNode } from 'react'
import { useId, useRef, useState } from 'react'
import { useContent } from '../../content'

const DOT_POS = 'absolute left-0 top-[2.2rem] md:left-[13.5rem]'
const DOT_INNER = 'block h-2 w-2 -translate-x-[0.21875rem] rounded-full'

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
          className="h-full w-px origin-top bg-gradient-to-b from-accent via-accent/70 to-accent/25 shadow-[0_0_8px_rgb(63_169_224/0.45)]"
        />
      </div>
      <ul>{children}</ul>
    </div>
  )
}

function TimelineDot() {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const active = useInView(ref, { margin: '0px 0px -42% 0px' })

  return (
    <span ref={ref} aria-hidden className={DOT_POS}>
      {/* halo de pulso ao ativar */}
      <motion.span
        className={`${DOT_INNER} absolute inset-0 bg-accent`}
        initial={false}
        animate={
          reduce || !active
            ? { scale: 0, opacity: 0 }
            : { scale: [1, 2.8], opacity: [0.6, 0] }
        }
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
      <motion.span
        className={`${DOT_INNER} relative border`}
        initial={false}
        animate={
          active
            ? {
                backgroundColor: 'var(--color-accent)',
                borderColor: 'rgb(255 255 255 / 0.35)',
                scale: 1.2,
                boxShadow: '0 0 10px rgb(63 169 224 / 0.55)',
              }
            : {
                backgroundColor: 'var(--color-line-bright)',
                borderColor: 'rgb(255 255 255 / 0)',
                scale: 1,
                boxShadow: '0 0 0 rgb(63 169 224 / 0)',
              }
        }
        transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  )
}

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
  const panelId = useId()
  const { ui } = useContent()

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col gap-1.5 py-7 pl-8 md:flex-row md:gap-10 md:pl-0"
    >
      <TimelineDot />
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
              aria-controls={panelId}
              aria-label={`${open ? ui.close : ui.open} ${role}`}
              className="timeline-detail mt-1 inline-flex min-h-11 items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-accent"
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
                  id={panelId}
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
                  <ul className="mt-4 space-y-2">
                    {detail.map((d, i) => (
                      <li
                        key={i}
                        className="flex max-w-prose gap-3 text-sm leading-relaxed text-muted"
                      >
                        <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-line-bright" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.li>
  )
}
