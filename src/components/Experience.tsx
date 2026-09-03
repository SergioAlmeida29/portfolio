import { Section } from './Section'

const rows = [
  {
    when: 'Jul 2026 - Set 2026',
    role: 'Software Engineer, estágio de verão',
    org: 'WEBA',
    note: 'App de processamento automático de faturas, em produção. OCR e QR codes, Angular, .NET, Docker.',
  },
  {
    when: 'Fev 2026 - Jul 2026',
    role: 'AI Engineer, estágio curricular',
    org: 'ARMIS Group',
    note: 'Inteligência de vendas de bilhetes para o contexto da Liga Portugal. API em ASP.NET Core, modelos preditivos em Python, Azure SQL.',
  },
  {
    when: '2023 - Presente',
    role: 'Licenciatura em Engenharia Informática',
    org: 'FEUP',
    note: 'Programação, estruturas de dados, engenharia de software, bases de dados, processamento de imagem.',
  },
  {
    when: '2023 - Presente',
    role: 'Membro',
    org: 'Tuna de Engenharia da U.Porto',
    note: 'Organizador principal do XI Encontro Solidário de Tunas, com mais de 1.000 pessoas envolvidas.',
  },
]

export function Experience() {
  return (
    <Section id="percurso" title="Percurso">
      <ul className="border-t border-line">
        {rows.map((r) => (
          <li
            key={r.role + r.org}
            className="grid gap-1 border-b border-line py-6 md:grid-cols-12 md:gap-6"
          >
            <p className="font-mono text-xs text-muted md:col-span-3 md:pt-0.5">
              {r.when}
            </p>
            <div className="md:col-span-9">
              <p className="text-[15px]">
                <span className="font-medium">{r.role}</span>
                <span className="text-muted"> · {r.org}</span>
              </p>
              <p className="mt-1 max-w-prose text-sm leading-relaxed text-muted">
                {r.note}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
