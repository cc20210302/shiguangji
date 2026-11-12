import { useState, useEffect,useMemo  } from 'react'
import { useNavigate } from 'react-router-dom'
import { EventCard } from '../components/EventCard'
import { CalendarStampArt } from '../components/Illustrations'
import { IconChevronLeft, IconChevronRight } from '../components/Icons'
import { PageShell } from '../components/PageShell'
import { eventsOn,sortByUpcoming  } from '../lib/countdown'
import { cx } from '../lib/cx'
// 🌟 引入 parseISODate 和 toISODate 用于本地存储日期
import { 
  TODAY, 
  buildMonthGrid, 
  formatMonthCN, 
  isSameDay, 
  getLunarText,
  parseISODate,
  toISODate,
  daysInMonth 
} from '../lib/date'
import { useEvents } from '../store/EventsProvider'
import { updateAppTheme } from '../lib/statusBar'

/** 月份列表 */
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

export default function CalendarPage() {
  const navigate = useNavigate()
  const { events } = useEvents()

  // 🌟 核心修改 1：初始化 selected，优先从本地存储读取
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem('calendar-selected-date')
    if (saved) {
      const parsed = parseISODate(saved)
      if (parsed instanceof Date && !isNaN(parsed.getTime())) {
        return parsed
      }
    }
    return new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())
  })

  // 🌟 核心修改 2：cursor（当前月份）根据 selected 初始化
  const [cursor, setCursor] = useState(
    () => new Date(selected.getFullYear(), selected.getMonth(), 1),
  )

  // 🌟 核心修改 3：监听 selected 的变化，存入本地
  useEffect(() => {
    localStorage.setItem('calendar-selected-date', toISODate(selected))
  }, [selected])

  // 页面加载时重置主题色
  useEffect(() => {
    updateAppTheme('#f8f7f2')
  }, [])

  // 控制是否处于“选月模式”
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

  // 选月模式下，左右箭头切换年份
  const changeYear = (delta: number) => {
    const next = new Date(cursor.getFullYear() + delta, cursor.getMonth(), 1)
    setCursor(next)
    if (selected.getFullYear() !== next.getFullYear()) {
      setSelected(new Date(next.getFullYear(), next.getMonth(), selected.getDate()))
    }
  }

  // 选择月份
  const handleSelectMonth = (monthIndex: number) => {
    const next = new Date(cursor.getFullYear(), monthIndex, 1)
    setCursor(next)
    setSelected(next) // 自动选中该月1号
    setIsMonthPickerOpen(false)
  }

  const cells = buildMonthGrid(cursor)
  const dayEvents = eventsOn(events, selected)
   // 🌟 核心新增：计算当前月份发生的所有事件
    const monthEvents = useMemo(() => {
      if (!isMonthPickerOpen) return []
      
      const eventMap = new Map() // 使用 Map 按 id 去重，防止重复事件出现多次
      const totalDays = daysInMonth(cursor.getFullYear(), cursor.getMonth())
      
      // 遍历当月每一天，找出所有事件
      for (let i = 1; i <= totalDays; i++) {
        const date = new Date(cursor.getFullYear(), cursor.getMonth(), i)
        const evts = eventsOn(events, date)
        evts.forEach(e => eventMap.set(e.id, e))
      }
      return Array.from(eventMap.values())
    }, [isMonthPickerOpen, events, cursor])

 // 🌟 核心修改：对列表进行排序，未来的排在前面，过去的排在最后
   const listEvents = useMemo(() => {
     const rawEvents = isMonthPickerOpen ? monthEvents : dayEvents
     return sortByUpcoming(rawEvents)
   }, [isMonthPickerOpen, monthEvents, dayEvents])

  return (
    <PageShell activeTab="calendar">
      {/* 日历页专属的顶部状态栏遮罩 */}
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

      {/* 根据模式渲染：月份网格 或 日历网格 */}
      {isMonthPickerOpen ? (
        <div className="month-grid">
          {MONTHS.map((month, index) => {
            const isSelectedMonth = cursor.getMonth() === index
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
                  isTodayMonth && 'is-today-month'
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
                  
                  <span className="cal-day__num">{day.getDate()}</span>
                  {lunarText && <span className="cal-day__lunar">{lunarText}</span>}
                  
                  {hasEvents ? <span className="cal-day__dot" aria-hidden="true" /> : null}
                </button>
              )
            })}
          </div>
        </>
      )}

            {/* 标题区域 */}
                  <div className="calendar-list-header">
                    <h2 className="section-title section-title--calendar">
                      {isMonthPickerOpen 
                        ? `${cursor.getMonth() + 1}月的重要日子` // 🌟 如果是选月模式，显示整月
                        : isSameDay(selected, TODAY) 
                          ? '今天的重要日子' 
                          : `${selected.getMonth() + 1}月${selected.getDate()}日的重要日子`}
                    </h2>
                    
                    {/* 🌟 如果不是今天且不是选月模式，显示回到今天按钮 */}
                    {!isMonthPickerOpen && !isSameDay(selected, TODAY) && (
                      <button 
                        type="button"
                        className="back-to-today-btn"
                        onClick={() => {
                          setSelected(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()))
                          setCursor(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
                        }}
                      >
                        回到今天
                      </button>
                    )}
                  </div>

            {listEvents.length === 0 ? (
              <div className="empty-state empty-state--calendar">
                <CalendarStampArt className="empty-state__art" />
                <p className="empty-state__title">没有记录任何日子哦~</p>
                <p className="empty-state__hint">去添加一个重要的日子吧</p>
              </div>
            ) : (
              <div className="day-events">
                {listEvents.map((event) => (
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