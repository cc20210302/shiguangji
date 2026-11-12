import { useState, useEffect } from 'react' // 🌟 增加 useEffect
import { useNavigate, useParams } from 'react-router-dom'
import { BackButton } from '../components/BackButton'
import { PageShell } from '../components/PageShell'
import { countdown, nextOccurrence } from '../lib/countdown'
import { cx } from '../lib/cx'
import { formatDateCN, parseISODate, formatDaysToMonthDay } from '../lib/date'
import { useGoBack } from '../lib/navigation'
import { useEvents } from '../store/EventsProvider'
// 🌟 引入我们刚写的颜色工具函数
import { updateAppTheme } from '../lib/statusBar'

import cakeImg from '../assets/cake.png'
import heartImg from '../assets/heart.png'
import holidayImg from '../assets/holiday.png'
import ofterImg from '../assets/ofter.png'

const EMPTY_NOTE = '什么备注信息都没写，这个人很懒哦~'

export default function EventDetailPage() {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const { eventId } = useParams()
  const { getEvent, removeEvent, startDraft } = useEvents()
  
  const [showConfirm, setShowConfirm] = useState(false)

  const event = eventId ? getEvent(eventId) : undefined

  // 详情页只负责设置当前分类主题；离开时不在 cleanup 中异步重置。
  // 目标页面（例如首页）会在自己的 layout effect 中同步设置目标主题，
  // 避免路由切换时两个异步状态栏请求互相覆盖，造成顶部闪变。
  useEffect(() => {
    const colorMap: Record<string, string> = {
      birthday: '#DCEBDD',
      anniversary: '#F8DFE0',
      festival: '#F9E6D8',
      other: '#DCEBDD',
    }
    const color = event ? (colorMap[event.category] || '#f8f7f2') : '#f8f7f2'
    void updateAppTheme(color)
  }, [event?.category, event?.id])
  if (!event) {
    return (
      <PageShell>
        <div className="page-head">
          <BackButton fallback="/" />
          <span className="page-head__title">事件详情</span>
        </div>
        <div className="empty-state empty-state--detail">
          <p className="empty-state__title">这个日子已经不在了</p>
          <p className="empty-state__hint">它可能已经被删除</p>
          <button type="button" className="btn btn--primary empty-state__action" onClick={goBack}>
            返回
          </button>
        </div>
      </PageShell>
    )
  }

  const state = countdown(event)
  const themeClass = `theme-${event.category}`
  const datePrefix = event.recordMode === 'fromToday' ? '起始日：' : '目标日：'
  const isRepeating = event.recordMode === 'monthly' || event.recordMode === 'yearly'
  const displayDate = isRepeating ? nextOccurrence(event) : parseISODate(event.date)

  const renderHeroArt = () => {
    switch (event.category) {
      case 'birthday': return <img src={cakeImg} alt="生日" className="detail-hero-art" />
      case 'anniversary': return <img src={heartImg} alt="纪念日" className="detail-hero-art" />
      case 'festival': return <img src={holidayImg} alt="节日" className="detail-hero-art" />
      default: return <img src={ofterImg} alt="其他" className="detail-hero-art" />
    }
  }

  const handleEdit = () => {
    startDraft({
      id: event.id,
      category: event.category,
      title: event.title,
      date: event.date,
      recordMode: event.recordMode,
      note: event.note,
    })
    navigate(`/add/${event.category}?edit=${event.id}`)
  }

  const confirmDelete = () => {
    removeEvent(event.id)
    goBack()
  }

  return (
    <PageShell underlay={<div className={cx('detail-bg', themeClass)} />}>
      <div className="page-head">
        <BackButton fallback="/" />
      </div>

      <div className="detail-sticker-wrapper">
        {renderHeroArt()}
      </div>

      <section className="detail-sheet">
        <h1 className="detail-title">{event.title}</h1>
        <p className="detail-date">
          {datePrefix}{formatDateCN(displayDate)}
        </p>

                        <div className={cx('detail-stat', themeClass)}>
                          <div className="detail-stat__main">
                            <p className="detail-stat__label">{state.label}</p>
                            
                            {/* 🌟 核心修改：如果是“今天”直接显示，否则数字和天分开 */}
                            <p className="detail-stat__days" style={{ color: state.isPast ? '#999' : 'var(--theme-color)' }}>
                              {state.value === '今天' ? (
                                '今天'
                              ) : (
                                <>
                                  {state.days}
                                  <span className="detail-stat__unit"> 天</span>
                                </>
                              )}
                            </p>
                          </div>
                          
                          {state.days >= 30 && (
                            <span className="detail-stat__extra">
                              {formatDaysToMonthDay(state.days)}
                            </span>
                          )}
                        </div>

        <p className="detail-note-label">备注信息</p>
        <p className={cx('detail-note', !event.note && 'is-empty')}>{event.note || EMPTY_NOTE}</p>

        <div className="detail-actions">
          <button type="button" className={cx('btn btn--primary', themeClass)} onClick={handleEdit}>
            编辑
          </button>
          <button type="button" className="btn btn--soft" onClick={() => setShowConfirm(true)}>
            删除
          </button>
        </div>
      </section>

      {showConfirm && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <h3 className="confirm-modal__title">删除事件</h3>
            <p className="confirm-modal__body">您确定要删除这个特殊的日子吗？</p>
            <div className="confirm-modal__actions">
              <button type="button" className="confirm-modal__btn" onClick={() => setShowConfirm(false)}>
                取消
              </button>
              <button type="button" className="confirm-modal__btn confirm-modal__btn--danger" onClick={confirmDelete}>
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  )
}