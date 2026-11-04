export type EventCategory = 'birthday' | 'anniversary' | 'festival' | 'other'

export type RecordMode = 'once' | 'fromToday' | 'monthly' | 'yearly'

export interface CountdownEvent {
  id: string
  title: string
  /** YYYY-MM-DD */
  date: string
  category: EventCategory
  recordMode: RecordMode
  note: string
}

export const CATEGORIES: EventCategory[] = ['birthday', 'anniversary', 'festival', 'other']

export const CATEGORY_META: Record<EventCategory, { label: string; example: string }> = {
  birthday: { label: '生日', example: '孩子的生日' },
  anniversary: { label: '纪念日', example: '结婚纪念日' },
  festival: { label: '节日', example: '中秋节' },
  other: { label: '其他', example: '宝宝出生了' },
}

export const RECORD_MODES: { value: RecordMode; label: string }[] = [
  { value: 'once', label: '仅一次' },
  { value: 'fromToday', label: '从这天起' },
  { value: 'monthly', label: '每月重复' },
  { value: 'yearly', label: '每年重复' },
]

export const isCategory = (value: string | undefined): value is EventCategory =>
  value !== undefined && (CATEGORIES as string[]).includes(value)

/**
 * 初始数据 —— 文案与日期取自设计稿（首页、日历、三个详情页）：
 * 「孩子的生日 11月10日 12天」「结婚纪念日」「中秋节」「宝宝出生了 / 张三的生日」
 */
export const SEED_EVENTS: CountdownEvent[] = [
  {
    id: 'seed-child-birthday',
    title: '孩子的生日',
    date: '2026-11-10',
    category: 'birthday',
    recordMode: 'yearly',
    note: '“愿你永远健康，开心快乐！”',
  },
  {
    id: 'seed-zhangsan-birthday',
    title: '张三的生日',
    date: '2026-11-10',
    category: 'birthday',
    recordMode: 'yearly',
    note: '',
  },
  {
    id: 'seed-wedding',
    title: '结婚纪念日',
    date: '2026-12-30',
    category: 'anniversary',
    recordMode: 'yearly',
    note: '',
  },
  {
    id: 'seed-mid-autumn',
    title: '中秋节',
    date: '2026-09-16',
    category: 'festival',
    recordMode: 'yearly',
    note: '买八箱酒六条烟，再买几件礼物。',
  },
  {
    id: 'seed-baby-born',
    title: '宝宝出生了',
    date: '2026-07-08',
    category: 'other',
    recordMode: 'once',
    note: '',
  },
]
