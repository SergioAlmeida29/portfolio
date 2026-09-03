import { useContent } from '../content'
import { Reveal } from './ui/reveal'
import { Section } from './Section'
import { SpotlightCard } from './ui/spotlight-card'
import { DetailList, Expandable } from './ui/expandable'

/**
 * Cada estágio lê-se por camadas: o produto, a minha posição nele, os números,
 * e só depois o detalhe. A linha de ownership e as métricas ficam sempre à
 * vista porque são a resposta à pergunta que interessa: o que fizeste tu.
 */
export function Internships() {
  const { internships, ui } = useContent()

  return (
    <Section id="internships" title={internships.title}>
      <div className="grid gap-5">
        {internships.roles.map((r, i) => (
          <Reveal key={r.org} delay={i * 0.08}>
            <SpotlightCard className="p-7 md:p-10">
              <Expandable
                label={r.org}
                head={
                  <div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
                        {r.org}
                      </h3>
                      <span className="glass-soft rounded-full px-3 py-1 font-mono text-[11px] text-accent">
                        {r.status}
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] text-fg/85">{r.role}</p>
                    <p className="mt-1 font-mono text-xs text-muted">{r.when}</p>

                    <p className="mt-6 font-mono text-[11px] text-muted/70">
                      {internships.product}
                    </p>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
                      {r.summary}
                    </p>

                    <p className="mt-5 max-w-2xl border-l-2 border-accent/50 pl-4 text-[15px] leading-relaxed text-fg/90">
                      {r.ownership}
                    </p>

                    <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-5">
                      {r.metrics.map((m) => (
                        <div key={m.value + m.label}>
                          <dd className="text-2xl font-medium tracking-[-0.02em] text-fg">
                            {m.value}
                          </dd>
                          <dt className="mt-1 max-w-[18ch] font-mono text-[11px] leading-relaxed text-muted">
                            {m.label}
                          </dt>
                        </div>
                      ))}
                    </dl>

                    <ul className="mt-7 flex flex-wrap gap-2">
                      {r.stack.map((s) => (
                        <li
                          key={s}
                          className="glass-soft rounded-full px-2.5 py-1 font-mono text-[11px] text-muted"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                }
              >
                <div className="border-t border-line pt-7">
                  <p className="max-w-2xl text-sm leading-relaxed text-fg/80">
                    {r.challenge}
                  </p>
                  <div className="mt-8 grid gap-8 sm:grid-cols-2">
                    <DetailList title={ui.whatIDid} items={r.did} />
                    <DetailList title={ui.result} items={r.impact} />
                  </div>
                </div>
              </Expandable>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
