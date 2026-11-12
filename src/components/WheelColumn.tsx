import { useCallback, useEffect, useRef } from 'react'

interface WheelColumnProps {
  values: number[]
  value: number
  onChange: (next: number) => void
  format?: (value: number) => string
  label: string
}

export function WheelColumn({ values, value, onChange, format, label }: WheelColumnProps) {
  const columnRef = useRef<HTMLDivElement | null>(null)
  const idleTimer = useRef<number | undefined>(undefined)
  
  // 🌟 记录初始值，防止多次触发
  const initialValueRef = useRef(value) 

  // 🌟 核心修复 1：只在组件初次挂载时居中一次，绝不干预用户后续滑动
  useEffect(() => {
    const node = columnRef.current
    if (!node) return

    const timer = setTimeout(() => {
      const targetIndex = values.indexOf(initialValueRef.current)
      if (targetIndex !== -1) {
        const firstItem = node.children[1] as HTMLElement
        const itemHeight = firstItem ? firstItem.offsetHeight : 39
        node.scrollTop = targetIndex * itemHeight
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [values])

  useEffect(
    () => () => {
      if (idleTimer.current !== undefined) window.clearTimeout(idleTimer.current)
    },
    [],
  )

  // 🌟 核心修复 2：滚动监听，找物理中心最近的元素，触发外部 onChange
  const handleScroll = useCallback(() => {
    const node = columnRef.current
    if (!node) return
    if (idleTimer.current !== undefined) window.clearTimeout(idleTimer.current)
    
    idleTimer.current = window.setTimeout(() => {
      const containerCenter = node.getBoundingClientRect().top + node.offsetHeight / 2
      let closestIndex = 0
      let minDistance = Infinity
      
      for (let i = 0; i < values.length; i++) {
        const item = node.children[i + 1] as HTMLElement
        if (!item) continue
        
        const itemRect = item.getBoundingClientRect()
        const itemCenter = itemRect.top + itemRect.height / 2
        const distance = Math.abs(containerCenter - itemCenter)
        
        if (distance < minDistance) {
          minDistance = distance
          closestIndex = i
        }
      }
      
      const nextValue = values[closestIndex]
      if (nextValue !== undefined && nextValue !== value) {
        onChange(nextValue)
      }
    }, 120) 
  }, [onChange, value, values])

  const handleItemClick = (item: number) => {
    onChange(item)
  }

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
          onClick={() => handleItemClick(item)}
          className={item === value ? 'picker__item is-active' : 'picker__item'}
        >
          {formatValue(item)}
        </div>
      ))}
      <div className="picker__spacer" aria-hidden="true" />
    </div>
  )
}