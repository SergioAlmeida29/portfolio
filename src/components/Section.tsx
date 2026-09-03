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
    <section id={id} className={cn('px-6 py-14 md:px-10 md:py-20', className)}>
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
          <WordReveal text={title} inView stagger={0.06} />
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
