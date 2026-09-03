import { useContent } from '../content'
import { Reveal } from './ui/reveal'
import { Section } from './Section'

export function About() {
  const { about } = useContent()

  return (
    <Section id="about" title={about.title}>
      <Reveal>
        <p className="max-w-4xl text-2xl font-medium leading-snug tracking-tight text-fg sm:text-3xl">
          {about.headline}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-12 max-w-3xl space-y-5 text-[15px] leading-relaxed text-muted">
          {about.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
