import { motion, useScroll } from 'motion/react'
import { useContent } from '../content'
import { cvUrl } from '../lib/base'
import { LangToggle } from './LangToggle'

export function Nav() {
  const { nav } = useContent()
  const { scrollYProgress } = useScroll()

  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between xl:max-w-7xl px-6 md:px-10">
        <a href="#top" className="text-sm font-medium tracking-tight">
          Sérgio Almeida
        </a>

        <nav className="flex items-center gap-5 text-sm sm:gap-7">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden text-muted transition-colors hover:text-fg md:inline"
            >
              {link.label}
            </a>
          ))}
          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden text-muted transition-colors hover:text-fg sm:inline"
          >
            {nav.cv}
          </a>
          <LangToggle />
          <a
            href="#contact"
            className="glass-soft rounded-full px-4 py-1.5 text-fg transition-colors hover:border-white/20 hover:bg-white/[0.07]"
          >
            {nav.contact}
          </a>
        </nav>
      </div>

      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent/70"
      />
    </header>
  )
}
