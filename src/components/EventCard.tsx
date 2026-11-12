import type { CountdownEvent } from '../data/events'
import { countdown } from '../lib/countdown'
import { cx } from '../lib/cx' // 🌟 引入 cx 工具函数

// 引入 assets 里的四张图
import imgBirthday from '../assets/cake.png'
import imgAnniversary from '../assets/heart.png'
import imgFestival from '../assets/holiday.png'
import imgOther from '../assets/ofter.png'

interface EventCardProps {
  event: CountdownEvent
  onClick?: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const state = countdown(event)

  const getStickerImage = () => {
    switch (event.category) {
      case 'birthday':
        return imgBirthday
      case 'anniversary':
        return imgAnniversary
      case 'festival':
        return imgFestival
      default:
        return imgOther
    }
  }

  return (
    // 🌟 核心修改：使用 cx 判断是否为过去，如果是则加上 'is-past' 类名
    <button 
      type="button" 
      className={cx('event-card', state.isPast && 'is-past')} 
      onClick={onClick}
    >
      <span className="event-card__title">{event.title}</span>
      <span className="event-card__count">
        <span className="event-card__label">{state.label}</span>
        <span className="event-card__days">
          {state.days}
          <span className="event-card__unit"> 天</span>
        </span>
      </span>
      <span className="event-card__sticker">
        <img 
          src={getStickerImage()} 
          alt={event.category} 
          className="event-card__sticker-img" 
        />
      </span>
    </button>
  )
}