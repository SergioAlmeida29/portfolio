import type { ReactNode } from 'react'

export function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="border-t border-line px-6 py-14 md:px-10 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
