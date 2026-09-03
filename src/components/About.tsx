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

      <div className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-12">
        <Reveal delay={0.08} className="md:col-span-7">
          <div className="space-y-5 text-[15px] leading-relaxed text-muted">
            {about.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16} className="md:col-span-4 md:col-start-9">
          <ul className="space-y-3 text-sm text-muted">
            {about.extras.map((extra) => (
              <li key={extra} className="border-l border-line pl-4 leading-relaxed">
                {extra}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
