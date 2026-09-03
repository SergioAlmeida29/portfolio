export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-start justify-center px-6 md:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
        Erro 404
      </p>
      <h1 className="mt-6 text-4xl font-medium tracking-tight sm:text-5xl">
        Página não encontrada
      </h1>
      <a
        href="/"
        className="mt-8 inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-medium transition hover:border-fg/30 hover:bg-white/[0.03]"
      >
        Voltar ao início
      </a>
    </section>
  )
}
