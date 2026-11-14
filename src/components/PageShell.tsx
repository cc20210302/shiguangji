import { useLayoutEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface PageShellProps {
  children: ReactNode
  /** 保留旧页面调用签名；底部导航现由 App 的固定外壳统一管理。 */
  activeTab?: 'home' | 'calendar'
  underlay?: ReactNode
  overlay?: ReactNode
  staticScreen?: boolean
}

/**
 * 页面内容包装器。
 * .phone / .screen 已提升到 App.tsx 的 Routes 外层，路由切换时不会再卸载重建。
 * underlay / overlay 通过 Portal 放回固定 .phone 层，保持原来的定位关系。
 */
export function PageShell({ children, underlay, overlay }: PageShellProps) {
  const [phoneRoot, setPhoneRoot] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    setPhoneRoot(document.querySelector<HTMLElement>('.phone'))
  }, [])

  return (
    <>
      {children}
      {phoneRoot && (underlay || overlay)
        ? createPortal(
            <>
              {underlay}
              {overlay}
            </>,
            phoneRoot,
          )
        : null}
    </>
  )
}
