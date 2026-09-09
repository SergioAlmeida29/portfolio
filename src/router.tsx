import { RootLayout } from './layout/RootLayout'
import { baseUrl } from './lib/base'
import { Home } from './routes/Home'
import { NotFound } from './routes/NotFound'

const homePaths = new Set([baseUrl, `${baseUrl}index.html`])
const isHome = homePaths.has(window.location.pathname)

export function App() {
  return <RootLayout>{isHome ? <Home /> : <NotFound />}</RootLayout>
}
