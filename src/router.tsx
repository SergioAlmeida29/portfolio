import { RootLayout } from './layout/RootLayout'
import { Home } from './routes/Home'
import { NotFound } from './routes/NotFound'

/* Duas páginas e o nginx a servir o index.html para qualquer caminho: chega
   ler o pathname à montagem. Ver docs/decisoes-frontend.md para o react-router
   que estava aqui e como o trazer de volta. */
const isHome = ['/', '/index.html'].includes(window.location.pathname)

export function App() {
  return <RootLayout>{isHome ? <Home /> : <NotFound />}</RootLayout>
}
