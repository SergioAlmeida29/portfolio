import { Section } from './Section'

const extras = [
  'Tuna de Engenharia da U.Porto',
  'EBEC 2026 (protótipo eletromecânico em 24h)',
  'Apoio técnico a eventos na FEUP',
  'Servidor FiveM com 100+ jogadores em simultâneo',
]

export function About() {
  return (
    <Section id="sobre" title="Sobre">
      <p className="max-w-4xl text-2xl font-medium leading-snug tracking-tight text-fg sm:text-3xl">
        Entro em problemas complexos, percebo as restrições depressa e chego a
        uma implementação simples, robusta e verificável.
      </p>

      <div className="mt-10 max-w-2xl space-y-5 text-[15px] leading-relaxed text-muted">
        <p>
          Estudante de Engenharia Informática na Faculdade de Engenharia da
          Universidade do Porto, com foco em backend, inteligência artificial e
          ciência de dados. Interessa-me ligar software, dados e modelos para
          resolver problemas concretos.
        </p>
        <p>
          Já desenvolvi APIs, modelos preditivos, aplicações full-stack com IA e
          soluções de extração documental por OCR. Nos estágios na ARMIS e na
          WEBA trabalhei em produtos destinados a utilização real.
        </p>
      </div>

      <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
        {extras.map((e) => (
          <li key={e} className="before:mr-2 before:text-line before:content-['/'] first:before:content-none">
            {e}
          </li>
        ))}
      </ul>
    </Section>
  )
}
