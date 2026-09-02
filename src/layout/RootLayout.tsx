import { Link, NavLink, Outlet } from 'react-router-dom'

const isStaging = import.meta.env.VITE_APP_ENV === 'staging'

export function RootLayout() {
  return (
    <div className="min-h-svh">
      {isStaging && (
        <div className="fixed bottom-3 left-3 z-50 rounded bg-yellow-400 px-2 py-1 text-xs font-semibold text-black">
          STAGING
        </div>
      )}

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-4 text-sm mix-blend-difference">
        <Link to="/" className="font-semibold tracking-tight">
          sérgio almeida
        </Link>
        <nav className="flex gap-5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'text-fg' : 'text-muted hover:text-fg'
            }
          >
            início
          </NavLink>
          <NavLink
            to="/projetos"
            className={({ isActive }) =>
              isActive ? 'text-fg' : 'text-muted hover:text-fg'
            }
          >
            projetos
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="px-6 py-10 text-center text-xs text-muted">
        © {new Date().getFullYear()} Sérgio Almeida
      </footer>
    </div>
  )
}
