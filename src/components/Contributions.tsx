import { IconArrowUpRight } from '@tabler/icons-react'
import { useContent } from '../content'
import { Reveal } from './ui/reveal'
import { Section } from './Section'
import { DetailList, Expandable } from './ui/expandable'

/* Estado e diffs verificados na API do GitHub a 2026-09-03. */
export function Contributions() {
  const { contributions, ui } = useContent()

  return (
    <Section id="open-source" title={contributions.title}>
      <Reveal>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">
          {contributions.intro}
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <p className="mt-10 font-mono text-[11px] text-muted/70">
          {contributions.listLabel}
        </p>
      </Reveal>

      <ul className="glass-panel mt-3 divide-y divide-white/[0.07] rounded-xl px-7 md:px-9">
        {contributions.items.map((item, i) => (
          <li key={item.repo + item.pr}>
            <Reveal delay={i * 0.07}>
              <Expandable className="py-6" label={`${item.repo} ${item.pr}`}
                head={
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
                    <div className="flex items-baseline gap-2.5 md:w-56 md:shrink-0">
                      <span className="font-mono text-[13px] text-fg/90">
                        {item.repo}
                      </span>
                      <span className="font-mono text-[13px] text-muted">
                        {item.pr}
                      </span>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-muted">
                      {item.what}
                    </p>
                    <div className="flex items-center gap-4 md:shrink-0">
                      <span className="font-mono text-[12px] text-muted/80">
                        {item.diff}
                      </span>
                      <span className="glass-soft rounded-full border-accent/25 px-2.5 py-0.5 font-mono text-[11px] text-accent">
                        merged
                      </span>
                    </div>
                  </div>
                }
              >
                <div className="md:pl-64">
                  <DetailList title={ui.whatChanged} items={item.detail} />
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-1 text-sm text-fg/80 transition-colors hover:text-accent"
                  >
                    {ui.viewPullRequest}
                    <IconArrowUpRight size={14} stroke={2} />
                  </a>
                </div>
              </Expandable>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={0.2}>
        <a
          href={contributions.moreHref}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
        >
          {contributions.more}
          <IconArrowUpRight size={14} stroke={2} />
        </a>
      </Reveal>
    </Section>
  )
}
