import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EventCard } from '../components/EventCard'
import { CalendarStampArt } from '../components/Illustrations'
import { IconChevronLeft, IconChevronRight } from '../components/Icons'
import { PageShell } from '../components/PageShell'
import { eventsOn } from '../lib/countdown'
import { cx } from '../lib/cx'
import { getLunarText } from '../lib/date' // 🌟 确保路径正确
import {
  TODAY,
  buildMonthGrid,
  // formatDateCN,
  formatMonthCN,
  isSameDay,
} from '../lib/date'
import { useEvents } from '../store/EventsProvider'

/** 月份列表 */
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

export default function CalendarPage() {
  const navigate = useNavigate()
  const { events } = useEvents()

  const [cursor, setCursor] = useState(
    () => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
  )
  const [selected, setSelected] = useState(
    () => new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()),
  )

  // 🌟 新增：控制是否处于“选月模式”
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)

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

  // 🌟 新增：选月模式下，左右箭头切换年份
  const changeYear = (delta: number) => {
    const next = new Date(cursor.getFullYear() + delta, cursor.getMonth(), 1)
    setCursor(next)
    if (selected.getFullYear() !== next.getFullYear()) {
      setSelected(new Date(next.getFullYear(), next.getMonth(), selected.getDate()))
    }
  }

   // 🌟 新增：选择月份
    const handleSelectMonth = (monthIndex: number) => {
      const next = new Date(cursor.getFullYear(), monthIndex, 1)
      setCursor(next)
      setSelected(next) // 自动选中该月1号
      
      // 🌟 核心添加：选择完月份后，自动关闭选月模式，回到详细日历
      setIsMonthPickerOpen(false)
    }

  const cells = buildMonthGrid(cursor)
  const dayEvents = eventsOn(events, selected)

  return (
    <PageShell activeTab="calendar">
	 {/* 🌟 新增：日历页专属的顶部状态栏遮罩 */}
	      <div className="calendar-top-mask" />
      {/* 顶部标题和左右切换按钮 */}
      <div className="cal-header">
        <button
          type="button"
          onClick={() => (isMonthPickerOpen ? changeYear(-1) : changeMonth(-1))}
          className="cal-nav-btn"
        >
          <IconChevronLeft />
        </button>
        
        {/* 🌟 点击标题切换模式 */}
        <button 
          type="button" 
          className="cal-title-btn" 
          onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
        >
          {isMonthPickerOpen ? `${cursor.getFullYear()}年` : formatMonthCN(cursor)}
        </button>
        
        <button
          type="button"
          onClick={() => (isMonthPickerOpen ? changeYear(1) : changeMonth(1))}
          className="cal-nav-btn"
        >
          <IconChevronRight />
        </button>
      </div>

      {/* 🌟 根据模式渲染：月份网格 或 日历网格 */}
      {isMonthPickerOpen ? (
        <div className="month-grid">
          {MONTHS.map((month, index) => {
                      // 判断是否是当前选中的月份
                      const isSelectedMonth = cursor.getMonth() === index
                      // 🌟 判断是否是“今年”的“本月”（今天所在的月份）
                      const isTodayMonth = 
                        cursor.getFullYear() === TODAY.getFullYear() && 
                        index === TODAY.getMonth()
          
                      return (
                        <button
                          key={month}
                          type="button"
                          className={cx(
                            'month-btn', 
                            isSelectedMonth && 'is-active',
                            isTodayMonth && 'is-today-month' // 🌟 加上今日月份的类名
                          )}
                          onClick={() => handleSelectMonth(index)}
                        >
                          {month}
                        </button>
                      )
                    })}
        </div>
      ) : (
        <>
          <div className="cal-week" aria-hidden="true">
            {['日', '一', '二', '三', '四', '五', '六'].map((label) => (
              <span key={label} className="cal-week__cell">
                {label}
              </span>
            ))}
          </div>

                    <div className="cal-grid" role="grid" aria-label={formatMonthCN(cursor)}>
                      {cells.map((day) => {
                        const isCurrentMonth = day.getMonth() === cursor.getMonth()
                        const isSelected = isSameDay(day, selected)
                        const isToday = isSameDay(day, TODAY)
                        const hasEvents = eventsOn(events, day).length > 0
          
                        // 🌟 1. 获取农历文本（非当前月不显示农历，防止太乱）
                        const lunarText = isCurrentMonth ? getLunarText(day) : ''
          
                        return (
                          <button
                            key={day.toISOString()}
                            type="button"
                            role="gridcell"
                            className={cx(
                              'cal-day',
                              isSelected && 'is-selected',
                              isToday && 'is-today',
                              !isCurrentMonth && 'is-outside' 
                            )}
                            aria-pressed={isSelected}
                            onClick={() => {
                              if (!isCurrentMonth) {
                                setCursor(new Date(day.getFullYear(), day.getMonth(), 1))
                              }
                              setSelected(day)
                            }}
                          >
                            <span className="cal-day__ring" aria-hidden="true" />
                            
                            {/* 🌟 2. 核心修改：上下排列公历和农历 */}
                            <span className="cal-day__num">{day.getDate()}</span>
                            {lunarText && <span className="cal-day__lunar">{lunarText}</span>}
                            
                            {hasEvents ? <span className="cal-day__dot" aria-hidden="true" /> : null}
                          </button>
                        )
                      })}
                    </div>
        </>
      )}

      {/* 下方的重要日子列表 */}
      <h2 className="section-title section-title--calendar">
        {selected.getMonth() + 1}月
        {/* 🌟 选月模式下不显示具体的“日” */}
        {!isMonthPickerOpen && `${selected.getDate()}日`}的重要日子
      </h2>

      {dayEvents.length === 0 ? (
        <div className="empty-state empty-state--calendar">
          <CalendarStampArt className="empty-state__art" />
          <p className="empty-state__title">没有记录任何日子哦~</p>
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