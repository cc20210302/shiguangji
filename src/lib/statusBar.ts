import { Capacitor, registerPlugin } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

interface ThemeStatusBarPlugin {
  setBackgroundColor(options: { color: string }): Promise<{ color: string }>
}

const ThemeStatusBar = registerPlugin<ThemeStatusBarPlugin>('ThemeStatusBar')

export async function updateAppTheme(color: string): Promise<void> {
  const normalizedColor = color.startsWith('#') ? color : `#${color}`

  if (!Capacitor.isNativePlatform()) return

  try {
    // 1. 强制状态栏图标为黑色
    await StatusBar.setStyle({ style: Style.Light })
    
    // 2. 让原生插件在屏幕最顶层画色块
    if (Capacitor.getPlatform() === 'android') {
      await ThemeStatusBar.setBackgroundColor({ color: normalizedColor })
    } else {
      await StatusBar.setBackgroundColor({ color: normalizedColor })
    }
  } catch (error) {
    console.warn('状态栏主题设置失败:', error)
  }
}