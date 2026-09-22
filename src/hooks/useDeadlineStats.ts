import { useMemo } from 'react'

import type { Deadline } from '../types/deadline'
import { getDaysDifference } from '../utils/dateUtils'

type DeadlineStats = {
  total: number
  pending: number
  overdue: number
  completed: number
  highPriority: number
}

type StatsKey = keyof DeadlineStats

const initialStats: Record<StatsKey, number> = {
  total: 0,
  pending: 0,
  overdue: 0,
  completed: 0,
  highPriority: 0,
}

export function useDeadlineStats(
  deadlines: Deadline[]
): DeadlineStats {
  return useMemo(
    () =>
      deadlines.reduce<DeadlineStats>(
        (stats, deadline) => {
          stats.total += 1

          if (deadline.completed) {
            stats.completed += 1
            return stats
          }

          stats.pending += 1

          if (
            getDaysDifference(deadline.deadline) < 0
          ) {
            stats.overdue += 1
          }

          if (deadline.priority === 'high') {
            stats.highPriority += 1
          }

          return stats
        },
        { ...initialStats }
      ),
    [deadlines]
  )
}
