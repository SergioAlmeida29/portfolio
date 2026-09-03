import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { WordReveal } from './ui/word-reveal'

export function Section({
  id,
  title,
  children,
  className,
}: {
  id?: string
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('border-t border-line px-6 py-20 md:px-10 md:py-28', className)}>
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
          <WordReveal text={title} inView stagger={0.06} />
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}
