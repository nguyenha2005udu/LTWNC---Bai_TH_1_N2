export type Priority = 'low' | 'medium' | 'high'

export type CreateDeadlineInput = Omit<
  Deadline,
  'id' | 'completed'
>
export type DeadlineFilter =
  | 'all'
  | 'pending'
  | 'overdue'
  | 'completed'

export interface Deadline {
  id: string
  subject: string
  title: string
  deadline: string
  priority: Priority
  completed: boolean
}