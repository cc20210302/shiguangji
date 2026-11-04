import { Navigate, Route, Routes } from 'react-router-dom'
import AddEventPage from './pages/AddEventPage'
import AddSuccessPage from './pages/AddSuccessPage'
import CalendarPage from './pages/CalendarPage'
import DatePickerPage from './pages/DatePickerPage'
import EventDetailPage from './pages/EventDetailPage'
import HomePage from './pages/HomePage'
import RecordModePage from './pages/RecordModePage'


/** 七个页面各一个独立 tsx 文件，路由与设计稿画板一一对应 */
export default function App() {
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
      </div>
    </div>
  )
}
