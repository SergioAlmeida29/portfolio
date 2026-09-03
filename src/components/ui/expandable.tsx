import { IconPlus } from '@tabler/icons-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { useId, useState } from 'react'
import { useContent } from '../../content'
import { cn } from '../../lib/cn'

/**
 * Divulgação progressiva. O resumo fica sempre visível, o detalhe abre por
 * cima do sítio. Transição de estado, portanto a altura anima: é a única
 * forma honesta de fazer um acordeão, e é um gesto discreto, não por frame.
 */
export function Expandable({
  head,
  children,
  className,
  contentClassName,
  label,
}: {
  head: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
  label: string
}) {
  const { ui } = useContent()
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const panelId = useId()

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group/exp flex w-full items-start gap-6 text-left"
      >
        <span className="min-w-0 flex-1">{head}</span>
        <span
          aria-hidden
          className="glass-soft mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors duration-300 group-hover/exp:border-white/25 group-hover/exp:text-fg"
        >
          <motion.span
            className="grid place-items-center"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <IconPlus size={15} stroke={2} />
          </motion.span>
        </span>
        <span className="sr-only">
          {open ? `${ui.close} ${label}` : `${ui.open} ${label}`}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="panel"
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
            <div className={cn('pt-6', contentClassName)}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Lista de detalhe dentro de um painel aberto. */
export function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-mono text-[11px] text-muted/70">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="border-l border-line pl-4 text-sm leading-relaxed text-muted"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
