import { useLang, type Lang } from '../content'
import { cn } from '../lib/cn'

const options: { value: Lang; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'pt', label: 'PT' },
]

/**
 * Dois estados, sem menu: o custo de trocar tem de ser um clique. O grupo é
 * um radiogroup para o leitor de ecrã anunciar a escolha atual.
 */
export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang()

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
              'rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors',
              active ? 'bg-white/[0.09] text-fg' : 'text-muted hover:text-fg',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
