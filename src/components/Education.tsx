import { useContent } from '../content'
import { Reveal } from './ui/reveal'
import { Section } from './Section'
import { Timeline, TimelineItem } from './ui/timeline'

export function Education() {
  const { education } = useContent()

  return (
    <Section id="education" title={education.title}>
      <div className="glass-panel rounded-xl px-7 py-4 md:px-9">
        <Timeline>
          {education.rows.map((row, i) => (
            <TimelineItem key={row.role + row.org} index={i} {...row} />
          ))}
        </Timeline>
      </div>

      {/* Para empresas fora de Portugal isto é um filtro; melhor respondê-lo
          antes de ser perguntado. */}
      <Reveal delay={0.12}>
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-line px-7 py-6 sm:flex-row sm:items-center sm:gap-10 md:px-9">
          <p className="font-mono text-[11px] text-muted/70 sm:w-40 sm:shrink-0">
            {education.languagesLabel}
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {education.languages.map((lang) => (
              <li key={lang} className="text-sm text-muted">
                {lang}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}
