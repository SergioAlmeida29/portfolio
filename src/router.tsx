import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './layout/RootLayout'
import { Home } from './routes/Home'
import { NotFound } from './routes/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
