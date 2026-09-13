import { RootLayout } from './layout/RootLayout'
import { baseUrl } from './lib/base'
import { isLiquidGlass } from './lib/preview'
import { Home } from './routes/Home'
import { NotFound } from './routes/NotFound'

const homePaths = new Set([baseUrl, `${baseUrl}index.html`])
const isHome = homePaths.has(window.location.pathname) || isLiquidGlass

export function App() {
  return (
    <RootLayout>{isHome ? <Home /> : <NotFound />}</RootLayout>
  )
}
