import { cn } from '../../lib/cn'

export function Tags({
  items,
  className,
}: {
  items: readonly string[]
  className?: string
}) {
  return (
    <ul className={cn('flex flex-wrap items-start content-start gap-2', className)}>
      {items.map((item) => (
        <li
          key={item}
          className="glass-soft rounded-full px-2.5 py-1 font-mono text-[11px] text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
