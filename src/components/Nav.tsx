const links = [
  { href: '#trabalho', label: 'Trabalho' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#percurso', label: 'Percurso' },
  { href: '#contacto', label: 'Contacto' },
]

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <a href="#top" className="text-sm font-medium tracking-tight">
          Sérgio Almeida
        </a>
        <nav className="flex items-center gap-6 text-sm text-muted">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={`transition-colors hover:text-fg ${
                i < links.length - 1 ? 'hidden sm:inline' : ''
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
