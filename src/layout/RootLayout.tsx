import type { ReactNode } from 'react'
import { Nav } from '../components/Nav'
import { SiteFooter } from '../components/SiteFooter'
import { Water } from '../components/ui/water'
import { useContent } from '../content'

const isStaging = import.meta.env.VITE_APP_ENV === 'staging'

export function RootLayout({ children }: { children: ReactNode }) {
  const { ui } = useContent()

  return (
    <div className="min-h-[100dvh]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-sm focus:text-accent-fg"
      >
        {ui.skipToContent}
      </a>

      {isStaging && (
        <div className="fixed bottom-3 left-3 z-50 rounded bg-accent px-2 py-1 font-mono text-[11px] font-medium text-accent-fg">
          STAGING
        </div>
      )}

      <Water />
      <Nav />
      <main id="main">
        <span id="top" className="absolute" />
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
