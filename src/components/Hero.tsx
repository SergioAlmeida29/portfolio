const proof = [
  { term: 'Atual', value: 'Software Engineer · WEBA (estágio)' },
  { term: '2026', value: 'AI Engineer · ARMIS Group (estágio)' },
  { term: 'Open source', value: '3 contribuições merged · Ultralytics, Uno Platform' },
  { term: 'Distinções', value: '1.º FEUP Engineering Days · 2.º AI Critical Challenge' },
]

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center px-6 pt-28 pb-20 md:px-10">
      <div className="grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
            Software engineer · Porto
          </p>
          <h1 className="mt-6 text-6xl font-medium leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Sérgio
            <br />
            Almeida
          </h1>
          <p className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-fg/80 sm:text-xl">
            Construo sistemas backend e produtos com inteligência artificial, do
            primeiro protótipo ao deployment.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#trabalho"
              className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition hover:bg-accent/90 active:scale-[0.98]"
            >
              Ver trabalho
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg transition hover:border-fg/30 hover:bg-white/[0.03] active:scale-[0.98]"
            >
              Contacto
            </a>
          </div>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <dl className="rounded-xl border border-line bg-surface">
            {proof.map((row) => (
              <div
                key={row.term}
                className="flex flex-col gap-1 border-b border-line px-4 py-4 last:border-b-0"
              >
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  {row.term}
                </dt>
                <dd className="text-sm leading-snug text-fg/90">{row.value}</dd>
              </div>
            ))}
            <div className="flex items-center gap-2 px-4 py-4">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                aria-hidden
              />
              <span className="text-sm text-fg/90">
                Disponível para propostas e estágios
              </span>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
