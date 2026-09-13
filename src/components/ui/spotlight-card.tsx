import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { GlassPanel } from './glass-panel'

export function SpotlightCard({ children, className, emptyBackdrop, defer }: { children: ReactNode; className?: string; emptyBackdrop?: boolean; defer?: boolean }) {
  return <GlassPanel emptyBackdrop={emptyBackdrop} defer={defer} className={cn('glass rounded-xl', className)}>{children}</GlassPanel>
}
