import { motion, useReducedMotion } from 'motion/react'
import { useId } from 'react'
import { useLang, type Lang } from '../content'
import { cn } from '../lib/cn'

const options: { value: Lang; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'pt', label: 'PT' },
]

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang()
  const reduce = useReducedMotion()
  const pillId = useId()

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={cn('glass-soft flex items-center rounded-full p-0.5', className)}
    >
      {options.map((option) => {
        const active = option.value === lang

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLang(option.value)}
            className={cn(
              'relative rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors',
              active ? 'text-fg' : 'text-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                aria-hidden
                layoutId={pillId}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }
                }
                className="absolute inset-0 rounded-full bg-white/[0.11] shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_2px_8px_-4px_rgb(0_0_0/0.6)]"
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
