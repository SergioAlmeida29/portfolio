import { IconArrowUpRight } from '@tabler/icons-react'
import { useContent, useLang } from '../content'
import { now } from '../content/now.generated'
import { monthYear } from '../lib/date'
import { Reveal } from './ui/reveal'
import { Section } from './Section'

export function Contributions() {
  const { contributions } = useContent()
  const { lang } = useLang()

  return (
    <Section id="open-source" title={contributions.title}>
      <Reveal>
        <p className="font-mono text-[11px] text-muted/70">{contributions.listLabel}</p>
      </Reveal>

      <Reveal>
        <ul className="glass-panel mt-3 divide-y divide-white/[0.07] rounded-xl px-7 md:px-9">
          {now.contributions.map((pr, i) => (
            <li key={i}>
              <a
                href={pr.url}
                target="_blank"
                rel="noreferrer"
                className="group/pr flex flex-col gap-3 py-6 md:flex-row md:items-center md:gap-8"
              >
                <div className="flex items-baseline gap-2.5 md:w-56 md:shrink-0">
                  <span className="font-mono text-[13px] text-fg/90">{pr.repo}</span>
                  <span className="font-mono text-[13px] text-muted">#{pr.number}</span>
                </div>

                <p className="flex-1 text-sm leading-relaxed text-muted transition-colors group-hover/pr:text-fg/90">
                  {pr.title}
                </p>

                <div className="flex items-center gap-4 md:shrink-0">
                  {pr.additions !== null && (
                    <span className="font-mono text-[12px] text-muted/80 tabular-nums">
                      +{pr.additions} −{pr.deletions}
                    </span>
                  )}
                  <span className="glass-soft rounded-full border-accent/25 px-2.5 py-0.5 font-mono text-[11px] text-accent">
                    {contributions.merged}
                    {pr.mergedAt && ` · ${monthYear(pr.mergedAt, lang)}`}
                  </span>
                  <IconArrowUpRight
                    size={15}
                    stroke={2}
                    aria-hidden
                    className="text-muted/60 transition-colors group-hover/pr:text-accent"
                  />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

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
