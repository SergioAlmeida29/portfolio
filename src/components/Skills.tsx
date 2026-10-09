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
import { useContent } from '../content'
import { Marquee } from './ui/marquee'
import { Reveal } from './ui/reveal'
import { Section } from './Section'
import { Tags } from './ui/tags'

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

export function Skills() {
  const { skills } = useContent()

  return (
    <Section id="skills" title={skills.title}>
      <Reveal>
        <Marquee className="-mx-6 py-2 md:-mx-10">
          {stack.map(({ label, Icon }) => (
            <span
              key={label}
              // o ícone é a única coisa que representa a tecnologia: sem role o
              // aria-label é ignorado e a lista fica muda para um leitor de ecrã
              role="img"
              title={label}
              aria-label={label}
              className="text-muted transition-colors hover:text-fg"
            >
              <Icon size={30} stroke={1.4} aria-hidden />
            </span>
          ))}
        </Marquee>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {skills.groups.map((group, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div className="glass-panel h-full rounded-xl p-6">
              <p className="font-mono text-[13px] text-fg/90">{group.label}</p>
              <Tags items={group.items} className="mt-4" />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
