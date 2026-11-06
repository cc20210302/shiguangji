import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { EventsProvider } from './store/EventsProvider'
import { updateAppTheme } from './lib/statusBar' // 🌟 只使用这个

import './styles/tokens.css'
import './styles/global.css'
import './styles/components.css'
import './styles/pages.css'

// 🌟 核心：在 App 启动的最开始，直接初始化全局主题
// 这会立刻把网页背景设为米色，并把状态栏图标强制设为黑色
updateAppTheme('#f8f7f2')

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