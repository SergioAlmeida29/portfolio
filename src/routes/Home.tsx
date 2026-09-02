import { Scene } from '../three/Scene'

const sections = [
  { id: 'sobre', title: 'Sobre', body: 'Engenheiro de software e IA. Placeholder.' },
  { id: 'skills', title: 'Competências', body: 'Python, TypeScript, R3F, LLMs. Placeholder.' },
  { id: 'experiencia', title: 'Experiência', body: 'Estágios em IA e software. Placeholder.' },
  { id: 'projetos', title: 'Projetos', body: 'iaedu e outros. Placeholder.' },
]

export function Home() {
  return (
    <div>
      <section className="relative flex h-svh items-center justify-center">
        <div className="absolute inset-0">
          <Scene />
        </div>
        <h1 className="pointer-events-none relative text-4xl font-semibold tracking-tight sm:text-6xl">
          Sérgio Almeida
        </h1>
      </section>

      {sections.map((s) => (
        <section
          key={s.id}
          id={s.id}
          className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-4 px-6"
        >
          <h2 className="text-2xl font-semibold tracking-tight">{s.title}</h2>
          <p className="text-muted">{s.body}</p>
        </section>
      ))}
    </div>
  )
}
