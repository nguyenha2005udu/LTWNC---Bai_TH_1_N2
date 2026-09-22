import { useMemo } from 'react'

import type { Deadline } from '../../types/deadline'
import { getDaysDifference } from '../../utils/dateUtils'

export function useDeadlineStats(
  deadlines: Deadline[]
) {
  return useMemo(() => {
    const total = deadlines.length

    const completed = deadlines.filter(
      (item) => item.completed
    ).length

    const pending = deadlines.filter(
      (item) => !item.completed
    ).length

    const overdue = deadlines.filter(
      (item) =>
        !item.completed &&
        getDaysDifference(item.deadline) < 0
    ).length

    const highPriority = deadlines.filter(
      (item) =>
        item.priority === 'high' &&
        !item.completed
    ).length

    return {
      total,
      completed,
      pending,
      overdue,
      highPriority,
    }
  }, [deadlines])
}
