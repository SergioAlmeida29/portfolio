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
            <TimelineItem key={i} index={i} {...row} />
          ))}
        </Timeline>
      </div>

      <Reveal delay={0.12}>
        <div className="glass-panel mt-5 rounded-xl px-7 py-7 md:px-9">
          <p className="font-mono text-[11px] text-muted/70">
            {education.languagesLabel}
          </p>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {education.languages.map((lang, i) => {
              const [nome, nivel] = lang.split(' — ')
              return (
                <li key={i}>
                  <p className="text-[15px] font-medium text-fg">{nome}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{nivel}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </Reveal>
    </Section>
  )
}
