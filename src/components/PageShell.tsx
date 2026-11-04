import type { ReactNode } from 'react'
import { cx } from '../lib/cx'
import { BottomNav } from './BottomNav'
// ❌ 删掉 StatusBar 的引入（如果你的代码里有 import { StatusBar } from './StatusBar'）

interface PageShellProps {
  children: ReactNode
  activeTab?: 'home' | 'calendar'
  underlay?: ReactNode
  overlay?: ReactNode
  staticScreen?: boolean
}

export function PageShell({ children, activeTab, underlay, overlay, staticScreen }: PageShellProps) {
  return (
    <div className="phone">
      {underlay}
      {/* ❌ 删掉了这里的 <StatusBar /> */}
      
      <main className={cx('screen', staticScreen && 'screen--static')}>{children}</main>
      
      {activeTab ? <BottomNav active={activeTab} /> : null}
      {overlay}
    </div>
  )
}