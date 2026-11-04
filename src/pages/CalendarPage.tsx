import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EventCard } from '../components/EventCard'
import { CalendarStampArt } from '../components/Illustrations'
import { IconChevronLeft, IconChevronRight } from '../components/Icons'
import { PageShell } from '../components/PageShell'
import { eventsOn } from '../lib/countdown'
import { cx } from '../lib/cx'
import {
  TODAY,
  buildMonthGrid,
  formatDateCN,
  formatMonthCN,
  isSameDay,
} from '../lib/date'
import { useEvents } from '../store/EventsProvider'

/** 日历页（设计稿 8:191 空 / 67:16 · 69:134 · 74:243 有记录） */
export default function CalendarPage() {
  const navigate = useNavigate()
  const { events } = useEvents()

  const [cursor, setCursor] = useState(
    () => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
  )
  const [selected, setSelected] = useState(
    () => new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()),
  )

  const changeMonth = (delta: number) => {
    const next = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1)
    setCursor(next)
    if (
      selected.getFullYear() !== next.getFullYear() ||
      selected.getMonth() !== next.getMonth()
    ) {
      setSelected(new Date(next.getFullYear(), next.getMonth(), 1))
    }
  }

  const cells = buildMonthGrid(cursor)
  const dayEvents = eventsOn(events, selected)

  return (
    <PageShell activeTab="calendar">
      {/* 顶部标题和左右切换按钮（假设你原本这里有，如果没有请忽略） */}
      <div className="cal-header">
        <button type="button" onClick={() => changeMonth(-1)}><IconChevronLeft /></button>
        <h2>{formatMonthCN(cursor)}</h2>
        <button type="button" onClick={() => changeMonth(1)}><IconChevronRight /></button>
      </div>

      <div className="cal-week" aria-hidden="true">
        {['日', '一', '二', '三', '四', '五', '六'].map((label) => (
          <span key={label} className="cal-week__cell">
            {label}
          </span>
        ))}
      </div>

      <div className="cal-grid" role="grid" aria-label={formatMonthCN(cursor)}>
        {cells.map((day) => {
          // 🌟 核心改动 1：判断是否属于当前显示的月份
          const isCurrentMonth = day.getMonth() === cursor.getMonth()

          const isSelected = isSameDay(day, selected)
          const isToday = isSameDay(day, TODAY)
          const hasEvents = eventsOn(events, day).length > 0

          return (
            <button
              key={day.toISOString()}
              type="button"
              role="gridcell"
              // 🌟 核心改动 2：如果不是当前月，加上 is-outside 类名
              className={cx(
                'cal-day',
                isSelected && 'is-selected',
                isToday && 'is-today',
                !isCurrentMonth && 'is-outside' 
              )}
              aria-pressed={isSelected}
              aria-label={`${formatDateCN(day)}${hasEvents ? '，有记录的日子' : ''}`}
              onClick={() => {
                // 🌟 核心改动 3：点击灰色日期时，自动切换到那个月份
                if (!isCurrentMonth) {
                  setCursor(new Date(day.getFullYear(), day.getMonth(), 1))
                }
                setSelected(day)
              }}
            >
              <span className="cal-day__ring" aria-hidden="true" />
              <span className="cal-day__num">{day.getDate()}</span>
              {hasEvents ? <span className="cal-day__dot" aria-hidden="true" /> : null}
            </button>
          )
        })}
      </div>

      <h2 className="section-title section-title--calendar">
        {selected.getMonth() + 1}月{selected.getDate()}的重要日子
      </h2>

      {dayEvents.length === 0 ? (
        <div className="empty-state empty-state--calendar">
          <CalendarStampArt className="empty-state__art" />
          <p className="empty-state__title">这一天没有记录任何日子哦~</p>
          <p className="empty-state__hint">去添加一个重要的日子吧</p>
        </div>
      ) : (
        <div className="day-events">
          {dayEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => navigate(`/event/${event.id}`)}
            />
          ))}
        </div>
      )}
    </PageShell>
  )
}