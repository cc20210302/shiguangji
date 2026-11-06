import { useEffect } from 'react' // 🌟 1. 引入 useEffect
import { useNavigate } from 'react-router-dom'
import { EventRow } from '../components/EventRow'
import { CalendarStampArt, StickerScene } from '../components/Illustrations'
import { CategoryIcon, IconPlus } from '../components/Icons'
import { PageShell } from '../components/PageShell'
import { CATEGORIES, CATEGORY_META } from '../data/events'
import { countdown, sortByUpcoming } from '../lib/countdown'
import { cx } from '../lib/cx'
import { TODAY, formatHeaderDate, formatMonthDayCN, parseISODate } from '../lib/date'
import { createDraft, useEvents } from '../store/EventsProvider'
// 🌟 2. 引入状态栏控制函数
import { updateAppTheme } from '../lib/statusBar'

/** 首页（设计稿 1:96 有数据 / 38:1094 空状态） */
export default function HomePage() {
  const navigate = useNavigate()
  const { events, startDraft } = useEvents()

  useEffect(() => {
    // 🌟 定义一个同步函数，在内部调用 async 函数
    const initTheme = async () => {
      await updateAppTheme('#f8f7f2')
    }
    initTheme()
  }, [])

  const sorted = sortByUpcoming(events)
  const upcoming = sorted.find((event) => !countdown(event).isPast)
  const hero = upcoming
  const heroState = hero ? countdown(hero) : null

  const startCreating = (category: (typeof CATEGORIES)[number]) => {
    startDraft(createDraft(category))
    navigate(`/add/${category}`)
  }

  return (
    <PageShell activeTab="home">
      <header className="home-head">
        <h1 className="home-head__brand">时光记</h1>
        <span className="home-head__date">{formatHeaderDate(TODAY)}</span>
      </header>

      <section className="hero-card" aria-label="下一个重要日子">
        <StickerScene className="hero-card__sticker" />
        {hero && heroState ? (
          <>
            <p className="hero-card__label">
              {heroState.signed > 0 ? '距离下一个重要日子还有' : heroState.label}
            </p>
            <p className="hero-card__days">
              {heroState.days} <span style={{ fontSize: '14px', fontWeight: 'normal' }}>天</span>
            </p>
            <p className="hero-card__event">
              {hero.title}
              {formatMonthDayCN(parseISODate(hero.date))}
            </p>
          </>
        ) : (
          <>
            <p className="hero-card__label">还没有记录任何日子</p>
            <p className="hero-card__days">去添加</p>
            <p className="hero-card__event">点底部的 + 记录第一个日子</p>
          </>
        )}
      </section>

      <div className="categories">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={cx('category', `category--${category}`)}
            onClick={() => startCreating(category)}
          >
            <span className="category__icon">
              <CategoryIcon category={category} size={40} />
            </span>
            <span className="category__label">{CATEGORY_META[category].label}</span>
          </button>
        ))}
      </div>

      {events.length === 0 ? (
        <div className="empty-state empty-state--home">
          <CalendarStampArt className="empty-state__art" />
          <p className="empty-state__title">还没有记录任何日子</p>
          <p className="empty-state__hint">去添加一个重要的日子吧</p>
          <button
            type="button"
            className="btn btn--primary empty-state__action"
            onClick={() => startCreating('birthday')}
          >
            <IconPlus size={18} />
            添加事件
          </button>
        </div>
      ) : (
        <>
          <h2 className="section-title">即将到来</h2>
          <ul className="event-list">
            {sorted.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                onClick={() => navigate(`/event/${event.id}`)}
              />
            ))}
          </ul>
        </>
      )}
    </PageShell>
  )
}