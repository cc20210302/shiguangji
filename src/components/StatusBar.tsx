import { useEffect, useState } from 'react'

const formatTime = (date: Date): string =>
  `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`

/** iOS 风格状态栏（设计稿 390 × 44） */
export function StatusBar() {
  const [time, setTime] = useState(() => formatTime(new Date()))

  useEffect(() => {
    const timer = window.setInterval(() => setTime(formatTime(new Date())), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="status-bar">
      <span className="status-bar__time">{time}</span>
      <svg
        className="status-bar__icons"
        width="67"
        height="12"
        viewBox="0 0 67 12"
        fill="none"
        aria-hidden="true"
      >
        <rect x="0" y="7" width="3" height="5" rx="1" fill="currentColor" />
        <rect x="4.6" y="5.2" width="3" height="6.8" rx="1" fill="currentColor" />
        <rect x="9.2" y="3.4" width="3" height="8.6" rx="1" fill="currentColor" />
        <rect x="13.8" y="1.6" width="3" height="10.4" rx="1" fill="currentColor" />
        <path d="M22.6 5.9a10.4 10.4 0 0 1 12.8 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <path d="M25.2 8.7a6.6 6.6 0 0 1 7.6 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
        <circle cx="29" cy="11" r="1.4" fill="currentColor" />
        <rect x="42" y="1.6" width="19" height="9" rx="2.8" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
        <rect x="44" y="3.6" width="14" height="5" rx="1.6" fill="currentColor" />
        <path d="M62.4 4.4v3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
      </svg>
    </div>
  )
}