/**
 * 日期工具。设计稿的“今天”固定为 2026 年 10 月 29 日（星期四），
 * 与设计稿首页右上角、以及“12 天 / 11月10日”等文案一致。
 */
export const TODAY = new Date()

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'] as const

const pad = (value: number) => String(value).padStart(2, '0')

export const toISODate = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const parseISODate = (value: string): Date => {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return new Date(TODAY)
  return new Date(year, month - 1, day)
}

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const diffDays = (a: Date, b: Date): number =>
  Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86_400_000)

export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate()

export const weekdayLabel = (date: Date): string => `星期${WEEKDAYS[date.getDay()]}`

/** 2026年10月30日 */
export const formatDateCN = (date: Date): string =>
  `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`

/** 11月10日 */
export const formatMonthDayCN = (date: Date): string =>
  `${date.getMonth() + 1}月${date.getDate()}日`

/** 2026年10月29日星期四（首页右上角） */
export const formatHeaderDate = (date: Date): string => `${formatDateCN(date)}${weekdayLabel(date)}`

/** 2026年10月（日历标题） */
export const formatMonthCN = (date: Date): string =>
  `${date.getFullYear()}年${date.getMonth() + 1}月`

/** 日历网格：固定 6 行（42 格），以周日为起点，补齐上个月末和下个月初的日期 */
export const buildMonthGrid = (cursor: Date): Date[] => {
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const first = new Date(year, month, 1)
  
  const cells: Date[] = []
  // 关键点：计算网格的第一个格子应该是几号
  const startOffset = 1 - first.getDay()
  
  // 强制循环 42 次 (6行 * 7列)
  for (let i = 0; i < 42; i += 1) {
    const day = startOffset + i
    cells.push(new Date(year, month, day))
  }
  return cells
}
