import { motion, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useId, useRef, useState } from 'react'
import { useContent } from '../content'
import { isPreview } from '../lib/preview'
import { LangToggle } from './LangToggle'
import { GlassPanel } from './ui/glass-panel'

export function Nav() {
  return isPreview ? <PreviewNav /> : <DefaultNav />
}

function DefaultNav() {
  const { nav } = useContent()
  const { scrollYProgress } = useScroll()

  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10 xl:max-w-7xl">
        <a href="#top" className="text-sm font-medium tracking-tight">
          Sérgio Almeida
        </a>

        <nav className="flex items-center gap-5 text-sm sm:gap-7">
          {nav.links.slice(0, 3).map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden text-muted transition-colors hover:text-fg md:inline"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/Sergio-Almeida-CV.pdf"
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

function PreviewNav() {
  const { nav, ui } = useContent()
  const header = useRef<HTMLElement>(null)
  const strip = useRef<HTMLElement>(null)
  const [activeHref, setActiveHref] = useState<string | null>(null)
  const underlineId = useId()
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const sections = nav.links.flatMap((link) => {
      const node = document.getElementById(link.href.slice(1))
      return node ? [{ href: link.href, node }] : []
    })
    let frame = 0
    let geometryDirty = true
    let threshold = 0
    let documentHeight = 0
    let positions: { href: string; top: number }[] = []

    function update() {
      frame = 0
      const scroll = window.scrollY
      if (geometryDirty) {
        threshold = Math.min((header.current?.getBoundingClientRect().bottom ?? 0) + 60, window.innerHeight * 0.4)
        positions = sections.map(({ href, node }) => ({ href, top: node.getBoundingClientRect().top + scroll }))
        documentHeight = document.documentElement.scrollHeight
        geometryDirty = false
      }
      let next: string | null = null
      for (const section of positions) {
        if (section.top <= scroll + threshold) next = section.href
      }
      // Contact can be too short to reach the activation threshold.
      if (scroll > 0 && scroll + window.innerHeight >= documentHeight - 2) {
        const contact = sections.find((section) => section.href === '#contact')
        if (contact) next = contact.href
      }
      setActiveHref(next)
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    function invalidateGeometry() {
      geometryDirty = true
      scheduleUpdate()
    }

    const observer = new ResizeObserver(invalidateGeometry)
    const main = document.querySelector('main')
    if (main) observer.observe(main)
    if (header.current) observer.observe(header.current)
    sections.forEach(({ node }) => observer.observe(node))
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', invalidateGeometry)
    scheduleUpdate()
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', invalidateGeometry)
    }
  }, [nav.links])

  useEffect(() => {
    const container = strip.current
    if (!container || !activeHref ||
        (container.contains(document.activeElement) && document.activeElement?.matches(':focus-visible'))) return
    const link = Array.from(container.querySelectorAll<HTMLAnchorElement>('a')).find((item) => item.hash === activeHref)
    if (!link) return
    const bounds = container.getBoundingClientRect()
    const item = link.getBoundingClientRect()
    const left = bounds.left + container.clientLeft
    const right = left + container.clientWidth
    const delta = item.left < left ? item.left - left : item.right > right ? item.right - right : 0
    if (Math.abs(delta) > 1) {
      // Scroll only the strip, never an ancestor or the page.
      container.scrollTo({ left: container.scrollLeft + delta, behavior: reducedMotion ? 'instant' : 'smooth' })
    }
  }, [activeHref, nav.links, reducedMotion])

  return (
    <header ref={header} className="glass-nav fixed inset-x-0 top-0 z-40">
      <GlassPanel className="nav-shell" surface="navigation">
        <div className="nav-inner">
          <a href="#top" className="nav-brand">
            Sérgio Almeida
          </a>
          <motion.nav ref={strip} className="nav-sections" aria-label={ui.menu} layoutScroll data-lenis-prevent>
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-section-link"
                aria-current={activeHref === link.href ? 'location' : undefined}
              >
                {link.label}
                {activeHref === link.href && (
                  <motion.span
                    className="nav-active-line"
                    layoutId={underlineId}
                    aria-hidden="true"
                    transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
              </a>
            ))}
          </motion.nav>
          <div className="nav-tools">
            <a
              href="/Sergio-Almeida-CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="nav-cv"
            >
              {nav.cv}
            </a>
            <LangToggle />
          </div>
        </div>
      </GlassPanel>
    </header>
  )
}
