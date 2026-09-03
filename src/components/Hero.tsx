import { IconDownload } from '@tabler/icons-react'
import { motion, useReducedMotion } from 'motion/react'
import { useContent } from '../content'
import { WordReveal } from './ui/word-reveal'

export function Hero() {
  const { hero } = useContent()
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-center px-6 pt-24 pb-20 md:px-10">
      <motion.p
        {...rise(0.02)}
        className="font-mono text-xs uppercase tracking-[0.24em] text-muted"
      >
        {hero.eyebrow}
      </motion.p>

      <h1 className="mt-7 text-[clamp(4rem,10.5vw,8.5rem)] font-medium leading-[0.92] tracking-[-0.035em]">
        <span className="block">
          <WordReveal text="Sérgio" delay={0.06} />
        </span>
        <span className="block">
          <WordReveal text="Almeida" delay={0.14} />
        </span>
      </h1>

      <motion.p
        {...rise(0.26)}
        className="mt-10 max-w-xl text-balance text-lg leading-relaxed text-fg/80 sm:text-xl"
      >
        {hero.lede}
      </motion.p>

      <motion.div {...rise(0.34)} className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href="#internships"
          className="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-fg shadow-[0_14px_34px_-18px_rgba(76,164,232,0.55)] transition hover:bg-accent/90 active:translate-y-px"
        >
          {hero.primaryCta}
        </a>
        {/* O CV é o que permite a um recrutador avançar internamente: fica no
            primeiro ecrã, não escondido no rodapé. */}
        <a
          href="/Sergio-Almeida-CV.pdf"
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
    </section>
  )
}
