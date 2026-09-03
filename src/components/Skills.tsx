import {
  IconBrandAngular,
  IconBrandAzure,
  IconBrandCpp,
  IconBrandCSharp,
  IconBrandDocker,
  IconBrandGit,
  IconBrandNextjs,
  IconBrandOpenai,
  IconBrandPrisma,
  IconBrandPython,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandTypescript,
  IconSql,
} from '@tabler/icons-react'
import { cn } from '../lib/cn'
import { useContent } from '../content'
import { Marquee } from './ui/marquee'
import { Reveal } from './ui/reveal'
import { Section } from './Section'

const stack = [
  { label: 'Python', Icon: IconBrandPython },
  { label: 'C#', Icon: IconBrandCSharp },
  { label: 'TypeScript', Icon: IconBrandTypescript },
  { label: 'C++', Icon: IconBrandCpp },
  { label: 'SQL', Icon: IconSql },
  { label: 'ASP.NET Core', Icon: IconBrandAzure },
  { label: 'React', Icon: IconBrandReact },
  { label: 'Next.js', Icon: IconBrandNextjs },
  { label: 'Angular', Icon: IconBrandAngular },
  { label: 'Prisma', Icon: IconBrandPrisma },
  { label: 'Tailwind', Icon: IconBrandTailwind },
  { label: 'Docker', Icon: IconBrandDocker },
  { label: 'Git', Icon: IconBrandGit },
  { label: 'LLMs', Icon: IconBrandOpenai },
]

/**
 * Uma lista plana faz Python e Tailwind parecerem a mesma coisa. Os níveis
 * existem para dizer onde é que a profundidade está, sem esconder o resto.
 */
export function Skills() {
  const { skills } = useContent()

  return (
    <Section id="skills" title={skills.title}>
      <Reveal>
        <Marquee className="-mx-6 py-2 md:-mx-10">
          {stack.map(({ label, Icon }) => (
            <span
              key={label}
              className="flex items-center gap-2.5 text-muted transition-colors hover:text-fg"
            >
              <Icon size={22} stroke={1.5} />
              <span className="whitespace-nowrap font-mono text-[13px]">{label}</span>
            </span>
          ))}
        </Marquee>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {skills.tiers.map((tier, i) => (
          <Reveal key={tier.label} delay={i * 0.06}>
            <div
              className={cn(
                'glass-panel h-full rounded-xl p-6',
                tier.primary && 'border-accent/25 sm:col-span-2',
              )}
            >
              <p
                className={cn(
                  'font-mono text-[13px]',
                  tier.primary ? 'text-accent' : 'text-fg/90',
                )}
              >
                {tier.label}
              </p>
              <p
                className={cn(
                  'mt-2.5 leading-relaxed',
                  tier.primary ? 'text-[15px] text-fg/85' : 'text-sm text-muted',
                )}
              >
                {tier.items}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
