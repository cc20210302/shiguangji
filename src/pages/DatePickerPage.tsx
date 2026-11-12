import { useMemo, useState } from 'react'
import { AddEventForm } from '../components/AddEventForm'
import { PageShell } from '../components/PageShell'
import { WheelColumn } from '../components/WheelColumn'
import { daysInMonth, parseISODate, toISODate } from '../lib/date'
import { useGoBack } from '../lib/navigation'
import { useEvents } from '../store/EventsProvider'

const YEARS = Array.from({ length: 201 }, (_, index) => 1900 + index)
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1)

const pad2 = (value: number) => String(value).padStart(2, '0')

/** 选择日期（设计稿 36:406）：覆盖在添加事件页之上的底部弹层 */
export default function DatePickerPage() {
  const goBack = useGoBack()
  const { draft, patchDraft } = useEvents()

  const initial = parseISODate(draft.date)
  const [year, setYear] = useState(initial.getFullYear())
  const [month, setMonth] = useState(initial.getMonth() + 1)
  const [day, setDay] = useState(initial.getDate())

  const maxDay = daysInMonth(year, month-1)
  const safeDay = Math.min(day, maxDay)
  const days = useMemo(
    () => Array.from({ length: maxDay }, (_, index) => index + 1),
    [maxDay],
  )

  // 🌟 1. 添加下拉拖拽的状态
  const [startY, setStartY] = useState(0)
  const [deltaY, setDeltaY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientY - startY
    if (diff > 0) {
      setDeltaY(diff)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    // 如果下拉超过 80px，关闭弹窗
    if (deltaY > 80) {
      goBack()
    }
    // 松手后重置位置
    setDeltaY(0)
  }

  const handleConfirm = () => {
    patchDraft({ date: toISODate(new Date(year, month - 1, safeDay)) })
    goBack()
  }

  return (
    <PageShell
      overlay={
        <div className="overlay">
          <button
            type="button"
            className="overlay__scrim"
            aria-label="关闭选择日期"
            onClick={goBack}
          />
          
          {/* 🌟 2. 把 sheet-handle 移到 sheet 内部，并绑定动态 transform */}
          <div 
            className="sheet"
            style={{
              transform: `translateY(${deltaY}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease',
            }}
          >
            {/* 🌟 3. 拖拽热区（只有在这个区域滑动才会触发关闭，避免干扰滚轮） */}
            <div 
              className="sheet-drag-area"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="sheet-handle">
                <span className="sheet-handle__bar" />
              </div>
            </div>

            <div className="picker">
              <div className="picker__pill" aria-hidden="true" />
              <WheelColumn values={YEARS} value={year} onChange={setYear} label="年份" />
              <WheelColumn
                values={MONTHS}
                value={month}
                onChange={setMonth}
                format={pad2}
                label="月份"
              />
              <WheelColumn
                values={days}
                value={safeDay}
                onChange={setDay}
                format={pad2}
                label="日期"
              />
            </div>
            <button
              type="button"
              className="btn btn--primary sheet__confirm"
              onClick={handleConfirm}
            >
              确定
            </button>
          </div>
        </div>
      }
    >
      <AddEventForm backdrop />
    </PageShell>
  )
}