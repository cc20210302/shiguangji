import type { EventCategory } from '../data/events'
import { CATEGORIES, CATEGORY_META } from '../data/events'
import { cx } from '../lib/cx'

interface SegmentedTabsProps {
  value: EventCategory
  onChange: (next: EventCategory) => void
}

/** 事件类型分段控件：生日 / 纪念日 / 节日 / 其他 */
export function SegmentedTabs({ value, onChange }: SegmentedTabsProps) {
  return (
    <div className="tabs" role="tablist" aria-label="事件类型">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={value === category}
          className={cx('tabs__item', value === category && 'is-active')}
          onClick={() => onChange(category)}
        >
          {CATEGORY_META[category].label}
        </button>
      ))}
    </div>
  )
}
