import type { CountdownEvent } from '../data/events'
import { countdown } from '../lib/countdown'
import { cx } from '../lib/cx'
import { formatMonthDayCN, parseISODate } from '../lib/date'
import { CategoryIcon } from './Icons'

interface EventRowProps {
  event: CountdownEvent
  onClick: () => void
}

/** 首页「即将到来」列表行（设计稿 358 × 70） */
export function EventRow({ event, onClick }: EventRowProps) {
  const state = countdown(event)
  const past = state.signed < 0

  return (
    <li>
      <button
        type="button"
        className={cx('event-row', past && 'event-row--past')}
        onClick={onClick}
      >
        <span className={cx('event-row__icon', `tint--${event.category}`)}>
          <CategoryIcon category={event.category} size={40} />
        </span>
        <span className="event-row__body">
          <span className="event-row__title">{event.title}</span>
          <span className="event-row__date">{formatMonthDayCN(parseISODate(event.date))}</span>
        </span>
        <span className="event-row__badge">
          {state.signed === 0 ? '今天' : `${state.days}天`}
        </span>
      </button>
    </li>
  )
}
