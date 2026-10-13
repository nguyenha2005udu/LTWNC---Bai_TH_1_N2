import type { Deadline } from '../../types/deadline'
import { getDaysDifference } from '../../utils/dateUtils'
export const calcDaysLeft = getDaysDifference
export function isOverdue(item: Deadline) { return !item.completed && calcDaysLeft(item.deadline) < 0 }
export function calcStats(items: Deadline[]) {
  const stats = { total: items.length, completed: 0, overdue: 0, bySubject: {} as Record<string, number> }
  for (const item of items) {
    if (item.completed) stats.completed++
    if (isOverdue(item)) stats.overdue++
    stats.bySubject[item.subject] = (stats.bySubject[item.subject] ?? 0) + 1
  }
  return stats
}
