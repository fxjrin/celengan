import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react"

import { cn } from "@/lib/utils"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  startValue?: number
  direction?: "up" | "down"
  delay?: number
  decimalPlaces?: number
  locale?: string
}

type Cell = {
  // position counted from the right, so a growing/shrinking digit count never reshuffles existing columns
  id: number
  char: string
}

const ROLL_MS = 450
const STAGGER_MS = 30
const MAX_STAGGER_STEPS = 9 // caps settle time under ~0.8s even for many-digit values
const FADE_MS = 150
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])
  return reduced
}

function formatValue(value: number, locale: string, decimalPlaces: number): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value)
}

function toCells(formatted: string): Cell[] {
  const chars = Array.from(formatted)
  const lastIndex = chars.length - 1
  return chars.map((char, i) => ({ id: lastIndex - i, char }))
}

function staggerDelay(id: number): number {
  return Math.min(id, MAX_STAGGER_STEPS) * STAGGER_MS
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  locale = "en-US",
  ...props
}: NumberTickerProps) {
  const reducedMotion = usePrefersReducedMotion()
  // "down" counts from value to startValue, matching the previous spring-based contract
  const target = direction === "down" ? startValue : value
  const initial = direction === "down" ? value : startValue

  const containerRef = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)
  const [cells, setCells] = useState<Cell[]>(() =>
    toCells(formatValue(reducedMotion ? target : initial, locale, decimalPlaces))
  )
  const [exiting, setExiting] = useState<Cell[]>([])
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    const formatted = formatValue(target, locale, decimalPlaces)

    if (reducedMotion) {
      setCells(toCells(formatted))
      return
    }

    const timer = setTimeout(() => {
      const next = toCells(formatted)
      setCells((prev) => {
        const nextIds = new Set(next.map((c) => c.id))
        const dropped = prev.filter((c) => !nextIds.has(c.id))
        if (dropped.length > 0) {
          // keep dropped columns mounted just long enough to fade out instead of jumping
          setExiting((prevExiting) => [...dropped, ...prevExiting])
          if (exitTimer.current) clearTimeout(exitTimer.current)
          exitTimer.current = setTimeout(() => setExiting([]), FADE_MS + 80)
        }
        return next
      })
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [inView, reducedMotion, target, locale, decimalPlaces, delay])

  useEffect(() => {
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current)
    }
  }, [])

  const text = cells.map((c) => c.char).join("")

  return (
    <span
      ref={containerRef}
      // no default text color: dark:* variants outrank a plain className color
      // utility in specificity, so a hardcoded color here would be unoverridable
      className={cn("inline-block tracking-wider tabular-nums", className)}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex items-baseline">
        {exiting.map((cell) => (
          <ExitingCell key={`x${cell.id}`} cell={cell} />
        ))}
        {cells.map((cell) => (
          <TickerCell key={cell.id} cell={cell} reducedMotion={reducedMotion} />
        ))}
      </span>
    </span>
  )
}

function TickerCell({ cell, reducedMotion }: { cell: Cell; reducedMotion: boolean }) {
  const [visible, setVisible] = useState(reducedMotion)

  useEffect(() => {
    if (reducedMotion) return
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion])

  const digit = cell.char >= "0" && cell.char <= "9" ? Number(cell.char) : null

  return (
    <span
      className="inline-block"
      style={{
        opacity: visible ? 1 : 0,
        transition: reducedMotion ? undefined : `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      {digit === null ? (
        cell.char
      ) : (
        <DigitColumn digit={digit} delayMs={staggerDelay(cell.id)} reducedMotion={reducedMotion} />
      )}
    </span>
  )
}

function ExitingCell({ cell }: { cell: Cell }) {
  const [shown, setShown] = useState(true)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(false))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <span
      className="inline-block"
      style={{ opacity: shown ? 1 : 0, transition: `opacity ${FADE_MS}ms ease-out` }}
    >
      {cell.char}
    </span>
  )
}

function DigitColumn({
  digit,
  delayMs,
  reducedMotion,
}: {
  digit: number
  delayMs: number
  reducedMotion: boolean
}) {
  const stripRef = useRef<HTMLSpanElement>(null)
  const prevDigit = useRef(digit)

  useLayoutEffect(() => {
    const el = stripRef.current
    const changed = prevDigit.current !== digit
    prevDigit.current = digit
    if (!el || reducedMotion || !changed) return
    // snap blur to its peak before the transform transition starts, then ease it back to 0
    // so the roll reads as motion rather than a hard cut to the next digit
    el.style.transitionProperty = "none"
    el.style.filter = "blur(3px)"
    void el.offsetHeight // force a reflow so the browser commits the snap before the eased transition
    el.style.transitionProperty = "transform, filter"
    el.style.filter = "blur(0px)"
  }, [digit, reducedMotion])

  return (
    <span className="relative inline-block h-[1em] w-[1ch] overflow-hidden">
      <span
        ref={stripRef}
        className="absolute inset-x-0 top-0 flex flex-col"
        style={{
          transform: `translateY(${-digit}em)`,
          transitionProperty: "transform, filter",
          transitionDuration: reducedMotion ? "0ms" : `${ROLL_MS}ms`,
          transitionDelay: reducedMotion ? "0ms" : `${delayMs}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="h-[1em] text-center leading-[1em]">
            {d}
          </span>
        ))}
      </span>
    </span>
  )
}
