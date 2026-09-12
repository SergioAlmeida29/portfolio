import { IconDownload } from '@tabler/icons-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useContent } from '../content'
import { cvUrl } from '../lib/base'
import { NowPanel } from './NowPanel'
import { WordReveal } from './ui/word-reveal'

const nativeParallax = CSS.supports('view-timeline-name', '--hero') &&
  CSS.supports('animation-range', 'exit-crossing 0% exit-crossing 100%')

export function Hero() {
  const { hero } = useContent()
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], ['0vw', '14vw'])
  const nameDrift = useTransform(scrollYProgress, [0, 1], ['0vw', '-12vw'])
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section ref={ref} data-native-scroll={nativeParallax || undefined} className="hero mx-auto grid min-h-[100dvh] max-w-6xl content-center gap-14 px-6 pt-28 pb-20 md:px-10 lg:grid-cols-12 lg:gap-10 xl:max-w-7xl">
      <div className="hero-copy lg:col-span-7 xl:col-span-7">
        <motion.div
          {...rise(0.02)}
          className="hero-meta"
        >
          <p className="hero-role font-mono text-xs uppercase tracking-[0.24em] text-muted">{hero.eyebrow}</p>
        </motion.div>

        <h1 className="mt-7 text-[clamp(4rem,10.5vw,8.5rem)] font-medium leading-[0.92] tracking-[-0.035em]">
          <motion.span className="hero-first block" style={!reduce && !nativeParallax ? { x: drift } : undefined}>
            <WordReveal text="Sérgio" delay={0.06} />
          </motion.span>
          <motion.span className="hero-last block" style={!reduce && !nativeParallax ? { x: nameDrift } : undefined}>
            <WordReveal text="Almeida" delay={0.14} />
          </motion.span>
        </h1>

        <motion.p
          {...rise(0.26)}
          className="hero-lede mt-10 max-w-xl text-balance text-lg leading-relaxed text-fg/80 sm:text-xl"
        >
          {hero.lede}
        </motion.p>

        <motion.div {...rise(0.34)} className="hero-actions mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg shadow-[0_14px_34px_-18px_rgba(76,164,232,0.55)] transition hover:bg-accent/90 active:translate-y-px"
          >
            {hero.primaryCta}
          </a>
          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="glass-soft inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-fg transition hover:border-white/20 hover:bg-white/[0.07] active:translate-y-px"
          >
            <IconDownload size={16} stroke={1.75} />
            {hero.cvCta}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-full px-4 py-3 text-sm font-medium text-muted transition-colors hover:text-fg"
          >
            {hero.contactCta}
          </a>
        </motion.div>
      </div>

      <div className="hero-now lg:col-span-5 lg:self-center xl:col-span-4 xl:col-start-9">
        <NowPanel />
      </div>
    </section>
  )
}
