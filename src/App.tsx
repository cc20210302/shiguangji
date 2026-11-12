import { useEffect, useState } from 'react'
import { Navigate, Route, Routes,useLocation  } from 'react-router-dom'
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
import { UpdateModal } from './components/UpdateModal'

// 🌟 新增：一个专门用来重置滚动位置的小组件
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    // 每次路由路径变化时，强制回到顶部
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
/** 七个页面各一个独立 tsx 文件，路由与设计稿画板一一对应 */
export default function App() {
  const [updateInfo, setUpdateInfo] = useState<{ version: string; updateLog: string; apkUrl: string } | null>(null)

  useEffect(() => {
    // 状态栏由 main.tsx 的全局主题初始化统一管理。
    // 此处只负责检查更新，避免 App 生命周期再次覆盖系统栏样式。
    const checkUpdate = async () => {
      if (!Capacitor.isNativePlatform()) return

      try {
        const info = await CapacitorApp.getInfo()
        // 请求远端的 version.json
        const res = await fetch('https://gitee.com/ccdesigncc/shiguangji-update/raw/master/version.json?t=' + Date.now())
        const remote = await res.json()

        // 比对版本
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

    const timer = setTimeout(checkUpdate, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleGoUpdate = async () => {
    if (updateInfo?.apkUrl) {
      await Browser.open({ url: updateInfo.apkUrl })
      setUpdateInfo(null)
    }
  }

  return (
    <div className="device-shell">
      <div className="device">
	  <ScrollToTop /> {/* 🌟 在这里挂载它 */}
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