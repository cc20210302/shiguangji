import type { CountdownEvent } from '../data/events'
import { countdown } from '../lib/countdown'


// 🌟 1. 引入 assets 里的四张图（请改成你真实的文件名和格式）
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

  // 🌟 2. 根据分类返回对应的图片
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
    // 🌟 1. 去掉 themeClass，只保留 event-card
        <button type="button" className="event-card" onClick={onClick}>
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