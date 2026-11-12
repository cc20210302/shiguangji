import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { EventsProvider } from './store/EventsProvider'
import { updateAppTheme } from './lib/statusBar'

import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/pages.css'

// 全局唯一的初始主题入口：浅色背景对应黑色状态栏图标。
void updateAppTheme('#f8f7f2')

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