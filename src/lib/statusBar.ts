export function updateAppTheme(color: string) {
  // 1. 动态修改网页根节点、body 的背景色
  document.documentElement.style.setProperty('--app-bg-color', color)
  document.documentElement.style.backgroundColor = color
  document.body.style.backgroundColor = color

  // 2. 顺手把手机外壳容器 (.phone) 的背景色也改掉（防止它遮挡）
  const phoneEl = document.querySelector('.phone') as HTMLElement
  if (phoneEl) {
    phoneEl.style.backgroundColor = color
  }
}