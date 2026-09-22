import type { Priority } from '../types/deadline'

export function isPriority(
  value: string
): value is Priority {
  return (
    value === 'low' ||
    value === 'medium' ||
    value === 'high'
  )
}