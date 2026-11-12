import { Capacitor } from '@capacitor/core'
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support'
import { StatusBar, Style } from '@capacitor/status-bar' // 🌟 引入 StatusBar

export async function updateAppTheme(color: string) {
  // 1. 动态修改网页根节点、body 的背景色
  document.documentElement.style.setProperty('--app-bg-color', color)
  document.documentElement.style.backgroundColor = color
  document.body.style.backgroundColor = color

  // 2. 把手机外壳容器 (.phone) 的背景色也改掉
  const phoneEl = document.querySelector('.phone') as HTMLElement
  if (phoneEl) {
    phoneEl.style.backgroundColor = color
  }

  // 3. 原生环境下，分别调用两个插件
  if (Capacitor.isNativePlatform()) {
    try {
      // 设置状态栏和导航栏（Home键区域）的背景色
      await EdgeToEdge.setBackgroundColor({ color })

      // 设置状态栏图标为深色（黑色），适配你的浅色背景
      await StatusBar.setStyle({ style: Style.Dark })
    } catch (e) {
      console.warn('状态栏设置失败:', e)
    }
  }
}