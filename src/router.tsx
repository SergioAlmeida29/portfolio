import { RootLayout } from './layout/RootLayout'
import { isHome } from './lib/base'
import { Home } from './routes/Home'
import { NotFound } from './routes/NotFound'

const home = isHome(window.location.pathname)

export function App() {
  return <RootLayout>{home ? <Home /> : <NotFound />}</RootLayout>
}
