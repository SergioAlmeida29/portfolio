import { RootLayout } from './layout/RootLayout'
import { isHome } from './lib/route'
import { Home } from './routes/Home'
import { NotFound } from './routes/NotFound'

export function App() {
  return (
    <RootLayout>{isHome ? <Home /> : <NotFound />}</RootLayout>
  )
}
