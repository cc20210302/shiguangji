import { useNavigate } from 'react-router-dom'
import type { EventCategory } from '../data/events'
import { CATEGORY_META, RECORD_MODES } from '../data/events'
import { recordModeLabel } from '../lib/countdown'
import { cx } from '../lib/cx'
import { parseISODate, toISODate } from '../lib/date'
import { useGoBack } from '../lib/navigation'
import { useEvents } from '../store/EventsProvider'
import { showToast } from '../lib/toast'
import { BackButton } from './BackButton'
import { FieldCard } from './FieldCard'
import {
  IconDate,
  IconChevronDown,
  IconPencil,
  IconRepeat,
  IconTag,
} from './Icons'
import { SegmentedTabs } from './SegmentedTabs'

interface AddEventFormProps {
  backdrop?: boolean
}

export function AddEventForm({ backdrop = false }: AddEventFormProps) {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const { draft, patchDraft, addEvent, updateEvent, resetDraft } = useEvents()

  const isTitleEmpty = !draft.title.trim()

  const handleCategory = (next: EventCategory) => {
    patchDraft({ category: next })
    navigate(`/add/${next}`, { replace: true })
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val.length > 20) {
      showToast('不能超过 20 个字符')
      patchDraft({ title: val.slice(0, 20) })
    } else {
      patchDraft({ title: val })
    }
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val.length > 50) {
      showToast('不能超过 50 个字符')
      patchDraft({ note: val.slice(0, 50) })
    } else {
      patchDraft({ note: val })
    }
  }

  const handleSave = () => {
    if (isTitleEmpty) return

    if (draft.id) {
      updateEvent(draft.id, draft)
      goBack()
      return
    }
    const id = addEvent(draft)
    resetDraft(draft.category)
    navigate('/add-success', { state: { id } })
  }

  return (
    <div className={cx('form-page', backdrop && 'is-backdrop')} aria-hidden={backdrop || undefined}>
      <div className="page-head">
        <BackButton fallback="/" />
        <span className="page-head__title">添加事件</span>
      </div>

      <SegmentedTabs value={draft.category} onChange={handleCategory} />

      <div className="fields">
        <FieldCard label="事件名称" icon={<IconTag size={20} />}>
          <input
            className="field__input"
            type="text"
            value={draft.title}
            placeholder={`例如：${CATEGORY_META[draft.category].example}`}
            onChange={handleTitleChange}
            tabIndex={backdrop ? -1 : undefined}
          />
        </FieldCard>

        {/* 🌟 修改：把 onClick 移到内部 div，并让内容行横向撑满 */}
        <FieldCard label="日期" icon={<IconDate size={20} />}>
          <div
            onClick={() => navigate('/date-picker')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            {toISODate(parseISODate(draft.date))}
            <span className="field__caret" style={{ float: 'none', margin: 0 }}>
              <IconChevronDown size={16} />
            </span>
          </div>
        </FieldCard>

        <FieldCard
          label="记录方式"
          icon={<IconRepeat size={20} />}
        >
          <div
            onClick={() => navigate('/record-mode')}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            {recordModeLabel(draft.recordMode, RECORD_MODES)}
            <span className="field__caret" style={{ float: 'none', margin: 0 }}>
              <IconChevronDown size={16} />
            </span>
          </div>
        </FieldCard>

        <FieldCard label="备注（选填）" icon={<IconPencil size={20} />}>
          <input
            className="field__input"
            type="text"
            value={draft.note}
            placeholder="写下你想说的话..."
            onChange={handleNoteChange}
            tabIndex={backdrop ? -1 : undefined}
          />
        </FieldCard>
      </div>

      <div className="form-page__actions">
        <button
          type="button"
          className="btn btn--primary btn--block"
          onClick={handleSave}
          disabled={isTitleEmpty}
          style={{
            backgroundColor: isTitleEmpty ? '#DCEBDD' : 'var(--green)',
            // 🌟 优化：禁用时文字变灰，正常时为白色
            color: isTitleEmpty ? '#fff' : '#fff', 
            cursor: isTitleEmpty ? 'not-allowed' : 'pointer',
            opacity: 1,
            transition: 'background-color 0.2s ease, color 0.2s ease',
          }}
        >
          保存
        </button>
      </div>
    </div>
  )
}