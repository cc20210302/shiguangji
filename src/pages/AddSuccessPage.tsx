import { useLocation, useNavigate } from 'react-router-dom'
import { CalendarStampArt } from '../components/Illustrations'
import { PageShell } from '../components/PageShell'
import { createDraft, useEvents } from '../store/EventsProvider'
import { IconChevronLeft } from '../components/Icons'

/** 添加成功（设计稿 36:960） */
export default function AddSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { startDraft } = useEvents()
  
  const state = location.state as { id?: string; category?: string; from?: string } | null
  const createdId = state?.id
  const category = state?.category || 'birthday'
  const fromPath = state?.from || '/'

  // 🌟 1. 点击左上角返回：回到来源页
  const handleBack = () => {
    navigate(fromPath, { replace: true }) 
  }

  // 🌟 2. 查看详情
  const handleViewDetail = () => {
    if (createdId) {
      navigate(`/event/${createdId}`, { replace: true })
    } else {
      navigate(fromPath, { replace: true })
    }
  }

  // 🌟 3. 继续添加：重置草稿，跳转到新建页面
  const handleContinueAdd = () => {
    startDraft(createDraft(category as any))
    navigate(`/add/${category}`, { 
      state: { from: fromPath }, 
      replace: true 
    })
  }

  return (
    <PageShell>
      <div className="page-head">
        {/* 🌟 直接使用原生 button，不再依赖缺失的 BackButton 组件 */}
        <button type="button" className="back-btn" onClick={handleBack}>
          <IconChevronLeft />
        </button>
      </div>

      <div className="success-body">
        <CalendarStampArt className="success-art" />
        <p className="success-title">添加成功</p>
        <p className="success-hint">已为你记录 1 个重要日子</p>

        <div className="success-actions">
          <button type="button" className="btn btn--primary" onClick={handleViewDetail}>
            查看详情
          </button>
          <button type="button" className="btn btn--ghost" onClick={handleContinueAdd}>
            继续添加
          </button>
        </div>
      </div>
    </PageShell>
  )
}