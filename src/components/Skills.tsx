import { Section } from './Section'

const clusters = [
  {
    label: 'Backend & APIs',
    items: ['ASP.NET Core', 'FastAPI', 'REST', 'Microservices', 'PostgreSQL', 'Azure SQL'],
  },
  {
    label: 'IA & Dados',
    items: ['LLMs', 'RAG', 'Computer Vision', 'YOLO / Ultralytics', 'Pandas', 'Modelos preditivos'],
  },
  {
    label: 'Full-stack',
    items: ['React', 'Next.js', 'Angular', 'TypeScript', 'Tailwind'],
  },
  {
    label: 'Linguagens & tooling',
    items: ['Python', 'C#', 'C++', 'SQL', 'Docker', 'GitHub Actions'],
  },
]

export function Skills() {
  return (
    <Section id="competencias" title="Competências">
      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {clusters.map((c) => (
          <div key={c.label} className="border-t border-line pt-5">
            <p className="font-mono text-[13px] text-muted">{c.label}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.items.map((it) => (
                <li
                  key={it}
                  className="rounded-full border border-line px-3 py-1 text-sm text-fg/85"
                >
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
