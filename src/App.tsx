import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'

import AddEventPage from './pages/AddEventPage'
import AddSuccessPage from './pages/AddSuccessPage'
import CalendarPage from './pages/CalendarPage'
import DatePickerPage from './pages/DatePickerPage'
import EventDetailPage from './pages/EventDetailPage'
import HomePage from './pages/HomePage'
import RecordModePage from './pages/RecordModePage'
import { UpdateModal } from './components/UpdateModal' // 🌟 引入新做的精美弹窗

/** 七个页面各一个独立 tsx 文件，路由与设计稿画板一一对应 */
export default function App() {
  // 🌟 控制更新弹窗的状态
  const [updateInfo, setUpdateInfo] = useState<{ version: string; updateLog: string; apkUrl: string } | null>(null)

  useEffect(() => {
    const checkUpdate = async () => {
      // 1. 仅在原生 App 环境检查
      if (!Capacitor.isNativePlatform()) return

      try {
        // 2. 获取本地版本号
        const info = await CapacitorApp.getInfo()
        
        // 3. 请求远端的 version.json（加时间戳防止 CDN 缓存）
        const res = await fetch('https://raw.githubusercontent.com/cc20210302/shiguangji/main/version.json?t=' + Date.now())
        const remote = await res.json()

        // 4. 比对版本
        if (remote.versionName !== info.version) {
          setUpdateInfo({
            version: remote.versionName,
            updateLog: remote.updateLog,
            apkUrl: remote.apkUrl
          })
        }
      } catch (error) {
        console.error('检查更新失败:', error)
      }
    }

    // 延迟 2 秒检查，不阻塞首屏渲染
    const timer = setTimeout(checkUpdate, 2000)
    return () => clearTimeout(timer)
  }, [])

  // 点击“立即更新”
  const handleGoUpdate = async () => {
    if (updateInfo?.apkUrl) {
      await Browser.open({ url: updateInfo.apkUrl })
      setUpdateInfo(null) // 关闭弹窗
    }
  }

  return (
    <div className="device-shell">
      <div className="device">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/add/:category" element={<AddEventPage />} />
          <Route path="/add-success" element={<AddSuccessPage />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
          <Route path="/date-picker" element={<DatePickerPage />} />
          <Route path="/record-mode" element={<RecordModePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* 🌟 在这里挂载弹窗，全局生效 */}
        <UpdateModal
          isOpen={!!updateInfo}
          version={`v${updateInfo?.version || ''}`}
          updateLog={updateInfo?.updateLog || ''}
          onUpdate={handleGoUpdate}
          onCancel={() => setUpdateInfo(null)}
        />
      </div>
    </div>
  )
}