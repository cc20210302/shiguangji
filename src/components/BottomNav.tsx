import { useLocation,useNavigate } from 'react-router-dom'
import { createDraft, useEvents } from '../store/EventsProvider'
import { cx } from '../lib/cx'
// 🌟 合并引入，删掉多余的 IconPlus
import { IconCalendar, IconHome, IconAddCircle } from './Icons'

/** 底部导航：首页 / 添加（FAB） / 日历，设计稿 390 × 56 + 34 安全区 */
export function BottomNav({ active }: { active: 'home' | 'calendar' }) {
  const navigate = useNavigate()
  const location = useLocation() // 🌟 获取当前路径
  const { startDraft } = useEvents()

  const handleAdd = () => {
    startDraft(createDraft('birthday'))
    navigate('/add/birthday', { state: { from: location.pathname } }) 
  }

  return (
    <nav className="tabbar" aria-label="底部导航">
      <div className="tabbar__row">
        <button
          type="button"
          className={cx('tabbar__item', active === 'home' && 'is-active')}
          onClick={() => navigate('/')}
          aria-current={active === 'home' ? 'page' : undefined}
        >
          <IconHome size={28} />
          <span className="tabbar__label">首页</span>
        </button>

        {/* 🌟 替换为一整个图标 IconAddCircle，去掉原来的 IconPlus */}
        <button type="button" className="tabbar__fab" onClick={handleAdd} aria-label="添加事件">
          <IconAddCircle size={44} />
        </button>

        <button
          type="button"
          className={cx('tabbar__item', active === 'calendar' && 'is-active')}
          onClick={() => navigate('/calendar')}
          aria-current={active === 'calendar' ? 'page' : undefined}
        >
          <IconCalendar size={28} />
          <span className="tabbar__label">日历</span>
        </button>
      </div>
    </nav>
  )
}