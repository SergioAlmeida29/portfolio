import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-5xl font-semibold tracking-tight">404</h1>
      <p className="text-muted">Página não encontrada.</p>
      <Link to="/" className="underline underline-offset-4 hover:text-fg">
        voltar ao início
      </Link>
    </section>
  )
}
