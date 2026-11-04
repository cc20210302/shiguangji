import type { CountdownEvent, EventCategory, RecordMode } from '../data/events'
import { TODAY, daysInMonth, diffDays, isSameDay, parseISODate } from './date'

export interface Countdown {
	/** 文案前缀：距离还有 / 日子已过，距离下一次还有 / 已经记录了 / 就是今天 */
	label : string
	/** 数值文案：12 天 */
	value : string
	/** 绝对值天数 */
	days : number
	/** 带符号天数：未来为正，已过为负 */
	signed : number
	/** 是否是过去的日子（用于你给列表置灰） */
	isPast : boolean
}

// const isRepeating = (event : CountdownEvent) : boolean =>
// 	event.recordMode === 'yearly' || event.recordMode === 'monthly'

/** 下一次（或唯一一次）到来的日期 */
export function nextOccurrence(event : CountdownEvent, from : Date = TODAY) : Date {
	const base = parseISODate(event.date)

	if (event.recordMode === 'yearly') {
		const thisYear = new Date(
			from.getFullYear(),
			base.getMonth(),
			Math.min(base.getDate(), daysInMonth(from.getFullYear(), base.getMonth())),
		)
		if (diffDays(thisYear, from) >= 0) return thisYear
		const nextYear = from.getFullYear() + 1
		return new Date(
			nextYear,
			base.getMonth(),
			Math.min(base.getDate(), daysInMonth(nextYear, base.getMonth())),
		)
	}

	if (event.recordMode === 'monthly') {
		let year = from.getFullYear()
		let month = from.getMonth()
		let candidate = new Date(year, month, Math.min(base.getDate(), daysInMonth(year, month)))
		if (diffDays(candidate, from) < 0) {
			month += 1
			if (month > 11) {
				month = 0
				year += 1
			}
			candidate = new Date(year, month, Math.min(base.getDate(), daysInMonth(year, month)))
		}
		return candidate
	}

	// once 和 fromToday 直接返回原始日期
	return base
}

export function countdown(event : CountdownEvent) : Countdown {
	const base = parseISODate(event.date)

	// 🌟 1. 单独处理“从今天起”（正计时逻辑）
	if (event.recordMode === 'fromToday') {
		const diff = diffDays(base, TODAY)

		if (diff > 0) {
			// 起始日还没到（比如你提前建了一个明天的从今天起）
			return { label: '距离开始还有', value: `${diff} 天`, days: diff, signed: diff, isPast: false }
		} else {
			// 起始日已到，开始正数（今天算第 1 天，昨天开始算第 2 天）
			const passedDays = Math.abs(diff)
			const displayDays = passedDays === 0 ? 1 : passedDays + 1
			return { label: '已经记录了', value: `${displayDays} 天`, days: displayDays, signed: diff, isPast: false }
		}
	}

	// 🌟 2. 其他模式（仅一次 / 每月重复 / 每年重复）
	const occurrence = nextOccurrence(event)
	const signed = diffDays(occurrence, TODAY)

	if (signed === 0) {
		return { label: '就是今天', value: '今天', days: 0, signed: 0, isPast: false }
	}

	if (signed > 0) {
		return {
			label: '距离还有',
			value: `${signed} 天`,
			days: signed,
			signed,
			isPast: false
		}
	}

	// 🌟 3. 只有“仅一次”且过期了，才会走到这里
	return {
		label: '日子已过',
		value: `${Math.abs(signed)} 天`,
		days: Math.abs(signed),
		signed,
		isPast: true
	}
}

/** 首页“即将到来”排序：未来的按临近程度升序在前，已经过去的排最后 */
export function sortByUpcoming(events : CountdownEvent[]) : CountdownEvent[] {
	return [...events].sort((a, b) => {
		const stateA = countdown(a)
		const stateB = countdown(b)

		// 如果是过去的，直接排最后
		if (stateA.isPast !== stateB.isPast) {
			return stateA.isPast ? 1 : -1
		}

		// 如果都在未来（或都不是过去），按临近天数升序
		return stateA.days - stateB.days
	})
}

/** 某一天是否有事件（支持每月 / 每年重复） */
export function eventsOn(events : CountdownEvent[], date : Date) : CountdownEvent[] {
	return events.filter((event) => {
		const base = parseISODate(event.date)
		if (event.recordMode === 'yearly') {
			return base.getMonth() === date.getMonth() && base.getDate() === date.getDate()
		}
		if (event.recordMode === 'monthly') {
			return base.getDate() === date.getDate()
		}
		return isSameDay(base, date)
	})
}

export const categoryAccent : Record<EventCategory, string> = {
	birthday: 'var(--pink)',
	anniversary: 'var(--peach)',
	festival: 'var(--mint)',
	other: 'var(--sage)',
}

export const recordModeLabel = (mode : RecordMode, modes : { value : RecordMode; label : string }[]) : string =>
	modes.find((item) => item.value === mode)?.label ?? '仅一次'