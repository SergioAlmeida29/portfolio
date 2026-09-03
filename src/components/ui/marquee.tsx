import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/**
 * Faixa continua. Serve para largura: mostra a extensao da stack sem
 * transformar a seccao numa lista de 22 linhas. Pausa em hover e para
 * por completo com prefers-reduced-motion.
 */
export function Marquee({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'group relative flex overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]',
        className,
      )}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className="flex shrink-0 animate-marquee items-center gap-12 pr-12 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        >
          {children}
        </div>
      ))}
    </div>
  )
}
