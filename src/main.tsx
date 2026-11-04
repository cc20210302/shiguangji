import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { EventsProvider } from './store/EventsProvider'
import { setSystemThemeColor } from './lib/theme' // 🌟 引入

import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/pages.css'
// 🌟 设置全局默认的系统状态栏颜色（和你首页背景色一致）
setSystemThemeColor('#f8f7f2')

const container = document.getElementById('root')
if (!container) throw new Error('缺少 #root 挂载节点')

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <EventsProvider>
        <App />
      </EventsProvider>
    </BrowserRouter>
  </StrictMode>,
)
