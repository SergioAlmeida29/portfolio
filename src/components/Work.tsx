import { ArrowUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowUpRight'
import { Section } from './Section'

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  )
}

function ExtLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-fg/80 transition-colors hover:text-accent"
    >
      {children}
      <ArrowUpRightIcon size={14} weight="bold" />
    </a>
  )
}

const also = [
  {
    group: 'Open source',
    items: [
      { name: 'Ultralytics', note: 'NMS em exports CoreML (Segment e Pose)' },
      { name: 'Ultralytics', note: 'fix de aliasing na config de augmentations' },
      { name: 'Uno Platform', note: 'testes de transições em VisualStateGroup' },
    ],
  },
  {
    group: 'Mais projetos',
    items: [
      { name: 'Assistente de voz para invisuais', note: '2.º lugar, AI Critical Challenge' },
      { name: 'Critical FrontEnd', note: 'visualizador de áudio em Web Audio e Canvas' },
      { name: 'Prog-Project', note: 'processador de imagens PNG em C++, com testes' },
    ],
  },
]

export function Work() {
  return (
    <Section id="trabalho" title="Trabalho">
      <article className="border-t border-line py-8 first:border-t-0 first:pt-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="font-mono text-xs text-muted">01 · Projeto pessoal · 2026</p>
          <div className="flex gap-5 text-sm">
            <ExtLink href="https://iafeup.vercel.app">Demo</ExtLink>
            <ExtLink href="https://github.com/SergioAlmeida29/ai_interface">
              Código
            </ExtLink>
          </div>
        </div>
        <h3 className="mt-3 text-2xl font-medium tracking-tight">
          iaedu{' '}
          <span className="font-normal text-muted">
            · Plataforma de estudo assistido por IA
          </span>
        </h3>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/85">
          Aplicação full-stack em Next.js. Chat com respostas em streaming
          (Server-Sent Events), RAG sobre PDFs e páginas web, autenticação e
          histórico persistente com Prisma e PostgreSQL. Inclui proteção contra
          SSRF em URLs fornecidos pelo utilizador.
        </p>
        <Chips items={['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind']} />
      </article>

      <article className="border-t border-line py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="font-mono text-xs text-muted">02 · Profissional · WEBA · 2026</p>
          <p className="text-sm text-muted">Código privado</p>
        </div>
        <h3 className="mt-3 text-2xl font-medium tracking-tight">
          Processamento automático de faturas{' '}
          <span className="font-normal text-muted">· em produção</span>
        </h3>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg/85">
          Aplicação usada ativamente por clientes da empresa. Leitura de faturas
          por QR code e OCR inteligente, com suporte para vários formatos de
          ficheiro. Frontend em Angular, componentes backend em .NET,
          containerização com Docker e deployment em produção.
        </p>
        <Chips items={['Angular', '.NET', 'C#', 'Docker', 'OCR']} />
      </article>

      <div className="mt-4 grid gap-x-12 gap-y-10 border-t border-line pt-8 md:grid-cols-2">
        {also.map((col) => (
          <div key={col.group}>
            <p className="font-mono text-[13px] text-muted">{col.group}</p>
            <ul className="mt-3 divide-y divide-line">
              {col.items.map((item) => (
                <li key={item.name + item.note} className="py-3 text-sm leading-relaxed">
                  <span className="text-fg/90">{item.name}</span>
                  <span className="text-muted">, {item.note}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
