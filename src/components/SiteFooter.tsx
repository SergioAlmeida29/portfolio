import { useContent } from '../content'

export function SiteFooter() {
  const { ui } = useContent()

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-xs text-muted md:px-10">
        <span>© {new Date().getFullYear()} Sérgio Almeida</span>
        <a href="#top" className="transition-colors hover:text-fg">
          {ui.backToTop}
        </a>
      </div>
    </footer>
  )
}
