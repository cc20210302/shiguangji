import { Capacitor } from '@capacitor/core'
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support'
import { StatusBar, Style } from '@capacitor/status-bar'

export async function updateAppTheme(color: string) {
  // 1. 动态修改网页根节点、body 的背景色
  document.documentElement.style.setProperty('--app-bg-color', color)
  document.documentElement.style.backgroundColor = color
  document.body.style.backgroundColor = color

  // 2. 顺手把手机外壳容器 (.phone) 的背景色也改掉
  const phoneEl = document.querySelector('.phone') as HTMLElement
  if (phoneEl) {
    phoneEl.style.backgroundColor = color
  }

  // 3. 原生环境下，调用插件强制接管
  if (Capacitor.isNativePlatform()) {
    try {
      // 🌟 强制状态栏背景设为透明
      await StatusBar.setBackgroundColor({ color: '#00000000' })
      // 🌟 强制图标为深色（黑色）
      await StatusBar.setStyle({ style: Style.Dark })
      // 🌟 使用 EdgeToEdge 插件强制底栏和状态栏透明
      await EdgeToEdge.setBackgroundColor({ color: '#00000000' })
    } catch (e) {
      console.warn('状态栏设置失败:', e)
    }
  }
}