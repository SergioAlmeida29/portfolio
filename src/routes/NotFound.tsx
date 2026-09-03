import { useContent } from '../content'

export function NotFound() {
  const { notFound } = useContent()

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-start justify-center px-6 md:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
        {notFound.code}
      </p>
      <h1 className="mt-6 text-4xl font-medium tracking-tight sm:text-5xl">
        {notFound.title}
      </h1>
      <a
        href="/"
        className="glass-soft mt-8 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition hover:border-white/20 hover:bg-white/[0.07]"
      >
        {notFound.back}
      </a>
    </section>
  )
}
