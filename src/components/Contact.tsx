import { GithubLogoIcon } from '@phosphor-icons/react/dist/ssr/GithubLogo'
import { LinkedinLogoIcon } from '@phosphor-icons/react/dist/ssr/LinkedinLogo'

const socials = [
  { href: 'https://github.com/SergioAlmeida29', label: 'GitHub', Icon: GithubLogoIcon },
  {
    href: 'https://www.linkedin.com/in/sergioalmeida5/',
    label: 'LinkedIn',
    Icon: LinkedinLogoIcon,
  },
]

export function Contact() {
  return (
    <section
      id="contacto"
      className="border-t border-line px-6 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Vamos falar.
        </h2>

        <a
          href="mailto:sergioalmeida29.05@gmail.com"
          className="mt-8 inline-block w-fit text-xl tracking-tight text-fg underline decoration-line decoration-1 underline-offset-[6px] transition-colors hover:decoration-accent sm:text-3xl"
        >
          sergioalmeida29.05@gmail.com
        </a>

        <div className="mt-10 flex flex-wrap gap-6 text-sm">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg"
            >
              <Icon size={18} />
              {label}
            </a>
          ))}
        </div>

        <p className="mt-12 text-sm text-muted">
          Porto, Portugal. Disponível para propostas e estágios.
        </p>
      </div>
    </section>
  )
}
