import { useContent } from '../content'
import { Reveal } from './ui/reveal'

export function Proof() {
  const { proof } = useContent()

  return (
    <section className="px-6 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <dl className="glass-panel grid overflow-hidden rounded-xl md:grid-cols-4">
            {proof.facts.map((fact) => (
              <div
                key={fact.value + fact.label}
                className="border-b border-white/[0.07] px-7 py-8 md:border-b-0 md:border-r"
              >
                <dt className="sr-only">{fact.label}</dt>
                <dd>
                  <p className="text-5xl font-medium tracking-[-0.03em] text-fg">
                    {fact.value}
                  </p>
                  <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-muted">
                    {fact.label}
                  </p>
                </dd>
              </div>
            ))}

            <div className="flex items-center px-7 py-8">
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-fg/90">
                <span
                  className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                {proof.availability}
              </p>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
