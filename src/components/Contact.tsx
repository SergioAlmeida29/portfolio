import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconDownload,
  IconMail,
} from '@tabler/icons-react'
import { useContent } from '../content'
import { Reveal } from './ui/reveal'
import { WordReveal } from './ui/word-reveal'

const socials = [
  {
    href: 'https://github.com/SergioAlmeida29',
    label: 'GitHub',
    Icon: IconBrandGithub,
  },
  {
    href: 'https://www.linkedin.com/in/sergioalmeida5/',
    label: 'LinkedIn',
    Icon: IconBrandLinkedin,
  },
]

export function Contact() {
  const { contact } = useContent()

  return (
    <section id="contact" className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl xl:max-w-7xl">
        <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-medium leading-[1] tracking-[-0.03em]">
          <WordReveal text={contact.heading} inView stagger={0.07} />
        </h2>

        <Reveal delay={0.1}>
          <div className="glass mt-12 rounded-xl p-8 md:p-12">
            <a
              href={`mailto:${contact.email}`}
              className="group inline-flex items-center gap-3 text-xl tracking-tight text-fg transition-colors hover:text-accent sm:text-3xl"
            >
              <IconMail
                size={26}
                stroke={1.5}
                className="shrink-0 text-muted transition-colors group-hover:text-accent"
              />
              {contact.email}
            </a>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-soft inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-fg/85 transition-colors hover:border-white/25 hover:text-fg"
                >
                  <Icon size={17} stroke={1.75} />
                  {label}
                </a>
              ))}
              <a
                href="/Sergio-Almeida-CV.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent transition-colors hover:bg-accent/15"
              >
                <IconDownload size={17} stroke={1.75} />
                {contact.cv}
              </a>
            </div>

            <p className="mt-10 flex items-center gap-2.5 border-t border-white/[0.07] pt-7 text-sm text-muted">
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                aria-hidden
              />
              {contact.location}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
