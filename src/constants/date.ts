import { TimeOption } from '@/types/date'
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from 'date-fns'

export const MONTH_FORMAT = 'MMM'
export const YEAR_FORMAT = 'yyyy'
export const DATE_FORMAT = 'yyyy-MM-dd'
export const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss'

const now = new Date()

export const TIME_OPTIONS: TimeOption[] = [
  {
    label: 'Today',
    value: 'today',
    range: {
      from: startOfDay(now),
      to: endOfDay(now),
    },
  },
  {
    label: 'Yesterday',
    value: 'yesterday',
    range: {
      from: startOfDay(subDays(now, 1)),
      to: endOfDay(subDays(now, 1)),
    },
  },
  {
    label: 'Last 3 Days',
    value: 'last3days',
    range: {
      from: startOfDay(subDays(now, 3)),
      to: endOfDay(subDays(now, 3)),
    },
  },
  {
    label: 'This Week',
    value: 'this-week',
    range: {
      from: startOfWeek(now),
      to: endOfWeek(now),
    },
  },
  {
    label: 'Last Week',
    value: 'last-week',
    range: {
      from: startOfWeek(subWeeks(now, 1)),
      to: endOfWeek(subWeeks(now, 1)),
    },
  },
  {
    label: 'This Month',
    value: 'this-month',
    range: {
      from: startOfMonth(now),
      to: endOfMonth(now),
    },
  },
  {
    label: 'Last Month',
    value: 'last-month',
    range: {
      from: startOfMonth(subMonths(now, 1)),
      to: endOfMonth(subMonths(now, 1)),
    },
  },
]
