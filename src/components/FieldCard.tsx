import type { ReactNode } from 'react'

interface FieldCardProps {
  label: string
  icon: ReactNode
  children: ReactNode
  /** 传了 onClick 就渲染成可点击的整卡按钮（日期 / 记录方式） */
  onClick?: () => void
}

/** 表单字段卡（设计稿 358 × 102，含分隔线与图标） */
export function FieldCard({ label, icon, children, onClick }: FieldCardProps) {
  const body = (
    <>
      <span className="field__head">
        <span className="field__icon">{icon}</span>
        <span className="field__label">{label}</span>
      </span>
      <span className="field__value">{children}</span>
    </>
  )

  if (onClick) {
    return (
      <button type="button" className="field" onClick={onClick}>
        {body}
      </button>
    )
  }

  return <div className="field">{body}</div>
}
