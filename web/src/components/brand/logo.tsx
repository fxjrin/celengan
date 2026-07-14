import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Brand mark: a classic side-view celengan (piggy bank) silhouette, snout
 * left, coin dropping toward the slot on its back, on a glossy Stellar-yellow
 * tile matching the FloatingDeco balloon style.
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
        <radialGradient id={coin} gradientUnits="userSpaceOnUse" cx="26.5" cy="11" r="7">
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
        <rect x="13" y="39" width="6" height="7" rx="2.2" />
        <rect x="28" y="39" width="6" height="7" rx="2.2" />
        <path d="M12 21C11.3 15.5 14.5 11.5 18 15C19.5 17.5 17.5 21.5 12 21Z" />
        <ellipse cx="24" cy="30" rx="15" ry="10.5" />
        {/* snout sits above body center so it reads as upturned */}
        <circle cx="8" cy="28.5" r="5.3" />
      </g>
      {/* userSpaceOnUse lets the knockouts sample the tile gradient in place so they read as cuts */}
      <circle cx="6.1" cy="26.9" r="0.85" fill={`url(#${tile})`} />
      <circle cx="6.1" cy="30.1" r="0.85" fill={`url(#${tile})`} />
      <rect
        x="19"
        y="19.8"
        width="11"
        height="3"
        rx="1.5"
        fill={`url(#${tile})`}
        transform="rotate(-8 24.5 21.3)"
      />
      {/* amber coin above the slot: the story is a coin dropping into the celengan */}
      <ellipse
        cx="26.5"
        cy="11"
        rx="3.6"
        ry="3.1"
        fill={`url(#${coin})`}
        transform="rotate(-15 26.5 11)"
      />
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
