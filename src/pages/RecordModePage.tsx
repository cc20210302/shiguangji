import { useState } from 'react' // 🌟 1. 引入 useState
import { AddEventForm } from '../components/AddEventForm'
import { PageShell } from '../components/PageShell'
import type { RecordMode } from '../data/events'
import { RECORD_MODES } from '../data/events'
import { cx } from '../lib/cx'
import { useGoBack } from '../lib/navigation'
import { useEvents } from '../store/EventsProvider'

/** 选择记录方式（设计稿 75:469）：仅一次 / 从今天起 / 每月重复 / 每年重复 */
export default function RecordModePage() {
  const goBack = useGoBack()
  const { draft, patchDraft } = useEvents()

  // 🌟 2. 添加下拉拖拽的状态
  const [startY, setStartY] = useState(0)
  const [deltaY, setDeltaY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const diff = e.touches[0].clientY - startY
    if (diff > 0) {
      setDeltaY(diff)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    // 如果下拉超过 80px，关闭弹窗
    if (deltaY > 80) {
      goBack()
    }
    // 松手后重置位置
    setDeltaY(0)
  }

  const handleSelect = (mode: RecordMode) => {
    patchDraft({ recordMode: mode })
    goBack()
  }

  return (
    <PageShell
      overlay={
        <div className="overlay">
          <button
            type="button"
            className="overlay__scrim"
            aria-label="关闭选择记录方式"
            onClick={goBack}
          />
          
          {/* 🌟 3. 把 sheet-handle 移到 sheet 内部，并绑定动态 transform */}
          <div 
            className="sheet"
            style={{
              transform: `translateY(${deltaY}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease',
            }}
          >
            {/* 🌟 4. 拖拽热区 */}
            <div 
              className="sheet-drag-area"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="sheet-handle">
                <span className="sheet-handle__bar" />
              </div>
            </div>

            <div className="mode-list">
              {RECORD_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  className={cx('mode-row', draft.recordMode === mode.value && 'is-active')}
                  aria-pressed={draft.recordMode === mode.value}
                  onClick={() => handleSelect(mode.value)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <AddEventForm backdrop />
    </PageShell>
  )
}