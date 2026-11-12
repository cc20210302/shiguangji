/**
 * 日期工具。设计稿的“今天”固定为 2026 年 10 月 29 日（星期四），
 * 与设计稿首页右上角、以及“12 天 / 11月10日”等文案一致。
 */
// src/lib/date.ts
import { Solar } from 'lunar-javascript' // 🌟 引入农历库
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

// ... 保留你之前的代码 ...

/**
 * 获取公历日期对应的农历显示文本
 * 优先显示传统节日（如中秋、春节），其次显示初一/十五，最后显示普通农历日
 */
export const getLunarText = (date: Date): string => {
  try {
    const solar = Solar.fromDate(date)
    const lunar = solar.getLunar()
    
    // 1. 优先显示节日（如：春节、中秋、国庆等）
    const festivals = lunar.getFestivals()
    if (festivals.length > 0) {
      return festivals[0] // 比如 "中秋"
    }

    // 2. 获取农历日（如：初一、十五）
    const dayInChinese = lunar.getDayInChinese() // "初一", "十五"
    
    // 3. 如果是初一，显示月份（如：正月、腊月）
    if (dayInChinese === '初一') {
      return lunar.getMonthInChinese() + '月' // 比如 "正月"
    }
    
    // 4. 其他日子，我们只显示 初一、十五（或者你想全显示也可以改这里）
    if (dayInChinese === '十五') {
       return '十五'
    }

    // 为了日历界面不显得太乱，普通的农历日子可以返回空，或者返回 dayInChinese
    // 这里选择返回普通的汉字（比如 廿三），如果不想要可以 return ''
    return dayInChinese
  } catch (e) {
    return ''
  }
}
/**
 * 将总天数转换为“X个月Y天”的格式
 * 按行业通用标准，1个月按 30 天计算
 */
export const formatDaysToMonthDay = (days: number): string => {
  if (days <= 0) return ''
  if (days < 30) return `也就是 ${days}天`
  
  const months = Math.floor(days / 30)
  const remainDays = days % 30
  
  if (remainDays === 0) return `也就是 ${months}个月`
  return `也就是 ${months}个月${remainDays}天`
}

/** 获取完整的农历描述，如：农历十月初八 */
export const getFullLunarText = (date: Date): string => {
  try {
    const solar = Solar.fromDate(date)
    const lunar = solar.getLunar()
    return `农历${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`
  } catch (e) {
    return ''
  }
}