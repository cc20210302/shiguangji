import { Capacitor, registerPlugin } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

interface ThemeStatusBarPlugin {
  setBackgroundColor(options: { color: string }): Promise<{ color: string }>
}

// Android 15/16 enforces edge-to-edge and ignores StatusBar.backgroundColor.
// This small native bridge paints the window behind the transparent system bar.
const ThemeStatusBar = registerPlugin<ThemeStatusBarPlugin>('ThemeStatusBar')

let latestThemeRequest = 0
let nativeThemeQueue: Promise<void> = Promise.resolve()

/** Keep the web page and native system status-bar background in sync. */
export async function updateAppTheme(color: string): Promise<void> {
  const requestId = ++latestThemeRequest
  const normalizedColor = color.startsWith('#') ? color : `#${color}`

  // Web 层立即更新，避免等待原生桥接期间出现旧颜色/白色闪屏。
  document.documentElement.style.setProperty('--app-bg-color', normalizedColor)
  document.documentElement.style.backgroundColor = normalizedColor
  document.body.style.backgroundColor = normalizedColor
  document.documentElement.style.setProperty('--status-bar-bg', normalizedColor)
  document.querySelectorAll<HTMLElement>('.phone').forEach((phoneEl) => {
    phoneEl.style.backgroundColor = normalizedColor
  })

  if (!Capacitor.isNativePlatform()) return

  // 原生系统栏调用串行执行，并丢弃过期主题请求，避免返回路由时异步竞态。
  nativeThemeQueue = nativeThemeQueue.then(async () => {
    if (requestId !== latestThemeRequest) return

    try {
      await StatusBar.setStyle({ style: Style.Light })
      if (requestId !== latestThemeRequest) return

      if (Capacitor.getPlatform() === 'android') {
        await ThemeStatusBar.setBackgroundColor({ color: normalizedColor })
      } else {
        await StatusBar.setBackgroundColor({ color: normalizedColor })
      }
      if (requestId === latestThemeRequest) await StatusBar.show()
    } catch (error) {
      console.warn('状态栏主题设置失败:', error)
    }
  })

  await nativeThemeQueue
}
