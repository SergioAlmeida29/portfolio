import { RootLayout } from './layout/RootLayout'
import { baseUrl } from './lib/base'
import { isPreview } from './lib/preview'
import { Home } from './routes/Home'
import { NotFound } from './routes/NotFound'

const homePaths = new Set([baseUrl, `${baseUrl}index.html`])
const isHome = homePaths.has(window.location.pathname) || isPreview

export function App() {
  return (
    <RootLayout>{isHome ? <Home /> : <NotFound />}</RootLayout>
  )
}
