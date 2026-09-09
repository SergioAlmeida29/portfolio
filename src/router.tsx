import { RootLayout } from './layout/RootLayout'
import { isPreview } from './lib/preview'
import { Home } from './routes/Home'
import { NotFound } from './routes/NotFound'

const isHome = ['/', '/index.html'].includes(window.location.pathname) || isPreview

// aplicado antes do primeiro render para evitar flash do fundo default
if (isPreview) {
  document.documentElement.dataset.preview = 'new'
}

export function App() {
  return (
    <RootLayout>{isHome ? <Home /> : <NotFound />}</RootLayout>
  )
}
