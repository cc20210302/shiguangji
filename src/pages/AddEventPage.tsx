import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AddEventForm } from '../components/AddEventForm'
import { PageShell } from '../components/PageShell'
import { isCategory } from '../data/events'
import { useEvents } from '../store/EventsProvider'
import { updateAppTheme } from '../lib/statusBar'

/**
 * 添加事件（设计稿 33:205 生日 / 36:548 纪念日 / 36:623 节日 / 36:698 其他）
 * 四种类型共用同一页面，通过 /add/:category 切换选中的分段项。
 */
export default function AddEventPage() {
  const { category } = useParams()
  const active = isCategory(category) ? category : 'birthday'
  const { draft, patchDraft } = useEvents()

  useEffect(() => {
    const statusBarColors: Record<string, string> = {
      birthday: '#DCEBDD',
      other: '#DCEBDD',
      anniversary: '#F8DFE0',
      festival: '#F9E6D8',
    }
    void updateAppTheme(statusBarColors[active] || '#F8F7F2')
  }, [active])

  // 当 URL 里的分类变化时（如用户手动切换顶部标签），同步更新全局草稿里的分类
  useEffect(() => {
    if (draft.category !== active) patchDraft({ category: active })
  }, [active, draft.category, patchDraft])
  return (
    <PageShell>
      <AddEventForm />
    </PageShell>
  )
}