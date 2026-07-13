import { cn } from '@/lib/utils'

/**
 * Brand mark: a coin dropping into an abstract celengan (piggy bank),
 * reduced to a dome body, coin slot, and snout bump on a terracotta tile.
 */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className="shrink-0 text-primary"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="48" height="48" rx="12" fill="currentColor" />
      <g fill="var(--primary-foreground)">
        <circle cx="24" cy="12.5" r="3.5" />
        <path d="M11 34a13 13 0 0 1 26 0Z" />
        <ellipse cx="37.3" cy="29.5" rx="2.8" ry="2.4" />
      </g>
      {/* slot drawn in tile color so it reads as a cut into the dome */}
      <rect x="18.5" y="23.5" width="11" height="3" rx="1.5" fill="currentColor" />
    </svg>
  )
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark size={22} />
      <span className="text-lg font-semibold tracking-tight">celengan</span>
    </span>
  )
}
