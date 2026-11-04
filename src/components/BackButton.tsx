import { useGoBack } from '../lib/navigation'
import { IconChevronLeft } from './Icons'

/** 返回按钮：回到上一个路由（浏览器历史后退） */
export function BackButton({ fallback }: { fallback?: string }) {
  const goBack = useGoBack(fallback)

  return (
    <button type="button" className="back-btn" aria-label="返回" onClick={goBack}>
      <IconChevronLeft size={20} />
    </button>
  )
}
