import { RootLayout } from './layout/RootLayout'
import { Home } from './routes/Home'
import { NotFound } from './routes/NotFound'

const isHome = ['/', '/index.html'].includes(window.location.pathname)

export function App() {
  return <RootLayout>{isHome ? <Home /> : <NotFound />}</RootLayout>
}
