import { useLocation, useNavigate } from 'react-router-dom'
import { BackButton } from '../components/BackButton'
import { CalendarStampArt } from '../components/Illustrations'
import { PageShell } from '../components/PageShell'
import { useGoBack } from '../lib/navigation'

/** 添加成功（设计稿 36:960） */
export default function AddSuccessPage() {
  const navigate = useNavigate()
  const goBack = useGoBack()
  const location = useLocation()
  const createdId = (location.state as { id?: string } | null)?.id

  return (
    <PageShell>
      <div className="page-head">
        <BackButton fallback="/" />
      </div>

      <div className="success-body">
        <CalendarStampArt className="success-art" />
        <p className="success-title">添加成功</p>
        <p className="success-hint">已为你记录 1 个重要日子</p>

        <div className="success-actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => (createdId ? navigate(`/event/${createdId}`) : navigate('/'))}
          >
            查看详情
          </button>
          {/* 继续添加 = 返回上一个路由（添加事件页） */}
          <button type="button" className="btn btn--ghost" onClick={goBack}>
            继续添加
          </button>
        </div>
      </div>
    </PageShell>
  )
}
