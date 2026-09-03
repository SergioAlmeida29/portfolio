import { IconArrowUpRight } from '@tabler/icons-react'
import { useContent } from '../content'
import { Reveal } from './ui/reveal'
import { Section } from './Section'
import { DetailList, Expandable } from './ui/expandable'
import { Tags } from './ui/tags'

export function Projects() {
  const { projects, ui } = useContent()

  return (
    <Section id="projects" title={projects.title}>
      <Reveal>
        <ul className="glass-panel divide-y divide-white/[0.07] rounded-xl px-7 md:px-9">
          {projects.items.map((p, i) => (
            <li key={i}>
              <Expandable
                className="py-6"
                label={p.name}
                head={
                  <div className="md:grid md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-4">
                      <h3 className="text-base font-medium tracking-tight">{p.name}</h3>
                      <p className="mt-1 font-mono text-[11px] text-muted">
                        {p.kind}, {p.when}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted md:col-span-8 md:mt-0">
                      {p.summary}
                    </p>
                  </div>
                }
              >
                <div className="md:grid md:grid-cols-12 md:gap-8">
                  <Tags items={p.stack} className="md:col-span-4" />
                  <div className="mt-6 md:col-span-8 md:mt-0">
                    <DetailList title={ui.detail} items={p.detail} />
                    {p.links && (
                      <div className="mt-5 flex gap-6">
                        {p.links.map((l) => (
                          <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-fg/80 transition-colors hover:text-accent"
                          >
                            {l.label}
                            <IconArrowUpRight size={14} stroke={2} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Expandable>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
