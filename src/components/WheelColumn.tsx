import { useCallback, useEffect, useRef } from 'react'

const ITEM_HEIGHT = 39

interface WheelColumnProps {
  values: number[]
  value: number
  onChange: (next: number) => void
  format?: (value: number) => string
  label: string
}

/** 滚轮选择列（年 / 月 / 日），滚动吸附到中间高亮行 */
export function WheelColumn({ values, value, onChange, format, label }: WheelColumnProps) {
  const columnRef = useRef<HTMLDivElement | null>(null)
  const idleTimer = useRef<number | undefined>(undefined)
  const index = Math.max(0, values.indexOf(value))

  useEffect(() => {
    const node = columnRef.current
    if (!node) return
    const target = index * ITEM_HEIGHT
    if (Math.abs(node.scrollTop - target) > 2) node.scrollTop = target
  }, [index])

  useEffect(
    () => () => {
      if (idleTimer.current !== undefined) window.clearTimeout(idleTimer.current)
    },
    [],
  )

  const handleScroll = useCallback(() => {
    const node = columnRef.current
    if (!node) return
    if (idleTimer.current !== undefined) window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => {
      const nextIndex = Math.min(
        values.length - 1,
        Math.max(0, Math.round(node.scrollTop / ITEM_HEIGHT)),
      )
      const nextValue = values[nextIndex]
      if (nextValue !== undefined && nextValue !== value) onChange(nextValue)
    }, 110)
  }, [onChange, value, values])

  const formatValue = format ?? ((item: number) => String(item))

  return (
    <div
      className="picker__col"
      ref={columnRef}
      onScroll={handleScroll}
      role="listbox"
      aria-label={label}
    >
      <div className="picker__spacer" aria-hidden="true" />
      {values.map((item) => (
        <div
          key={item}
          role="option"
          aria-selected={item === value}
          className={item === value ? 'picker__item is-active' : 'picker__item'}
          onClick={() => onChange(item)}
        >
          {formatValue(item)}
        </div>
      ))}
      <div className="picker__spacer" aria-hidden="true" />
    </div>
  )
}
