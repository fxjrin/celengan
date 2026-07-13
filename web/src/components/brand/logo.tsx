import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Brand mark: an amber coin dropping into an abstract celengan (piggy bank)
 * on a glossy Stellar-yellow tile matching the FloatingDeco balloon style.
 */
export function LogoMark({ size = 24 }: { size?: number }) {
  // strip useId wrapper chars; they break url(#...) gradient references
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const tile = `cel-logo-tile-${uid}`
  const depth = `cel-logo-depth-${uid}`
  const coin = `cel-logo-coin-${uid}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className="shrink-0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={tile} gradientUnits="userSpaceOnUse" cx="13" cy="10" r="56">
          <stop offset="0%" stopColor="#ffe98a" />
          <stop offset="48%" stopColor="#fdda24" />
          <stop offset="100%" stopColor="#d9a900" />
        </radialGradient>
        <linearGradient id={depth} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
        </linearGradient>
        {/* deep amber ramp so the coin separates from the yellow tile */}
        <radialGradient id={coin} gradientUnits="userSpaceOnUse" cx="22.8" cy="11.2" r="7">
          <stop offset="0%" stopColor="#e7b93c" />
          <stop offset="55%" stopColor="#c78f1e" />
          <stop offset="100%" stopColor="#9a6a10" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#${tile})`} />
      <rect width="48" height="48" rx="14" fill={`url(#${depth})`} />
      <ellipse
        cx="14"
        cy="10"
        rx="8.5"
        ry="4"
        fill="#fff"
        opacity="0.5"
        transform="rotate(-28 14 10)"
      />
      <g fill="#26201a">
        <path d="M11 34a13 13 0 0 1 26 0Z" />
        <ellipse cx="37.3" cy="29.5" rx="2.8" ry="2.4" />
      </g>
      {/* amber coin above the slot: the story is a coin dropping into the celengan */}
      <circle cx="24" cy="12.5" r="3.5" fill={`url(#${coin})`} />
      {/* userSpaceOnUse lets the slot sample the tile gradient in place so it reads as a cut */}
      <rect x="18.5" y="23.5" width="11" height="3" rx="1.5" fill={`url(#${tile})`} />
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
