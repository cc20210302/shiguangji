import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { CountdownEvent, EventCategory, RecordMode } from '../data/events'
import { toISODate } from '../lib/date'

const STORAGE_KEY = 'shiguangji.events.v1'

export interface EventDraft {
  /** 有 id 表示正在编辑已有事件 */
  id?: string
  category: EventCategory
  title: string
  date: string
  recordMode: RecordMode
  note: string
}

interface EventsContextValue {
  events: CountdownEvent[]
  draft: EventDraft
  startDraft: (draft: EventDraft) => void
  patchDraft: (patch: Partial<EventDraft>) => void
  resetDraft: (category?: EventCategory) => void
  addEvent: (draft: EventDraft) => string
  updateEvent: (id: string, draft: EventDraft) => void
  removeEvent: (id: string) => void
  getEvent: (id: string) => CountdownEvent | undefined
}

const EventsContext = createContext<EventsContextValue | null>(null)

const newId = (): string => {
  const cryptoRef = globalThis.crypto
  if (cryptoRef && typeof cryptoRef.randomUUID === 'function') return cryptoRef.randomUUID()
  return `ev-${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 8)}`
}

const isEvent = (value: unknown): value is CountdownEvent => {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Partial<CountdownEvent>
  return (
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    typeof item.date === 'string' &&
    typeof item.note === 'string' &&
    typeof item.category === 'string' &&
    typeof item.recordMode === 'string'
  )
}

const loadEvents = (): CountdownEvent[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isEvent);
  } catch {
    return [];
  }
}

export const createDraft = (category: EventCategory = 'birthday'): EventDraft => ({
  category,
  title: '',
  date: toISODate(new Date()),
  recordMode: 'once',
  note: '',
})

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CountdownEvent[]>(loadEvents)
  const [draft, setDraft] = useState<EventDraft>(() => createDraft())

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch {
      /* 隐私模式下忽略写入失败 */
    }
  }, [events])

  const startDraft = useCallback((next: EventDraft) => setDraft(next), [])

  const patchDraft = useCallback(
    (patch: Partial<EventDraft>) => setDraft((prev) => ({ ...prev, ...patch })),
    [],
  )

  const resetDraft = useCallback(
    (category: EventCategory = 'birthday') => setDraft(createDraft(category)),
    [],
  )

  const addEvent = useCallback((value: EventDraft) => {
    const id = newId()
    const event: CountdownEvent = {
      id,
      title: value.title.trim() || '未命名的重要日子',
      date: value.date,
      category: value.category,
      recordMode: value.recordMode,
      note: value.note.trim(),
    }
    setEvents((prev) => [event, ...prev])
    return id
  }, [])

  const updateEvent = useCallback((id: string, value: EventDraft) => {
    setEvents((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: value.title.trim() || item.title,
              date: value.date,
              category: value.category,
              recordMode: value.recordMode,
              note: value.note.trim(),
            }
          : item,
      ),
    )
  }, [])

  const removeEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const getEvent = useCallback(
    (id: string) => events.find((item) => item.id === id),
    [events],
  )

  const value = useMemo<EventsContextValue>(
    () => ({
      events,
      draft,
      startDraft,
      patchDraft,
      resetDraft,
      addEvent,
      updateEvent,
      removeEvent,
      getEvent,
    }),
    [
      events,
      draft,
      startDraft,
      patchDraft,
      resetDraft,
      addEvent,
      updateEvent,
      removeEvent,
      getEvent,
    ],
  )

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
}

export function useEvents(): EventsContextValue {
  const context = useContext(EventsContext)
  if (!context) throw new Error('useEvents 必须在 EventsProvider 内使用')
  return context
}
