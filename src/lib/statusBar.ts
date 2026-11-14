import { Capacitor, registerPlugin } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

interface ThemeStatusBarPlugin {
  setBackgroundColor(options: { color: string }): Promise<{ color: string }>
}

// Android 15+ uses edge-to-edge. The native plugin paints only the status-bar
// inset; it never changes the WebView size, CSS background, or scroll position.
const ThemeStatusBar = registerPlugin<ThemeStatusBarPlugin>('ThemeStatusBar')

let initialized = false
let latestRequest = 0
let queue: Promise<void> = Promise.resolve()

/** Update the native system status-bar background without relaying out the WebView. */
export async function updateAppTheme(color: string): Promise<void> {
  const normalizedColor = color.startsWith('#') ? color : `#${color}`

  // Browser preview has no native status bar to paint.
  if (!Capacitor.isNativePlatform()) return

  const requestId = ++latestRequest
  queue = queue.then(async () => {
    if (requestId !== latestRequest) return

    try {
      // Configure dark status-bar icons once. Do not toggle overlays or system
      // window fitting during route changes.
      if (!initialized) {
        await StatusBar.setStyle({ style: Style.Light })
        await StatusBar.show()
        initialized = true
      }

      if (requestId !== latestRequest) return

      if (Capacitor.getPlatform() === 'android') {
        await ThemeStatusBar.setBackgroundColor({ color: normalizedColor })
      } else {
        await StatusBar.setBackgroundColor({ color: normalizedColor })
      }
    } catch (error) {
      console.warn('状态栏主题设置失败:', error)
    }
  })

  await queue
}
