import { useContent } from '../content'
import { Reveal } from './ui/reveal'
import { Section } from './Section'
import { SpotlightCard } from './ui/spotlight-card'
import { DetailList, Expandable } from './ui/expandable'
import { Tags } from './ui/tags'

export function Internships() {
  const { internships, ui } = useContent()

  return (
    <Section id="work" title={internships.title}>
      <div className="grid gap-5">
        {internships.roles.map((r, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <SpotlightCard className="p-7 md:p-9">
              <Expandable
                label={r.org}
                head={
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight sm:text-[1.75rem]">
                      {r.org}
                    </h3>
                    <p className="mt-1.5 text-[15px] text-fg/85">{r.role}</p>
                    <p className="mt-1 font-mono text-xs text-muted">{r.when}</p>

                    <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">
                      {r.summary}
                    </p>
                    <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-fg/90">
                      {r.mine}
                    </p>

                    <Tags items={r.stack} className="mt-6" />
                  </div>
                }
              >
                <div className="border-t border-line pt-7">
                  <dl className="flex flex-wrap gap-x-10 gap-y-5">
                    {r.metrics.map((m, mi) => (
                      <div key={mi}>
                        <dd className="text-2xl font-medium tracking-[-0.02em] text-fg">
                          {m.value}
                        </dd>
                        <dt className="mt-1 max-w-[18ch] font-mono text-[11px] leading-relaxed text-muted">
                          {m.label}
                        </dt>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-8 max-w-2xl text-sm leading-relaxed text-fg/80">
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
