import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 全站「返回」统一走浏览器历史后退（回到上一个路由）。
 * 只有直接打开深层页面、没有历史可退时，才回退到兜底路由。
 */
export function useGoBack(fallback = '/') {
  const navigate = useNavigate()

  return useCallback(() => {
    const state = window.history.state as { idx?: number } | null
    const idx = typeof state?.idx === 'number' ? state.idx : 0
    if (idx > 0) {
      navigate(-1)
    } else {
      navigate(fallback, { replace: true })
    }
  }, [navigate, fallback])
}
