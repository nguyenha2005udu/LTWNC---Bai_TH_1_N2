import type { Deadline } from '../../types/deadline'
export function generateAssignments(count = 10_000): Deadline[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `sample-${i}`, title: `Bài tập mẫu ${i + 1}`, subject: ['Toán', 'React', 'Tiếng Anh'][i % 3],
    deadline: '2026-12-31', priority: i % 3 === 0 ? 'high' : 'medium', completed: i % 4 === 0,
  }))
}
