import { useEffect, useRef } from 'react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

type DecoProps = { uid: string }

const SHADOW = { x: '-40%', y: '-40%', width: '180%', height: '180%' }

function RpCoin({ uid }: DecoProps) {
  const rim = `${uid}-rim`
  const face = `${uid}-face`
  const sh = `${uid}-sh`
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={rim} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ffe9b8" />
          <stop offset="55%" stopColor="#d9a441" />
          <stop offset="100%" stopColor="#a9761f" />
        </radialGradient>
        <linearGradient id={face} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#f3d27e" />
          <stop offset="100%" stopColor="#cf9832" />
        </linearGradient>
        <filter id={sh} {...SHADOW}>
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#7a5410" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter={`url(#${sh})`}>
        <circle cx="32" cy="32" r="27" fill={`url(#${rim})`} />
        <circle cx="32" cy="32" r="21" fill={`url(#${face})`} />
        <circle cx="32" cy="32" r="21" fill="none" stroke="#b07f22" strokeWidth="1.2" opacity="0.5" />
        <text
          x="32"
          y="40"
          textAnchor="middle"
          fontFamily="'Geist Variable', system-ui, sans-serif"
          fontSize="20"
          fontWeight="700"
          fill="#8f6414"
        >
          Rp
        </text>
        <ellipse cx="22" cy="16" rx="9" ry="4.2" fill="#fff" opacity="0.55" transform="rotate(-28 22 16)" />
      </g>
    </svg>
  )
}

function DollarCoin({ uid }: DecoProps) {
  const rim = `${uid}-rim`
  const face = `${uid}-face`
  const sh = `${uid}-sh`
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={rim} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#ecf6d8" />
          <stop offset="55%" stopColor="#a8c377" />
          <stop offset="100%" stopColor="#5e7f3d" />
        </radialGradient>
        <linearGradient id={face} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#d9e9b4" />
          <stop offset="100%" stopColor="#8fb05c" />
        </linearGradient>
        <filter id={sh} {...SHADOW}>
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#425f2b" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter={`url(#${sh})`}>
        <circle cx="32" cy="32" r="27" fill={`url(#${rim})`} />
        <circle cx="32" cy="32" r="21" fill={`url(#${face})`} />
        <circle cx="32" cy="32" r="21" fill="none" stroke="#6d8c44" strokeWidth="1.2" opacity="0.5" />
        <text
          x="32"
          y="40"
          textAnchor="middle"
          fontFamily="'Geist Variable', system-ui, sans-serif"
          fontSize="22"
          fontWeight="700"
          fill="#4c672c"
        >
          $
        </text>
        <ellipse cx="22" cy="16" rx="9" ry="4.2" fill="#fff" opacity="0.55" transform="rotate(-28 22 16)" />
      </g>
    </svg>
  )
}

function XlmCoin({ uid }: DecoProps) {
  const rim = `${uid}-rim`
  const face = `${uid}-face`
  const sh = `${uid}-sh`
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={rim} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#7a8089" />
          <stop offset="55%" stopColor="#4a4f55" />
          <stop offset="100%" stopColor="#23262a" />
        </radialGradient>
        <linearGradient id={face} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#565c63" />
          <stop offset="100%" stopColor="#2b2f34" />
        </linearGradient>
        <filter id={sh} {...SHADOW}>
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0c0e10" floodOpacity="0.35" />
        </filter>
      </defs>
      <g filter={`url(#${sh})`}>
        <circle cx="32" cy="32" r="27" fill={`url(#${rim})`} />
        <circle cx="32" cy="32" r="21" fill={`url(#${face})`} />
        <circle cx="32" cy="32" r="21" fill="none" stroke="#171a1d" strokeWidth="1.2" opacity="0.5" />
        {/* stylized lumen: two sweeping arcs plus a dot, not the official flat mark */}
        <g fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" opacity="0.92">
          <path d="M16 31 A 27 27 0 0 1 44 23" />
          <path d="M48 33 A 27 27 0 0 1 20 41" />
        </g>
        <circle cx="48" cy="24" r="2.2" fill="#ffffff" opacity="0.92" />
        <ellipse cx="22" cy="16" rx="9" ry="4.2" fill="#fff" opacity="0.45" transform="rotate(-28 22 16)" />
      </g>
    </svg>
  )
}

function UsdcCoin({ uid }: DecoProps) {
  const rim = `${uid}-rim`
  const face = `${uid}-face`
  const sh = `${uid}-sh`
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={rim} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#5aa9e6" />
          <stop offset="55%" stopColor="#2775ca" />
          <stop offset="100%" stopColor="#17559c" />
        </radialGradient>
        <linearGradient id={face} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#4d9ede" />
          <stop offset="100%" stopColor="#1f65b3" />
        </linearGradient>
        <filter id={sh} {...SHADOW}>
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#123f74" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter={`url(#${sh})`}>
        <circle cx="32" cy="32" r="27" fill={`url(#${rim})`} />
        <circle cx="32" cy="32" r="21" fill={`url(#${face})`} />
        <circle cx="32" cy="32" r="21" fill="none" stroke="#144a87" strokeWidth="1.2" opacity="0.5" />
        <circle cx="32" cy="32" r="13.5" fill="none" stroke="#ffffff" strokeWidth="2.4" opacity="0.9" />
        <text
          x="32"
          y="38"
          textAnchor="middle"
          fontFamily="'Geist Variable', system-ui, sans-serif"
          fontSize="16"
          fontWeight="700"
          fill="#ffffff"
        >
          $
        </text>
        <ellipse cx="22" cy="16" rx="9" ry="4.2" fill="#fff" opacity="0.55" transform="rotate(-28 22 16)" />
      </g>
    </svg>
  )
}

function CoinStack({ uid }: DecoProps) {
  const side = `${uid}-side`
  const top = `${uid}-top`
  const sh = `${uid}-sh`
  const coin = (cx: number, topY: number) => (
    <g key={topY}>
      <ellipse cx={cx} cy={topY + 5} rx="20" ry="7.5" fill={`url(#${side})`} />
      <rect x={cx - 20} y={topY} width="40" height="5" fill={`url(#${side})`} />
      <ellipse cx={cx} cy={topY} rx="20" ry="7.5" fill={`url(#${top})`} />
      <ellipse cx={cx} cy={topY} rx="14" ry="4.8" fill="none" stroke="#c9992e" strokeWidth="1" opacity="0.6" />
    </g>
  )
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <linearGradient id={side} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b9861f" />
          <stop offset="100%" stopColor="#8f6414" />
        </linearGradient>
        <linearGradient id={top} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#f7dc94" />
          <stop offset="100%" stopColor="#d9a441" />
        </linearGradient>
        <filter id={sh} {...SHADOW}>
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#7a5410" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter={`url(#${sh})`}>
        {coin(32, 42)}
        {coin(30, 33)}
        {coin(33, 24)}
        <ellipse cx="27" cy="21.5" rx="8" ry="2.8" fill="#fff" opacity="0.6" transform="rotate(-8 27 21.5)" />
      </g>
    </svg>
  )
}

function PiggyBlob({ uid }: DecoProps) {
  const body = `${uid}-body`
  const sh = `${uid}-sh`
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={body} cx="32%" cy="26%" r="85%">
          <stop offset="0%" stopColor="#3fbf94" />
          <stop offset="55%" stopColor="#0f8560" />
          <stop offset="100%" stopColor="#06402f" />
        </radialGradient>
        <filter id={sh} {...SHADOW}>
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#053024" floodOpacity="0.32" />
        </filter>
      </defs>
      <g filter={`url(#${sh})`}>
        <rect x="6" y="6" width="52" height="52" rx="17" fill={`url(#${body})`} />
        <g fill="#f6fdf9" opacity="0.95">
          <circle cx="32" cy="20.5" r="3.2" />
          <path d="M20 42a12 12 0 0 1 24 0Z" />
          <ellipse cx="44.3" cy="37.8" rx="2.6" ry="2.2" />
        </g>
        <rect x="27" y="32.5" width="10.5" height="2.8" rx="1.4" fill="#0a5a42" />
        <ellipse cx="18" cy="14" rx="9" ry="4.2" fill="#fff" opacity="0.45" transform="rotate(-30 18 14)" />
      </g>
    </svg>
  )
}

function Sparkle({ uid }: DecoProps) {
  const body = `${uid}-body`
  const sh = `${uid}-sh`
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={body} cx="40%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#e6f6fb" />
          <stop offset="55%" stopColor="#7fcbe3" />
          <stop offset="100%" stopColor="#38a3c8" />
        </radialGradient>
        <filter id={sh} {...SHADOW}>
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1c688a" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter={`url(#${sh})`}>
        <path
          d="M32 5C34.5 23 41 29.5 59 32 41 34.5 34.5 41 32 59 29.5 41 23 34.5 5 32 23 29.5 29.5 23 32 5Z"
          fill={`url(#${body})`}
        />
        <ellipse cx="27" cy="22" rx="4.5" ry="2.4" fill="#fff" opacity="0.7" transform="rotate(-35 27 22)" />
      </g>
    </svg>
  )
}

function SoftArrow({ uid }: DecoProps) {
  const body = `${uid}-body`
  const sh = `${uid}-sh`
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <linearGradient id={body} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8dcc8" />
          <stop offset="55%" stopColor="#45ab8a" />
          <stop offset="100%" stopColor="#17805e" />
        </linearGradient>
        <filter id={sh} {...SHADOW}>
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0d4d38" floodOpacity="0.32" />
        </filter>
      </defs>
      <g
        filter={`url(#${sh})`}
        fill="none"
        stroke={`url(#${body})`}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 47 44 20" />
        <path d="M29 20h15v15" />
      </g>
      <ellipse cx="25" cy="37" rx="7" ry="2.2" fill="#fff" opacity="0.5" transform="rotate(-45 25 37)" />
    </svg>
  )
}

function HeartBlob({ uid }: DecoProps) {
  const body = `${uid}-body`
  const sh = `${uid}-sh`
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={body} cx="35%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#ffdbe3" />
          <stop offset="55%" stopColor="#ee8aa3" />
          <stop offset="100%" stopColor="#c2557a" />
        </radialGradient>
        <filter id={sh} {...SHADOW}>
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#8c3355" floodOpacity="0.3" />
        </filter>
      </defs>
      <g filter={`url(#${sh})`}>
        <path
          d="M32 55C13 42 7 28 15 19 21 12.5 30 14.5 32 21 34 14.5 43 12.5 49 19 57 28 51 42 32 55Z"
          fill={`url(#${body})`}
        />
        <ellipse cx="22" cy="24" rx="6" ry="3" fill="#fff" opacity="0.55" transform="rotate(-30 22 24)" />
      </g>
    </svg>
  )
}

type Placement = {
  obj: ComponentType<DecoProps>
  side: 'left' | 'right'
  top: string
  left?: string
  right?: string
  size: number
  rotate: number
  depth: number
  duration: number
  delay: number
}

const PLACEMENTS: Placement[] = [
  { obj: RpCoin, side: 'left', top: '12%', left: '6%', size: 96, rotate: -12, depth: 22, duration: 7, delay: 0 },
  { obj: Sparkle, side: 'left', top: '34%', left: '14%', size: 44, rotate: 8, depth: 28, duration: 5.5, delay: 0.8 },
  { obj: PiggyBlob, side: 'left', top: '52%', left: '4%', size: 110, rotate: 6, depth: 12, duration: 8, delay: 0.4 },
  { obj: CoinStack, side: 'left', top: '76%', left: '12%', size: 76, rotate: -8, depth: 18, duration: 6.5, delay: 1.2 },
  { obj: UsdcCoin, side: 'left', top: '90%', left: '5%', size: 46, rotate: 10, depth: 24, duration: 6.2, delay: 0.7 },
  { obj: HeartBlob, side: 'right', top: '10%', right: '10%', size: 72, rotate: 10, depth: 20, duration: 7.5, delay: 0.6 },
  { obj: XlmCoin, side: 'right', top: '24%', right: '18%', size: 50, rotate: -8, depth: 16, duration: 7.2, delay: 0.9 },
  { obj: SoftArrow, side: 'right', top: '36%', right: '4%', size: 88, rotate: 4, depth: 10, duration: 8.5, delay: 0.2 },
  { obj: DollarCoin, side: 'right', top: '60%', right: '14%', size: 52, rotate: 14, depth: 26, duration: 5, delay: 1 },
  { obj: Sparkle, side: 'right', top: '80%', right: '7%', size: 40, rotate: -10, depth: 24, duration: 6, delay: 0.3 },
]

const LERP = 0.08

export function FloatingDeco({
  side,
  className,
}: {
  side: 'both' | 'left' | 'right'
  className?: string
}) {
  const items = side === 'both' ? PLACEMENTS : PLACEMENTS.filter((p) => p.side === side)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const depths = (side === 'both' ? PLACEMENTS : PLACEMENTS.filter((p) => p.side === side)).map(
      (p) => p.depth,
    )
    let raf = 0
    let running = false
    let targetX = 0
    let targetY = 0
    let curX = 0
    let curY = 0
    const tick = () => {
      curX += (targetX - curX) * LERP
      curY += (targetY - curY) * LERP
      for (let i = 0; i < depths.length; i++) {
        const el = itemRefs.current[i]
        if (!el) continue
        el.style.transform = `translate3d(${(curX * depths[i]).toFixed(2)}px, ${(curY * depths[i]).toFixed(2)}px, 0)`
      }
      if (Math.abs(targetX - curX) + Math.abs(targetY - curY) > 0.002) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }
    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1
      targetY = (e.clientY / window.innerHeight) * 2 - 1
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [side])

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 hidden select-none overflow-hidden md:block',
        className,
      )}
    >
      <style>{`
        @keyframes cel-deco-drift {
          from { transform: translateY(-7px); }
          to { transform: translateY(7px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cel-deco-drift { animation: none !important; }
        }
      `}</style>
      {items.map((item, i) => {
        const Obj = item.obj
        return (
          <div
            key={`${item.side}-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className="absolute will-change-transform"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              width: item.size,
              height: item.size,
            }}
          >
            <div
              className="cel-deco-drift h-full w-full"
              style={{
                animation: `cel-deco-drift ${item.duration}s ease-in-out ${item.delay}s infinite alternate`,
              }}
            >
              <div className="h-full w-full" style={{ transform: `rotate(${item.rotate}deg)` }}>
                <Obj uid={`cel-${item.side}-${i}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
