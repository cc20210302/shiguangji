import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
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

// 🌟 严谨的版本号比对函数
function isRemoteVersionNewer(remoteVersion: string, localVersion: string): boolean {
  const remote = String(remoteVersion).trim().replace(/^v/i, '').split('.').map(Number)
  const local = String(localVersion).trim().replace(/^v/i, '').split('.').map(Number)
  const len = Math.max(remote.length, local.length)
  for (let i = 0; i < len; i++) {
    const r = remote[i] || 0
    const l = local[i] || 0
    if (r > l) return true
    if (r < l) return false
  }
  return false
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const [updateInfo, setUpdateInfo] = useState<{ version: string; updateLog: string; apkUrl: string } | null>(null)

  useEffect(() => {
    const checkUpdate = async () => {
      // 🌟 核心修改：仅在原生环境（如雷电模拟器、真机）执行
      // 纯电脑浏览器预览时将直接跳过，不再弹窗
      if (!Capacitor.isNativePlatform()) {
        console.info('[更新检查] 当前为浏览器环境，跳过更新检查')
        return
      }

      try {
        // 1. 获取雷电模拟器/真机当前安装的 APK 版本号
        const info = await CapacitorApp.getInfo()
        const localVersion = info.version
        console.info('[更新检查] 当前环境:', Capacitor.getPlatform(), '| 本地版本:', localVersion)

        // 2. 请求 Gitee 上的 version.json
        const res = await fetch('https://gitee.com/ccdesigncc/shiguangji-update/raw/master/version.json?t=' + Date.now())
        if (!res.ok) throw new Error(`HTTP 状态码 ${res.status}`)
        
        const remote = await res.json()
        console.info('[更新检查] 远端版本:', remote.versionName)

        // 3. 比对版本
        if (remote.versionName && isRemoteVersionNewer(remote.versionName, localVersion)) {
          console.info('[更新检查] 发现新版本，弹出更新框！')
          setUpdateInfo({
            version: remote.versionName,
            updateLog: remote.updateLog || '',
            apkUrl: remote.apkUrl || ''
          })
        } else {
          console.info('[更新检查] 当前已是最新版本，无需更新。')
        }
      } catch (error) {
        console.error('[更新检查] 请求失败:', error)
      }
    }

    const timer = setTimeout(checkUpdate, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleGoUpdate = async () => {
    if (!updateInfo?.apkUrl) return
    try {
      await Browser.open({ url: updateInfo.apkUrl })
      setUpdateInfo(null)
    } catch (err) {
      console.error('打开下载链接失败', err)
    }
  }

  return (
    <div className="device-shell">
      <div className="device">
        <ScrollToTop />
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